import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  Calendar, 
  User, 
  Hash, 
  Database, 
  Building2, 
  FileText, 
  ExternalLink,
  CheckCircle2,
  Clock,
  ChevronRight,
  Download,
  TrendingUp,
  DollarSign,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ProjectAuditLog } from '../utils/auditLogData';

export interface AuditLog extends ProjectAuditLog {}

interface AuditLogsPageProps {
  isAdmin?: boolean;
  onViewProof: (log: AuditLog) => void;
  logs: AuditLog[];
  loading?: boolean;
}

export function AuditLogsPage({ onViewProof, logs, loading = false }: AuditLogsPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [barangayFilter, setBarangayFilter] = useState('all');
  const [moduleFilter, setModuleFilter] = useState('all');
  const [actionTypeFilter, setActionTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesSearch = 
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.projectTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.performedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.barangay.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.txHash.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesBarangay = barangayFilter === 'all' || log.barangay === barangayFilter;
      const matchesModule = moduleFilter === 'all' || log.module === moduleFilter;
      const matchesActionType = actionTypeFilter === 'all' || log.actionType === actionTypeFilter;
      const matchesStatus = statusFilter === 'all' || log.blockchainStatus === statusFilter;
      const matchesDate = !dateFilter || log.timestamp.includes(dateFilter);

      return matchesSearch && matchesBarangay && matchesModule && matchesActionType && matchesStatus && matchesDate;
    });
  }, [logs, searchTerm, barangayFilter, moduleFilter, actionTypeFilter, statusFilter, dateFilter]);

  const barangays = ['Poblacion 1', 'Poblacion 2', 'Poblacion 3', 'Poblacion 4', 'Poblacion 5'];
  const modules = ['Projects', 'Funding', 'Documents', 'Blockchain', 'Users', 'System'];
  const actionTypes = ['Create', 'Update', 'Delete', 'Verify', 'Upload', 'Approve', 'Login'];

  const stats = useMemo(() => ({
    total: logs.length,
    verified: logs.filter(log => log.blockchainStatus === 'Success').length,
    byModule: {
      Projects: logs.filter(log => log.module === 'Projects').length,
      Funding: logs.filter(log => log.module === 'Funding').length,
      Documents: logs.filter(log => log.module === 'Documents').length,
      Blockchain: logs.filter(log => log.module === 'Blockchain').length,
    }
  }), [logs]);

  const getActionTypeColor = (actionType: string) => {
    switch (actionType) {
      case 'Create': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Update': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Delete': return 'bg-red-100 text-red-700 border-red-200';
      case 'Verify': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Upload': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Approve': return 'bg-green-100 text-green-700 border-green-200';
      case 'Login': return 'bg-gray-100 text-gray-700 border-gray-200';
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
            Tamper-proof record of all administrative actions secured by blockchain
          </p>
        </div>
        <div className="flex items-center space-x-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-2xl">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Live Transparency Sync</span>
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="border-2 border-[#09637E]/10 rounded-3xl shadow-sm bg-white overflow-hidden">
        <div className="p-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#09637E]/40" />
            <input 
              placeholder="Search by project title, user, barangay, or TxHash..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 h-14 border-2 border-[#EBF4F6] rounded-2xl focus:ring-2 focus:ring-[#088395] focus:outline-none font-medium"
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center space-x-2 bg-[#EBF4F6] px-4 py-2 rounded-xl border border-[#09637E]/10">
              <Building2 size={16} className="text-[#09637E]/50" />
              <select 
                value={barangayFilter}
                onChange={(e) => setBarangayFilter(e.target.value)}
                className="bg-transparent border-none text-xs font-black text-[#09637E] focus:ring-0 cursor-pointer pr-4 uppercase tracking-wider"
              >
                <option value="all">All Barangays</option>
                {barangays.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>

            <div className="flex items-center space-x-2 bg-[#EBF4F6] px-4 py-2 rounded-xl border border-[#09637E]/10">
              <Database size={16} className="text-[#09637E]/50" />
              <select 
                value={moduleFilter}
                onChange={(e) => setModuleFilter(e.target.value)}
                className="bg-transparent border-none text-xs font-black text-[#09637E] focus:ring-0 cursor-pointer pr-4 uppercase tracking-wider"
              >
                <option value="all">All Modules</option>
                {modules.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            <div className="flex items-center space-x-2 bg-[#EBF4F6] px-4 py-2 rounded-xl border border-[#09637E]/10">
              <Filter size={16} className="text-[#09637E]/50" />
              <select 
                value={actionTypeFilter}
                onChange={(e) => setActionTypeFilter(e.target.value)}
                className="bg-transparent border-none text-xs font-black text-[#09637E] focus:ring-0 cursor-pointer pr-4 uppercase tracking-wider"
              >
                <option value="all">All Action Types</option>
                {actionTypes.map(at => <option key={at} value={at}>{at}</option>)}
              </select>
            </div>

            <div className="flex items-center space-x-2 bg-[#EBF4F6] px-4 py-2 rounded-xl border border-[#09637E]/10">
              <Calendar size={16} className="text-[#09637E]/50" />
              <input 
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="bg-transparent border-none text-xs font-black text-[#09637E] focus:ring-0 cursor-pointer uppercase tracking-wider"
              />
            </div>

            <div className="flex items-center space-x-2 bg-[#EBF4F6] px-4 py-2 rounded-xl border border-[#09637E]/10">
              <ShieldCheck size={16} className="text-[#09637E]/50" />
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent border-none text-xs font-black text-[#09637E] focus:ring-0 cursor-pointer pr-4 uppercase tracking-wider"
              >
                <option value="all">All Status</option>
                <option value="Success">Verified</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
              </select>
            </div>

            <button 
              className="ml-auto px-6 py-2 bg-[#088395] text-white text-xs font-bold rounded-xl hover:bg-[#09637E] transition-colors flex items-center gap-2"
              onClick={() => alert('Export functionality coming soon')}
            >
              <Download size={14} />
              Export Logs
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="px-6 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-[#EBF4F6] border border-[#09637E]/10">
              <p className="text-xs font-bold text-[#09637E]/50 uppercase tracking-widest mb-1">Total Logs</p>
              <p className="text-2xl font-black text-[#09637E]">
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : stats.total}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
              <p className="text-xs font-bold text-emerald-600/50 uppercase tracking-widest mb-1">Verified</p>
              <p className="text-2xl font-black text-emerald-700">
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : stats.verified}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200">
              <p className="text-xs font-bold text-blue-600/50 uppercase tracking-widest mb-1">Projects</p>
              <p className="text-2xl font-black text-blue-700">
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : stats.byModule.Projects}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200">
              <p className="text-xs font-bold text-purple-600/50 uppercase tracking-widest mb-1">Documents</p>
              <p className="text-2xl font-black text-purple-700">
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : stats.byModule.Documents}
              </p>
            </div>
          </div>
        </div>

        {/* Logs Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-[#088395]" />
              <span className="text-gray-500 font-bold">Loading audit logs from database...</span>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#EBF4F6] text-[10px] uppercase tracking-widest text-[#09637E]/60 font-black">
                  <th className="px-6 py-5 border-b border-[#09637E]/5">Date & Time</th>
                  <th className="px-6 py-5 border-b border-[#09637E]/5">Module</th>
                  <th className="px-6 py-5 border-b border-[#09637E]/5">Action</th>
                  <th className="px-6 py-5 border-b border-[#09637E]/5">Description</th>
                  <th className="px-6 py-5 border-b border-[#09637E]/5">Barangay</th>
                  <th className="px-6 py-5 border-b border-[#09637E]/5">Performed By</th>
                  <th className="px-6 py-5 border-b border-[#09637E]/5 text-center">Status</th>
                  <th className="px-6 py-5 border-b border-[#09637E]/5 text-right">Proof</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredLogs.map((log) => (
                  <tr 
                    key={log.id} 
                    className="hover:bg-[#EBF4F6]/30 transition-all group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Clock size={14} className="text-[#088395]" />
                        <span className="text-xs font-bold text-[#1C1C1C]">{log.timestamp}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                        log.module === 'Projects' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        log.module === 'Funding' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        log.module === 'Documents' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                        log.module === 'Blockchain' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        'bg-gray-50 text-gray-700 border-gray-200'
                      }`}>
                        {log.module}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${getActionTypeColor(log.actionType)}`}>
                        {log.actionType}
                      </span>
                    </td>
                    <td className="px-6 py-4 max-w-[250px]">
                      <p className="text-xs font-medium text-gray-700 truncate">{log.description}</p>
                      {log.projectTitle && (
                        <p className="text-[10px] text-gray-400 mt-1">{log.projectTitle}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-gray-500">
                      <div className="flex items-center space-x-2">
                        <Building2 size={14} className="text-[#088395]" />
                        <span>{log.barangay}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-[#088395]/20 flex items-center justify-center">
                          <User size={12} className="text-[#088395]" />
                        </div>
                        <span className="text-xs font-bold text-[#1C1C1C]">{log.performedBy}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className={`inline-flex items-center px-2 py-1 rounded-full border ${
                        log.blockchainStatus === 'Success' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' :
                        log.blockchainStatus === 'Pending' ? 'bg-amber-50 border-amber-100 text-amber-700' :
                        'bg-red-50 border-red-100 text-red-700'
                      }`}>
                        <ShieldCheck size={12} className="mr-1" />
                        <span className="text-[9px] font-black uppercase">{log.blockchainStatus}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => onViewProof(log)}
                        className="inline-flex items-center space-x-2 text-[10px] font-black text-[#088395] uppercase hover:text-[#09637E] transition-colors cursor-pointer"
                      >
                        <span>View</span>
                        <ChevronRight size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredLogs.length === 0 && !loading && (
                  <tr>
                    <td colSpan={8} className="px-6 py-20 text-center text-gray-400 font-bold italic">
                      No matching audit records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

// Keep backward compat export
export const SAMPLE_LOGS: AuditLog[] = [];
