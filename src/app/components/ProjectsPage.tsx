import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Building2, 
  ShieldCheck, 
  FileText, 
  TrendingUp,
  AlertCircle,
  ChevronDown,
  Eye,
  DollarSign,
  Briefcase,
  Plus,
  Database,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BarangayProject } from '../utils/projectData';
import { useData } from './DataContext';

interface ProjectsPageProps {
  projects: BarangayProject[];
  barangays: { id: string; name: string }[];
  selectedBarangayId: string;
  onViewDetails: (project: BarangayProject) => void;
  onAddProject?: () => void;
  isAdmin: boolean;
  loading?: boolean;
  title?: string;
  subtitle?: string;
}

const ITEMS_PER_PAGE = 10;

export function ProjectsPage({ 
  projects, 
  barangays, 
  selectedBarangayId,
  onViewDetails,
  onAddProject,
  isAdmin,
  title = "Project Monitoring Dashboard",
  subtitle = "Comprehensive barangay project tracking and transparency"
}: ProjectsPageProps) {
  const { handleSealProjectToBlockchain } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const categories = [
    'Infrastructure & Physical Improvement',
    'Health, Sanitation, and Environment',
    'Safety, Order, and Social Services',
    'Livelihood, Education, and Agriculture'
  ];

  const statuses = ['Planned', 'Ongoing', 'Completed', 'Cancelled'];

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesBarangay = selectedBarangayId === 'all' || project.barangay === barangays.find(b => b.id === selectedBarangayId)?.name;
      const matchesSearch = searchQuery === '' || 
        project.projectTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.projectId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
      const matchesStatus = selectedStatus === 'all' || project.projectStatus === selectedStatus;

      return matchesBarangay && matchesSearch && matchesCategory && matchesStatus;
    });
  }, [projects, selectedBarangayId, searchQuery, selectedCategory, selectedStatus, barangays]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedStatus, selectedBarangayId]);

  const stats = useMemo(() => ({
    total: projects.length,
    active: projects.filter(p => p.projectStatus === 'Ongoing').length,
    completed: projects.filter(p => p.projectStatus === 'Completed').length,
    planned: projects.filter(p => p.projectStatus === 'Planned').length,
    totalBudget: projects.reduce((sum, p) => sum + (p.financials?.totalApprovedBudget || 0), 0),
  }), [projects]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const formatCurrency = (amount: number) => {
    return `₱${amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Ongoing': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Planned': return 'bg-amber-50 text-amber-700 border-amber-100';
      default: return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#1C1C1C] tracking-tight">{title}</h1>
          <p className="text-sm text-gray-500 font-bold mt-1 uppercase tracking-widest">{subtitle}</p>
        </div>
        {isAdmin && onAddProject && (
          <button
            onClick={onAddProject}
            className="px-6 py-3 bg-[#088395] text-white font-black rounded-2xl flex items-center gap-2 hover:bg-[#09637E] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#088395]/20 uppercase text-xs tracking-widest"
          >
            <Plus className="w-5 h-5" />
            New Project Record
          </button>
        )}
      </div>

      {/* Statistics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<FileText />} label="Total Records" value={stats.total} color="bg-[#09637E]" />
        <StatCard icon={<TrendingUp />} label="Ongoing" value={stats.active} color="bg-[#088395]" />
        <StatCard icon={<ShieldCheck />} label="Verified" value={projects.filter(p => p.blockchainVerified).length} color="bg-emerald-600" />
        <StatCard icon={<DollarSign />} label="Allocated Budget" value={formatCurrency(stats.totalBudget)} color="bg-[#09637E]" />
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-[32px] shadow-sm border border-[#09637E]/10 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#088395] transition-colors" />
            <input
              type="text"
              placeholder="Search by ID, Title, or Scope..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-100 rounded-[20px] focus:ring-2 focus:ring-[#088395]/20 focus:border-[#088395] focus:outline-none transition-all text-sm font-medium"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-6 py-4 rounded-[20px] font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all ${
              showFilters ? 'bg-[#1C1C1C] text-white' : 'bg-white border border-gray-100 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-4 h-4" />
            Refine Search
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-6 pt-6 border-t border-gray-50 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#09637E] uppercase tracking-[0.2em] ml-1">Thematic Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#088395]/10"
                  >
                    <option value="all">All Sectors</option>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#09637E] uppercase tracking-[0.2em] ml-1">Execution Status</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#088395]/10"
                  >
                    <option value="all">Any Status</option>
                    {statuses.map(status => <option key={status} value={status}>{status}</option>)}
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Projects Table */}
      <div className="bg-white rounded-[32px] shadow-sm border border-[#09637E]/10 overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
          <div>
            <h3 className="font-black text-[#1C1C1C] uppercase tracking-tight">Active Ledger</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
              Showing records {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredProjects.length)} of {filteredProjects.length}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Project Details</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] hidden lg:table-cell">Jurisdiction</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] hidden md:table-cell">Financials</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                <th className="px-6 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginatedProjects.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-20 text-center">
                    <AlertCircle className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No project records discovered</p>
                  </td>
                </tr>
              ) : (
                paginatedProjects.map((project) => (
                  <tr 
                    key={project.id} 
                    className="hover:bg-[#EBF4F6]/20 transition-colors group cursor-pointer"
                    onClick={() => onViewDetails(project)}
                  >
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                           <span className="text-[9px] font-mono text-[#088395] font-black bg-[#EBF4F6] px-1.5 py-0.5 rounded uppercase">{project.projectId}</span>
                           {project.blockchainVerified && (
                             <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" title="Verified on Chain" />
                           )}
                        </div>
                        <h4 className="text-sm font-black text-[#1C1C1C] group-hover:text-[#088395] transition-colors leading-tight">
                          {project.projectTitle}
                        </h4>
                        <p className="text-[10px] text-gray-500 font-medium line-clamp-1 italic">{project.description}</p>
                      </div>
                    </td>
                    <td className="px-6 py-5 hidden lg:table-cell">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-[#1C1C1C] text-xs font-bold">
                          <Building2 className="w-3 h-3 text-gray-400" />
                          {project.barangay}
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-500 text-[10px] font-bold">
                          <Briefcase className="w-3 h-3 text-gray-300" />
                          {project.category.split(' & ')[0]}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 hidden md:table-cell">
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-[#09637E]">{formatCurrency(project.financials.totalApprovedBudget)}</span>
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">{project.financials.fundingSource}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusStyle(project.projectStatus)}`}>
                        {project.projectStatus}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-2">
                        {isAdmin && !project.blockchainVerified && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleSealProjectToBlockchain(project); }}
                            className="p-2 text-amber-500 hover:bg-amber-50 rounded-lg transition-colors"
                            title="Seal to Blockchain"
                          >
                            <Database className="w-4 h-4" />
                          </button>
                        )}
                        <button className="p-2 text-[#088395] hover:bg-[#EBF4F6] rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="p-6 border-t border-gray-50 bg-gray-50/30 flex items-center justify-between">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              {/* Page Numbers */}
              <div className="flex items-center gap-1 mx-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1)
                  .map((page, index, array) => {
                    const showEllipsis = index > 0 && page - array[index - 1] > 1;
                    return (
                      <React.Fragment key={page}>
                        {showEllipsis && <MoreHorizontal className="w-3 h-3 text-gray-300" />}
                        <button
                          onClick={() => setCurrentPage(page)}
                          className={`w-8 h-8 rounded-xl text-xs font-black transition-all ${
                            currentPage === page 
                              ? 'bg-[#1C1C1C] text-white shadow-md' 
                              : 'text-gray-400 hover:bg-gray-100'
                          }`}
                        >
                          {page}
                        </button>
                      </React.Fragment>
                    );
                  })}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: any) {
  return (
    <div className="bg-white p-6 rounded-[28px] shadow-sm border border-[#09637E]/10 relative group overflow-hidden transition-all hover:shadow-md">
      <div className="absolute top-0 right-0 w-20 h-20 bg-[#EBF4F6]/50 rounded-bl-full -mr-6 -mt-6 transition-transform group-hover:scale-125" />
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className={`p-3.5 ${color} text-white rounded-[18px] shadow-lg shadow-black/5`}>
          {React.cloneElement(icon, { size: 18 })}
        </div>
      </div>
      <p className="text-[10px] font-black text-[#09637E]/40 uppercase tracking-[0.15em] relative z-10">{label}</p>
      <h3 className="text-xl font-black text-[#1C1C1C] mt-1 relative z-10">{value}</h3>
    </div>
  );
}