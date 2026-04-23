import React, { useState, useMemo } from 'react';
import { 
  Search, ShieldCheck, FileText, AlertTriangle, Database, 
  Layers, Loader2, RefreshCw, ExternalLink 
} from 'lucide-react';
import { useData } from './DataContext';
import { BlockchainTransaction } from '../utils/blockchainData';

export function BlockchainExplorerPage() {
  // 1. Consume live data directly from your verified context
  const { liveTransactions = [], loadingBlockchain, handleRefreshData, barangays = [] } = useData();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  // 2. SAFETY: Ensure we never run .length on undefined
  const transactions = liveTransactions || [];

  const stats = useMemo(() => ({
    total: transactions.length,
    latestBlock: transactions.length > 0 
      ? Math.max(...transactions.map(tx => parseInt(tx.blockNumber) || 0)) 
      : 0,
    verified: transactions.filter(tx => tx.verificationStatus === 'Verified').length
  }), [transactions]);

  const filtered = useMemo(() => {
    return transactions.filter(tx => {
      const matchesSearch = 
        (tx.txHash || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (tx.ordinanceTitle || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || tx.recordType === filterType;
      return matchesSearch && matchesType;
    });
  }, [transactions, searchTerm, filterType]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#1C1C1C] tracking-tight">Blockchain Explorer</h1>
          <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mt-1">
            Real-time Ledger: Polygon Amoy Testnet
          </p>
        </div>
        <button 
          onClick={handleRefreshData}
          className="px-6 py-3 bg-[#EBF4F6] text-[#088395] font-black rounded-2xl flex items-center gap-2 hover:bg-[#088395] hover:text-white transition-all shadow-sm uppercase text-[10px] tracking-widest"
        >
          <RefreshCw size={14} className={loadingBlockchain ? 'animate-spin' : ''} />
          {loadingBlockchain ? 'Syncing Chain...' : 'Refresh Records'}
        </button>
      </div>

      {/* Stats Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Total Transactions" value={stats.total} icon={<Database />} color="bg-blue-50" text="text-blue-600" />
        <StatCard label="Verified Records" value={stats.verified} icon={<ShieldCheck />} color="bg-emerald-50" text="text-emerald-600" />
        <StatCard label="Current Block Height" value={`#${stats.latestBlock}`} icon={<Layers />} color="bg-purple-50" text="text-purple-600" />
      </div>

      {/* Transaction Table */}
      <div className="bg-white rounded-[40px] border-2 border-[#09637E]/5 overflow-hidden shadow-sm">
        <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
            <input 
              placeholder="Search Transaction Hash..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#088395] transition-all"
            />
          </div>
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-6 py-4 bg-gray-50 border-none rounded-2xl text-xs font-black uppercase tracking-widest text-[#09637E]"
          >
            <option value="all">All Records</option>
            <option value="Project Record">Projects</option>
            <option value="Ordinance Record">Ordinances</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          {loadingBlockchain && transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-[#088395]" />
              <span className="text-[#09637E]/60 font-black text-xs uppercase tracking-[0.2em]">Communicating with Polygon Node...</span>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#EBF4F6] text-[10px] uppercase tracking-[0.2em] text-[#09637E]/60 font-black">
                  <th className="px-8 py-6">Tx Hash</th>
                  <th className="px-8 py-6">Block</th>
                  <th className="px-8 py-6">Identity / Title</th>
                  <th className="px-8 py-6 text-center">Status</th>
                  <th className="px-8 py-6 text-right">PolygonScan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((tx, i) => (
                  <tr key={i} className="hover:bg-[#EBF4F6]/20 transition-all group">
                    <td className="px-8 py-5">
                      <span className="font-mono font-black text-[#088395] text-[11px] bg-[#088395]/5 px-2 py-1 rounded-lg">
                        {tx.txHash.slice(0, 10)}...{tx.txHash.slice(-6)}
                      </span>
                    </td>
                    <td className="px-8 py-5 font-mono font-black text-xs text-gray-400">#{tx.blockNumber}</td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-[#1C1C1C] uppercase">{tx.ordinanceTitle}</span>
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">{tx.recordType}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <div className="inline-flex items-center px-3 py-1 rounded-full border-2 bg-emerald-50 border-emerald-100 text-emerald-700">
                        <ShieldCheck size={10} className="mr-1.5" />
                        <span className="text-[8px] font-black uppercase tracking-tight">Verified</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <a 
                        href={tx.blockExplorerUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:bg-[#088395] hover:text-white transition-all inline-block"
                      >
                        <ExternalLink size={16} />
                      </a>
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

function StatCard({ label, value, icon, color, text }: any) {
  return (
    <div className={`p-8 rounded-[40px] ${color} border-2 border-transparent hover:border-current/10 transition-all group`}>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 bg-white shadow-sm ${text}`}>
        {icon}
      </div>
      <p className={`text-[10px] font-black uppercase tracking-widest ${text} opacity-60 mb-1`}>{label}</p>
      <h3 className={`text-3xl font-black ${text} tracking-tight`}>{value}</h3>
    </div>
  );
}