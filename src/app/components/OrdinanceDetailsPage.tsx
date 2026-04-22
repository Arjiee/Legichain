import React from 'react';
import { 
  ArrowLeft, 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  Tag, 
  TrendingUp, 
  AlertTriangle,
  FileText,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';
import { Ordinance, ViolationRecord, getViolationsForOrdinance } from '../utils/ordinanceData';
import { toast } from 'sonner';

interface OrdinanceDetailsPageProps {
  ordinance: Ordinance;
  violations: ViolationRecord[];
  onBack: () => void;
}

export function OrdinanceDetailsPage({ ordinance, violations, onBack }: OrdinanceDetailsPageProps) {
  const [copiedHash, setCopiedHash] = React.useState(false);
  const [copiedBlock, setCopiedBlock] = React.useState(false);

  // Calculate real-time violations for this ordinance
  const violationsRecorded = getViolationsForOrdinance(ordinance.id, violations);

  const copyToClipboard = (text: string, type: 'hash' | 'block') => {
    navigator.clipboard.writeText(text);
    if (type === 'hash') {
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    } else {
      setCopiedBlock(true);
      setTimeout(() => setCopiedBlock(false), 2000);
    }
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center text-sm font-bold text-[#504B38] hover:text-[#B9B28A] transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Return to Ordinance Records
      </button>

      {/* Header Card */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#504B38]/10">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <span className="text-sm font-mono font-bold text-[#504B38] bg-[#F8F3D9] px-3 py-1 rounded-lg">
                {ordinance.id}
              </span>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(ordinance.status)}`}>
                {ordinance.status}
              </span>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${getCategoryColor(ordinance.category)}`}>
                {ordinance.category}
              </span>
            </div>
            <h1 className="text-3xl font-black text-[#504B38] mb-4">{ordinance.title}</h1>
            <p className="text-sm text-gray-600 leading-relaxed font-medium">
              {ordinance.description || 'No description available for this ordinance.'}
            </p>
          </div>
        </div>

        {/* Meta Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-50 rounded-xl">
              <MapPin className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Barangay</p>
              <p className="text-sm font-bold text-[#504B38]">{ordinance.barangay}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-50 rounded-xl">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date Implemented</p>
              <p className="text-sm font-bold text-[#504B38]">{ordinance.dateImplemented}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-amber-50 rounded-xl">
              <Tag className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Category</p>
              <p className="text-sm font-bold text-[#504B38]">{ordinance.category}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          icon={<TrendingUp className="w-6 h-6" />}
          label="Times Enforced"
          value={ordinance.timesEnforced}
          color="bg-blue-50"
          iconColor="text-blue-600"
        />
        <StatCard 
          icon={<AlertTriangle className="w-6 h-6" />}
          label="Violations Recorded"
          value={violationsRecorded}
          color="bg-amber-50"
          iconColor="text-amber-600"
        />
        <StatCard 
          icon={<FileText className="w-6 h-6" />}
          label="Compliance Rate"
          value={`${Math.round((1 - violationsRecorded / ordinance.timesEnforced) * 100)}%`}
          color="bg-emerald-50"
          iconColor="text-emerald-600"
        />
      </div>

      {/* Blockchain Verification */}
      {ordinance.txHash && ordinance.block && (
        <div className="bg-gradient-to-br from-[#EBE5C2] to-[#F8F3D9] p-8 rounded-3xl border border-[#504B38]/10">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-emerald-500 rounded-xl shadow-lg">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-black text-[#504B38]">Blockchain Verification</h3>
              <p className="text-xs text-gray-600 font-medium">This ordinance record is secured on the blockchain</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl space-y-4 border border-[#504B38]/10">
            {/* Transaction Hash */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Transaction Hash</label>
                <button
                  onClick={() => copyToClipboard(ordinance.txHash!, 'hash')}
                  className="inline-flex items-center text-[10px] font-bold text-[#B9B28A] hover:text-[#504B38] transition-colors cursor-pointer"
                >
                  {copiedHash ? (
                    <>
                      <Check className="w-3 h-3 mr-1" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 mr-1" />
                      Copy
                    </>
                  )}
                </button>
              </div>
              <div className="flex items-center space-x-2 bg-[#F8F3D9] p-3 rounded-xl">
                <code className="text-xs font-mono text-[#504B38] flex-1 break-all">{ordinance.txHash}</code>
              </div>
            </div>

            {/* Block Number */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Block Number</label>
                <button
                  onClick={() => copyToClipboard(ordinance.block!, 'block')}
                  className="inline-flex items-center text-[10px] font-bold text-[#B9B28A] hover:text-[#504B38] transition-colors cursor-pointer"
                >
                  {copiedBlock ? (
                    <>
                      <Check className="w-3 h-3 mr-1" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 mr-1" />
                      Copy
                    </>
                  )}
                </button>
              </div>
              <div className="flex items-center space-x-2 bg-[#F8F3D9] p-3 rounded-xl">
                <code className="text-xs font-mono text-[#504B38] flex-1">{ordinance.block}</code>
              </div>
            </div>

            {/* Verification Status */}
            <div className="pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-emerald-700">Verified on Blockchain</span>
                </div>
                <button className="inline-flex items-center px-4 py-2 bg-[#B9B28A] text-white text-xs font-bold rounded-xl hover:bg-[#504B38] transition-colors cursor-pointer">
                  <ExternalLink className="w-3 h-3 mr-2" />
                  View on Explorer
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-white/50 rounded-xl border border-[#504B38]/10">
            <p className="text-xs text-gray-600 leading-relaxed">
              <strong className="text-[#504B38]">What does this mean?</strong><br />
              This ordinance has been permanently recorded on the blockchain, making it tamper-proof and transparent. 
              Anyone can verify its authenticity using the transaction hash above.
            </p>
          </div>
        </div>
      )}

      {/* Additional Information */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#504B38]/10">
        <h3 className="text-lg font-bold text-[#504B38] mb-6">Enforcement Information</h3>
        <div className="space-y-4">
          <InfoRow 
            label="Total Enforcement Actions"
            value={`${ordinance.timesEnforced} times`}
          />
          <InfoRow 
            label="Total Violations Recorded"
            value={`${violationsRecorded} cases`}
          />
          <InfoRow 
            label="Enforcement Rate"
            value={`${Math.round((violationsRecorded / ordinance.timesEnforced) * 100)}% of enforcements resulted in violations`}
          />
          <InfoRow 
            label="Status"
            value={ordinance.status}
            badge
          />
        </div>
      </div>

      {/* Violation Cases Table */}
      {violationsRecorded > 0 && (
        <div className="bg-white rounded-3xl shadow-sm border border-[#504B38]/10 overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h3 className="font-bold text-[#504B38] flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              Violation Cases ({violationsRecorded})
            </h3>
            <p className="text-xs text-gray-500 font-medium mt-1">All recorded violations for this ordinance</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#F8F3D9] text-[10px] uppercase tracking-widest text-[#504B38]/60 font-bold">
                  <th className="px-6 py-4">Case ID</th>
                  <th className="px-6 py-4">Violation Type</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Barangay</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Recorded By</th>
                  <th className="px-6 py-4">Blockchain</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {violations.filter(v => v.ordinanceId === ordinance.id).map((violation) => (
                  <tr key={violation.id} className="hover:bg-[#F8F3D9]/20 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono font-bold text-[#504B38]">{violation.id}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-700 font-medium">{violation.violationType}</td>
                    <td className="px-6 py-4 text-gray-600">{new Date(violation.dateOfViolation).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                    <td className="px-6 py-4 text-gray-600">{violation.barangay}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold ${
                        violation.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700' :
                        violation.status === 'Warning Issued' ? 'bg-amber-100 text-amber-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {violation.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-medium">{violation.recordedBy}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        violation.verificationStatus === 'Verified' ? 'bg-emerald-50 border border-emerald-100 text-emerald-700' :
                        violation.verificationStatus === 'Pending' ? 'bg-amber-50 border border-amber-100 text-amber-700' :
                        'bg-red-50 border border-red-100 text-red-700'
                      }`}>
                        <ShieldCheck className="w-3 h-3 mr-1" />
                        {violation.verificationStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper Components
function StatCard({ icon, label, value, color, iconColor }: any) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#504B38]/10 relative overflow-hidden group">
      <div className={`absolute top-0 right-0 w-20 h-20 ${color} rounded-bl-full -mr-8 -mt-8 opacity-50 transition-all group-hover:scale-110`} />
      <div className={`p-4 ${color} rounded-2xl ${iconColor} inline-flex mb-4`}>
        {icon}
      </div>
      <p className="text-xs font-bold text-[#504B38]/50 uppercase tracking-widest mb-1">{label}</p>
      <h3 className="text-3xl font-black text-[#504B38]">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </h3>
    </div>
  );
}

function InfoRow({ label, value, badge = false }: { label: string; value: string; badge?: boolean }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <span className="text-sm font-medium text-gray-600">{label}</span>
      {badge ? (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(value)}`}>
          {value}
        </span>
      ) : (
        <span className="text-sm font-bold text-[#504B38]">{value}</span>
      )}
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