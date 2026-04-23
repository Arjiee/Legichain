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
import { uploadProjectToIPFS, mintNFTOnPolygon, completeWeb3Upload } from '../utils/web3Utils';
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
  handleDeleteDocument: (docId: string) => Promise<boolean>;
  handleVerifyDocument: (doc: Document) => Promise<void>;
  handleSealProjectToBlockchain: (project: BarangayProject) => Promise<void>;
  handleSealDocumentToBlockchain: (doc: Document, files: File[]) => Promise<void>; 
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
   * Sync Engine: Safe merging of Database and Blockchain data
   */
  const syncEverything = async () => {
    try {
      setLoadingBlockchain(true);
      const [blockchainDocs, supabaseDocs, supabaseProjects] = await Promise.all([
        getAllBlockchainDocumentsWithMetadata(),
        api.fetchDocuments(),
        api.fetchProjects()
      ]);

      // --- 1. DEDUPLICATE & SORT DOCUMENTS (LATEST FIRST) ---
      const docsMap = new Map();
      (supabaseDocs || []).forEach(doc => {
        const key = doc.documentId?.toString() || doc.id?.toString();
        docsMap.set(key, doc);
      });

      (blockchainDocs || []).filter(doc => doc.type !== 'Project').forEach(bDoc => {
        const key = bDoc.documentId?.toString() || bDoc.id?.toString();
        const existing = docsMap.get(key);
        
        // SAFE MERGE: Preserve database values if blockchain metadata is missing
        docsMap.set(key, { 
          ...existing, 
          ...bDoc,
          // Guard: Don't let a placeholder '0x...' overwrite a real hash in Supabase
          txHash: (existing?.txHash && existing.txHash !== '0x...') ? existing.txHash : bDoc.txHash,
          images: existing?.images || bDoc.images || bDoc.documentImage,
          description: existing?.description || bDoc.description
        });
      });
      
      const sortedDocs = Array.from(docsMap.values()).sort((a, b) => 
        Number(b.id || 0) - Number(a.id || 0)
      );
      setDbDocuments(sortedDocs);

      // --- 2. DEDUPLICATE & SORT PROJECTS (LATEST FIRST) ---
      const projectsMap = new Map();
      (supabaseProjects || []).forEach(proj => {
        const key = proj.projectId?.toString() || proj.id?.toString();
        projectsMap.set(key, proj);
      });

      (blockchainDocs || []).filter(doc => doc.type === 'Project').forEach(bProj => {
        const key = bProj.projectId?.toString() || bProj.id?.toString();
        const existing = projectsMap.get(key);
        
        projectsMap.set(key, { 
          ...existing, 
          ...bProj,
          txHash: (existing?.txHash && existing.txHash !== '0x...') ? existing.txHash : bProj.txHash
        });
      });
      
      const sortedProjects = Array.from(projectsMap.values()).sort((a, b) => 
        Number(b.id || 0) - Number(a.id || 0)
      );
      setProjects(sortedProjects);

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
        previousBlockHash: doc.metadataCID || doc.ipfsHash,
        blockExplorerUrl: `https://amoy.polygonscan.com/tx/${doc.txHash}`
      }));
      setBlockchainTxs(txs);

    } catch (e) {
      console.error("Sync Engine Failure:", e);
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
    toast.success("Document added to local registry.");
  };

  const handleDeleteDocument = async (docId: string) => {
    if (!confirm("Remove this document record?")) return false;
    try {
      await api.deleteDocument(docId);
      setDbDocuments(prev => prev.filter(doc => doc.documentId !== docId && doc.id !== docId));
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

  // --- BLOCKCHAIN SEALING (FOR PROJECTS) ---
  const handleSealProjectToBlockchain = async (project: BarangayProject) => {
    try {
      toast.loading("Uploading metadata to IPFS...");
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
        blockchainStatus: 'Verified',
        txHash, 
        block: blockNumber, 
        documentHash: metadataHash,
        verificationStatus: 'Verified on Chain'
      };
      await api.updateProject(project.id, verifiedUpdate);

      toast.dismiss();
      toast.success("Project Successfully Sealed!");
      await syncEverything(); 
    } catch (error: any) {
      toast.dismiss();
      toast.error(`Blockchain Error: ${error.message}`);
    }
  };

  // --- BLOCKCHAIN SEALING (FOR DOCUMENTS) ---
  const handleSealDocumentToBlockchain = async (doc: Document, files: File[]) => {
    try {
      toast.loading("Initiating Web3 Protocol...");

      // 1. Orchestrate: Upload Scan -> Upload Metadata -> Mint NFT
      const { imagesHash, documentHash, txHash, blockNumber } = await completeWeb3Upload(
        doc,
        doc.tags || [],
        files,
        LEGICHAIN_CONTRACT_ADDRESS as `0x${string}`,
        (step) => {
          if (step === 'ipfs') toast.loading("Step 1: Uploading Scanned Document...");
          if (step === 'metadata') toast.loading("Step 2: Securing Metadata...");
          if (step === 'minting') toast.loading("Step 3: Anchoring to Polygon...");
        }
      );

      // 2. Prepare verified update
      const verifiedUpdate = { 
        ...doc, 
        blockchainVerified: true, 
        blockchainStatus: 'Verified', 
        txHash: txHash,         
        block: blockNumber, 
        metadataCID: documentHash,
        images: imagesHash ? `ipfs://${imagesHash}` : (doc as any).images, 
        verificationStatus: 'Verified on Chain'
      };

      // 3. Update Supabase
      await api.updateDocument(doc.id, verifiedUpdate);
      
      toast.dismiss();
      toast.success("Document Immutably Sealed!");
      await syncEverything(); 
    } catch (error: any) {
      toast.dismiss();
      toast.error(`Blockchain Error: ${error.message}`);
    }
  };

  return (
    <DataContext.Provider value={{
      projects, auditLogs, dbDocuments, blockchainTxs, barangays,
      loadingProjects, loadingBlockchain, projectStats,
      handleCreateProject, handleUpdateProject, handleDeleteProject,
      handleCreateDocument, handleDeleteDocument,
      handleVerifyDocument,
      handleSealProjectToBlockchain, 
      handleSealDocumentToBlockchain, 
      handleRefreshData
    }}>
      {children}
    </DataContext.Provider>
  );
}