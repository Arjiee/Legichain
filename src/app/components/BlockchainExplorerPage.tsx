import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ShieldCheck, 
  FileText, 
  AlertTriangle,
  Database,
  Layers,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { BlockchainTransaction } from '../utils/blockchainData';

interface BlockchainExplorerPageProps {
  barangays: Array<{id: string; name: string}>;
  selectedBarangayId: string;
  onViewDetails: (transaction: BlockchainTransaction) => void;
  transactions: BlockchainTransaction[];
  loading?: boolean;
  onRefresh?: () => void;
}

export function BlockchainExplorerPage({ barangays, selectedBarangayId, onViewDetails, transactions, loading = false, onRefresh }: BlockchainExplorerPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRecordType, setFilterRecordType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Compute stats from real data
  const stats = useMemo(() => ({
    totalTransactions: transactions.length,
    verifiedRecords: transactions.filter(tx => tx.verificationStatus === 'Verified').length,
    ordinanceRecords: transactions.filter(tx => tx.recordType === 'Ordinance Record').length,
    violationRecords: transactions.filter(tx => tx.recordType === 'Violation Case').length,
    latestBlock: transactions.length > 0
      ? Math.max(...transactions.map(tx => parseInt(tx.blockNumber) || 0))
      : 0,
  }), [transactions]);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];

    if (selectedBarangayId !== 'all') {
      const barangayName = barangays.find(b => b.id === selectedBarangayId)?.name;
      if (barangayName) filtered = filtered.filter(tx => tx.barangay === barangayName);
    }
    if (filterRecordType !== 'all') filtered = filtered.filter(tx => tx.recordType === filterRecordType);
    if (filterStatus !== 'all') filtered = filtered.filter(tx => tx.verificationStatus === filterStatus);

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(tx =>
        tx.txHash.toLowerCase().includes(term) ||
        tx.ordinanceId?.toLowerCase().includes(term) ||
        tx.violationCaseId?.toLowerCase().includes(term) ||
        tx.barangay.toLowerCase().includes(term) ||
        tx.ordinanceTitle?.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [transactions, selectedBarangayId, filterRecordType, filterStatus, searchTerm, barangays]);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1C1C1C] tracking-tight">Blockchain Explorer</h1>
          <p className="text-sm text-gray-500 font-medium flex items-center gap-2 mt-1">
            Complete blockchain transaction ledger for all barangay records
            {!loading && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-700 text-[10px] font-bold">
                <Database className="w-3 h-3" /> Live Database
              </span>
            )}
            {loading && <Loader2 className="w-4 h-4 animate-spin text-[#088395]" />}
          </p>
        </div>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-[#EBF4F6] border border-[#09637E]/20 text-[#09637E] text-xs font-bold rounded-xl hover:bg-[#09637E] hover:text-white transition-all"
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        )}
      </div>

      {/* Statistics Panel */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-[#09637E]/10 animate-pulse">
              <div className="h-12 w-12 bg-gray-200 rounded-2xl mb-4" />
              <div className="h-3 bg-gray-200 rounded mb-2" />
              <div className="h-8 bg-gray-200 rounded" />
            </div>
          ))
        ) : (
          <>
            <StatCard icon={<Database className="w-6 h-6" />} label="Total Transactions" value={stats.totalTransactions} color="bg-blue-50" iconColor="text-blue-600" />
            <StatCard icon={<ShieldCheck className="w-6 h-6" />} label="Verified Records" value={stats.verifiedRecords} color="bg-emerald-50" iconColor="text-emerald-600" />
            <StatCard icon={<FileText className="w-6 h-6" />} label="Ordinance Records" value={stats.ordinanceRecords} color="bg-purple-50" iconColor="text-purple-600" />
            <StatCard icon={<AlertTriangle className="w-6 h-6" />} label="Violation Records" value={stats.violationRecords} color="bg-amber-50" iconColor="text-amber-600" />
            <StatCard icon={<Layers className="w-6 h-6" />} label="Latest Block" value={`#${stats.latestBlock.toLocaleString()}`} color="bg-indigo-50" iconColor="text-indigo-600" />
          </>
        )}
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#09637E]/10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Search Transactions</label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by TxHash, Record ID, Barangay, or Title..."
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium placeholder-gray-400 focus:ring-2 focus:ring-[#088395] focus:border-transparent focus:outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Record Type</label>
            <select
              value={filterRecordType}
              onChange={(e) => setFilterRecordType(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 focus:ring-2 focus:ring-[#088395] focus:border-transparent focus:outline-none cursor-pointer transition-all"
            >
              <option value="all">All Types</option>
              <option value="Ordinance Record">Ordinance Record</option>
              <option value="Violation Case">Violation Case</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Verification Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 focus:ring-2 focus:ring-[#088395] focus:border-transparent focus:outline-none cursor-pointer transition-all"
            >
              <option value="all">All Status</option>
              <option value="Verified">Verified</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>
          </div>
        </div>

        {(filterRecordType !== 'all' || filterStatus !== 'all' || searchTerm) && (
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Filters:</span>
            {filterRecordType !== 'all' && (
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold">
                {filterRecordType}<button onClick={() => setFilterRecordType('all')} className="ml-2">×</button>
              </span>
            )}
            {filterStatus !== 'all' && (
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                {filterStatus}<button onClick={() => setFilterStatus('all')} className="ml-2">×</button>
              </span>
            )}
            {searchTerm && (
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                "{searchTerm}"<button onClick={() => setSearchTerm('')} className="ml-2">×</button>
              </span>
            )}
            <button
              onClick={() => { setFilterRecordType('all'); setFilterStatus('all'); setSearchTerm(''); }}
              className="text-xs font-bold text-[#088395] hover:text-[#09637E] transition-colors ml-2"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-[#09637E]/10 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-[#1C1C1C]">Blockchain Transactions</h3>
            <p className="text-xs text-gray-500 font-medium mt-1">
              {loading ? 'Loading from database...' : `Showing ${filteredTransactions.length} of ${stats.totalTransactions} transactions`}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#088395]" />
            <span className="text-gray-500 font-bold">Loading blockchain transactions from database...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#EBF4F6] text-[10px] uppercase tracking-widest text-[#09637E]/60 font-bold">
                  <th className="px-6 py-4">Tx Hash</th>
                  <th className="px-6 py-4">Block</th>
                  <th className="px-6 py-4">Record ID</th>
                  <th className="px-6 py-4">Barangay</th>
                  <th className="px-6 py-4">Record Type</th>
                  <th className="px-6 py-4">Action</th>
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4">Recorded By</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-6 py-12 text-center text-gray-400">
                      <Database className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p className="font-medium">No transactions found matching your criteria</p>
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((tx, index) => (
                    <tr key={`${tx.txHash}-${index}`} className="hover:bg-[#EBF4F6]/30 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-mono font-bold text-[#088395] text-[11px]">
                          {tx.txHash.slice(0, 12)}...{tx.txHash.slice(-4)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono font-bold text-[#1C1C1C]">#{tx.blockNumber}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono font-bold text-gray-700">
                          {tx.violationCaseId || tx.ordinanceId || '—'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600 font-medium">{tx.barangay}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold ${
                          tx.recordType === 'Ordinance Record' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                        }`}>
                          {tx.recordType}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold ${
                          tx.actionRecorded === 'Created' ? 'bg-green-100 text-green-700' :
                          tx.actionRecorded === 'Updated' ? 'bg-amber-100 text-amber-700' :
                          tx.actionRecorded === 'Verified' ? 'bg-purple-100 text-purple-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {tx.actionRecorded}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {new Date(tx.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-6 py-4 text-gray-600 font-medium">{tx.recordedBy}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          tx.verificationStatus === 'Verified' ? 'bg-emerald-50 border border-emerald-100 text-emerald-700' :
                          tx.verificationStatus === 'Pending' ? 'bg-amber-50 border border-amber-100 text-amber-700' :
                          'bg-red-50 border border-red-100 text-red-700'
                        }`}>
                          <ShieldCheck className="w-3 h-3 mr-1" />{tx.verificationStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => onViewDetails(tx)}
                          className="px-3 py-1.5 bg-[#088395] text-white text-[10px] font-bold rounded-lg hover:bg-[#09637E] transition-colors cursor-pointer"
                        >
                          View Details
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

function StatCard({ icon, label, value, color, iconColor }: any) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#09637E]/10 relative overflow-hidden group">
      <div className={`absolute top-0 right-0 w-20 h-20 ${color} rounded-bl-full -mr-8 -mt-8 opacity-50 transition-all group-hover:scale-110`} />
      <div className={`p-3 ${color} rounded-2xl ${iconColor} inline-flex mb-4`}>{icon}</div>
      <p className="text-xs font-bold text-[#09637E]/50 uppercase tracking-widest mb-1">{label}</p>
      <h3 className="text-2xl font-black text-[#1C1C1C]">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </h3>
    </div>
  );
}
