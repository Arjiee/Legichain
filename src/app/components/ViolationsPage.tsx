import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Shield, 
  AlertTriangle,
  TrendingUp,
  Users,
  MapPin,
  Calendar,
  ExternalLink,
  FileText,
  DollarSign
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { ViolationRecord, getMostViolatedOrdinances, getViolationsByBarangayStats } from '../utils/ordinanceData';

interface ViolationsPageProps {
  violations: ViolationRecord[];
  barangays: any[];
  selectedBarangayId: string;
  onViewTransaction: (violation: ViolationRecord) => void;
}

export function ViolationsPage({ 
  violations, 
  barangays, 
  selectedBarangayId, 
  onViewTransaction 
}: ViolationsPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');

  const filteredViolations = useMemo(() => {
    let filtered = violations;

    // Filter by barangay
    if (selectedBarangayId !== 'all') {
      const barangay = barangays.find(b => b.id === selectedBarangayId);
      if (barangay) {
        filtered = filtered.filter(v => v.barangay === barangay.name);
      }
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(v => 
        v.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.citizenId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.ordinanceViolated.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.barangay.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.txHash.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by date range
    if (dateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date(v => new Date(v.date));
      
      switch(dateFilter) {
        case '7days':
          filtered = filtered.filter(v => {
            const violationDate = new Date(v.date);
            const diffDays = Math.floor((now.getTime() - violationDate.getTime()) / (1000 * 60 * 60 * 24));
            return diffDays <= 7;
          });
          break;
        case '30days':
          filtered = filtered.filter(v => {
            const violationDate = new Date(v.date);
            const diffDays = Math.floor((now.getTime() - violationDate.getTime()) / (1000 * 60 * 60 * 24));
            return diffDays <= 30;
          });
          break;
        case '90days':
          filtered = filtered.filter(v => {
            const violationDate = new Date(v.date);
            const diffDays = Math.floor((now.getTime() - violationDate.getTime()) / (1000 * 60 * 60 * 24));
            return diffDays <= 90;
          });
          break;
      }
    }

    return filtered;
  }, [violations, selectedBarangayId, barangays, searchTerm, dateFilter]);

  const mostViolated = useMemo(() => getMostViolatedOrdinances(filteredViolations), [filteredViolations]);
  const barangayStats = useMemo(() => getViolationsByBarangayStats(filteredViolations), [filteredViolations]);

  const stats = useMemo(() => {
    const verified = filteredViolations.filter(v => v.status === 'Verified').length;
    const uniqueCitizens = new Set(filteredViolations.map(v => v.citizenId)).size;
    const totalPenalties = filteredViolations.reduce((sum, v) => {
      const penalty = v.penalty?.replace('₱', '').replace(',', '') || '0';
      return sum + parseFloat(penalty);
    }, 0);
    
    return {
      total: filteredViolations.length,
      verified,
      uniqueCitizens,
      totalPenalties
    };
  }, [filteredViolations]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#504B38] tracking-tight">Violation Records</h1>
        <p className="text-sm text-gray-500 font-medium">
          Blockchain-verified ordinance violation tracking for {selectedBarangayId === 'all' ? 'all barangays' : barangays.find(b => b.id === selectedBarangayId)?.name}
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard 
          icon={<AlertTriangle className="w-5 h-5" />}
          label="Total Violations"
          value={stats.total}
          color="bg-amber-50"
          iconColor="text-amber-600"
        />
        <StatCard 
          icon={<Shield className="w-5 h-5" />}
          label="Verified on Chain"
          value={stats.verified}
          color="bg-emerald-50"
          iconColor="text-emerald-600"
        />
        <StatCard 
          icon={<Users className="w-5 h-5" />}
          label="Unique Violators"
          value={stats.uniqueCitizens}
          color="bg-blue-50"
          iconColor="text-blue-600"
        />
        <StatCard 
          icon={<DollarSign className="w-5 h-5" />}
          label="Total Penalties"
          value={`₱${stats.totalPenalties.toLocaleString()}`}
          color="bg-purple-50"
          iconColor="text-purple-600"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Most Violated Ordinances */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#504B38]/10">
          <h3 className="font-bold text-[#504B38] mb-6 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-amber-600" />
            Most Violated Ordinances
          </h3>
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer>
              <BarChart data={mostViolated.slice(0, 8)} layout="vertical" margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f5f5f5" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#504B38' }} />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#504B38' }}
                  width={120}
                />
                <Tooltip 
                  cursor={{ fill: '#F8F3D9' }} 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
                />
                <Bar dataKey="value" fill="#F59E0B" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Violations by Barangay */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#504B38]/10">
          <h3 className="font-bold text-[#504B38] mb-6 flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-blue-600" />
            Violations by Barangay
          </h3>
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer>
              <BarChart data={barangayStats.slice(0, 10)} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 9, fill: '#504B38' }}
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#504B38' }} />
                <Tooltip 
                  cursor={{ fill: '#F8F3D9' }} 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
                />
                <Bar dataKey="value" fill="#504B38" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#504B38]/10">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Record ID, Citizen ID, Ordinance, or Transaction Hash..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#504B38]/20 focus:outline-none focus:ring-2 focus:ring-[#B9B28A] text-sm"
            />
          </div>

          {/* Date Range Filter */}
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-3 rounded-xl border border-[#504B38]/20 focus:outline-none focus:ring-2 focus:ring-[#B9B28A] text-sm font-medium text-[#504B38] cursor-pointer"
          >
            <option value="all">All Time</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
          </select>
        </div>
      </div>

      {/* Violations Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-[#504B38]/10 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
          <h3 className="font-bold text-[#504B38]">Violation Records ({filteredViolations.length})</h3>
          <span className="text-xs font-bold text-[#504B38]/50 uppercase tracking-widest">
            All records verified on blockchain
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#F8F3D9] text-[10px] uppercase tracking-widest text-[#504B38]/60 font-bold">
                <th className="px-6 py-4">Record ID</th>
                <th className="px-6 py-4">Citizen ID</th>
                <th className="px-6 py-4">Barangay</th>
                <th className="px-6 py-4">Ordinance Violated</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Penalty</th>
                <th className="px-6 py-4">Block</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredViolations.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <FileText className="w-12 h-12 mb-3 opacity-50" />
                      <p className="text-sm font-medium">No violation records found</p>
                      <p className="text-xs">Try adjusting your filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredViolations.map(violation => (
                  <tr key={violation.id} className="hover:bg-[#EBE5C2]/10 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-[#504B38] font-mono">{violation.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-mono text-gray-600">{violation.citizenId}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500 font-medium">{violation.barangay}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-[#504B38]">{violation.ordinanceViolated}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500 font-medium">{violation.date}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-amber-600">{violation.penalty || 'N/A'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-mono text-gray-500">{violation.block}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        violation.status === 'Verified' 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {violation.status === 'Verified' && <Shield className="w-3 h-3 mr-1" />}
                        {violation.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => onViewTransaction(violation)}
                        className="inline-flex items-center px-3 py-1.5 rounded-lg bg-[#B9B28A] text-white text-[10px] font-bold hover:bg-[#504B38] cursor-pointer transition-colors"
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        View on Chain
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
function StatCard({ icon, label, value, color, iconColor }: any) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#504B38]/10 relative overflow-hidden group">
      <div className={`absolute top-0 right-0 w-20 h-20 ${color} rounded-bl-full -mr-8 -mt-8 opacity-50 transition-all group-hover:scale-110`} />
      <div className={`p-3 ${color} rounded-2xl ${iconColor} inline-flex mb-4`}>
        {icon}
      </div>
      <p className="text-xs font-bold text-[#504B38]/50 uppercase tracking-widest mb-1">{label}</p>
      <h3 className="text-2xl md:text-3xl font-black text-[#504B38]">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </h3>
    </div>
  );
}