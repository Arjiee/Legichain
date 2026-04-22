import React, { useMemo } from 'react';
import { ShieldCheck, Eye, MapPin, Calendar } from 'lucide-react';
import { Ordinance, ViolationRecord, getViolationsForOrdinance } from '../utils/ordinanceData';

interface OrdinanceTableProps {
  ordinances: Ordinance[];
  violations: ViolationRecord[];
  barangays: any[];
  selectedBarangayId: string;
  onViewDetails: (ordinance: Ordinance) => void;
  limit?: number;
  showActions?: boolean;
  isAdmin?: boolean;
}

export function OrdinanceTable({
  ordinances,
  violations,
  barangays,
  selectedBarangayId,
  onViewDetails,
  limit,
  showActions = true,
  isAdmin = false
}: OrdinanceTableProps) {
  // Filter ordinances based on selected barangay
  const filteredOrdinances = useMemo(() => {
    let filtered = ordinances;
    
    if (selectedBarangayId !== 'all') {
      const barangay = barangays.find(b => b.id === selectedBarangayId);
      if (barangay) {
        filtered = filtered.filter(o => o.barangay === barangay.name);
      }
    }
    
    return limit ? filtered.slice(0, limit) : filtered;
  }, [ordinances, selectedBarangayId, barangays, limit]);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-[#F8F3D9] text-[10px] uppercase tracking-widest text-[#504B38]/60 font-bold">
            <th className="px-6 py-4">Ordinance ID</th>
            <th className="px-6 py-4">Barangay</th>
            <th className="px-6 py-4">Ordinance Title</th>
            <th className="px-6 py-4">Category</th>
            <th className="px-6 py-4">Date Implemented</th>
            <th className="px-6 py-4 text-center">Total Violations</th>
            <th className="px-6 py-4">Status</th>
            {showActions && <th className="px-6 py-4">Action</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {filteredOrdinances.length === 0 ? (
            <tr>
              <td colSpan={showActions ? 8 : 7} className="px-6 py-12 text-center text-gray-400">
                <p className="text-sm font-medium">No ordinances found</p>
              </td>
            </tr>
          ) : (
            filteredOrdinances.map(ord => {
              // Calculate violations for THIS specific ordinance
              const violationCount = getViolationsForOrdinance(ord.id, violations);
              
              return (
                <tr key={ord.id} className="hover:bg-[#EBE5C2]/10 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold text-[#504B38] font-mono">{ord.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500 font-medium">{ord.barangay}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-[#504B38]">{ord.title}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold ${getCategoryColor(ord.category)}`}>
                      {ord.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500 font-medium">{ord.dateImplemented}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm font-bold text-amber-600">{violationCount}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold ${getStatusColor(ord.status)}`}>
                      {ord.status === 'Active' && <ShieldCheck className="w-3 h-3 mr-1" />}
                      {ord.status}
                    </span>
                  </td>
                  {showActions && (
                    <td className="px-6 py-4">
                      <button
                        onClick={() => onViewDetails(ord)}
                        className="inline-flex items-center px-3 py-1.5 rounded-lg bg-[#B9B28A] text-white text-[10px] font-bold hover:bg-[#504B38] cursor-pointer transition-colors"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        View Details
                      </button>
                    </td>
                  )}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
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
    'Business Regulation': 'bg-pink-100 text-pink-700',
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