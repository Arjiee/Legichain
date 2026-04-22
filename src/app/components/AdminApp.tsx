import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import {
  ShieldCheck, FileText, Users, LayoutDashboard, History,
  TrendingUp, AlertTriangle, Database, Loader2, RefreshCw,
  Edit2, Trash2, Plus, LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useData } from './DataContext';
import { EnhancedAdminDocsPage } from './EnhancedAdminDocsPage';
import { BlockchainExplorerPage } from './BlockchainExplorerPage';
import { BlockchainTransactionDetailsPage } from './BlockchainTransactionDetailsPage';
import { DocumentDetailsPage } from './DocumentDetailsPage';
import { AuditLogsPage } from './AuditLogsPage';
import { BlockchainProofPage } from './BlockchainProofPage';
import { ProjectsPage } from './ProjectsPage';
import { ProjectDetailsPage } from './ProjectDetailsPage';
import { ProjectFormModal } from './ProjectFormModal';
import { DocumentFormModal } from './DocumentFormModal';
import { Web3StatusChecker } from './Web3StatusChecker';
import { BarangayProject } from '../utils/projectData';
import { Document } from '../utils/documentData';
import { BlockchainTransaction } from '../utils/blockchainData';

type AdminView =
  | 'dashboard' | 'docs' | 'docs-detail'
  | 'tx' | 'tx-detail'
  | 'barangay' | 'audit' | 'audit-proof'
  | 'projects' | 'project-detail';

export function AdminApp() {
  const navigate = useNavigate();
  const {
    projects, auditLogs, dbDocuments, blockchainTxs, barangays,
    loadingProjects, loadingAuditLogs, loadingDocuments, loadingBlockchain, loadingBarangays,
    projectStats,
    handleCreateProject, handleUpdateProject, handleDeleteProject,
    handleCreateDocument, handleUpdateDocument, handleDeleteDocument, handleVerifyDocument,
    handleAddBarangay, handleEditBarangay, handleDeleteBarangay,
    handleRefreshData,
  } = useData();

  const [view, setView] = useState<AdminView>('dashboard');
  const [selectedBarangayId, setSelectedBarangayId] = useState('all');
  const [selectedProject, setSelectedProject] = useState<BarangayProject | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [selectedBlockchainTx, setSelectedBlockchainTx] = useState<BlockchainTransaction | null>(null);
  const [selectedAuditLog, setSelectedAuditLog] = useState<any>(null);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState<BarangayProject | null>(null);
  const [showDocForm, setShowDocForm] = useState(false);
  const [editingDoc, setEditingDoc] = useState<Document | null>(null);

  // Keep selected project/document in sync after edits
  useEffect(() => {
    if (selectedProject) {
      const updated = projects.find(p => p.id === selectedProject.id);
      if (updated && updated !== selectedProject) setSelectedProject(updated);
    }
  }, [projects]);

  useEffect(() => {
    if (selectedDocument) {
      const updated = dbDocuments.find(d => d.id === selectedDocument.id);
      if (updated && updated !== selectedDocument) setSelectedDocument(updated);
    }
  }, [dbDocuments]);

  const userRaw = sessionStorage.getItem('legichain_user');
  const user = userRaw ? JSON.parse(userRaw) : { username: 'admin', role: 'Administrator' };

  const handleLogout = () => {
    sessionStorage.removeItem('legichain_admin');
    sessionStorage.removeItem('legichain_user');
    navigate('/', { replace: true });
    toast.success('Logged out successfully');
  };

  const SidebarItem = ({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${
        active
          ? 'bg-[#088395] text-white shadow-md font-bold'
          : 'text-white/70 hover:text-white hover:bg-white/10'
      }`}
    >
      {icon}
      <span className="text-sm">{label}</span>
    </button>
  );

  const Sidebar = () => (
    <div className="fixed left-0 top-16 bottom-0 w-64 bg-[#09637E] border-r border-[#09637E]/20 flex flex-col p-4 z-30 overflow-y-auto">
      <div className="space-y-1">
        <SidebarItem icon={<LayoutDashboard size={18} />} label="Dashboard" active={view === 'dashboard'} onClick={() => setView('dashboard')} />
        <SidebarItem icon={<FileText size={18} />} label="Documents" active={view === 'docs' || view === 'docs-detail'} onClick={() => setView('docs')} />
        <SidebarItem icon={<History size={18} />} label="Blockchain" active={view === 'tx' || view === 'tx-detail'} onClick={() => setView('tx')} />
        <SidebarItem icon={<Users size={18} />} label="Barangays" active={view === 'barangay'} onClick={() => setView('barangay')} />
        <SidebarItem icon={<ShieldCheck size={18} />} label="Audit Logs" active={view === 'audit' || view === 'audit-proof'} onClick={() => setView('audit')} />
        <SidebarItem icon={<FileText size={18} />} label="Project Records" active={view === 'projects' || view === 'project-detail'} onClick={() => setView('projects')} />
      </div>

      <div className="mt-auto space-y-3">
        <div className="p-4 rounded-2xl bg-white/10 border border-white/20">
          <p className="text-[10px] text-white/70 uppercase tracking-widest font-bold mb-2">Network Status</p>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-white font-medium">Mainnet Connected</span>
          </div>
        </div>
        <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
          <p className="text-[10px] text-white/50 uppercase tracking-widest font-bold mb-1">Logged in as</p>
          <p className="text-xs text-white font-bold">{user.username}</p>
          <p className="text-[10px] text-white/60">{user.role}</p>
        </div>
      </div>
    </div>
  );

  const Navbar = () => (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-[#09637E] border-b border-[#09637E]/20 flex items-center justify-between px-6 z-40">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
          <ShieldCheck className="w-5 h-5 text-[#09637E]" />
        </div>
        <div>
          <span className="font-bold text-white tracking-tight text-lg">LegiChain</span>
          <span className="ml-2 text-xs font-bold text-white/50 uppercase tracking-wider">Admin</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <ConnectButton
          chainStatus="icon"
          accountStatus="avatar"
          showBalance={false}
        />
        <Link
          to="/"
          className="px-4 py-1.5 rounded-full bg-white/10 text-white text-xs font-bold hover:bg-white/20 transition-all border border-white/20 cursor-pointer"
        >
          ← Public Portal
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/80 text-white text-xs font-bold hover:bg-red-500 transition-all cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign Out
        </button>
      </div>
    </nav>
  );

  const StatCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) => (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#09637E]/10 relative group overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-[#EBF4F6]/50 rounded-bl-full -mr-8 -mt-8 transition-all group-hover:scale-110" />
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-[#EBF4F6] rounded-2xl text-[#09637E]">{icon}</div>
      </div>
      <p className="text-xs font-bold text-[#09637E]/50 uppercase tracking-widest">{label}</p>
      <h3 className="text-3xl font-black text-[#1C1C1C] mt-1">{value}</h3>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#EBF4F6] font-sans text-gray-900 selection:bg-[#088395] selection:text-white">
      <Navbar />
      <Sidebar />

      {/* Modals */}
      <ProjectFormModal
        isOpen={showProjectForm}
        onClose={() => { setShowProjectForm(false); setEditingProject(null); }}
        onSave={editingProject ? handleUpdateProject : handleCreateProject}
        editProject={editingProject}
      />
      <DocumentFormModal
        isOpen={showDocForm}
        onClose={() => { setShowDocForm(false); setEditingDoc(null); }}
        onSave={editingDoc ? handleUpdateDocument : handleCreateDocument}
        editDoc={editingDoc}
      />

      <main className="pt-16 pl-64">
        <div className="p-6 md:p-10 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">

            {/* ── Dashboard ── */}
            {view === 'dashboard' && (
              <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h1 className="text-2xl font-bold text-[#1C1C1C] tracking-tight">Projects Monitoring Dashboard</h1>
                    <p className="text-sm text-gray-500 font-medium flex items-center gap-2 mt-1">
                      Project tracking, financial transparency, and blockchain verification
                      {loadingProjects && <Loader2 className="w-4 h-4 animate-spin text-[#088395]" />}
                      {!loadingProjects && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-700 text-[10px] font-bold">
                          <Database className="w-3 h-3" /> Live Database
                        </span>
                      )}
                    </p>
                  </div>
                  <button onClick={handleRefreshData} className="flex items-center gap-2 px-4 py-2 bg-[#EBF4F6] border border-[#09637E]/20 text-[#09637E] text-xs font-bold rounded-xl hover:bg-[#09637E] hover:text-white transition-all">
                    <RefreshCw className="w-4 h-4" /> Refresh
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <StatCard icon={<FileText />} label="Total Projects" value={loadingProjects ? '...' : projectStats.total} />
                  <StatCard icon={<TrendingUp />} label="Ongoing Projects" value={loadingProjects ? '...' : projectStats.active} />
                  <StatCard icon={<ShieldCheck />} label="Completed Projects" value={loadingProjects ? '...' : projectStats.completed} />
                  <StatCard icon={<AlertTriangle />} label="Blockchain Verified" value={loadingProjects ? '...' : projectStats.verified} />
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-[#09637E]/10 overflow-hidden mb-8">
                  <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-[#1C1C1C]">Recent Project Records</h3>
                      <p className="text-xs text-gray-500 font-medium mt-1">Latest projects from the database</p>
                    </div>
                    <button onClick={() => setView('projects')} className="px-4 py-2 bg-[#088395] text-white text-xs font-bold rounded-lg hover:bg-[#09637E] transition-colors cursor-pointer">
                      View All Projects
                    </button>
                  </div>
                  <div className="p-6 space-y-4">
                    {loadingProjects ? (
                      <div className="flex items-center justify-center py-8 gap-3">
                        <Loader2 className="w-6 h-6 animate-spin text-[#088395]" />
                        <span className="text-gray-500 font-bold text-sm">Loading from database...</span>
                      </div>
                    ) : projects.slice(0, 6).map((project) => (
                      <div
                        key={project.id}
                        onClick={() => { setSelectedProject(project); setView('project-detail'); }}
                        className="flex items-start justify-between p-4 rounded-2xl bg-[#EBF4F6]/30 border border-[#09637E]/5 hover:bg-[#EBF4F6] hover:border-[#088395]/20 cursor-pointer transition-all group"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-xs font-mono text-[#088395] font-bold">{project.projectId}</span>
                            {project.blockchainVerified && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-[9px] font-bold">
                                <ShieldCheck className="w-3 h-3 mr-1" />Verified
                              </span>
                            )}
                          </div>
                          <h4 className="text-sm font-bold text-[#1C1C1C] mb-1">{project.projectTitle}</h4>
                          <p className="text-xs text-gray-600 font-medium mb-2">{project.barangay} · {project.category}</p>
                          <div className="flex items-center justify-between">
                            <p className="text-[10px] text-gray-400 font-medium">Budget: ₱{project.financials.totalApprovedBudget.toLocaleString()}</p>
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                              project.projectStatus === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                              project.projectStatus === 'Ongoing' ? 'bg-blue-100 text-blue-700' :
                              project.projectStatus === 'Planned' ? 'bg-amber-100 text-amber-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>{project.projectStatus}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  <div className="bg-white p-8 rounded-3xl border border-[#09637E]/10 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="font-bold text-[#1C1C1C] flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-[#088395]" />
                          Financial Transparency
                        </h3>
                        <p className="text-xs text-gray-500 font-medium mt-1">Live budget allocation and utilization</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="p-6 rounded-2xl bg-[#EBF4F6] border border-[#09637E]/10">
                        <p className="text-xs font-bold text-[#09637E]/50 uppercase tracking-widest mb-2">Total Budget</p>
                        <p className="text-3xl font-black text-[#09637E]">₱{projectStats.totalBudget.toLocaleString()}</p>
                      </div>
                      <div className="p-6 rounded-2xl bg-white border border-gray-200">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Funds Utilized</p>
                        <p className="text-3xl font-black text-emerald-600">₱{projectStats.totalUtilized.toLocaleString()}</p>
                      </div>
                      <div className="p-6 rounded-2xl bg-white border border-gray-200">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Remaining</p>
                        <p className="text-3xl font-black text-amber-600">₱{projectStats.totalRemaining.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  <Web3StatusChecker />
                </div>
              </motion.div>
            )}

            {/* ── Documents ── */}
            {view === 'docs' && (
              <motion.div key="docs" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <EnhancedAdminDocsPage
                  barangays={barangays}
                  selectedBarangayId={selectedBarangayId}
                  documents={dbDocuments}
                  loading={loadingDocuments}
                  onViewDetails={(doc) => { setSelectedDocument(doc); setView('docs-detail'); }}
                  onAddDocument={() => { setEditingDoc(null); setShowDocForm(true); }}
                  onEditDocument={(doc) => { setEditingDoc(doc); setShowDocForm(true); }}
                  onDeleteDocument={async (id) => { await handleDeleteDocument(id); }}
                  onVerifyDocument={handleVerifyDocument}
                  onRefresh={handleRefreshData}
                />
              </motion.div>
            )}

            {view === 'docs-detail' && selectedDocument && (
              <motion.div key="docs-detail" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="flex justify-end gap-3 mb-6">
                  <button
                    onClick={() => { setEditingDoc(selectedDocument); setShowDocForm(true); }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#088395] text-white text-sm font-bold rounded-xl hover:bg-[#09637E] transition-colors"
                  >
                    <Edit2 className="w-4 h-4" /> Edit Document
                  </button>
                  <button
                    onClick={async () => {
                      const deleted = await handleDeleteDocument(selectedDocument.id);
                      if (deleted) setView('docs');
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-700 text-sm font-bold rounded-xl hover:bg-red-100 transition-colors border border-red-200"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
                <DocumentDetailsPage document={selectedDocument} onBack={() => setView('docs')} />
              </motion.div>
            )}

            {/* ── Blockchain ── */}
            {view === 'tx' && (
              <motion.div key="tx" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <BlockchainExplorerPage
                  barangays={barangays}
                  selectedBarangayId={selectedBarangayId}
                  transactions={blockchainTxs}
                  loading={loadingBlockchain}
                  onViewDetails={(tx) => { setSelectedBlockchainTx(tx); setView('tx-detail'); }}
                  onRefresh={handleRefreshData}
                />
              </motion.div>
            )}

            {view === 'tx-detail' && selectedBlockchainTx && (
              <motion.div key="tx-detail" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <BlockchainTransactionDetailsPage
                  transaction={selectedBlockchainTx}
                  onBack={() => setView('tx')}
                />
              </motion.div>
            )}

            {/* ── Barangays ── */}
            {view === 'barangay' && (
              <motion.div key="barangay" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                  <div>
                    <h1 className="text-2xl font-bold text-[#1C1C1C] tracking-tight">Barangay Management</h1>
                    <p className="text-sm text-gray-500 font-medium flex items-center gap-2 mt-1">
                      Manage the five participating local units
                      {!loadingBarangays && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-700 text-[10px] font-bold">
                          <Database className="w-3 h-3" /> Live Database
                        </span>
                      )}
                      {loadingBarangays && <Loader2 className="w-4 h-4 animate-spin text-[#088395]" />}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={handleRefreshData} className="flex items-center gap-2 px-4 py-2 bg-[#EBF4F6] border border-[#09637E]/20 text-[#09637E] text-xs font-bold rounded-xl hover:bg-[#09637E] hover:text-white transition-all">
                      <RefreshCw className="w-4 h-4" /> Refresh
                    </button>
                    <button onClick={handleAddBarangay} className="px-6 py-3 bg-[#088395] text-white font-bold rounded-2xl flex items-center shadow-md hover:bg-[#09637E] transition-colors cursor-pointer">
                      <Plus className="mr-2 w-5 h-5" /> Add Barangay
                    </button>
                  </div>
                </div>
                {loadingBarangays ? (
                  <div className="flex items-center justify-center py-16 gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-[#088395]" />
                    <span className="text-gray-500 font-bold">Loading barangays from database...</span>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {barangays.map(b => (
                      <div key={b.id} className="bg-white p-6 rounded-3xl border border-[#09637E]/10 shadow-sm flex justify-between items-center group hover:border-[#088395]/30 hover:shadow-md transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-[#EBF4F6] flex items-center justify-center">
                            <span className="text-xl font-black text-[#09637E]">{b.name.split(' ')[1] || b.id}</span>
                          </div>
                          <div>
                            <h4 className="font-bold text-[#1C1C1C]">{b.name}</h4>
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mt-0.5">GMA, Cavite · ID: {b.id}</p>
                          </div>
                        </div>
                        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleEditBarangay(b.id)} className="p-2 hover:bg-[#EBF4F6] rounded-lg text-[#088395] cursor-pointer" title="Edit"><Edit2 size={16} /></button>
                          <button onClick={() => handleDeleteBarangay(b.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-400 cursor-pointer" title="Delete"><Trash2 size={16} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* ── Audit Logs ── */}
            {view === 'audit' && (
              <motion.div key="audit" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <AuditLogsPage
                  logs={auditLogs}
                  loading={loadingAuditLogs}
                  onViewProof={(log) => { setSelectedAuditLog(log); setView('audit-proof'); }}
                />
              </motion.div>
            )}

            {view === 'audit-proof' && selectedAuditLog && (
              <motion.div key="audit-proof" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <BlockchainProofPage
                  log={selectedAuditLog}
                  onBack={() => setView('audit')}
                  onGoToDashboard={() => setView('dashboard')}
                />
              </motion.div>
            )}

            {/* ── Projects ── */}
            {view === 'projects' && (
              <motion.div key="projects" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <ProjectsPage
                  projects={projects}
                  barangays={barangays}
                  selectedBarangayId={selectedBarangayId}
                  onViewDetails={(project) => { setSelectedProject(project); setView('project-detail'); }}
                  onAddProject={() => { setEditingProject(null); setShowProjectForm(true); }}
                  isAdmin={true}
                  loading={loadingProjects}
                  title="Project Records"
                  subtitle="Comprehensive barangay project tracking and transparency"
                />
              </motion.div>
            )}

            {view === 'project-detail' && selectedProject && (
              <motion.div key="project-detail" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="flex justify-end gap-3 mb-6">
                  <button
                    onClick={() => { setEditingProject(selectedProject); setShowProjectForm(true); }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#088395] text-white text-sm font-bold rounded-xl hover:bg-[#09637E] transition-colors"
                  >
                    <Edit2 className="w-4 h-4" /> Edit Project
                  </button>
                  <button
                    onClick={async () => {
                      const deleted = await handleDeleteProject(selectedProject.id);
                      if (deleted) setView('projects');
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-700 text-sm font-bold rounded-xl hover:bg-red-100 transition-colors border border-red-200"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
                <ProjectDetailsPage
                  project={selectedProject}
                  onBack={() => setView('projects')}
                />
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}