import React, { useState, useMemo } from 'react';
import { 
  Search, ShieldCheck, FileText, AlertTriangle, Database, 
  Layers, Loader2, RefreshCw, ExternalLink 
} from 'lucide-react';
import { useData } from './DataContext'; // 1. Import useData

export function BlockchainExplorerPage({ onViewDetails }: any) {
  // 2. Pull everything from Context
  const { 
    blockchainTxs = [], 
    loadingBlockchain, 
    handleRefreshData, 
    barangays = [] 
  } = useData();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRecordType, setFilterRecordType] = useState<string>('all');

  // 3. SAFETY: diagnostic log to see if data exists
  console.log("Explorer Data Check:", blockchainTxs.length, "items found.");

  const stats = useMemo(() => ({
    total: blockchainTxs.length,
    latestBlock: blockchainTxs.length > 0 
      ? Math.max(...blockchainTxs.map(tx => parseInt(tx.blockNumber) || 0)) 
      : 0,
    verified: blockchainTxs.filter(tx => tx.verificationStatus === 'Verified').length
  }), [blockchainTxs]);

  const filtered = useMemo(() => {
    return (blockchainTxs || []).filter(tx => {
      const matchesSearch = 
        (tx.txHash || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (tx.ordinanceTitle || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterRecordType === 'all' || tx.recordType === filterRecordType;
      return matchesSearch && matchesType;
    });
  }, [blockchainTxs, searchTerm, filterRecordType]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#1C1C1C]">Blockchain Explorer</h1>
          <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mt-1">
            Polygon Amoy Protocol Ledger
          </p>
        </div>
        <button 
          onClick={handleRefreshData}
          className="px-6 py-3 bg-[#EBF4F6] text-[#088395] font-black rounded-2xl flex items-center gap-2 hover:bg-[#088395] hover:text-white transition-all uppercase text-[10px] tracking-[0.2em]"
        >
          <RefreshCw size={14} className={loadingBlockchain ? 'animate-spin' : ''} />
          {loadingBlockchain ? 'Syncing...' : 'Refresh Protocol'}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Total Txs" value={stats.total} icon={<Database />} color="bg-blue-50" text="text-blue-600" />
        <StatCard label="Verified" value={stats.verified} icon={<ShieldCheck />} color="bg-emerald-50" text="text-emerald-600" />
        <StatCard label="Block Height" value={`#${stats.latestBlock}`} icon={<Layers />} color="bg-purple-50" text="text-purple-600" />
      </div>

      {/* Search/Filter Bar */}
      <div className="bg-white p-6 rounded-[32px] border-2 border-[#09637E]/5 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
          <input 
            placeholder="Search Tx Hash or Project Title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#088395]"
          />
        </div>
        <select 
          value={filterRecordType}
          onChange={(e) => setFilterRecordType(e.target.value)}
          className="px-6 py-4 bg-gray-50 border-none rounded-2xl text-xs font-black uppercase tracking-widest text-[#09637E]"
        >
          <option value="all">All Records</option>
          <option value="Project Record">Projects</option>
          <option value="Ordinance Record">Ordinances</option>
        </select>
      </div>

      {/* Table Content */}
      <div className="bg-white rounded-[40px] border-2 border-[#09637E]/5 overflow-hidden shadow-sm">
        {loadingBlockchain && blockchainTxs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-[#088395]" />
            <span className="text-[#09637E]/60 font-black text-xs uppercase tracking-widest">Querying Polygon Node...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#EBF4F6] text-[9px] uppercase tracking-[0.2em] text-[#09637E]/60 font-black">
                  <th className="px-8 py-6">Transaction Hash</th>
                  <th className="px-8 py-6">Identity</th>
                  <th className="px-8 py-6 text-center">Status</th>
                  <th className="px-8 py-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-32 text-center text-gray-300 font-black uppercase text-xs italic tracking-widest">
                      No records found on the blockchain.
                    </td>
                  </tr>
                ) : (
                  filtered.map((tx, i) => (
                    <tr key={i} className="hover:bg-[#EBF4F6]/20 transition-all group">
                      <td className="px-8 py-5">
                        <span className="font-mono font-black text-[#088395] text-[11px] bg-[#088395]/5 px-2 py-1 rounded-lg">
                          {tx.txHash.slice(0, 10)}...{tx.txHash.slice(-6)}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex flex-col">
                          <span className="text-xs font-black text-[#1C1C1C] uppercase">{tx.ordinanceTitle || 'SEALED RECORD'}</span>
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
                        <button 
                          onClick={() => onViewDetails(tx)}
                          className="px-6 py-3 bg-[#088395] text-white text-[9px] font-black uppercase rounded-xl"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color, text }: any) {
  return (
    <div className={`p-8 rounded-[40px] ${color} border-2 border-transparent transition-all group`}>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 bg-white shadow-sm ${text}`}>
        {icon}
      </div>
      <p className={`text-[10px] font-black uppercase tracking-widest ${text} opacity-60 mb-1`}>{label}</p>
      <h3 className={`text-3xl font-black ${text} tracking-tight`}>{value}</h3>
    </div>
  );
}