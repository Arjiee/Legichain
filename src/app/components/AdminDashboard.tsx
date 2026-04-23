import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { 
  FileText, CheckCircle, Database, Activity, Loader2, 
  Building2, TrendingUp, ShieldCheck, ChevronLeft, 
  ChevronRight, ArrowRight, Clock
} from 'lucide-react';
import { useData } from './DataContext'; 
import { Badge } from './ui/badge';
import { BarangayProject } from '../utils/projectData';
import { useAccount, useChainId } from 'wagmi';

const ITEMS_PER_PAGE = 10;
const AMOY_CHAIN_ID = 80002;

interface AdminDashboardProps {
  onViewProject: (project: BarangayProject) => void;
}

export function AdminDashboard({ onViewProject }: AdminDashboardProps) {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { 
    dbDocuments, 
    projects, 
    blockchainTxs, 
    loadingProjects, 
    loadingBlockchain 
  } = useData();

  const [currentPage, setCurrentPage] = useState(1);

  const networkStatus = useMemo(() => {
    if (!isConnected) return { label: 'Disconnected', color: 'text-red-600', dot: 'bg-red-600' };
    return chainId === AMOY_CHAIN_ID 
      ? { label: 'Synchronized', color: 'text-emerald-600', dot: 'bg-emerald-600' }
      : { label: 'Wrong Network', color: 'text-amber-600', dot: 'bg-amber-600' };
  }, [isConnected, chainId]);

  const sortedProjects = useMemo(() => {
    return [...projects].sort((a, b) => Number(b.id || 0) - Number(a.id || 0));
  }, [projects]);

  const totalPages = Math.ceil(sortedProjects.length / ITEMS_PER_PAGE);
  const paginatedProjects = sortedProjects.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const stats = [
    { title: 'Total Projects', value: loadingProjects ? '...' : projects.length, icon: Building2, gradient: 'linear-gradient(135deg, #504B38 0%, #B9B28A 100%)' },
    { title: 'Active Ledger', value: loadingProjects ? '...' : dbDocuments.length, icon: FileText, gradient: 'linear-gradient(135deg, #B9B28A 0%, #EBE5C2 100%)' },
    { title: 'Verified Proofs', value: loadingProjects ? '...' : projects.filter(p => p.blockchainVerified).length, icon: ShieldCheck, gradient: 'linear-gradient(135deg, #EBE5C2 0%, #B9B28A 100%)' },
    { title: 'Chain Operations', value: loadingBlockchain ? '...' : blockchainTxs.length, icon: Database, gradient: 'linear-gradient(135deg, #B9B28A 0%, #504B38 100%)' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700 min-h-screen p-2">
      {/* Header Area */}
      <div className="space-y-2">
        <h1 className="text-4xl font-black tracking-tight" style={{ color: '#504B38' }}>Admin Dashboard</h1>
        <p style={{ color: '#504B38' }} className="font-bold opacity-70 uppercase text-[10px] tracking-[0.2em] flex items-center gap-2">
          <span className={`relative flex h-2 w-2`}>
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${networkStatus.dot}`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${networkStatus.dot}`}></span>
          </span>
          Protocol Status: Polygon Amoy {networkStatus.label}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-none shadow-sm rounded-[24px] overflow-hidden bg-white group">
            <div className="h-1.5" style={{ background: stat.gradient }} />
            <CardHeader className="flex flex-row items-center justify-between pb-2 pt-6">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest text-gray-400">{stat.title}</CardTitle>
              <div className="p-3 rounded-2xl bg-[#F8F3D9] group-hover:scale-110 transition-transform">
                <stat.icon className="w-5 h-5 text-[#B9B28A]" strokeWidth={2.5} />
              </div>
            </CardHeader>
            <CardContent><div className="text-4xl font-black text-[#504B38]">{stat.value}</div></CardContent>
          </Card>
        ))}
      </div>

      {/* PROJECT MONITORING TABLE */}
      <Card className="border-none shadow-sm rounded-[32px] bg-white overflow-hidden">
        <CardHeader className="border-b border-gray-50 bg-gray-50/30 py-6 px-8 flex justify-between items-center">
          <CardTitle className="flex items-center gap-3 font-black text-xl text-[#504B38] uppercase">
            <TrendingUp className="w-6 h-6 text-[#B9B28A]" strokeWidth={2.5} />
            Project Monitoring Ledger
          </CardTitle>
          <Badge className="bg-[#B9B28A] text-white font-black text-[9px] uppercase tracking-widest px-3 py-1">Live Data</Badge>
        </CardHeader>
        <CardContent className="p-0">
          {loadingProjects ? (
            <div className="py-20 flex flex-col items-center justify-center gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-[#B9B28A]" />
              <p className="font-bold text-[#504B38]/60 uppercase text-xs tracking-widest">Hydrating Ledger...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50 border-b border-gray-100">
                  <tr>
                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Identification</th>
                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {paginatedProjects.map((project) => (
                    <tr key={project.id} className="hover:bg-[#F8F3D9]/20 transition-colors group">
                      <td className="px-8 py-5">
                        <span className="text-[10px] font-mono text-[#B9B28A] font-black uppercase mb-0.5 block">{project.projectId}</span>
                        <span className="text-sm font-black text-[#504B38]">{project.projectTitle}</span>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                          project.projectStatus === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-blue-50 text-blue-700 border-blue-100'
                        }`}>{project.projectStatus}</span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button onClick={() => onViewProject(project)} className="p-2 text-[#B9B28A] bg-[#F8F3D9] rounded-xl hover:bg-[#B9B28A] hover:text-white transition-all shadow-sm">
                          <ArrowRight size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {totalPages > 1 && (
                <div className="p-6 bg-gray-50/20 border-t border-gray-100 flex items-center justify-between">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Page {currentPage} of {totalPages}</p>
                  <div className="flex gap-2">
                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-xl border border-gray-200 bg-white disabled:opacity-30"><ChevronLeft size={16}/></button>
                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 rounded-xl border border-gray-200 bg-white disabled:opacity-30"><ChevronRight size={16}/></button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}