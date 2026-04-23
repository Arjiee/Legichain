import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, Search, Filter, Calendar, User, Database, Building2, 
  Clock, ChevronRight, Download, Loader2 
} from 'lucide-react';
import { ProjectAuditLog } from '../utils/auditLogData';

export interface AuditLog extends ProjectAuditLog {}

interface AuditLogsPageProps {
  isAdmin?: boolean;
  onViewProof: (log: AuditLog) => void;
  logs: AuditLog[];
  loading?: boolean;
}

export function AuditLogsPage({ onViewProof, logs = [], loading = false }: AuditLogsPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [barangayFilter, setBarangayFilter] = useState('all');
  const [moduleFilter, setModuleFilter] = useState('all');
  const [actionTypeFilter, setActionTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');

  // 1. Double-lock safety fallback
  const safeLogs = logs || [];

  const filteredLogs = useMemo(() => {
    return safeLogs.filter(log => {
      // 2. Null-safe property access to prevent Crashes
      const action = log.action || '';
      const title = log.projectTitle || '';
      const performer = log.performedBy || '';
      const desc = log.description || '';
      const brgy = log.barangay || '';
      const hash = log.txHash || '';

      const matchesSearch = 
        action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        performer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hash.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesBarangay = barangayFilter === 'all' || brgy === barangayFilter;
      const matchesModule = moduleFilter === 'all' || log.module === moduleFilter;
      const matchesActionType = actionTypeFilter === 'all' || log.actionType === actionTypeFilter;
      const matchesStatus = statusFilter === 'all' || log.blockchainStatus === statusFilter;
      const matchesDate = !dateFilter || (log.timestamp && log.timestamp.includes(dateFilter));

      return matchesSearch && matchesBarangay && matchesModule && matchesActionType && matchesStatus && matchesDate;
    });
  }, [safeLogs, searchTerm, barangayFilter, moduleFilter, actionTypeFilter, statusFilter, dateFilter]);

  // Dynamic Statistics from local state
  const stats = useMemo(() => ({
    total: safeLogs.length,
    verified: safeLogs.filter(l => l.blockchainStatus === 'Success' || l.blockchainStatus === 'Verified').length,
    byModule: {
      Projects: safeLogs.filter(l => l.module === 'Projects').length,
      Documents: safeLogs.filter(l => l.module === 'Documents').length,
    }
  }), [safeLogs]);

  const getActionTypeColor = (type: string) => {
    switch (type) {
      case 'Create': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Update': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Delete': return 'bg-red-100 text-red-700 border-red-200';
      case 'Verify': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#1C1C1C] tracking-tight flex items-center gap-3">
            <ShieldCheck className="text-[#088395]" size={32} />
            System Audit Logs
          </h1>
          <p className="text-gray-500 font-bold mt-1">
            Authenticated administrative trail secured by Polygon Blockchain
          </p>
        </div>
        <div className="flex items-center space-x-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-2xl">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Integrity Check Active</span>
        </div>
      </div>

      {/* Stats Panel */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Total Operations" value={stats.total} color="bg-[#EBF4F6]" text="text-[#09637E]" />
        <StatCard label="On-Chain Sealed" value={stats.verified} color="bg-emerald-50" text="text-emerald-700" />
        <StatCard label="Project Updates" value={stats.byModule.Projects} color="bg-blue-50" text="text-blue-700" />
        <StatCard label="Doc Registries" value={stats.byModule.Documents} color="bg-purple-50" text="text-purple-700" />
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-6 rounded-[32px] border-2 border-[#09637E]/5 shadow-sm space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
          <input 
            placeholder="Search by Action, Performer, or Transaction Hash..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#088395] transition-all"
          />
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-[40px] border-2 border-[#09637E]/5 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          {loading && safeLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-[#088395]" />
              <span className="text-[#09637E]/60 font-black text-xs uppercase tracking-[0.2em]">Synchronizing Audit Trail...</span>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#EBF4F6] text-[9px] uppercase tracking-[0.2em] text-[#09637E]/60 font-black">
                  <th className="px-8 py-6">Timestamp</th>
                  <th className="px-8 py-6">Operation</th>
                  <th className="px-8 py-6">Description</th>
                  <th className="px-8 py-6">Performer</th>
                  <th className="px-8 py-6 text-center">Status</th>
                  <th className="px-8 py-6 text-right">Proof</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#EBF4F6]/20 transition-all group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <Clock size={12} className="text-gray-300" />
                        <span className="text-[11px] font-bold text-gray-500">{log.timestamp}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-wider border ${getActionTypeColor(log.actionType)}`}>
                        {log.actionType}
                      </span>
                    </td>
                    <td className="px-8 py-5 max-w-[300px]">
                      <p className="text-[11px] font-bold text-[#1C1C1C] truncate">{log.description}</p>
                      <p className="text-[9px] font-medium text-[#088395] mt-1 uppercase tracking-widest">{log.barangay}</p>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                          <User size={12} />
                        </div>
                        <span className="text-[11px] font-bold text-gray-700">{log.performedBy}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full border-2 ${
                        log.blockchainStatus === 'Success' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-amber-50 border-amber-100 text-amber-700'
                      }`}>
                        <ShieldCheck size={10} className="mr-1.5" />
                        <span className="text-[8px] font-black uppercase tracking-tight">{log.blockchainStatus}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button onClick={() => onViewProof(log)} className="p-2 hover:bg-[#EBF4F6] rounded-xl text-[#088395] transition-all">
                        <ChevronRight size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color, text }: any) {
  return (
    <div className={`p-6 rounded-[32px] ${color} border-2 border-transparent transition-all`}>
      <p className={`text-[9px] font-black uppercase tracking-[0.2em] ${text} opacity-60 mb-1`}>{label}</p>
      <h3 className={`text-2xl font-black ${text} tracking-tight`}>{value}</h3>
    </div>
  );
}