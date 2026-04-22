import React, { useState, useMemo } from 'react';
import { 
  Search, 
  FileText, 
  Eye,
  Edit,
  Trash2,
  ShieldCheck,
  AlertTriangle,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  SortAsc,
  SortDesc,
  Loader2,
  Plus,
  Database,
  RefreshCw
} from 'lucide-react';
import { Document } from '../utils/documentData';
import { toast } from 'sonner';

interface EnhancedAdminDocsPageProps {
  barangays: Array<{id: string; name: string}>;
  selectedBarangayId: string;
  onViewDetails: (doc: Document) => void;
  documents: Document[];
  loading?: boolean;
  onAddDocument?: () => void;
  onEditDocument?: (doc: Document) => void;
  onDeleteDocument?: (id: string) => void;
  onVerifyDocument?: (doc: Document) => void;
  onRefresh?: () => void;
}

type SortField = 'datePublished' | 'title' | 'violationCount' | 'documentId';
type SortDirection = 'asc' | 'desc';

export function EnhancedAdminDocsPage({ 
  barangays, 
  selectedBarangayId,
  onViewDetails,
  documents,
  loading = false,
  onAddDocument,
  onEditDocument,
  onDeleteDocument,
  onVerifyDocument,
  onRefresh,
}: EnhancedAdminDocsPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterBlockchainStatus, setFilterBlockchainStatus] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('datePublished');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Compute stats from real data
  const stats = useMemo(() => ({
    total: documents.length,
    active: documents.filter(d => d.status === 'Active').length,
    archived: documents.filter(d => d.status === 'Archived').length,
    verified: documents.filter(d => d.blockchainStatus === 'Verified').length,
    pending: documents.filter(d => d.blockchainStatus === 'Pending').length,
    notVerified: documents.filter(d => d.blockchainStatus === 'Not Verified').length,
    withViolations: documents.filter(d => d.violationCount > 0).length,
  }), [documents]);

  // Filter and sort documents
  const filteredDocuments = useMemo(() => {
    let filtered = [...documents];

    if (selectedBarangayId !== 'all') {
      const barangayName = barangays.find(b => b.id === selectedBarangayId)?.name;
      if (barangayName) filtered = filtered.filter(doc => doc.barangay === barangayName);
    }
    if (filterType !== 'all') filtered = filtered.filter(doc => doc.type === filterType);
    if (filterStatus !== 'all') filtered = filtered.filter(doc => doc.status === filterStatus);
    if (filterBlockchainStatus !== 'all') filtered = filtered.filter(doc => doc.blockchainStatus === filterBlockchainStatus);

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(doc =>
        doc.documentId.toLowerCase().includes(term) ||
        doc.title.toLowerCase().includes(term) ||
        doc.barangay.toLowerCase().includes(term) ||
        doc.publishedBy.toLowerCase().includes(term)
      );
    }

    filtered.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'datePublished') {
        comparison = new Date(a.datePublished).getTime() - new Date(b.datePublished).getTime();
      } else if (sortField === 'title') {
        comparison = a.title.localeCompare(b.title);
      } else if (sortField === 'violationCount') {
        comparison = a.violationCount - b.violationCount;
      } else if (sortField === 'documentId') {
        comparison = a.documentId.localeCompare(b.documentId);
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [documents, selectedBarangayId, filterType, filterStatus, filterBlockchainStatus, searchTerm, sortField, sortDirection, barangays]);

  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);
  const paginatedDocuments = filteredDocuments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1C1C1C] tracking-tight">Document Management</h1>
          <p className="text-sm text-gray-500 font-medium flex items-center gap-2 mt-1">
            Comprehensive document control with blockchain verification
            {!loading && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-700 text-[10px] font-bold">
                <Database className="w-3 h-3" /> Live Database
              </span>
            )}
            {loading && <Loader2 className="w-4 h-4 animate-spin text-[#088395]" />}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="flex items-center gap-2 px-4 py-2 bg-[#EBF4F6] border border-[#09637E]/20 text-[#09637E] text-xs font-bold rounded-xl hover:bg-[#09637E] hover:text-white transition-all"
            >
              <RefreshCw className="w-4 h-4" /> Refresh
            </button>
          )}
          {onAddDocument && (
            <button
              onClick={onAddDocument}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#088395] text-white text-sm font-bold rounded-xl hover:bg-[#09637E] transition-colors shadow-md"
            >
              <Plus className="w-4 h-4" /> Add Document
            </button>
          )}
        </div>
      </div>

      {/* Statistics Panel */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {loading ? (
          Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-[#09637E]/10 animate-pulse">
              <div className="h-3 bg-gray-200 rounded mb-2" />
              <div className="h-8 bg-gray-200 rounded" />
            </div>
          ))
        ) : (
          <>
            <StatCard label="Total Documents" value={stats.total} color="bg-blue-50" iconColor="text-blue-600" />
            <StatCard label="Active" value={stats.active} color="bg-green-50" iconColor="text-green-600" />
            <StatCard label="Archived" value={stats.archived} color="bg-gray-50" iconColor="text-gray-600" />
            <StatCard label="Verified" value={stats.verified} color="bg-emerald-50" iconColor="text-emerald-600" />
            <StatCard label="Pending" value={stats.pending} color="bg-amber-50" iconColor="text-amber-600" />
            <StatCard label="Not Verified" value={stats.notVerified} color="bg-red-50" iconColor="text-red-600" />
            <StatCard label="With Violations" value={stats.withViolations} color="bg-orange-50" iconColor="text-orange-600" />
          </>
        )}
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#09637E]/10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Search Documents</label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by ID, Title, or Barangay..."
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium placeholder-gray-400 focus:ring-2 focus:ring-[#088395] focus:border-transparent focus:outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Document Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 focus:ring-2 focus:ring-[#088395] focus:border-transparent focus:outline-none cursor-pointer transition-all"
            >
              <option value="all">All Types</option>
              <option value="Ordinance">Ordinance</option>
              <option value="Resolution">Resolution</option>
              <option value="Executive Order">Executive Order</option>
              <option value="Bids & Awards">Bids & Awards</option>
              <option value="Financial Aid">Financial Aid</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 focus:ring-2 focus:ring-[#088395] focus:border-transparent focus:outline-none cursor-pointer transition-all"
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Archived">Archived</option>
              <option value="Draft">Draft</option>
              <option value="Under Review">Under Review</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Blockchain</label>
            <select
              value={filterBlockchainStatus}
              onChange={(e) => setFilterBlockchainStatus(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 focus:ring-2 focus:ring-[#088395] focus:border-transparent focus:outline-none cursor-pointer transition-all"
            >
              <option value="all">All</option>
              <option value="Verified">Verified</option>
              <option value="Pending">Pending</option>
              <option value="Not Verified">Not Verified</option>
            </select>
          </div>
        </div>

        {(filterType !== 'all' || filterStatus !== 'all' || filterBlockchainStatus !== 'all' || searchTerm) && (
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Filters:</span>
            {filterType !== 'all' && (
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold">
                Type: {filterType}
                <button onClick={() => setFilterType('all')} className="ml-2">×</button>
              </span>
            )}
            {filterStatus !== 'all' && (
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                Status: {filterStatus}
                <button onClick={() => setFilterStatus('all')} className="ml-2">×</button>
              </span>
            )}
            {filterBlockchainStatus !== 'all' && (
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                Blockchain: {filterBlockchainStatus}
                <button onClick={() => setFilterBlockchainStatus('all')} className="ml-2">×</button>
              </span>
            )}
            {searchTerm && (
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                Search: "{searchTerm}"
                <button onClick={() => setSearchTerm('')} className="ml-2">×</button>
              </span>
            )}
            <button
              onClick={() => { setFilterType('all'); setFilterStatus('all'); setFilterBlockchainStatus('all'); setSearchTerm(''); }}
              className="text-xs font-bold text-[#088395] hover:text-[#09637E] transition-colors ml-2"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Documents Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-[#09637E]/10 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-[#1C1C1C]">Documents</h3>
            <p className="text-xs text-gray-500 font-medium mt-1">
              {loading ? 'Loading from database...' : `Showing ${paginatedDocuments.length} of ${filteredDocuments.length} documents`}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#088395]" />
            <span className="text-gray-500 font-bold">Loading documents from database...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#EBF4F6] text-[10px] uppercase tracking-widest text-[#09637E]/60 font-bold">
                  <th className="px-6 py-4">
                    <button onClick={() => handleSort('documentId')} className="inline-flex items-center hover:text-[#09637E] cursor-pointer">
                      Document ID {sortField === 'documentId' && (sortDirection === 'asc' ? <SortAsc className="w-3 h-3 ml-1" /> : <SortDesc className="w-3 h-3 ml-1" />)}
                    </button>
                  </th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">
                    <button onClick={() => handleSort('title')} className="inline-flex items-center hover:text-[#09637E] cursor-pointer">
                      Title {sortField === 'title' && (sortDirection === 'asc' ? <SortAsc className="w-3 h-3 ml-1" /> : <SortDesc className="w-3 h-3 ml-1" />)}
                    </button>
                  </th>
                  <th className="px-6 py-4">Barangay</th>
                  <th className="px-6 py-4">
                    <button onClick={() => handleSort('datePublished')} className="inline-flex items-center hover:text-[#09637E] cursor-pointer">
                      Date {sortField === 'datePublished' && (sortDirection === 'asc' ? <SortAsc className="w-3 h-3 ml-1" /> : <SortDesc className="w-3 h-3 ml-1" />)}
                    </button>
                  </th>
                  <th className="px-6 py-4">Published By</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">
                    <button onClick={() => handleSort('violationCount')} className="inline-flex items-center hover:text-[#09637E] cursor-pointer">
                      Violations {sortField === 'violationCount' && (sortDirection === 'asc' ? <SortAsc className="w-3 h-3 ml-1" /> : <SortDesc className="w-3 h-3 ml-1" />)}
                    </button>
                  </th>
                  <th className="px-6 py-4">Blockchain</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginatedDocuments.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-6 py-12 text-center text-gray-400">
                      <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p className="font-medium">No documents found matching your criteria</p>
                    </td>
                  </tr>
                ) : (
                  paginatedDocuments.map((doc) => (
                    <tr key={doc.id} className="hover:bg-[#EBF4F6]/30 transition-colors group">
                      <td className="px-6 py-4">
                        <span className="font-mono font-bold text-[#088395]">{doc.documentId}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold ${
                          doc.type === 'Ordinance' ? 'bg-blue-100 text-blue-700' :
                          doc.type === 'Resolution' ? 'bg-purple-100 text-purple-700' :
                          doc.type === 'Executive Order' ? 'bg-indigo-100 text-indigo-700' :
                          doc.type === 'Bids & Awards' ? 'bg-orange-100 text-orange-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {doc.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-700 font-medium line-clamp-1 max-w-[280px]">{doc.title}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-600 font-medium">{doc.barangay}</td>
                      <td className="px-6 py-4 text-gray-600">
                        {new Date(doc.datePublished).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 text-gray-600 font-medium">{doc.publishedBy}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold ${
                          doc.status === 'Active' ? 'bg-green-100 text-green-700' :
                          doc.status === 'Archived' ? 'bg-gray-100 text-gray-700' :
                          doc.status === 'Draft' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-orange-100 text-orange-700'
                        }`}>
                          {doc.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {doc.violationCount > 0 ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full bg-red-100 text-red-700 text-[10px] font-bold">
                            <AlertTriangle className="w-3 h-3 mr-1" />{doc.violationCount}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-[10px]">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          doc.blockchainStatus === 'Verified' ? 'bg-emerald-50 border border-emerald-100 text-emerald-700' :
                          doc.blockchainStatus === 'Pending' ? 'bg-amber-50 border border-amber-100 text-amber-700' :
                          'bg-gray-50 border border-gray-100 text-gray-700'
                        }`}>
                          {doc.blockchainStatus === 'Verified' && <CheckCircle className="w-3 h-3 mr-1" />}
                          {doc.blockchainStatus === 'Pending' && <Clock className="w-3 h-3 mr-1" />}
                          {doc.blockchainStatus === 'Not Verified' && <XCircle className="w-3 h-3 mr-1" />}
                          {doc.blockchainStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => onViewDetails(doc)}
                            className="p-1.5 text-[#088395] hover:bg-[#088395]/10 rounded-lg transition-colors cursor-pointer"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {onEditDocument && (
                            <button
                              onClick={() => onEditDocument(doc)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          )}
                          {onVerifyDocument && doc.blockchainStatus !== 'Verified' && (
                            <button
                              onClick={() => onVerifyDocument(doc)}
                              className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                              title="Verify on Blockchain"
                            >
                              <ShieldCheck className="w-4 h-4" />
                            </button>
                          )}
                          {onDeleteDocument && (
                            <button
                              onClick={() => onDeleteDocument(doc.id)}
                              className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="p-6 border-t border-gray-50 flex items-center justify-between">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-50 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <div className="flex items-center gap-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) pageNum = i + 1;
                else if (currentPage <= 3) pageNum = i + 1;
                else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                else pageNum = currentPage - 2 + i;
                return (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                      currentPage === pageNum ? 'bg-[#088395] text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-50 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, color, iconColor }: any) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#09637E]/10">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-2xl font-black ${iconColor}`}>{value}</p>
    </div>
  );
}
