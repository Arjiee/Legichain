import React from 'react';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Copy, 
  Check,
  ExternalLink,
  Clock,
  User,
  FileText,
  AlertTriangle,
  Layers,
  Zap,
  DollarSign
} from 'lucide-react';
import { BlockchainTransaction } from '../utils/blockchainData';
import { toast } from 'sonner';

interface BlockchainTransactionDetailsPageProps {
  transaction: BlockchainTransaction;
  onBack: () => void;
}

export function BlockchainTransactionDetailsPage({ transaction, onBack }: BlockchainTransactionDetailsPageProps) {
  const [copiedHash, setCopiedHash] = React.useState(false);
  const [copiedBlock, setCopiedBlock] = React.useState(false);
  const [copiedPrevHash, setCopiedPrevHash] = React.useState(false);
  const [copiedContract, setCopiedContract] = React.useState(false);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    
    if (type === 'hash') setCopiedHash(true);
    if (type === 'block') setCopiedBlock(true);
    if (type === 'prevHash') setCopiedPrevHash(true);
    if (type === 'contract') setCopiedContract(true);

    setTimeout(() => {
      setCopiedHash(false);
      setCopiedBlock(false);
      setCopiedPrevHash(false);
      setCopiedContract(false);
    }, 2000);

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
        Back to Blockchain Explorer
      </button>

      {/* Header */}
      <div className="bg-gradient-to-br from-[#EBE5C2] to-[#F8F3D9] p-8 rounded-3xl border border-[#504B38]/10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-xl shadow-lg ${
              transaction.verificationStatus === 'Verified' ? 'bg-emerald-500' :
              transaction.verificationStatus === 'Pending' ? 'bg-amber-500' :
              'bg-red-500'
            }`}>
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-[#504B38]">Blockchain Transaction Details</h1>
              <p className="text-xs text-gray-600 font-medium mt-1">Complete blockchain record information</p>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-full text-sm font-bold ${
            transaction.verificationStatus === 'Verified' ? 'bg-emerald-100 text-emerald-700' :
            transaction.verificationStatus === 'Pending' ? 'bg-amber-100 text-amber-700' :
            'bg-red-100 text-red-700'
          }`}>
            {transaction.verificationStatus}
          </div>
        </div>

        {/* Transaction Info Pills */}
        <div className="flex flex-wrap gap-3">
          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold ${
            transaction.recordType === 'Ordinance Record' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
          }`}>
            {transaction.recordType}
          </span>
          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold ${
            transaction.actionRecorded === 'Created' ? 'bg-green-100 text-green-700' :
            transaction.actionRecorded === 'Updated' ? 'bg-amber-100 text-amber-700' :
            transaction.actionRecorded === 'Verified' ? 'bg-purple-100 text-purple-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            {transaction.actionRecorded}
          </span>
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-orange-100 text-orange-700">
            {transaction.barangay}
          </span>
        </div>
      </div>

      {/* Main Transaction Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Transaction Hash */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#504B38]/10">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Transaction Hash</label>
              <button
                onClick={() => copyToClipboard(transaction.txHash, 'hash')}
                className="inline-flex items-center text-xs font-bold text-[#B9B28A] hover:text-[#504B38] transition-colors cursor-pointer"
              >
                {copiedHash ? <><Check className="w-3 h-3 mr-1" />Copied!</> : <><Copy className="w-3 h-3 mr-1" />Copy</>}
              </button>
            </div>
            <div className="bg-[#F8F3D9] p-4 rounded-xl">
              <code className="text-xs font-mono text-[#504B38] break-all">{transaction.txHash}</code>
            </div>
          </div>

          {/* Block Number */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#504B38]/10">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Layers className="w-5 h-5 text-blue-600" />
              </div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Block Number</label>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black text-[#504B38] font-mono">#{transaction.blockNumber}</span>
              <button
                onClick={() => copyToClipboard(transaction.blockNumber, 'block')}
                className="inline-flex items-center px-3 py-1.5 bg-[#B9B28A] text-white text-xs font-bold rounded-lg hover:bg-[#504B38] transition-colors cursor-pointer"
              >
                {copiedBlock ? <><Check className="w-3 h-3 mr-1" />Copied</> : <><Copy className="w-3 h-3 mr-1" />Copy</>}
              </button>
            </div>
          </div>

          {/* Previous Block Hash */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#504B38]/10">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Previous Block Hash</label>
              <button
                onClick={() => copyToClipboard(transaction.previousBlockHash, 'prevHash')}
                className="inline-flex items-center text-xs font-bold text-[#B9B28A] hover:text-[#504B38] transition-colors cursor-pointer"
              >
                {copiedPrevHash ? <><Check className="w-3 h-3 mr-1" />Copied!</> : <><Copy className="w-3 h-3 mr-1" />Copy</>}
              </button>
            </div>
            <div className="bg-[#F8F3D9] p-4 rounded-xl">
              <code className="text-xs font-mono text-[#504B38] break-all">{transaction.previousBlockHash}</code>
            </div>
          </div>

          {/* Smart Contract */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#504B38]/10">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Smart Contract Address</label>
              <button
                onClick={() => copyToClipboard(transaction.smartContractAddress, 'contract')}
                className="inline-flex items-center text-xs font-bold text-[#B9B28A] hover:text-[#504B38] transition-colors cursor-pointer"
              >
                {copiedContract ? <><Check className="w-3 h-3 mr-1" />Copied!</> : <><Copy className="w-3 h-3 mr-1" />Copy</>}
              </button>
            </div>
            <div className="bg-[#F8F3D9] p-4 rounded-xl">
              <code className="text-xs font-mono text-[#504B38] break-all">{transaction.smartContractAddress}</code>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Record Information */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#504B38]/10">
            <h3 className="text-lg font-bold text-[#504B38] mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#B9B28A]" />
              Record Information
            </h3>
            <div className="space-y-3">
              {transaction.ordinanceId && (
                <InfoRow label="Ordinance ID" value={transaction.ordinanceId} mono />
              )}
              {transaction.violationCaseId && (
                <InfoRow label="Violation Case ID" value={transaction.violationCaseId} mono />
              )}
              {transaction.ordinanceTitle && (
                <InfoRow label="Ordinance Title" value={transaction.ordinanceTitle} />
              )}
              {transaction.violationType && (
                <InfoRow label="Violation Type" value={transaction.violationType} />
              )}
              <InfoRow label="Barangay" value={transaction.barangay} />
              <InfoRow label="Record Type" value={transaction.recordType} badge />
              <InfoRow label="Action" value={transaction.actionRecorded} badge />
            </div>
          </div>

          {/* Transaction Metadata */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#504B38]/10">
            <h3 className="text-lg font-bold text-[#504B38] mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#B9B28A]" />
              Transaction Metadata
            </h3>
            <div className="space-y-3">
              <InfoRow 
                label="Timestamp" 
                value={new Date(transaction.timestamp).toLocaleString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                })} 
              />
              <InfoRow label="Recorded By" value={transaction.recordedBy} icon={<User className="w-4 h-4 text-gray-400" />} />
              <InfoRow label="Verification Status" value={transaction.verificationStatus} badge />
            </div>
          </div>

          {/* Gas Information */}
          {transaction.gasUsed && transaction.gasPrice && (
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#504B38]/10">
              <h3 className="text-lg font-bold text-[#504B38] mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#B9B28A]" />
                Gas Information
              </h3>
              <div className="space-y-3">
                <InfoRow label="Gas Used" value={`${parseInt(transaction.gasUsed).toLocaleString()} units`} />
                <InfoRow label="Gas Price" value={`${transaction.gasPrice} Gwei`} />
                <InfoRow 
                  label="Transaction Fee" 
                  value={`${(parseInt(transaction.gasUsed) * parseFloat(transaction.gasPrice) / 1e9).toFixed(8)} ETH`}
                  icon={<DollarSign className="w-4 h-4 text-emerald-600" />}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Verification Banner */}
      <div className={`p-6 rounded-3xl border-2 ${
        transaction.verificationStatus === 'Verified' 
          ? 'bg-emerald-50 border-emerald-200' 
          : transaction.verificationStatus === 'Pending'
          ? 'bg-amber-50 border-amber-200'
          : 'bg-red-50 border-red-200'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ShieldCheck className={`w-6 h-6 ${
              transaction.verificationStatus === 'Verified' ? 'text-emerald-600' :
              transaction.verificationStatus === 'Pending' ? 'text-amber-600' :
              'text-red-600'
            }`} />
            <div>
              <h4 className={`font-bold ${
                transaction.verificationStatus === 'Verified' ? 'text-emerald-900' :
                transaction.verificationStatus === 'Pending' ? 'text-amber-900' :
                'text-red-900'
              }`}>
                {transaction.verificationStatus === 'Verified' ? 'Transaction Verified on Blockchain' :
                 transaction.verificationStatus === 'Pending' ? 'Transaction Pending Verification' :
                 'Transaction Verification Failed'}
              </h4>
              <p className="text-xs text-gray-600 font-medium mt-1">
                {transaction.verificationStatus === 'Verified' 
                  ? 'This transaction has been permanently recorded and verified on the blockchain.'
                  : transaction.verificationStatus === 'Pending'
                  ? 'This transaction is currently being processed and verified.'
                  : 'This transaction could not be verified. Please check the details.'}
              </p>
            </div>
          </div>
          <button className="inline-flex items-center px-4 py-2 bg-[#B9B28A] text-white text-xs font-bold rounded-xl hover:bg-[#504B38] transition-colors cursor-pointer">
            <ExternalLink className="w-4 h-4 mr-2" />
            View on Explorer
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper component
function InfoRow({ label, value, mono = false, badge = false, icon }: any) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
      <span className="text-xs font-medium text-gray-500 flex items-center gap-2">
        {icon}
        {label}
      </span>
      {badge ? (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold ${
          value === 'Verified' ? 'bg-emerald-100 text-emerald-700' :
          value === 'Pending' ? 'bg-amber-100 text-amber-700' :
          value === 'Failed' ? 'bg-red-100 text-red-700' :
          value === 'Created' ? 'bg-green-100 text-green-700' :
          value === 'Updated' ? 'bg-amber-100 text-amber-700' :
          value === 'Verified' ? 'bg-purple-100 text-purple-700' :
          value === 'Archived' ? 'bg-gray-100 text-gray-700' :
          value === 'Ordinance Record' ? 'bg-blue-100 text-blue-700' :
          value === 'Violation Case' ? 'bg-purple-100 text-purple-700' :
          'bg-gray-100 text-gray-700'
        }`}>
          {value}
        </span>
      ) : (
        <span className={`text-sm font-bold text-[#504B38] text-right ${mono ? 'font-mono' : ''}`}>
          {value}
        </span>
      )}
    </div>
  );
}
