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
  auditLogs: AuditLog[];
  loading?: boolean;
}

export function AuditLogsPage({ onViewProof, auditLogs = [], loading = false }: AuditLogsPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [barangayFilter, setBarangayFilter] = useState('all');
  const [moduleFilter, setModuleFilter] = useState('all');
  const [actionTypeFilter, setActionTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');

  // Safety fallback array guard
  const safeLogs = auditLogs || [];

  // --- DYNAMIC SELECT OPTION EXTRACTORS (Calculated automatically from live row entries) ---
  const dynamicOptions = useMemo(() => {
    const barangays = new Set<string>();
    const modules = new Set<string>();
    const actionTypes = new Set<string>();
    
    safeLogs.forEach(log => {
      if (log.barangay) barangays.add(log.barangay);
      
      // Normalize module names to ensure consistent categorization tags
      if (log.module) {
        if (log.module === 'Projects' || log.module === 'Funding') modules.add('Projects');
        else if (log.module === 'Documents' || log.module === 'Blockchain') modules.add('Documents');
        else modules.add(log.module);
      }
      
      if (log.actionType) actionTypes.add(log.actionType);
    });

    return {
      barangays: Array.from(barangays).sort(),
      modules: Array.from(modules).sort(),
      actionTypes: Array.from(actionTypes).sort(),
    };
  }, [safeLogs]);

  // --- FILTER ENGINE FOR COMBINED TIMELINE ---
  const filteredLogs = useMemo(() => {
    return safeLogs.filter(log => {
      const action = log.action || '';
      const title = log.projectTitle || '';
      const performer = log.performedBy || '';
      const desc = log.description || '';
      const brgy = log.barangay || '';
      const hash = log.txHash || '';
      const status = log.blockchainStatus || '';
      
      // Normalize current module checking row strings
      let logModule = log.module || '';
      if (logModule === 'Funding') logModule = 'Projects';
      if (logModule === 'Blockchain') logModule = 'Documents';

      const matchesSearch = 
        action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        performer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hash.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesBarangay = barangayFilter === 'all' || brgy.toLowerCase() === barangayFilter.toLowerCase();
      const matchesModule = moduleFilter === 'all' || logModule === moduleFilter;
      const matchesActionType = actionTypeFilter === 'all' || log.actionType === actionTypeFilter;
      
      // Normalized matching layer for both data models verification states
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'Success' && (status === 'Success' || status === 'Verified' || status === 'Verified on Chain')) ||
        (statusFilter === 'Pending' && status.toLowerCase().includes('pending')) ||
        status === statusFilter;

      const matchesDate = !dateFilter || (log.timestamp && log.timestamp.includes(dateFilter));

      return matchesSearch && matchesBarangay && matchesModule && matchesActionType && matchesStatus && matchesDate;
    });
  }, [safeLogs, searchTerm, barangayFilter, moduleFilter, actionTypeFilter, statusFilter, dateFilter]);

  // --- DYNAMIC COMBINED STATISTICS ---
  const stats = useMemo(() => {
    return {
      total: safeLogs.length,
      verified: safeLogs.filter(l => 
        l.blockchainStatus === 'Success' || 
        l.blockchainStatus === 'Verified' || 
        l.blockchainStatus === 'Verified on Chain'
      ).length,
      byModule: {
        Projects: safeLogs.filter(l => l.module === 'Projects' || l.module === 'Funding').length,
        Documents: safeLogs.filter(l => l.module === 'Documents' || l.module === 'Blockchain').length,
      }
    };
  }, [safeLogs]);

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
            Combined historical administrative trail for Projects and Documents secured by Polygon Blockchain
          </p>
        </div>
        <div className="flex items-center space-x-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-2xl">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Integrity Check Active</span>
        </div>
      </div>

      {/* Stats Cards Dashboard Display */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Total Aggregated Ops" value={stats.total} color="bg-[#EBF4F6]" text="text-[#09637E]" />
        <StatCard label="Combined On-Chain Sealed" value={stats.verified} color="bg-emerald-50" text="text-emerald-700" />
        <StatCard label="Project Updates" value={stats.byModule.Projects} color="bg-blue-50" text="text-blue-700" />
        <StatCard label="Doc Registries" value={stats.byModule.Documents} color="bg-purple-50" text="text-purple-700" />
      </div>

      {/* Filters Control Center Panel */}
      <div className="bg-white p-6 rounded-[32px] border-2 border-[#09637E]/5 shadow-sm space-y-4">
        {/* Search Bar Input */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
          <input 
            placeholder="Search combined logs by Action, Performer, Description, or Transaction Hash..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#088395] transition-all"
          />
        </div>

        {/* Multi-Select Interactive Filter Dropdowns Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {/* Barangay Dropdown */}
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider">Barangay</label>
            <select
              value={barangayFilter}
              onChange={(e) => setBarangayFilter(e.target.value)}
              className="w-full p-3 bg-gray-50 border-none rounded-xl text-xs font-bold text-gray-700 focus:ring-2 focus:ring-[#088395]"
            >
              <option value="all">All Barangays</option>
              {dynamicOptions.barangays.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* Module Filter */}
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider">System Module</label>
            <select
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              className="w-full p-3 bg-gray-50 border-none rounded-xl text-xs font-bold text-gray-700 focus:ring-2 focus:ring-[#088395]"
            >
              <option value="all">All Modules</option>
              {dynamicOptions.modules.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* Action Type Filter */}
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider">Operation Type</label>
            <select
              value={actionTypeFilter}
              onChange={(e) => setActionTypeFilter(e.target.value)}
              className="w-full p-3 bg-gray-50 border-none rounded-xl text-xs font-bold text-gray-700 focus:ring-2 focus:ring-[#088395]"
            >
              <option value="all">All Actions</option>
              {dynamicOptions.actionTypes.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Ledger Status Filter */}
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider">Ledger Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-3 bg-gray-50 border-none rounded-xl text-xs font-bold text-gray-700 focus:ring-2 focus:ring-[#088395]"
            >
              <option value="all">All States</option>
              <option value="Success">Success / Verified</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>
          </div>

          {/* Date Query Filter */}
          <div className="space-y-1 col-span-2 md:col-span-1">
            <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider">Date/Year</label>
            <input
              type="text"
              placeholder="e.g. 2026"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full p-3 bg-gray-50 border-none rounded-xl text-xs font-bold text-gray-700 focus:ring-2 focus:ring-[#088395]"
            />
          </div>
        </div>
      </div>

      {/* Data Layout Table Container */}
      <div className="bg-white rounded-[40px] border-2 border-[#09637E]/5 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          {loading && safeLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-[#088395]" />
              <span className="text-[#09637E]/60 font-black text-xs uppercase tracking-[0.2em]">Synchronizing Combined Trail...</span>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-gray-400">
              <Database size={32} className="mb-2 text-gray-300" />
              <span className="text-xs font-bold uppercase tracking-wider">No matching combined audit entries found</span>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#EBF4F6] text-[9px] uppercase tracking-[0.2em] text-[#09637E]/60 font-black">
                  <th className="px-8 py-6">Timestamp</th>
                  <th className="px-8 py-6">Operation</th>
                  <th className="px-8 py-6">Description / Module Context</th>
                  <th className="px-8 py-6">Performer</th>
                  <th className="px-8 py-6 text-center">Status</th>
                  <th className="px-8 py-6 text-right">Proof</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredLogs.map((log) => {
                  const statusStr = log.blockchainStatus || '';
                  const isSuccess = statusStr === 'Success' || statusStr === 'Verified' || statusStr === 'Verified on Chain';
                  
                  // Extract display scope category for module column tracing representation
                  let currentScope = log.module || 'System';
                  if (currentScope === 'Funding') currentScope = 'Projects';
                  if (currentScope === 'Blockchain') currentScope = 'Documents';

                  return (
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
                      <td className="px-8 py-5 max-w-[340px]">
                        <p className="text-[11px] font-bold text-[#1C1C1C] truncate">{log.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[9px] font-medium text-[#088395] uppercase tracking-widest">{log.barangay}</span>
                          <span className="text-[9px] text-gray-300">•</span>
                          <span className="px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded text-[8px] font-extrabold uppercase tracking-tight">{currentScope}</span>
                          {log.projectTitle && (
                            <>
                              <span className="text-[9px] text-gray-300">•</span>
                              <span className="text-[9px] text-gray-400 font-medium truncate max-w-[120px]">{log.projectTitle}</span>
                            </>
                          )}
                        </div>
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
                          isSuccess ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-amber-50 border-amber-100 text-amber-700'
                        }`}>
                          <ShieldCheck size={10} className="mr-1.5" />
                          <span className="text-[8px] font-black uppercase tracking-tight">
                            {isSuccess ? 'Verified' : log.blockchainStatus || 'Local'}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button onClick={() => onViewProof(log)} className="p-2 hover:bg-[#EBF4F6] rounded-xl text-[#088395] transition-all">
                          <ChevronRight size={20} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
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