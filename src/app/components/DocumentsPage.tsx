import React, { useState, useMemo } from 'react';
import { 
  Search, FileText, ShieldCheck, ArrowRight, 
  ChevronLeft, ChevronRight, Scale, Info
} from 'lucide-react';
import { Document } from '../utils/documentData';

interface DocumentsPageProps {
  documents: Document[];
  barangays: any[];
  onViewDetails: (doc: Document) => void;
  loading: boolean;
}

export function DocumentsPage({ documents, barangays, onViewDetails, loading }: DocumentsPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeType, setActiveType] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 40;

  const categories = ['All', 'Ordinance', 'Resolution', 'Executive Order', 'Others'];

  // 1. Filtering Logic
  const filtered = useMemo(() => {
    return (documents || []).filter(doc => {
      const matchesSearch = 
        doc.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        doc.documentId?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = activeType === 'All' || doc.type === activeType;
      return matchesSearch && matchesType;
    });
  }, [documents, searchTerm, activeType]);

  // 2. Pagination Logic (Max 40 latest per page)
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const paginatedDocs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage]);

  // Handle page changes
  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#1C1C1C] tracking-tight">Documents Monitoring</h1>
          <p className="text-[#088395] font-black uppercase text-[10px] tracking-[0.2em] mt-1">
            GMA, Cavite Public Legislative Registry
          </p>
        </div>
        <div className="bg-white px-4 py-2 rounded-2xl border border-[#09637E]/10 flex items-center gap-2">
           <Info size={14} className="text-[#088395]" />
           <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
             {filtered.length} Total Records Found
           </span>
        </div>
      </div>

      {/* Modern Filter & Search Bar */}
      <div className="bg-white p-4 rounded-[28px] border border-[#09637E]/10 shadow-sm flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
          <input 
            placeholder="Search records by title or ID..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#088395] transition-all outline-none"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => { setActiveType(cat); setCurrentPage(1); }}
              className={`px-5 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                activeType === cat ? 'bg-[#1C1C1C] text-white shadow-lg shadow-black/10' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Administrative Table */}
      <div className="bg-white rounded-[40px] border border-[#09637E]/10 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 border-b border-gray-100">
                <th className="px-8 py-6">ID & Identification</th>
                <th className="px-8 py-6">Classification</th>
                <th className="px-8 py-6">Jurisdiction</th>
                <th className="px-8 py-6 text-center">Protocol Status</th>
                <th className="px-8 py-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading && documents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-32 text-center">
                    <div className="animate-spin w-8 h-8 border-4 border-[#088395] border-t-transparent rounded-full mx-auto mb-4" />
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Querying Node...</p>
                  </td>
                </tr>
              ) : paginatedDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-[#EBF4F6]/30 transition-all group">
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-[#1C1C1C] group-hover:text-[#088395] transition-colors">{doc.title}</span>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{doc.documentId}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1.5 bg-gray-100 rounded-lg text-[9px] font-black uppercase text-gray-500 tracking-wider">
                      {doc.type}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{doc.barangay}</span>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="flex justify-center">
                      {doc.blockchainStatus === 'Verified' ? (
                        <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                          <ShieldCheck size={12} />
                          <span className="text-[8px] font-black uppercase tracking-tighter">Verified</span>
                        </div>
                      ) : (
                        <span className="text-[8px] font-black uppercase tracking-widest text-gray-300">Unverified</span>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button 
                      onClick={() => onViewDetails(doc)}
                      className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#088395] hover:text-[#1C1C1C] transition-all"
                    >
                      View Details <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {!loading && filtered.length === 0 && (
          <div className="py-24 text-center flex flex-col items-center">
            <Scale className="text-gray-100 w-16 h-16 mb-4" />
            <p className="text-sm font-black text-gray-300 uppercase tracking-widest">No matching registry entries</p>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-4 py-2">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            Page {currentPage} of {totalPages} — Showing {paginatedDocs.length} Records
          </p>
          <div className="flex items-center gap-3">
            <button 
              disabled={currentPage === 1}
              onClick={() => goToPage(currentPage - 1)}
              className="p-3 bg-white rounded-2xl border border-gray-100 text-[#088395] shadow-sm disabled:opacity-20 hover:bg-[#EBF4F6] transition-all active:scale-95"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToPage(i + 1)}
                  className={`w-10 h-10 rounded-xl text-[10px] font-black transition-all ${
                    currentPage === i + 1 
                    ? 'bg-[#088395] text-white shadow-lg' 
                    : 'bg-white text-gray-400 hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => goToPage(currentPage + 1)}
              className="p-3 bg-white rounded-2xl border border-gray-100 text-[#088395] shadow-sm disabled:opacity-20 hover:bg-[#EBF4F6] transition-all active:scale-95"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}