import { 
  Search, 
  Filter, 
  Eye, 
  ShieldCheck, 
  AlertCircle,
  BarChart3,
  TrendingUp,
  FileText,
  Calendar,
  MapPin
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Ordinance, getOrdinanceCategories, getViolationsForOrdinance } from '../utils/ordinanceData';
import { OrdinanceTable } from './OrdinanceTable';
import { ViolationRecord } from '../utils/ordinanceData';
import React, { useState, useMemo } from 'react';

interface OrdinancesPageProps {
  ordinances: Ordinance[];
  violations: ViolationRecord[];
  barangays: any[];
  selectedBarangayId: string;
  onViewDetails: (ordinance: Ordinance) => void;
  isAdmin?: boolean;
  title?: string;
  subtitle?: string;
}

const COLORS = {
  chart: ["#504B38", "#B9B28A", "#EBE5C2", "#8A8364", "#D4CBA0", "#6B6348"]
};

export function OrdinancesPage({ 
  ordinances, 
  violations,
  barangays, 
  selectedBarangayId, 
  onViewDetails,
  isAdmin = true,
  title = "Ordinance Records",
  subtitle = "Comprehensive ordinance management and enforcement tracking"
}: OrdinancesPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredOrdinances = useMemo(() => {
    let filtered = ordinances;

    // Filter by barangay
    if (selectedBarangayId !== 'all') {
      const barangay = barangays.find(b => b.id === selectedBarangayId);
      if (barangay) {
        filtered = filtered.filter(o => o.barangay === barangay.name);
      }
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(o => 
        o.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.barangay.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(o => o.category === categoryFilter);
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(o => o.status === statusFilter);
    }

    return filtered;
  }, [ordinances, selectedBarangayId, barangays, searchTerm, categoryFilter, statusFilter]);

  const categories = useMemo(() => getOrdinanceCategories(filteredOrdinances), [filteredOrdinances]);
  
  const uniqueCategories = useMemo(() => {
    const cats = Array.from(new Set(ordinances.map(o => o.category)));
    return cats.sort();
  }, [ordinances]);

  const stats = useMemo(() => {
    const totalEnforced = filteredOrdinances.reduce((sum, o) => sum + o.timesEnforced, 0);
    const totalViolations = filteredOrdinances.reduce((sum, o) => sum + o.violationsRecorded, 0);
    const activeOrdinances = filteredOrdinances.filter(o => o.status === 'Active').length;
    
    return {
      total: filteredOrdinances.length,
      active: activeOrdinances,
      totalEnforced,
      totalViolations
    };
  }, [filteredOrdinances]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#504B38] tracking-tight">{title || "Ordinance Records"}</h1>
        <p className="text-sm text-gray-500 font-medium">
          {subtitle || `Comprehensive ordinance management and enforcement tracking for ${selectedBarangayId === 'all' ? 'all barangays' : barangays.find(b => b.id === selectedBarangayId)?.name}`}
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard 
          icon={<FileText className="w-5 h-5" />}
          label="Total Ordinances"
          value={stats.total}
          color="bg-[#F8F3D9]"
        />
        <StatCard 
          icon={<ShieldCheck className="w-5 h-5" />}
          label="Active Ordinances"
          value={stats.active}
          color="bg-emerald-50"
        />
        <StatCard 
          icon={<BarChart3 className="w-5 h-5" />}
          label="Times Enforced"
          value={stats.totalEnforced}
          color="bg-blue-50"
        />
        <StatCard 
          icon={<AlertCircle className="w-5 h-5" />}
          label="Total Violations"
          value={stats.totalViolations}
          color="bg-amber-50"
        />
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#504B38]/10">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search ordinances..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#504B38]/20 focus:outline-none focus:ring-2 focus:ring-[#B9B28A] text-sm"
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-3 rounded-xl border border-[#504B38]/20 focus:outline-none focus:ring-2 focus:ring-[#B9B28A] text-sm font-medium text-[#504B38] cursor-pointer"
          >
            <option value="all">All Categories</option>
            {uniqueCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 rounded-xl border border-[#504B38]/20 focus:outline-none focus:ring-2 focus:ring-[#B9B28A] text-sm font-medium text-[#504B38] cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Updated">Updated</option>
            <option value="Archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Ordinances Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-[#504B38]/10 overflow-hidden">
        <div className="p-6 border-b border-gray-50">
          <h3 className="font-bold text-[#504B38]">Ordinance Records ({filteredOrdinances.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#F8F3D9] text-[10px] uppercase tracking-widest text-[#504B38]/60 font-bold">
                <th className="px-6 py-4">Ordinance ID</th>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Barangay</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Implemented</th>
                <th className="px-6 py-4 text-center">Enforced</th>
                <th className="px-6 py-4 text-center">Violations</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredOrdinances.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <FileText className="w-12 h-12 mb-3 opacity-50" />
                      <p className="text-sm font-medium">No ordinances found</p>
                      <p className="text-xs">Try adjusting your filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrdinances.map(ordinance => (
                  <tr key={ordinance.id} className="hover:bg-[#EBE5C2]/10 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-[#504B38] font-mono">{ordinance.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-[#504B38] block">{ordinance.title}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500 font-medium">{ordinance.barangay}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold ${getCategoryColor(ordinance.category)}`}>
                        {ordinance.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500 font-medium">{ordinance.dateImplemented}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm font-bold text-[#504B38]">{ordinance.timesEnforced}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm font-bold text-amber-600">{getViolationsForOrdinance(ordinance.id, violations)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold ${getStatusColor(ordinance.status)}`}>
                        {ordinance.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => onViewDetails(ordinance)}
                        className="inline-flex items-center px-3 py-1.5 rounded-lg bg-[#B9B28A] text-white text-[10px] font-bold hover:bg-[#504B38] cursor-pointer transition-colors"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function StatCard({ icon, label, value, color }: any) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#504B38]/10 relative overflow-hidden group">
      <div className={`absolute top-0 right-0 w-20 h-20 ${color} rounded-bl-full -mr-8 -mt-8 opacity-30 transition-all group-hover:scale-110`} />
      <div className={`p-3 ${color} rounded-2xl text-[#504B38] inline-flex mb-4`}>
        {icon}
      </div>
      <p className="text-xs font-bold text-[#504B38]/50 uppercase tracking-widest mb-1">{label}</p>
      <h3 className="text-3xl font-black text-[#504B38]">{value.toLocaleString()}</h3>
    </div>
  );
}

// Helper functions
function getCategoryColor(category: string) {
  const colors: Record<string, string> = {
    'Environmental': 'bg-green-100 text-green-700',
    'Public Safety': 'bg-blue-100 text-blue-700',
    'Health': 'bg-purple-100 text-purple-700',
    'Traffic': 'bg-orange-100 text-orange-700',
    'Community Order': 'bg-indigo-100 text-indigo-700',
    'Public Order': 'bg-pink-100 text-pink-700',
  };
  return colors[category] || 'bg-gray-100 text-gray-700';
}

function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    'Active': 'bg-emerald-100 text-emerald-700',
    'Updated': 'bg-blue-100 text-blue-700',
    'Archived': 'bg-gray-100 text-gray-700',
  };
  return colors[status] || 'bg-gray-100 text-gray-700';
}