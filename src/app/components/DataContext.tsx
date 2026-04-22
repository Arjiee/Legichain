import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { BarangayProject, SAMPLE_PROJECTS } from '../utils/projectData';
import { Document, DOCUMENTS } from '../utils/documentData';
import { BlockchainTransaction, BLOCKCHAIN_TRANSACTIONS } from '../utils/blockchainData';
import { ProjectAuditLog, PROJECT_AUDIT_LOGS } from '../utils/auditLogData';
import * as api from '../utils/api';

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

const makeAuditLog = (
  action: string,
  actionType: ProjectAuditLog['actionType'],
  module: ProjectAuditLog['module'],
  project: BarangayProject,
  description: string,
  details: string
): ProjectAuditLog => ({
  id: `LOG-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
  timestamp: new Date().toLocaleString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true,
  }),
  performedBy: 'Admin Officer',
  action, actionType, module, description,
  barangay: project.barangay,
  projectId: project.projectId,
  projectTitle: project.projectTitle,
  details,
  txHash: '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
  block: String(19000000 + Math.floor(Math.random() * 500000)),
  blockchainStatus: 'Success',
  changeType: (['Create', 'Update', 'Delete', 'Verify'].includes(actionType) ? actionType : 'Update') as any,
  ipAddress: '192.168.1.1',
});

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

  useEffect(() => {
    const init = async () => {
      try {
        await api.seedDatabase({
          projects: SAMPLE_PROJECTS,
          auditLogs: PROJECT_AUDIT_LOGS,
          documents: DOCUMENTS,
          blockchainTransactions: BLOCKCHAIN_TRANSACTIONS,
          barangays: INITIAL_BARANGAYS,
        });
      } catch (e) {
        console.log('Seed skipped or already done:', e);
      }

      const [projR, logsR, docsR, txsR, barR] = await Promise.allSettled([
        api.fetchProjects(),
        api.fetchAuditLogs(),
        api.fetchDocuments(),
        api.fetchBlockchainTransactions(),
        api.fetchBarangays(),
      ]);

      if (projR.status === 'fulfilled') setProjects(projR.value);
      else { console.error('Error fetching projects:', projR.reason); toast.error('Failed to load projects'); }
      setLoadingProjects(false);

      if (logsR.status === 'fulfilled') setAuditLogs(logsR.value);
      else console.error('Error fetching audit logs:', logsR.reason);
      setLoadingAuditLogs(false);

      if (docsR.status === 'fulfilled') setDbDocuments(docsR.value);
      else { console.error('Error fetching documents:', docsR.reason); toast.error('Failed to load documents'); }
      setLoadingDocuments(false);

      if (txsR.status === 'fulfilled') setBlockchainTxs(txsR.value);
      else console.error('Error fetching blockchain txs:', txsR.reason);
      setLoadingBlockchain(false);

      if (barR.status === 'fulfilled' && barR.value.length > 0) {
        setBarangays(barR.value);
      } else {
        console.warn('Barangays not found — using defaults and re-seeding...');
        try { await Promise.all(INITIAL_BARANGAYS.map(b => api.createBarangay(b))); }
        catch (e) { console.warn('Could not re-seed barangays:', e); }
      }
      setLoadingBarangays(false);
    };
    init();
  }, []);

  const handleRefreshData = async () => {
    toast.info('Refreshing all data from database...');
    setLoadingProjects(true); setLoadingAuditLogs(true);
    setLoadingDocuments(true); setLoadingBlockchain(true); setLoadingBarangays(true);
    try {
      const [p, l, d, t, b] = await Promise.all([
        api.fetchProjects(), api.fetchAuditLogs(),
        api.fetchDocuments(), api.fetchBlockchainTransactions(), api.fetchBarangays(),
      ]);
      setProjects(p); setAuditLogs(l); setDbDocuments(d); setBlockchainTxs(t);
      if (b.length > 0) setBarangays(b);
      toast.success('All data refreshed from database');
    } catch (e: any) {
      toast.error(`Refresh failed: ${e.message}`);
    } finally {
      setLoadingProjects(false); setLoadingAuditLogs(false);
      setLoadingDocuments(false); setLoadingBlockchain(false); setLoadingBarangays(false);
    }
  };

  // --- Project CRUD ---
  const handleCreateProject = async (project: BarangayProject) => {
    await api.createProject(project);
    const log = makeAuditLog('Created Project Record', 'Create', 'Projects', project,
      `Created "${project.projectTitle}" project`,
      `New project created with budget of ₱${project.financials.totalApprovedBudget.toLocaleString()}`);
    await api.createAuditLog(log);
    setProjects(prev => [project, ...prev]);
    setAuditLogs(prev => [log, ...prev]);
    toast.success(`Project "${project.projectTitle}" created successfully`);
  };

  const handleUpdateProject = async (project: BarangayProject) => {
    await api.updateProject(project.id, project);
    const log = makeAuditLog('Updated Project Record', 'Update', 'Projects', project,
      `Updated "${project.projectTitle}" project`,
      `Project details updated — Status: ${project.projectStatus}`);
    await api.createAuditLog(log);
    setProjects(prev => prev.map(p => p.id === project.id ? project : p));
    setAuditLogs(prev => [log, ...prev]);
    toast.success(`Project "${project.projectTitle}" updated`);
  };

  const handleDeleteProject = async (projectId: string): Promise<boolean> => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return false;
    if (!confirm(`Are you sure you want to delete "${project.projectTitle}"?`)) return false;
    await api.deleteProject(projectId);
    const log = makeAuditLog('Deleted Project Record', 'Delete', 'Projects', project,
      `Deleted "${project.projectTitle}" project`,
      `Project permanently removed from the system`);
    await api.createAuditLog(log);
    setProjects(prev => prev.filter(p => p.id !== projectId));
    setAuditLogs(prev => [log, ...prev]);
    toast.error(`Project "${project.projectTitle}" deleted`);
    return true;
  };

  // --- Document CRUD ---
  const handleCreateDocument = async (doc: Document) => {
    await api.createDocument(doc);
    setDbDocuments(prev => [doc, ...prev]);
    toast.success(`Document "${doc.title}" created successfully`);
  };

  const handleUpdateDocument = async (doc: Document) => {
    await api.updateDocument(doc.id, doc);
    setDbDocuments(prev => prev.map(d => d.id === doc.id ? doc : d));
    toast.success(`Document "${doc.title}" updated`);
  };

  const handleDeleteDocument = async (docId: string): Promise<boolean> => {
    const doc = dbDocuments.find(d => d.id === docId);
    if (!doc) return false;
    if (!confirm(`Are you sure you want to delete "${doc.title}"?`)) return false;
    await api.deleteDocument(docId);
    setDbDocuments(prev => prev.filter(d => d.id !== docId));
    toast.error(`Document "${doc.title}" deleted`);
    return true;
  };

  const handleVerifyDocument = async (doc: Document) => {
    const txHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const block = String(19000000 + Math.floor(Math.random() * 500000));
    const updated: Document = {
      ...doc, blockchainStatus: 'Verified', txHash, block,
      verifiedBy: 'Admin Officer',
      verificationTimestamp: new Date().toISOString(),
    };
    await api.updateDocument(doc.id, updated);
    setDbDocuments(prev => prev.map(d => d.id === doc.id ? updated : d));
    toast.success(`Document "${doc.title}" verified on blockchain`);
  };

  // --- Barangay CRUD ---
  const handleAddBarangay = async () => {
    const name = prompt('Enter Barangay Name:');
    if (!name) return;
    const newB = { id: Date.now().toString(), name };
    try {
      await api.createBarangay(newB);
      setBarangays(prev => [...prev, newB]);
      toast.success(`Barangay "${name}" added successfully`);
    } catch (e: any) {
      toast.error(`Failed to add barangay: ${e.message}`);
    }
  };

  const handleEditBarangay = async (id: string) => {
    const b = barangays.find(x => x.id === id);
    const newName = prompt('Edit Barangay Name:', b?.name);
    if (!newName || !b) return;
    const updated = { ...b, name: newName };
    try {
      await api.updateBarangay(id, updated);
      setBarangays(prev => prev.map(x => x.id === id ? updated : x));
      toast.success('Barangay name updated');
    } catch (e: any) {
      toast.error(`Failed to update barangay: ${e.message}`);
    }
  };

  const handleDeleteBarangay = async (id: string) => {
    const b = barangays.find(x => x.id === id);
    if (!confirm(`Are you sure you want to remove ${b?.name}?`)) return;
    try {
      await api.deleteBarangay(id);
      setBarangays(prev => prev.filter(x => x.id !== id));
      toast.error('Barangay removed');
    } catch (e: any) {
      toast.error(`Failed to delete barangay: ${e.message}`);
    }
  };

  return (
    <DataContext.Provider value={{
      projects, auditLogs, dbDocuments, blockchainTxs, barangays,
      loadingProjects, loadingAuditLogs, loadingDocuments, loadingBlockchain, loadingBarangays,
      projectStats,
      setProjects, setAuditLogs, setDbDocuments,
      handleCreateProject, handleUpdateProject, handleDeleteProject,
      handleCreateDocument, handleUpdateDocument, handleDeleteDocument, handleVerifyDocument,
      handleAddBarangay, handleEditBarangay, handleDeleteBarangay,
      handleRefreshData,
    }}>
      {children}
    </DataContext.Provider>
  );
}
