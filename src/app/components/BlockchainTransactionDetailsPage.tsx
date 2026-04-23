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
  Layers,
  Zap,
  DollarSign,
  Database,
  Hash
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
  const [copiedCID, setCopiedCID] = React.useState(false);
  const [copiedContract, setCopiedContract] = React.useState(false);

  // Helper for empty values
  const getValue = (val: any) => val || '---';

  const copyToClipboard = (text: string, type: string) => {
    if (!text || text === '---' || text === '0x...') return;
    navigator.clipboard.writeText(text);
    
    if (type === 'hash') setCopiedHash(true);
    if (type === 'block') setCopiedBlock(true);
    if (type === 'cid') setCopiedCID(true);
    if (type === 'contract') setCopiedContract(true);

    setTimeout(() => {
      setCopiedHash(false);
      setCopiedBlock(false);
      setCopiedCID(false);
      setCopiedContract(false);
    }, 2000);

    toast.success('Proof copied to clipboard!');
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center text-sm font-black text-[#504B38] hover:text-[#B9B28A] transition-colors cursor-pointer group"
      >
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Blockchain Explorer
      </button>

      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#EBE5C2] to-[#F8F3D9] p-8 rounded-3xl border border-[#504B38]/10 shadow-sm">
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
              <h1 className="text-2xl font-black text-[#504B38]">Cryptographic Proof</h1>
              <p className="text-xs text-gray-600 font-medium mt-1 uppercase tracking-widest">Protocol ID: {transaction.ordinanceId || transaction.id}</p>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${
            transaction.verificationStatus === 'Verified' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
            transaction.verificationStatus === 'Pending' ? 'bg-amber-100 text-amber-700 border-amber-200' :
            'bg-red-100 text-red-700 border-red-200'
          }`}>
            {transaction.verificationStatus}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-white/50 text-[#504B38] border border-[#504B38]/10 shadow-sm`}>
            <Database className="w-3 h-3 mr-2" />
            {transaction.recordType}
          </span>
          <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-[#504B38] text-white`}>
            {transaction.actionRecorded}
          </span>
          <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-orange-100 text-orange-700 border border-orange-200">
            {transaction.barangay}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Required Cryptographic Data */}
        <div className="space-y-6">
          {/* 1. Transaction Hash */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#504B38]/10">
            <div className="flex items-center justify-between mb-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Transaction Hash</label>
              <button
                onClick={() => copyToClipboard(transaction.txHash, 'hash')}
                className="inline-flex items-center text-xs font-bold text-[#B9B28A] hover:text-[#504B38] transition-colors"
              >
                {copiedHash ? <><Check size={12} className="mr-1" />Copied!</> : <><Copy size={12} className="mr-1" />Copy</>}
              </button>
            </div>
            <div className="bg-[#F8F3D9] p-4 rounded-xl border border-[#504B38]/5">
              <code className="text-xs font-mono font-bold text-[#504B38] break-all">{getValue(transaction.txHash)}</code>
            </div>
          </div>

          {/* 2. Confirmation Block (Block Height) */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#504B38]/10">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                <Layers className="w-5 h-5" />
              </div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Confirmation Block Height</label>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-black text-[#504B38] font-mono tracking-tighter">#{getValue(transaction.blockNumber)}</span>
              <button
                onClick={() => copyToClipboard(transaction.blockNumber || '', 'block')}
                className="inline-flex items-center px-5 py-2 bg-[#B9B28A] text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-[#504B38] transition-all"
              >
                {copiedBlock ? 'Copied' : 'Copy Block'}
              </button>
            </div>
          </div>

          {/* 3. Metadata CID (IPFS Hash) */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#504B38]/10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Hash className="w-3 h-3 text-[#B9B28A]" />
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Metadata CID (IPFS Hash)</label>
              </div>
              <button
                onClick={() => copyToClipboard(transaction.previousBlockHash || '', 'cid')}
                className="inline-flex items-center text-xs font-bold text-[#B9B28A] hover:text-[#504B38] transition-colors"
              >
                {copiedCID ? <><Check size={12} className="mr-1" />Copied!</> : <><Copy size={12} className="mr-1" />Copy CID</>}
              </button>
            </div>
            <div className="bg-[#F8F3D9] p-4 rounded-xl border border-[#504B38]/5">
              <code className="text-xs font-mono font-bold text-[#504B38] break-all">{transaction.previousBlockHash || 'Pending Sync...'}</code>
            </div>
          </div>

          {/* Smart Contract Authority */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#504B38]/10">
            <div className="flex items-center justify-between mb-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Polygon Contract Authority</label>
              <button
                onClick={() => copyToClipboard(transaction.smartContractAddress || '0x331a62DAb90228ec326DA48Db5600fA77dD36bBe', 'contract')}
                className="inline-flex items-center text-xs font-bold text-[#B9B28A] hover:text-[#504B38] transition-colors"
              >
                {copiedContract ? <Check size={12} /> : <Copy size={12} />}
              </button>
            </div>
            <div className="bg-[#F8F3D9] p-4 rounded-xl border border-[#504B38]/5">
              <code className="text-xs font-mono font-bold text-[#504B38] break-all">{transaction.smartContractAddress || '0x331a62DAb90228ec326DA48Db5600fA77dD36bBe'}</code>
            </div>
          </div>
        </div>

        {/* Right Column - Metadata Info */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[40px] shadow-sm border border-[#504B38]/10">
            <h3 className="text-lg font-black text-[#504B38] mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#B9B28A]" />
              Record Metadata
            </h3>
            <div className="space-y-4">
              <InfoRow label="Protocol Identity" value={transaction.ordinanceId || transaction.id} mono />
              <InfoRow label="Record Title" value={transaction.ordinanceTitle || 'Project Registry'} />
              <InfoRow label="Origin Barangay" value={transaction.barangay} />
              <InfoRow label="Classification" value={transaction.recordType} badge />
              <InfoRow label="Finality Status" value={transaction.verificationStatus} badge />
            </div>
          </div>

          <div className="bg-white p-8 rounded-[40px] shadow-sm border border-[#504B38]/10">
            <h3 className="text-lg font-black text-[#504B38] mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#B9B28A]" />
              Temporal Metadata
            </h3>
            <div className="space-y-4">
              <InfoRow 
                label="Creation Timestamp" 
                value={new Date(transaction.timestamp).toLocaleString('en-US', {
                  year: 'numeric', month: 'long', day: 'numeric',
                  hour: '2-digit', minute: '2-digit'
                })} 
              />
              <InfoRow label="Recording Entity" value={transaction.recordedBy || 'System Protocol'} icon={<User className="w-4 h-4 text-gray-300" />} />
              <InfoRow label="Network Protocol" value="Polygon POS Amoy" />
            </div>
          </div>

          {/* Gas Consumption Info */}
          <div className="bg-[#504B38] p-8 rounded-[40px] text-white shadow-xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full -mr-16 -mt-16" />
             <h3 className="text-lg font-black mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#B9B28A]" />
              Protocol Consumption
            </h3>
            <div className="space-y-4">
               <div className="flex justify-between items-center py-2 border-b border-white/10">
                 <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Execution Fee</span>
                 <span className="text-xs font-black text-[#EBE5C2]">0.00042 MATIC</span>
               </div>
               <div className="flex justify-between items-center py-2">
                 <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Finality Time</span>
                 <span className="text-xs font-black text-[#EBE5C2]">~2.1 Seconds</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Verification Proof Banner */}
      <div className={`p-8 rounded-[40px] border-2 shadow-sm ${
        transaction.verificationStatus === 'Verified' 
          ? 'bg-emerald-50 border-emerald-200' 
          : 'bg-amber-50 border-amber-200'
      }`}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className={`p-4 rounded-full ${
               transaction.verificationStatus === 'Verified' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
            }`}>
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <h4 className={`text-xl font-black ${
                transaction.verificationStatus === 'Verified' ? 'text-emerald-900' : 'text-amber-900'
              }`}>
                {transaction.verificationStatus === 'Verified' ? 'Immutability Confirmed' : 'Sync in Progress'}
              </h4>
              <p className="text-xs text-gray-600 font-bold mt-1 max-w-md">
                This record is secured by the Metadata CID. The actual project data is stored on IPFS, while the cryptographic proof is anchored to the Polygon network.
              </p>
            </div>
          </div>
          <a 
            href={transaction.blockExplorerUrl || `https://amoy.polygonscan.com/tx/${transaction.txHash}`}
            target="_blank"
            rel="noreferrer"
            className="w-full md:w-auto inline-flex items-center justify-center px-8 py-4 bg-[#B9B28A] text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-[#504B38] transition-all shadow-lg active:scale-95"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            PolygonScan Proof
          </a>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value, mono = false, badge = false, icon }: any) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[#504B38]/5 last:border-0">
      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
        {icon}
        {label}
      </span>
      {badge ? (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${
          value === 'Verified' || value === 'Verified on Chain' ? 'bg-emerald-100 text-emerald-700' :
          value === 'Pending' ? 'bg-amber-100 text-amber-700' :
          value === 'Ordinance Record' ? 'bg-blue-100 text-blue-700' :
          value === 'Project Record' ? 'bg-indigo-100 text-indigo-700' :
          'bg-gray-100 text-gray-700'
        }`}>
          {value}
        </span>
      ) : (
        <span className={`text-xs font-black text-[#504B38] text-right max-w-[220px] truncate ${mono ? 'font-mono' : ''}`}>
          {value}
        </span>
      )}
    </div>
  );
}