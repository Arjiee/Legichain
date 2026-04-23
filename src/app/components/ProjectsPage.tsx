import React, { useState, useMemo } from 'react';
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
  Calendar,
  Users,
  MapPin,
  Briefcase,
  Loader2,
  Plus,
  Database // Added for Sealing action
} from 'lucide-react';
import { motion } from 'motion/react';
import { BarangayProject } from '../utils/projectData';
import { useData } from './DataContext'; // Import hook for blockchain actions

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

export function ProjectsPage({ 
  projects, 
  barangays, 
  selectedBarangayId,
  onViewDetails,
  onAddProject,
  isAdmin,
  loading = false,
  title = "Project Monitoring Dashboard",
  subtitle = "Comprehensive barangay project tracking and transparency"
}: ProjectsPageProps) {
  const { handleSealProjectToBlockchain } = useData(); // Real blockchain handler
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

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

  const stats = useMemo(() => ({
    total: projects.length,
    active: projects.filter(p => p.projectStatus === 'Ongoing').length,
    completed: projects.filter(p => p.projectStatus === 'Completed').length,
    planned: projects.filter(p => p.projectStatus === 'Planned').length,
    totalBudget: projects.reduce((sum, p) => sum + (p.financials?.totalApprovedBudget || 0), 0),
  }), [projects]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Infrastructure & Physical Improvement': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Health, Sanitation, and Environment': return 'bg-green-100 text-green-700 border-green-200';
      case 'Safety, Order, and Social Services': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Livelihood, Education, and Agriculture': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Ongoing': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Planned': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const formatCurrency = (amount: number) => {
    return `₱${amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1C1C1C] tracking-tight">{title}</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">{subtitle}</p>
        </div>
        {isAdmin && onAddProject && (
          <button
            onClick={onAddProject}
            className="px-6 py-3 bg-[#088395] text-white font-bold rounded-2xl flex items-center gap-2 hover:bg-[#09637E] transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Project
          </button>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<FileText className="w-5 h-5" />} 
          label="Total Projects" 
          value={stats.total}
          color="bg-[#09637E]"
        />
        <StatCard 
          icon={<TrendingUp className="w-5 h-5" />} 
          label="Ongoing Projects" 
          value={stats.active}
          color="bg-[#088395]"
        />
        <StatCard 
          icon={<ShieldCheck className="w-5 h-5" />} 
          label="Completed Projects" 
          value={stats.completed}
          color="bg-[#7AB2B2]"
        />
        <StatCard 
          icon={<DollarSign className="w-5 h-5" />} 
          label="Total Budget" 
          value={formatCurrency(stats.totalBudget)}
          color="bg-[#09637E]"
        />
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-3xl shadow-sm border border-[#09637E]/10 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects by title, ID, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#088395] focus:outline-none transition-all text-sm"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-6 py-3 bg-[#088395] text-white font-bold rounded-2xl flex items-center gap-2 hover:bg-[#09637E] transition-colors"
          >
            <Filter className="w-5 h-5" />
            Filters
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div>
              <label className="block text-xs font-bold text-[#09637E] uppercase tracking-widest mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#088395] focus:outline-none"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#09637E] uppercase tracking-widest mb-2">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#088395] focus:outline-none"
              >
                <option value="all">All Statuses</option>
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </motion.div>
        )}
      </div>

      {/* Projects List */}
      <div className="bg-white rounded-3xl shadow-sm border border-[#09637E]/10 overflow-hidden">
        <div className="p-6 border-b border-gray-50">
          <h3 className="font-bold text-[#1C1C1C]">Project Records</h3>
          <p className="text-xs text-gray-500 font-medium mt-1">
            Showing {filteredProjects.length} of {projects.length} projects
          </p>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="p-12 text-center">
            <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No projects found matching your criteria</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filteredProjects.map((project) => (
              <ProjectRow
                key={project.id}
                project={project}
                onViewDetails={onViewDetails}
                getCategoryColor={getCategoryColor}
                getStatusColor={getStatusColor}
                formatCurrency={formatCurrency}
                isAdmin={isAdmin}
                onSeal={handleSealProjectToBlockchain} // Passed the sealant handler
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: any) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#09637E]/10 relative group overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-[#EBF4F6]/50 rounded-bl-full -mr-8 -mt-8 transition-all group-hover:scale-110" />
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 ${color} text-white rounded-2xl`}>
          {icon}
        </div>
      </div>
      <p className="text-xs font-bold text-[#09637E]/50 uppercase tracking-widest">{label}</p>
      <h3 className="text-2xl font-black text-[#1C1C1C] mt-1">{value}</h3>
    </div>
  );
}

function ProjectRow({ project, onViewDetails, getCategoryColor, getStatusColor, formatCurrency, isAdmin, onSeal }: any) {
  return (
    <div className="p-6 hover:bg-[#EBF4F6]/30 transition-colors group cursor-pointer" onClick={() => onViewDetails(project)}>
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex-1 space-y-3">
          {/* Header Row */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-mono text-[#088395] font-bold">{project.projectId}</span>
                {project.blockchainVerified && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                    <ShieldCheck className="w-3 h-3 mr-1" />
                    Verified on Chain
                  </span>
                )}
              </div>
              <h4 className="font-bold text-[#1C1C1C] text-lg mb-2 group-hover:text-[#088395] transition-colors">
                {project.projectTitle}
              </h4>
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">{project.description}</p>
            </div>
          </div>

          {/* Tags Row */}
          <div className="flex flex-wrap gap-2">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getCategoryColor(project.category)}`}>
              <Briefcase className="w-3 h-3 mr-1" />
              {project.category}
            </span>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(project.projectStatus)}`}>
              {project.projectStatus}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-bold border border-gray-200">
              <Building2 className="w-3 h-3 mr-1" />
              {project.barangay}
            </span>
          </div>

          {/* Info Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-3 border-t border-gray-100">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Budget</p>
              <p className="text-sm font-bold text-[#09637E]">{formatCurrency(project.financials.totalApprovedBudget)}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Funding Source</p>
              <p className="text-sm font-bold text-gray-700">{project.financials.fundingSource}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Start Date</p>
              <p className="text-sm font-bold text-gray-700">{new Date(project.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Implementing Office</p>
              <p className="text-sm font-bold text-gray-700 truncate">{project.implementingOffice}</p>
            </div>
          </div>
        </div>

        {/* Actions Button Group */}
        <div className="flex flex-col gap-2">
          {isAdmin && !project.blockchainVerified && (
            <button 
              onClick={(e) => { e.stopPropagation(); onSeal(project); }}
              className="px-4 py-2 bg-amber-500 text-white text-[10px] font-black rounded-xl hover:bg-amber-600 transition-all flex items-center gap-2 shadow-sm whitespace-nowrap"
            >
              <Database className="w-3 h-3" />
              Seal to Blockchain
            </button>
          )}
          <button className="px-6 py-3 bg-[#088395] text-white font-bold rounded-2xl flex items-center gap-2 hover:bg-[#09637E] transition-all shadow-sm opacity-0 group-hover:opacity-100">
            <Eye className="w-4 h-4" />
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}