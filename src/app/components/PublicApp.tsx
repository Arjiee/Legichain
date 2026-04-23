import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import {
  ShieldCheck, Search, Database, ArrowRight, FileText, Users, History,
  ExternalLink, AlertCircle, Eye, Scale, BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ImageWithFallback } from './fallback/ImageWithFallback';
import { ProjectsPage } from './ProjectsPage';
import { ProjectDetailsPage } from './ProjectDetailsPage';
import { DocumentsPage } from './DocumentsPage'; // The paginated table view
import { PublicDocumentDetailsPage } from './PublicDocumentDetailsPage';
import { FOISection } from './FOISection';
import { useData } from './DataContext';
import { BarangayProject } from '../utils/projectData';
import { Document } from '../utils/documentData';

// Added document-related views to the type
type PublicView = 'home' | 'dashboard' | 'documents-monitoring' | 'project-detail' | 'document-detail' | 'foi';

const BlockchainBadge = ({ status }: { status: boolean }) => (
  <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${
    status
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : 'bg-gray-50 text-gray-500 border-gray-200'
  }`}>
    {status ? (
      <><ShieldCheck className="w-3 h-3 mr-1" />Verified</>
    ) : (
      <><AlertCircle className="w-3 h-3 mr-1" />Pending</>
    )}
  </div>
);

export function PublicApp() {
  const navigate = useNavigate();
  const { projects, dbDocuments, barangays, loadingProjects, loadingBlockchain } = useData();
  
  const [view, setView] = useState<PublicView>('home');
  const [selectedProject, setSelectedProject] = useState<BarangayProject | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [selectedBarangayId, setSelectedBarangayId] = useState('all');

  const Navbar = () => (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-[#09637E] border-b border-[#09637E]/20 flex items-center justify-between px-6 z-40 shadow-sm">
      <button
        onClick={() => setView('home')}
        className="flex items-center space-x-3 cursor-pointer"
      >
        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
          <ShieldCheck className="w-5 h-5 text-[#09637E]" />
        </div>
        <span className="font-bold text-white tracking-tight text-lg">LegiChain</span>
      </button>

      <div className="hidden lg:flex items-center space-x-8">
        <NavButton active={view === 'home'} onClick={() => setView('home')} label="Home" />
        <NavButton 
          active={view === 'dashboard' || view === 'project-detail'} 
          onClick={() => setView('dashboard')} 
          label="Projects Monitoring" 
        />
        <NavButton 
          active={view === 'documents-monitoring' || view === 'document-detail'} 
          onClick={() => setView('documents-monitoring')} 
          label="Documents Monitoring" 
        />
        <NavButton active={view === 'foi'} onClick={() => setView('foi')} label="FOI Office" />
      </div>

      <div className="flex items-center gap-3">
        <Link
          to="/login"
          className="px-4 py-1.5 rounded-full bg-[#088395] text-white text-xs font-bold hover:bg-white hover:text-[#09637E] transition-all shadow-md cursor-pointer border border-transparent hover:border-[#09637E]/20"
        >
          Admin Portal
        </Link>
      </div>
    </nav>
  );

  const NavButton = ({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) => (
    <button
      onClick={onClick}
      className={`text-sm cursor-pointer transition-all relative py-1 ${
        active ? 'text-white font-bold' : 'text-white/70 hover:text-white'
      }`}
    >
      {label}
      {active && (
        <motion.div 
          layoutId="nav-underline" 
          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-white rounded-full" 
        />
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#EBF4F6] font-sans text-gray-900 selection:bg-[#088395] selection:text-white">
      <Navbar />

      <main className="pt-16">
        <div className="p-6 md:p-10 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {view === 'home' && (
              <motion.div key="home" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                {/* Hero Section */}
                <div className="relative rounded-[40px] overflow-hidden bg-[#7AB2B2] min-h-[500px] flex items-center p-8 md:p-16 border border-[#09637E]/20 shadow-xl">
                  <div className="absolute inset-0 opacity-20 grayscale">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1593642532400-2682810df593?q=80&w=1000&auto=format&fit=crop"
                      className="w-full h-full object-cover"
                      alt="Barangay"
                    />
                  </div>
                  <div className="relative z-10 max-w-2xl">
                    <h1 className="text-5xl md:text-6xl font-black text-white leading-tight mb-6">
                      Civic Accountability,{' '}
                      <br />
                      <span className="text-[#09637E]">Powered by the Chain.</span>
                    </h1>
                    <p className="text-lg text-white/90 mb-10 leading-relaxed font-medium">
                      Monitor local governance with absolute certainty. Access real-time project tracking and the official 
                      document registry of GMA, Cavite—secured immutably on the Polygon blockchain.
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <button
                        onClick={() => setView('dashboard')}
                        className="px-8 py-4 bg-[#088395] text-white font-bold rounded-2xl flex items-center group hover:bg-[#09637E] transition-all shadow-lg cursor-pointer"
                      >
                        Explore Projects
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </button>
                      <button
                        onClick={() => setView('documents-monitoring')}
                        className="px-8 py-4 bg-white/40 backdrop-blur-md text-[#09637E] font-bold rounded-2xl border border-white/40 hover:bg-white/60 transition-all cursor-pointer"
                      >
                        Browse Documents
                      </button>
                    </div>
                  </div>
                </div>

                {/* Stats Section with Documents Integration */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
                    <StatCard icon={<Database size={24}/>} label="Projects Tracked" value={loadingProjects ? '...' : String(projects.length)} />
                    <StatCard icon={<BookOpen size={24}/>} label="Legal Records" value={loadingBlockchain ? '...' : String(dbDocuments.length)} />
                    <StatCard icon={<ShieldCheck size={24}/>} label="On-Chain Verified" value={String(projects.filter(p => p.blockchainVerified).length + dbDocuments.filter(d => d.blockchainStatus === 'Verified').length)} />
                    <StatCard icon={<Users size={24}/>} label="Active Barangays" value="5" />
                </div>
              </motion.div>
            )}

            {view === 'dashboard' && (
              <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <ProjectsPage
                  projects={projects}
                  barangays={barangays}
                  selectedBarangayId={selectedBarangayId}
                  onViewDetails={(project) => {
                    setSelectedProject(project);
                    setView('project-detail');
                  }}
                  isAdmin={false}
                  loading={loadingProjects}
                  title="Projects Monitoring"
                  subtitle="Transparent tracking of local community infrastructure."
                />
              </motion.div>
            )}

            {view === 'documents-monitoring' && (
              <motion.div key="documents" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <DocumentsPage 
                  documents={dbDocuments}
                  barangays={barangays}
                  onViewDetails={(doc) => {
                    setSelectedDocument(doc);
                    setView('document-detail');
                  }}
                  loading={loadingBlockchain}
                />
              </motion.div>
            )}

            {view === 'project-detail' && selectedProject && (
              <motion.div key="project-detail" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <ProjectDetailsPage
                  project={selectedProject}
                  onBack={() => setView('dashboard')}
                />
              </motion.div>
            )}

            {view === 'document-detail' && selectedDocument && (
              <motion.div key="document-detail" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <PublicDocumentDetailsPage
                  document={selectedDocument}
                  onBack={() => setView('documents-monitoring')}
                />
              </motion.div>
            )}

            {view === 'foi' && (
              <motion.div key="foi" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <FOISection />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <footer className="mt-20 py-12 px-6 border-t border-[#09637E]/10 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-[#09637E] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-[#09637E] tracking-tight">LegiChain</span>
          </div>
          <p className="text-xs text-gray-400 font-medium">© 2026 LegiChain · GMA, Cavite · Securing Governance via Blockchain</p>
        </div>
      </footer>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
    return (
        <div className="p-8 rounded-[32px] bg-white border border-[#09637E]/10 shadow-sm flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-[#EBF4F6] rounded-2xl flex items-center justify-center text-[#09637E] mb-4">
                {icon}
            </div>
            <h3 className="text-3xl font-black text-[#1C1C1C] tracking-tighter">{value}</h3>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{label}</p>
        </div>
    );
}