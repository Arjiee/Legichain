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
  handleDeleteDocument: (docId: string) => Promise<boolean>; // ADDED
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
   * Sync Engine: Deduplicates Database records against Blockchain reality
   */
  const syncEverything = async () => {
    try {
      setLoadingBlockchain(true);
      const blockchainDocs = await getAllBlockchainDocumentsWithMetadata();
      const supabaseDocs = await api.fetchDocuments();
      const supabaseProjects = await api.fetchProjects();

      // --- 1. DEDUPLICATE DOCUMENTS ---
      const docsMap = new Map();
      (supabaseDocs || []).forEach(doc => {
        const key = doc.documentId?.toString() || doc.id?.toString();
        docsMap.set(key, doc);
      });
      (blockchainDocs || []).filter(doc => doc.type !== 'Project').forEach(bDoc => {
        const key = bDoc.documentId?.toString() || bDoc.id?.toString();
        docsMap.set(key, bDoc);
      });
      setDbDocuments(Array.from(docsMap.values()));

      // --- 2. DEDUPLICATE PROJECTS ---
      const projectsMap = new Map();
      (supabaseProjects || []).forEach(proj => {
        const key = proj.projectId?.toString() || proj.id?.toString();
        projectsMap.set(key, proj);
      });
      (blockchainDocs || []).filter(doc => doc.type === 'Project').forEach(bProj => {
        const key = bProj.projectId?.toString() || bProj.id?.toString();
        projectsMap.set(key, bProj);
      });
      setProjects(Array.from(projectsMap.values()).sort((a, b) => (b.id > a.id ? 1 : -1)));

      // --- 3. MAP BLOCKCHAIN EXPLORER TRANSACTIONS ---
      const txs: BlockchainTransaction[] = (blockchainDocs || []).map(doc => ({
        id: doc.id,
        txHash: doc.txHash || '0x...',
        blockNumber: doc.blockNumber || '---',
        ordinanceId: doc.documentId || doc.projectId || `BC-${doc.id}`,
        ordinanceTitle: doc.title,
        barangay: doc.barangay,
        recordType: doc.type === 'Project' ? 'Project Record' : 'Ordinance Record',
        actionRecorded: 'Minted',
        timestamp: doc.datePublished || new Date().toISOString(),
        recordedBy: 'Admin Protocol',
        verificationStatus: 'Verified',
        previousBlockHash: doc.metadataCID || doc.ipfsHash, // IPFS Hash
        blockExplorerUrl: `https://amoy.polygonscan.com/tx/${doc.txHash}`
      }));
      setBlockchainTxs(txs);

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

  // --- PROJECT HANDLERS ---
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

  // --- DOCUMENT HANDLERS ---
  const handleCreateDocument = async (doc: Document) => {
    await api.createDocument(doc);
    setDbDocuments(prev => [doc, ...prev]);
    toast.success("Document added to ledger.");
  };

  const handleDeleteDocument = async (docId: string) => {
    if (!confirm("Remove this document record?")) return false;
    try {
      await api.deleteDocument(docId);
      // Clean up local state using both possible ID keys
      setDbDocuments(prev => prev.filter(doc => 
        doc.documentId !== docId && doc.id !== docId
      ));
      toast.success("Document removed.");
      return true;
    } catch (e) {
      toast.error("Failed to delete document.");
      return false;
    }
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

  // --- BLOCKCHAIN SEALING ---
  const handleSealProjectToBlockchain = async (project: BarangayProject) => {
    try {
      toast.loading("Uploading fat metadata to IPFS...");
      const metadataHash = await uploadProjectToIPFS(project);
      
      toast.loading("Anchoring proof on Polygon (Amoy)...");
      const { txHash, blockNumber } = await mintNFTOnPolygon(
        project.projectTitle,
        metadataHash,
        project.barangay,
        LEGICHAIN_CONTRACT_ADDRESS as `0x${string}`
      );

      const verifiedUpdate = { 
        ...project, 
        blockchainVerified: true, 
        txHash, 
        block: blockNumber, 
        documentHash: metadataHash,
        verificationStatus: 'Verified on Chain'
      };
      await api.updateProject(project.id, verifiedUpdate);

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

  return (
    <DataContext.Provider value={{
      projects, auditLogs, dbDocuments, blockchainTxs, barangays,
      loadingProjects, loadingBlockchain, projectStats,
      handleCreateProject, handleUpdateProject, handleDeleteProject,
      handleCreateDocument, handleDeleteDocument, // ADDED TO PROVIDER
      handleVerifyDocument,
      handleSealProjectToBlockchain, handleRefreshData
    }}>
      {children}
    </DataContext.Provider>
  );
}
const handleSealProjectToBlockchain = async (project: any) => {
  try {
    toast.loading("Step 1: Uploading Scanned Image & Metadata to IPFS...");
    // Ensure metadata includes the image CID
    const metadataHash = await uploadProjectToIPFS(project);
    
    toast.loading("Step 2: Securing on Polygon (Amoy)...");
    const { txHash, blockNumber } = await mintNFTOnPolygon(
      project.projectTitle || project.title,
      metadataHash,
      project.barangay,
      LEGICHAIN_CONTRACT_ADDRESS as `0x${string}`
    );

    // CRITICAL FIX: Save the HASH and the CID to Supabase
    const verifiedUpdate = { 
      ...project, 
      blockchainVerified: true, 
      txHash: txHash,         // The Transaction Hash from the receipt
      block: blockNumber,     // The Block Number
      documentHash: metadataHash, // The CID of the metadata
      documentImage: project.documentImage, // Ensure this is saved
      verificationStatus: 'Verified on Chain'
    };

    // Update Supabase
    await api.updateProject(project.id, verifiedUpdate);
    
    toast.dismiss();
    toast.success("Document Immutably Sealed!");
    await syncEverything(); 
  } catch (error: any) {
    toast.dismiss();
    toast.error(`Blockchain Error: ${error.message}`);
  }
};