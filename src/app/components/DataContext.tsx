import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { BarangayProject } from '../utils/projectData';
import { Document } from '../utils/documentData';
import { ProjectAuditLog } from '../utils/auditLogData';
import { BlockchainTransaction } from '../utils/blockchainData';
import * as api from '../utils/api';

// Web3 Integration
import { getAllBlockchainDocumentsWithMetadata } from '../utils/blockchainReader';
import { wagmiConfig, LEGICHAIN_CONTRACT_ADDRESS } from '../config/web3Config';
import { uploadProjectToIPFS, mintNFTOnPolygon } from '../utils/web3Utils';
import { parseAbi } from 'viem';
import { writeContract, waitForTransactionReceipt } from 'wagmi/actions';

export const INITIAL_BARANGAYS = [
  { id: "1", name: "Poblacion 1" },
  { id: "2", name: "Poblacion 2" },
  { id: "3", name: "Poblacion 3" },
  { id: "4", name: "Poblacion 4" },
  { id: "5", name: "Poblacion 5" },
];

interface ProjectStats {
  total: number;
  active: number;
  completed: number;
  planned: number;
  totalBudget: number;
  totalUtilized: number;
  totalRemaining: number;
  verified: number;
}

interface DataContextType {
  projects: BarangayProject[];
  auditLogs: ProjectAuditLog[];
  dbDocuments: Document[];
  blockchainTxs: BlockchainTransaction[];
  barangays: Array<{ id: string; name: string }>;
  loadingProjects: boolean;
  loadingBlockchain: boolean;
  projectStats: ProjectStats;
  handleCreateProject: (project: BarangayProject) => Promise<void>;
  handleUpdateProject: (project: BarangayProject) => Promise<void>;
  handleDeleteProject: (projectId: string) => Promise<boolean>;
  handleCreateDocument: (doc: Document) => Promise<void>;
  handleVerifyDocument: (doc: Document) => Promise<void>;
  handleSealProjectToBlockchain: (project: BarangayProject) => Promise<void>;
  handleRefreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | null>(null);

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<BarangayProject[]>([]);
  const [auditLogs, setAuditLogs] = useState<ProjectAuditLog[]>([]);
  const [dbDocuments, setDbDocuments] = useState<Document[]>([]);
  const [blockchainTxs, setBlockchainTxs] = useState<BlockchainTransaction[]>([]);
  const [barangays, setBarangays] = useState<Array<{ id: string; name: string }>>(INITIAL_BARANGAYS);
  
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingBlockchain, setLoadingBlockchain] = useState(true);

  const projectStats = useMemo(() => ({
    total: projects.length,
    active: projects.filter(p => p.projectStatus === 'Ongoing').length,
    completed: projects.filter(p => p.projectStatus === 'Completed').length,
    planned: projects.filter(p => p.projectStatus === 'Planned').length,
    totalBudget: projects.reduce((s, p) => s + (p.financials?.totalApprovedBudget || 0), 0),
    totalUtilized: projects.reduce((s, p) => s + (p.financials?.amountUtilized || 0), 0),
    totalRemaining: projects.reduce((s, p) => s + (p.financials?.remainingBalance || 0), 0),
    verified: projects.filter(p => p.blockchainVerified).length,
  }), [projects]);

  /**
   * Unified Sync: Captures Hash, Block, and IPFS CID
   */
  const syncEverything = async () => {
    try {
      setLoadingBlockchain(true);
      const blockchainDocs = await getAllBlockchainDocumentsWithMetadata();
      const supabaseDocs = await api.fetchDocuments();
      const supabaseProjects = await api.fetchProjects();

      // 1. Map Blockchain Docs to Explorer Transactions (Including CID and Block)
      const txs: BlockchainTransaction[] = (blockchainDocs || []).map(doc => ({
        id: doc.id,
        txHash: doc.txHash || '0x...', // Captured from IPFS hydration
        blockNumber: doc.blockNumber || '---', // Captured from IPFS hydration
        ordinanceId: (doc as any).projectId || (doc as any).documentId || `BC-${doc.id}`,
        ordinanceTitle: doc.title,
        barangay: doc.barangay,
        recordType: (doc as any).type === 'Project' ? 'Project Record' : 'Ordinance Record',
        actionRecorded: 'Minted',
        timestamp: doc.datePublished || new Date().toISOString(),
        recordedBy: 'Admin Protocol',
        verificationStatus: 'Verified',
        previousBlockHash: doc.ipfsHash, // This IS the Metadata CID (IPFS Hash)
        blockExplorerUrl: `https://amoy.polygonscan.com/tx/${doc.txHash}`
      }));
      setBlockchainTxs(txs);

      // 2. Resolve Projects
      const liveProjects = (blockchainDocs || [])
        .filter(doc => (doc as any).type === 'Project')
        .map(doc => doc as unknown as BarangayProject);

      setProjects(() => {
        const merged = [...liveProjects];
        (supabaseProjects || []).forEach(p => {
          if (!merged.find(m => m.projectId === p.projectId)) merged.push(p);
        });
        return merged.sort((a, b) => (b.id > a.id ? 1 : -1));
      });

      // 3. Resolve Ordinances
      const mergedDocs = [...(blockchainDocs || []).filter(doc => (doc as any).type !== 'Project')];
      (supabaseDocs || []).forEach(sDoc => {
        if (!mergedDocs.find(bDoc => bDoc.documentId === sDoc.documentId)) mergedDocs.push(sDoc);
      });
      setDbDocuments(mergedDocs);

    } catch (e) {
      console.error("Sync failed:", e);
    } finally {
      setLoadingBlockchain(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      const [projR, logsR, barR] = await Promise.allSettled([
        api.fetchProjects(), api.fetchAuditLogs(), api.fetchBarangays(),
      ]);
      if (projR.status === 'fulfilled') setProjects(projR.value || []);
      if (logsR.status === 'fulfilled') setAuditLogs(logsR.value || []);
      if (barR.status === 'fulfilled') setBarangays(barR.value || INITIAL_BARANGAYS);
      
      await syncEverything();
      setLoadingProjects(false);
    };
    init();
  }, []);

  const handleRefreshData = async () => {
    toast.info('Polling Polygon Amoy Ledger...');
    await syncEverything();
    toast.success('System synchronized');
  };

  const handleCreateProject = async (project: BarangayProject) => {
    try {
      await api.createProject(project);
      setProjects(prev => [project, ...prev]);
      toast.success("Database record created.");
    } catch (e) { toast.error("Local save failed."); }
  };

  const handleUpdateProject = async (project: BarangayProject) => {
    try {
      await api.updateProject(project.id, project);
      setProjects(prev => prev.map(p => p.id === project.id ? project : p));
      toast.success("Record updated.");
    } catch (e) { toast.error("Update failed."); }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm("Remove this project record?")) return false;
    try {
      await api.deleteProject(projectId);
      setProjects(prev => prev.filter(p => p.id !== projectId));
      return true;
    } catch (e) { return false; }
  };

  const handleSealProjectToBlockchain = async (project: BarangayProject) => {
    try {
      // 1. IPFS Upload (Metadata CID generation)
      toast.loading("Uploading fat metadata to IPFS...");
      const metadataHash = await uploadProjectToIPFS(project);
      
      // 2. Minting on Polygon (Wait for Receipt to get Block Number)
      toast.loading("Anchoring proof on Polygon (Amoy)...");
      const { txHash, blockNumber } = await mintNFTOnPolygon(
        project.projectTitle,
        metadataHash,
        project.barangay,
        LEGICHAIN_CONTRACT_ADDRESS as `0x${string}`
      );

      // 3. Update Database with cryptographic proof
      const verifiedUpdate = { 
        ...project, 
        blockchainVerified: true, 
        txHash, 
        block: blockNumber, // This is the Confirmation Block
        documentHash: metadataHash, // This is the Metadata CID
        verificationStatus: 'Verified on Chain'
      };
      await api.updateProject(project.id, verifiedUpdate);

      // 4. Generate Audit Log with proof
      const log = {
        id: `LOG-${Date.now()}`,
        timestamp: new Date().toLocaleString(),
        performedBy: 'Admin Official',
        action: 'Project Sealed to Blockchain',
        actionType: 'Verify',
        module: 'Blockchain',
        description: `Immutable record created for ${project.projectTitle}`,
        barangay: project.barangay,
        projectId: project.projectId,
        projectTitle: project.projectTitle,
        txHash: txHash,
        blockchainStatus: 'Success'
      };
      await api.createAuditLog(log as any);
      setAuditLogs(prev => [log as any, ...prev]);

      toast.dismiss();
      toast.success("Project immutably recorded & logged!");
      await syncEverything(); 
    } catch (error: any) {
      toast.dismiss();
      toast.error(`Blockchain Error: ${error.message}`);
      throw error;
    }
  };

  const handleCreateDocument = async (doc: Document) => {
    await api.createDocument(doc);
    setDbDocuments(prev => [doc, ...prev]);
    toast.success("Document added to ledger.");
  };

  const handleVerifyDocument = async (doc: Document) => {
    try {
      toast.loading("Sending verification...");
      const abi = parseAbi(['function verifyDocument(uint256 tokenId) public']);
      const hash = await writeContract(wagmiConfig as any, {
        address: LEGICHAIN_CONTRACT_ADDRESS,
        abi,
        functionName: 'verifyDocument',
        args: [BigInt(doc.id)],
      });
      await waitForTransactionReceipt(wagmiConfig as any, { hash });
      toast.dismiss();
      toast.success(`Verified!`);
      await syncEverything();
    } catch (error: any) {
      toast.dismiss();
      toast.error(`Verification failed.`);
    }
  };

  return (
    <DataContext.Provider value={{
      projects, auditLogs, dbDocuments, blockchainTxs, barangays,
      loadingProjects, loadingBlockchain, projectStats,
      handleCreateProject, handleUpdateProject, handleDeleteProject,
      handleCreateDocument, handleVerifyDocument,
      handleSealProjectToBlockchain, handleRefreshData
    }}>
      {children}
    </DataContext.Provider>
  );
}