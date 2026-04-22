import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import {
  ShieldCheck, Search, Database, ArrowRight, FileText, Users, History,
  ExternalLink, AlertCircle, Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ImageWithFallback } from './fallback/ImageWithFallback';
import { ProjectsPage } from './ProjectsPage';
import { ProjectDetailsPage } from './ProjectDetailsPage';
import { FOISection } from './FOISection';
import { useData } from './DataContext';
import { BarangayProject } from '../utils/projectData';
import { Document } from '../utils/documentData';

type PublicView = 'home' | 'dashboard' | 'project-detail' | 'foi';

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
  const { projects, barangays, loadingProjects } = useData();
  const [view, setView] = useState<PublicView>('home');
  const [selectedProject, setSelectedProject] = useState<BarangayProject | null>(null);
  const [selectedBarangayId, setSelectedBarangayId] = useState('all');

  const Navbar = () => (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-[#09637E] border-b border-[#09637E]/20 flex items-center justify-between px-6 z-40">
      <button
        onClick={() => setView('home')}
        className="flex items-center space-x-3 cursor-pointer"
      >
        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
          <ShieldCheck className="w-5 h-5 text-[#09637E]" />
        </div>
        <span className="font-bold text-white tracking-tight text-lg">LegiChain</span>
      </button>

      <div className="hidden md:flex items-center space-x-8">
        <button
          onClick={() => setView('home')}
          className={`text-sm cursor-pointer transition-colors ${
            view === 'home' ? 'text-white font-bold underline decoration-2 underline-offset-4' : 'text-white/70 hover:text-white'
          }`}
        >
          Home
        </button>
        <button
          onClick={() => setView('dashboard')}
          className={`text-sm cursor-pointer transition-colors ${
            view === 'dashboard' || view === 'project-detail' ? 'text-white font-bold underline decoration-2 underline-offset-4' : 'text-white/70 hover:text-white'
          }`}
        >
          Projects Monitoring
        </button>
        <button
          onClick={() => setView('foi')}
          className={`text-sm cursor-pointer transition-colors ${
            view === 'foi' ? 'text-white font-bold underline decoration-2 underline-offset-4' : 'text-white/70 hover:text-white'
          }`}
        >
          FOI Office
        </button>
      </div>

      <div className="flex items-center gap-3">
        {/* Mobile menu buttons */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setView('dashboard')}
            className="px-3 py-1.5 rounded-full bg-white/20 text-white text-xs font-bold hover:bg-white/30 transition-all border border-white/30 cursor-pointer"
          >
            Projects
          </button>
          <button
            onClick={() => setView('foi')}
            className="px-3 py-1.5 rounded-full bg-white/20 text-white text-xs font-bold hover:bg-white/30 transition-all border border-white/30 cursor-pointer"
          >
            FOI
          </button>
        </div>
        <Link
          to="/login"
          className="px-4 py-1.5 rounded-full bg-[#088395] text-white text-xs font-bold hover:bg-white hover:text-[#09637E] transition-all shadow-md cursor-pointer border border-transparent hover:border-[#09637E]/20"
        >
          Admin Portal
        </Link>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-[#EBF4F6] font-sans text-gray-900 selection:bg-[#088395] selection:text-white">
      <Navbar />

      <main className="pt-16">
        <div className="p-6 md:p-10 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {view === 'home' && (
              <motion.div key="home" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                {/* Hero */}
                <div className="relative rounded-[40px] overflow-hidden bg-[#7AB2B2] min-h-[500px] flex items-center p-12 border border-[#09637E]/20">
                  <div className="absolute inset-0 opacity-20 grayscale">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1593642532400-2682810df593?q=80&w=1000&auto=format&fit=crop"
                      className="w-full h-full object-cover"
                      alt="Barangay"
                    />
                  </div>
                  <div className="relative z-10 max-w-2xl">
                    <h1 className="text-5xl md:text-6xl font-black text-white leading-tight mb-6">
                      Transparent Barangay Projects,{' '}
                      <br />
                      <span className="text-[#09637E]">Secured by Blockchain.</span>
                    </h1>
                    <p className="text-lg text-white/90 mb-10 leading-relaxed">
                      LegiChain provides an immutable, tamper-proof platform for monitoring all local government
                      projects, ensuring total transparency for every citizen of GMA, Cavite.
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <button
                        onClick={() => setView('dashboard')}
                        className="px-8 py-4 bg-[#088395] text-white font-bold rounded-2xl flex items-center group hover:bg-[#09637E] transition-all shadow-lg cursor-pointer"
                      >
                        Explore Projects Dashboard
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </button>
                      <button
                        onClick={() => setView('foi')}
                        className="px-8 py-4 bg-white/40 backdrop-blur-md text-[#09637E] font-bold rounded-2xl border border-white/40 hover:bg-white/60 transition-all cursor-pointer"
                      >
                        View Public Records
                      </button>
                    </div>
                  </div>
                </div>

                {/* Feature Cards */}
                <div className="grid md:grid-cols-3 gap-8 mt-16">
                  <div className="p-8 rounded-3xl bg-white border border-[#09637E]/10 shadow-sm">
                    <div className="w-12 h-12 bg-[#EBF4F6] rounded-2xl flex items-center justify-center text-[#09637E] mb-6">
                      <ShieldCheck />
                    </div>
                    <h3 className="text-xl font-bold text-[#1C1C1C] mb-3">Immutable Records</h3>
                    <p className="text-sm text-gray-500 leading-relaxed font-medium">
                      Project records cannot be altered once finalized, ensuring accountability and preventing unauthorized modifications.
                    </p>
                  </div>
                  <div className="p-8 rounded-3xl bg-white border border-[#09637E]/10 shadow-sm">
                    <div className="w-12 h-12 bg-[#088395] rounded-2xl flex items-center justify-center text-white mb-6">
                      <Search />
                    </div>
                    <h3 className="text-xl font-bold text-[#1C1C1C] mb-3">Public Transparency</h3>
                    <p className="text-sm text-gray-500 leading-relaxed font-medium">
                      Citizens can track project budgets, timelines, and status in real time with blockchain-verified data.
                    </p>
                  </div>
                  <div className="p-8 rounded-3xl bg-white border border-[#09637E]/10 shadow-sm">
                    <div className="w-12 h-12 bg-[#09637E] rounded-2xl flex items-center justify-center text-white mb-6">
                      <Database />
                    </div>
                    <h3 className="text-xl font-bold text-[#1C1C1C] mb-3">Citizen Access</h3>
                    <p className="text-sm text-gray-500 leading-relaxed font-medium">
                      Easy-to-use search and filter tools for citizens to find projects that matter to their community.
                    </p>
                  </div>
                </div>

                {/* Barangays Section */}
                <div className="mt-16">
                  <h2 className="text-2xl font-black text-[#09637E] mb-8 text-center">Covered Barangays · GMA, Cavite</h2>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {['Poblacion 1', 'Poblacion 2', 'Poblacion 3', 'Poblacion 4', 'Poblacion 5'].map((b, i) => (
                      <div
                        key={b}
                        className="p-6 rounded-3xl bg-white border border-[#09637E]/10 shadow-sm text-center hover:border-[#088395]/30 hover:shadow-md transition-all cursor-pointer"
                        onClick={() => { setSelectedBarangayId(String(i + 1)); setView('dashboard'); }}
                      >
                        <div className="w-12 h-12 rounded-2xl bg-[#EBF4F6] flex items-center justify-center mx-auto mb-3">
                          <span className="text-xl font-black text-[#09637E]">{i + 1}</span>
                        </div>
                        <p className="text-sm font-bold text-[#09637E]">{b}</p>
                        <p className="text-[10px] text-gray-400 font-medium mt-1">GMA, Cavite</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stats Banner */}
                <div className="mt-16 p-8 md:p-12 rounded-[40px] bg-[#09637E] text-white">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {[
                      { value: loadingProjects ? '...' : String(projects.length), label: 'Total Projects' },
                      { value: loadingProjects ? '...' : String(projects.filter(p => p.projectStatus === 'Ongoing').length), label: 'Ongoing Projects' },
                      { value: loadingProjects ? '...' : String(projects.filter(p => p.blockchainVerified).length), label: 'Blockchain Verified' },
                      { value: '5', label: 'Active Barangays' },
                    ].map(s => (
                      <div key={s.label} className="text-center">
                        <p className="text-4xl font-black text-white">{s.value}</p>
                        <p className="text-xs font-bold text-white/50 uppercase tracking-wider mt-2">{s.label}</p>
                      </div>
                    ))}
                  </div>
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
                  title="Projects Monitoring Dashboard"
                  subtitle={`Citizen-facing project tracking and transparency for ${selectedBarangayId === 'all' ? 'all barangays' : barangays.find(b => b.id === selectedBarangayId)?.name}`}
                />
              </motion.div>
            )}

            {view === 'project-detail' && selectedProject && (
              <motion.div key="project-detail" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <ProjectDetailsPage
                  project={selectedProject}
                  onBack={() => setView('dashboard')}
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
          <div className="flex items-center gap-6 text-xs text-gray-400 font-medium">
            <button onClick={() => setView('home')} className="hover:text-[#09637E] transition-colors cursor-pointer">Home</button>
            <button onClick={() => setView('dashboard')} className="hover:text-[#09637E] transition-colors cursor-pointer">Projects</button>
            <button onClick={() => setView('foi')} className="hover:text-[#09637E] transition-colors cursor-pointer">FOI Office</button>
            <Link to="/login" className="hover:text-[#09637E] transition-colors">Admin Login</Link>
          </div>
          <p className="text-xs text-gray-400 font-medium">© 2026 LegiChain · GMA, Cavite</p>
        </div>
      </footer>
    </div>
  );
}
