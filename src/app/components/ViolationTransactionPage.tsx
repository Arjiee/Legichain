import React from 'react';
import { 
  ArrowLeft, 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  User, 
  AlertTriangle,
  Copy,
  Check,
  ExternalLink,
  FileText,
  DollarSign
} from 'lucide-react';
import { ViolationRecord } from '../utils/ordinanceData';
import { toast } from 'sonner';

interface ViolationTransactionPageProps {
  violation: ViolationRecord;
  onBack: () => void;
}

export function ViolationTransactionPage({ violation, onBack }: ViolationTransactionPageProps) {
  const [copiedHash, setCopiedHash] = React.useState(false);
  const [copiedBlock, setCopiedBlock] = React.useState(false);

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
        Back to Violations
      </button>

      {/* Header Card */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#504B38]/10">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <span className="text-sm font-mono font-bold text-[#504B38] bg-[#F8F3D9] px-3 py-1 rounded-lg">
                {violation.id}
              </span>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                violation.status === 'Verified' 
                  ? 'bg-emerald-100 text-emerald-700' 
                  : 'bg-amber-100 text-amber-700'
              }`}>
                <ShieldCheck className="w-3 h-3 mr-1" />
                {violation.status}
              </span>
            </div>
            <h1 className="text-3xl font-black text-[#504B38] mb-2">Violation Record Details</h1>
            <p className="text-lg font-bold text-amber-600">{violation.ordinanceViolated}</p>
          </div>
        </div>

        {/* Meta Information */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-6 border-t border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-50 rounded-xl">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Citizen ID</p>
              <p className="text-sm font-mono font-bold text-[#504B38]">{violation.citizenId}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-50 rounded-xl">
              <MapPin className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Barangay</p>
              <p className="text-sm font-bold text-[#504B38]">{violation.barangay}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-amber-50 rounded-xl">
              <Calendar className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</p>
              <p className="text-sm font-bold text-[#504B38]">{violation.date}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-red-50 rounded-xl">
              <DollarSign className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Penalty</p>
              <p className="text-sm font-bold text-[#504B38]">{violation.penalty || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Blockchain Transaction Details */}
      <div className="bg-gradient-to-br from-[#EBE5C2] to-[#F8F3D9] p-8 rounded-3xl border border-[#504B38]/10">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-emerald-500 rounded-xl shadow-lg">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-black text-[#504B38]">Blockchain Transaction</h3>
            <p className="text-xs text-gray-600 font-medium">Immutable proof of violation record</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl space-y-6 border border-[#504B38]/10">
          {/* Transaction Hash */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center">
                <FileText className="w-3 h-3 mr-1" />
                Transaction Hash (TxHash)
              </label>
              <button
                onClick={() => copyToClipboard(violation.txHash, 'hash')}
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
            <div className="flex items-center space-x-2 bg-[#F8F3D9] p-4 rounded-xl">
              <code className="text-xs font-mono text-[#504B38] flex-1 break-all font-bold">{violation.txHash}</code>
            </div>
            <p className="text-[10px] text-gray-500 mt-2 italic">
              This cryptographic hash proves the violation record was stored on the blockchain
            </p>
          </div>

          {/* Block Number */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Block Number</label>
              <button
                onClick={() => copyToClipboard(violation.block, 'block')}
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
            <div className="flex items-center space-x-2 bg-[#F8F3D9] p-4 rounded-xl">
              <code className="text-xs font-mono text-[#504B38] flex-1 font-bold">{violation.block}</code>
            </div>
            <p className="text-[10px] text-gray-500 mt-2 italic">
              The specific block where this transaction was permanently recorded
            </p>
          </div>

          {/* Blockchain Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">From Address</p>
              <p className="text-xs font-mono text-gray-600">Barangay Enforcement System</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">To Address</p>
              <p className="text-xs font-mono text-gray-600">GMA Cavite Blockchain Ledger</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Recorded By</p>
              <p className="text-xs text-gray-600 font-medium">Barangay Enforcement Officer</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Timestamp</p>
              <p className="text-xs text-gray-600 font-medium">{violation.date} • 10:32 AM</p>
            </div>
          </div>

          {/* Verification Status */}
          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-emerald-700">✓ Verified on Blockchain</span>
              </div>
              <button className="inline-flex items-center px-4 py-2 bg-[#B9B28A] text-white text-xs font-bold rounded-xl hover:bg-[#504B38] transition-colors cursor-pointer shadow-sm">
                <ExternalLink className="w-3 h-3 mr-2" />
                View on Block Explorer
              </button>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 p-5 bg-white/50 rounded-xl border border-[#504B38]/10">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#504B38] mb-1">Blockchain Transparency</p>
              <p className="text-xs text-gray-600 leading-relaxed">
                This violation record cannot be altered or deleted. The blockchain transaction hash serves as 
                cryptographic proof that ensures transparency and prevents unauthorized modifications to barangay records.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Violation Summary */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#504B38]/10">
        <h3 className="text-lg font-bold text-[#504B38] mb-6">Violation Summary</h3>
        <div className="space-y-4">
          <InfoRow 
            label="Record ID"
            value={violation.id}
            mono
          />
          <InfoRow 
            label="Citizen ID"
            value={violation.citizenId}
            mono
          />
          <InfoRow 
            label="Ordinance Violated"
            value={violation.ordinanceViolated}
          />
          <InfoRow 
            label="Barangay"
            value={violation.barangay}
          />
          <InfoRow 
            label="Date of Violation"
            value={violation.date}
          />
          <InfoRow 
            label="Penalty Amount"
            value={violation.penalty || 'Not specified'}
            highlight
          />
          <InfoRow 
            label="Verification Status"
            value={violation.status}
            badge
          />
        </div>
      </div>
    </div>
  );
}

// Helper Component
function InfoRow({ label, value, mono = false, badge = false, highlight = false }: { 
  label: string; 
  value: string; 
  mono?: boolean;
  badge?: boolean;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <span className="text-sm font-medium text-gray-600">{label}</span>
      {badge ? (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
          value === 'Verified' 
            ? 'bg-emerald-100 text-emerald-700' 
            : 'bg-amber-100 text-amber-700'
        }`}>
          <ShieldCheck className="w-3 h-3 mr-1" />
          {value}
        </span>
      ) : highlight ? (
        <span className="text-sm font-bold text-amber-600">{value}</span>
      ) : (
        <span className={`text-sm font-bold text-[#504B38] ${mono ? 'font-mono' : ''}`}>{value}</span>
      )}
    </div>
  );
}
