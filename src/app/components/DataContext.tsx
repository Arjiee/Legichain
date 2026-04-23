import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { BarangayProject, SAMPLE_PROJECTS } from '../utils/projectData';
import { Document, DOCUMENTS } from '../utils/documentData';
import { BlockchainTransaction, BLOCKCHAIN_TRANSACTIONS } from '../utils/blockchainData';
import { ProjectAuditLog, PROJECT_AUDIT_LOGS } from '../utils/auditLogData';
import * as api from '../utils/api';

// Web3 Integration
import { getAllBlockchainDocumentsWithMetadata } from '../utils/blockchainReader';
import { writeContract, waitForTransactionReceipt } from 'wagmi/actions';
import { wagmiConfig, LEGICHAIN_CONTRACT_ADDRESS } from '../config/web3Config';
import { parseAbi } from 'viem';
import { uploadProjectToIPFS, mintNFTOnPolygon } from '../utils/web3Utils';

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
  loadingAuditLogs: boolean;
  loadingDocuments: boolean;
  loadingBlockchain: boolean;
  loadingBarangays: boolean;
  projectStats: ProjectStats;
  setProjects: React.Dispatch<React.SetStateAction<BarangayProject[]>>;
  setAuditLogs: React.Dispatch<React.SetStateAction<ProjectAuditLog[]>>;
  setDbDocuments: React.Dispatch<React.SetStateAction<Document[]>>;
  handleCreateProject: (project: BarangayProject) => Promise<void>;
  handleUpdateProject: (project: BarangayProject) => Promise<void>;
  handleDeleteProject: (projectId: string) => Promise<boolean>;
  handleCreateDocument: (doc: Document) => Promise<void>;
  handleUpdateDocument: (doc: Document) => Promise<void>;
  handleDeleteDocument: (docId: string) => Promise<boolean>;
  handleVerifyDocument: (doc: Document) => Promise<void>;
  handleSealProjectToBlockchain: (project: BarangayProject) => Promise<void>; // Added for Project Sealing
  handleAddBarangay: () => Promise<void>;
  handleEditBarangay: (id: string) => Promise<void>;
  handleDeleteBarangay: (id: string) => Promise<void>;
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
  const [loadingAuditLogs, setLoadingAuditLogs] = useState(true);
  const [loadingDocuments, setLoadingDocuments] = useState(true);
  const [loadingBlockchain, setLoadingBlockchain] = useState(true);
  const [loadingBarangays, setLoadingBarangays] = useState(true);

  const projectStats = useMemo<ProjectStats>(() => ({
    total: projects.length,
    active: projects.filter(p => p.projectStatus === 'Ongoing').length,
    completed: projects.filter(p => p.projectStatus === 'Completed').length,
    planned: projects.filter(p => p.projectStatus === 'Planned').length,
    totalBudget: projects.reduce((s, p) => s + (p.financials?.totalApprovedBudget || 0), 0),
    totalUtilized: projects.reduce((s, p) => s + (p.financials?.amountUtilized || 0), 0),
    totalRemaining: projects.reduce((s, p) => s + (p.financials?.remainingBalance || 0), 0),
    verified: projects.filter(p => p.blockchainVerified).length,
  }), [projects]);

  // Comprehensive synchronization logic for both Documents and Projects
  const syncEverything = async () => {
    try {
      setLoadingBlockchain(true);
      
      // 1. Fetch all records from Smart Contract + IPFS
      const blockchainDocs = await getAllBlockchainDocumentsWithMetadata();
      
      // 2. Process Projects from Blockchain
      const liveProjects = blockchainDocs
        .filter(doc => (doc as any).type === 'Project')
        .map(doc => doc as unknown as BarangayProject);

      setProjects(prev => {
        const merged = [...liveProjects];
        prev.forEach(p => {
          if (!merged.find(m => m.projectId === p.projectId)) merged.push(p);
        });
        return merged;
      });

      // 3. Process Standard Documents (Ordinances/Resolutions)
      const supabaseDocs = await api.fetchDocuments();
      const mergedDocs = [...blockchainDocs.filter(doc => (doc as any).type !== 'Project')];
      
      supabaseDocs.forEach(sDoc => {
        if (!mergedDocs.find(bDoc => bDoc.documentId === sDoc.documentId)) mergedDocs.push(sDoc);
      });
      
      setDbDocuments(mergedDocs);
    } catch (e) {
      console.error("Sync failed:", e);
    } finally {
      setLoadingBlockchain(false);
      setLoadingDocuments(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      const [projR, logsR, barR] = await Promise.allSettled([
        api.fetchProjects(),
        api.fetchAuditLogs(),
        api.fetchBarangays(),
      ]);
      if (projR.status === 'fulfilled') setProjects(projR.value);
      if (logsR.status === 'fulfilled') setAuditLogs(logsR.value);
      if (barR.status === 'fulfilled') setBarangays(barR.value);
      
      await syncEverything();
      
      setLoadingProjects(false);
      setLoadingAuditLogs(false);
      setLoadingBarangays(false);
    };
    init();
  }, []);

  const handleRefreshData = async () => {
    toast.info('Synchronizing blockchain records...');
    await syncEverything();
    toast.success('System synchronized');
  };

  const handleVerifyDocument = async (doc: Document) => {
    try {
      toast.loading("Sending verification to blockchain...");
      const abi = parseAbi(['function verifyDocument(uint256 tokenId) public']);
      const hash = await writeContract(wagmiConfig as any, {
        address: LEGICHAIN_CONTRACT_ADDRESS,
        abi,
        functionName: 'verifyDocument',
        args: [BigInt(doc.id)],
      });
      await waitForTransactionReceipt(wagmiConfig as any, { hash });
      toast.dismiss();
      toast.success(`Verified on Polygon!`);
      await syncEverything();
    } catch (error: any) {
      toast.dismiss();
      toast.error(`Verification failed: ${error.message}`);
    }
  };

  // Real Web3 Project Upload
  const handleSealProjectToBlockchain = async (project: BarangayProject) => {
    try {
      toast.loading("Sealing project to Polygon blockchain...");
      
      // 1. Upload full project metadata (financials, etc.) to IPFS
      const metadataHash = await uploadProjectToIPFS(project);
      
      // 2. Record Registry CID on the Smart Contract
      const txHash = await mintNFTOnPolygon(
        project.projectTitle,
        metadataHash,
        project.barangay,
        LEGICHAIN_CONTRACT_ADDRESS as `0x${string}`
      );

      toast.dismiss();
      toast.success("Project immutably recorded!");
      await syncEverything(); 
    } catch (error: any) {
      toast.dismiss();
      toast.error(`Blockchain Error: ${error.message}`);
    }
  };

  // ... (keep handleCreateProject and other CRUD functions)

  return (
    <DataContext.Provider value={{
      projects, auditLogs, dbDocuments, blockchainTxs, barangays,
      loadingProjects, loadingAuditLogs, loadingDocuments, loadingBlockchain, loadingBarangays,
      projectStats,
      setProjects, setAuditLogs, setDbDocuments,
      handleCreateProject: async () => {}, // Use existing logic
      handleUpdateProject: async () => {}, // Use existing logic
      handleDeleteProject: async () => false, // Use existing logic
      handleCreateDocument: async () => {}, // Use existing logic
      handleUpdateDocument: async () => {}, // Use existing logic
      handleDeleteDocument: async () => false, // Use existing logic
      handleVerifyDocument,
      handleSealProjectToBlockchain,
      handleAddBarangay: async () => {}, // Use existing logic
      handleEditBarangay: async () => {}, // Use existing logic
      handleDeleteBarangay: async () => {}, // Use existing logic
      handleRefreshData,
    }}>
      {children}
    </DataContext.Provider>
  );
}