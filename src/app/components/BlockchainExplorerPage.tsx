import React, { useState, useMemo } from 'react';
import { 
  Search, ShieldCheck, FileText, AlertTriangle, Database, 
  Layers, Loader2, RefreshCw, ExternalLink, MapPin 
} from 'lucide-react';
import { useData } from '../components/DataContext'; // Verified clean relative tracking route path

export function BlockchainExplorerPage({ onViewDetails }: any) {
  const { 
    blockchainTxs = [], 
    loadingBlockchain, 
    handleRefreshData, 
    barangays = [] 
  } = useData();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRecordType, setFilterRecordType] = useState<string>('all');
  const [barangayFilter, setBarangayFilter] = useState<string>('all');

  // Diagnostic runtime check console tracker logs
  console.log("Explorer Data Trace Stream Sync:", blockchainTxs.length, "items loaded.");

  // --- DYNAMIC COMBINED METRICS AGGREGATION ENGINE ---
  const stats = useMemo(() => {
    const blockNumbers = blockchainTxs
      .map(tx => parseInt(tx.blockNumber?.toString().replace('#', '')) || 0)
      .filter(num => num > 0);

    return {
      total: blockchainTxs.length,
      latestBlock: blockNumbers.length > 0 ? Math.max(...blockNumbers) : 0,
      verified: blockchainTxs.filter(tx => 
        tx.verificationStatus === 'Verified' || 
        tx.verificationStatus === 'Verified on Chain'
      ).length
    };
  }, [blockchainTxs]);

  // --- SEARCH AND MULTI-DROP FILTER EVALUATION LAYER ---
  const filtered = useMemo(() => {
    return (blockchainTxs || []).filter(tx => {
      const hash = tx.txHash || '';
      const title = tx.ordinanceTitle || '';
      const brgy = tx.barangay || '';
      const recordType = tx.recordType || '';

      const matchesSearch = 
        hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
        title.toLowerCase().includes(searchTerm.toLowerCase());
        
      const matchesType = filterRecordType === 'all' || recordType === filterRecordType;
      const matchesBarangay = barangayFilter === 'all' || brgy.toLowerCase() === barangayFilter.toLowerCase();

      return matchesSearch && matchesType && matchesBarangay;
    });
  }, [blockchainTxs, searchTerm, filterRecordType, barangayFilter]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#1C1C1C] tracking-tight">Blockchain Explorer</h1>
          <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mt-1">
            Polygon Amoy Real-Time Ledger State
          </p>
        </div>
        <button 
          onClick={handleRefreshData}
          disabled={loadingBlockchain}
          className="px-6 py-3 bg-[#EBF4F6] text-[#088395] font-black rounded-2xl border-2 border-transparent hover:border-[#088395]/10 flex items-center gap-2 hover:bg-[#088395] hover:text-white transition-all uppercase text-[10px] tracking-[0.2em]"
        >
          <RefreshCw size={14} className={loadingBlockchain ? 'animate-spin' : ''} />
          {loadingBlockchain ? 'Syncing...' : 'Refresh Protocol'}
        </button>
      </div>

      {/* Stats Cards Display Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Total Ledgers Anchored" value={stats.total} icon={<Database />} color="bg-blue-50" text="text-blue-600" />
        <StatCard label="On-Chain Verified" value={stats.verified} icon={<ShieldCheck />} color="bg-emerald-50" text="text-emerald-700" />
        <StatCard label="Current Block Height" value={stats.latestBlock > 0 ? `#${stats.latestBlock}` : '---'} icon={<Layers />} color="bg-purple-50" text="text-purple-600" />
      </div>

      {/* Control Center Filtering Actions Grid */}
      <div className="bg-white p-6 rounded-[32px] border-2 border-[#09637E]/5 flex flex-col md:flex-row gap-4 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
          <input 
            placeholder="Search decentralized hashes, titles, or keys..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#088395] text-gray-700"
          />
        </div>
        
        <div className="flex gap-2">
          {/* Dynamic Barangay Picker */}
          <select 
            value={barangayFilter}
            onChange={(e) => setBarangayFilter(e.target.value)}
            className="px-4 py-4 bg-gray-50 border-none rounded-2xl text-xs font-black uppercase tracking-widest text-[#09637E] focus:ring-2 focus:ring-[#088395]"
          >
            <option value="all">All Barangays</option>
            {barangays.map(b => (
              <option key={b.id} value={b.name}>{b.name}</option>
            ))}
          </select>

          {/* Module Record Taxonomy filter */}
          <select 
            value={filterRecordType}
            onChange={(e) => setFilterRecordType(e.target.value)}
            className="px-4 py-4 bg-gray-50 border-none rounded-2xl text-xs font-black uppercase tracking-widest text-[#09637E] focus:ring-2 focus:ring-[#088395]"
          >
            <option value="all">All Modules</option>
            <option value="Project Record">Project Records</option>
            <option value="Ordinance Record">Ordinance Documents</option>
          </select>
        </div>
      </div>

      {/* Data Presentation Table Grid */}
      <div className="bg-white rounded-[40px] border-2 border-[#09637E]/5 overflow-hidden shadow-sm">
        {loadingBlockchain && blockchainTxs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-[#088395]" />
            <span className="text-[#09637E]/60 font-black text-xs uppercase tracking-widest">Querying Polygon RPC Node...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#EBF4F6] text-[9px] uppercase tracking-[0.2em] text-[#09637E]/60 font-black">
                  <th className="px-8 py-6">Transaction Signature</th>
                  <th className="px-8 py-6">Identity Registry Scope</th>
                  <th className="px-8 py-6 text-center">Ledger State</th>
                  <th className="px-8 py-6 text-right">Verification Row</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-32 text-center text-gray-300 font-black uppercase text-xs italic tracking-widest">
                      No matching verified block receipts stored.
                    </td>
                  </tr>
                ) : (
                  filtered.map((tx, i) => {
                    const hashString = tx.txHash || '0x...';
                    const hasValidHash = hashString !== '0x...' && hashString.length > 15;

                    return (
                      <tr key={i} className="hover:bg-[#EBF4F6]/20 transition-all group">
                        {/* Short Hash Truncator cell block */}
                        <td className="px-8 py-5">
                          <span className="font-mono font-black text-[#088395] text-[11px] bg-[#088395]/5 px-2.5 py-1.5 rounded-lg border border-[#088395]/5">
                            {hasValidHash 
                              ? `${hashString.slice(0, 10)}...${hashString.slice(-6)}` 
                              : '0x... (Awaiting Sync)'
                            }
                          </span>
                        </td>
                        
                        {/* Core context details rows fields */}
                        <td className="px-8 py-5">
                          <div className="flex flex-col">
                            <span className="text-xs font-black text-[#1C1C1C] uppercase tracking-tight max-w-[340px] truncate">
                              {tx.ordinanceTitle || 'SEALED SYSTEM RECORD'}
                            </span>
                            <div className="flex items-center gap-1.5 mt-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                              <span>{tx.recordType}</span>
                              <span>•</span>
                              <span className="text-[#088395] inline-flex items-center gap-0.5">
                                <MapPin size={10} /> {tx.barangay || 'System Matrix'}
                              </span>
                            </div>
                          </div>
                        </td>
                        
                        {/* Interactive Status Indicator pills columns */}
                        <td className="px-8 py-5 text-center">
                          <div className="inline-flex items-center px-3 py-1 rounded-full border-2 bg-emerald-50 border-emerald-100 text-emerald-700">
                            <ShieldCheck size={10} className="mr-1.5 animate-pulse" />
                            <span className="text-[8px] font-black uppercase tracking-tight">Verified</span>
                          </div>
                        </td>
                        
                        {/* Dynamic Actions Trigger */}
                        <td className="px-8 py-5 text-right">
                          <button 
                            onClick={() => onViewDetails(tx)}
                            className="px-5 py-2.5 bg-[#088395] hover:bg-[#09637E] shadow-sm text-white text-[9px] font-black uppercase rounded-xl tracking-wider hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    );
                  })
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
    <div className={`p-8 rounded-[40px] ${color} border-2 border-transparent shadow-sm transition-all group`}>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 bg-white shadow-md ${text}`}>
        {icon}
      </div>
      <p className={`text-[10px] font-black uppercase tracking-widest ${text} opacity-60 mb-1`}>{label}</p>
      <h3 className={`text-3xl font-black ${text} tracking-tight`}>{value}</h3>
    </div>
  );
}