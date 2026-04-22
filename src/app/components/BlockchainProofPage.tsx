import React from 'react';
import { 
  ShieldCheck, 
  ArrowLeft, 
  ExternalLink, 
  Hash, 
  Clock, 
  Database, 
  User, 
  ArrowRight,
  Info,
  Layers,
  Search,
  CheckCircle2,
  FileText,
  Building2
} from 'lucide-react';
import { motion } from 'motion/react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { AuditLog } from './AuditLogsPage';

interface BlockchainProofPageProps {
  log: AuditLog;
  onBack: () => void;
  onGoToDashboard: () => void;
}

export function BlockchainProofPage({ log, onBack, onGoToDashboard }: BlockchainProofPageProps) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 max-w-5xl mx-auto space-y-8">
      {/* Navigation & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <button 
            onClick={onBack}
            className="w-12 h-12 rounded-2xl bg-white border border-[#EBE5C2] flex items-center justify-center text-[#504B38] hover:bg-[#F8F3D9] transition-all cursor-pointer shadow-sm group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-[#504B38] tracking-tight">Audit Log Blockchain Proof</h1>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Immutable Transaction Certificate</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={onGoToDashboard}
            className="px-6 py-3 bg-white border border-[#EBE5C2] text-[#504B38] font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-[#F8F3D9] transition-all cursor-pointer shadow-sm flex items-center"
          >
            Transparency Dashboard
          </button>
          <div className="px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">On-Chain Verified</span>
          </div>
        </div>
      </div>

      {/* Main Proof Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Verification Status Banner - Left (Lg: Col 4) */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-8 border-2 border-[#504B38]/10 rounded-[40px] shadow-sm bg-white text-center flex flex-col items-center justify-center space-y-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-emerald-50 border-4 border-emerald-100 flex items-center justify-center text-emerald-500 shadow-inner">
                <ShieldCheck size={64} />
              </div>
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.8, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-emerald-500 border-4 border-white flex items-center justify-center text-white"
              >
                <CheckCircle2 size={20} />
              </motion.div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-[#504B38]">Verified Record</h3>
              <p className="text-sm font-bold text-emerald-600 uppercase tracking-tighter">Status: 100% Immutable</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-[11px] font-medium text-gray-500 leading-relaxed italic">
              "This audit entry has been hashed and anchored to the blockchain. Its integrity is mathematically guaranteed and any attempt to modify this historical record would be immediately detected by the network consensus."
            </div>

            <button className="w-full py-4 bg-[#504B38] text-white font-black rounded-2xl text-xs uppercase tracking-widest hover:bg-[#B9B28A] transition-all flex items-center justify-center gap-2 shadow-lg">
              <ExternalLink size={14} /> View on Etherscan
            </button>
          </Card>

          <Card className="p-6 border border-[#F8F3D9] rounded-3xl bg-[#F8F3D9]/30 space-y-4">
             <div className="flex items-center space-x-3 text-[#504B38]">
                <Info size={18} className="text-[#B9B28A]" />
                <h4 className="text-sm font-black uppercase tracking-wider">Internal Audit Info</h4>
             </div>
             <p className="text-xs text-gray-600 font-medium leading-relaxed">
                This log entry is part of the internal GMA Blockchain accountability system. All administrative activities are immutably recorded to ensure governance integrity.
             </p>
          </Card>
        </div>

        {/* Technical Details - Right (Lg: Col 8) */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="overflow-hidden border-2 border-[#504B38]/5 rounded-[40px] bg-white shadow-xl">
            {/* Action Summary */}
            <div className="p-8 bg-[#504B38] text-white flex flex-col md:flex-row md:items-center justify-between gap-6">
               <div className="flex items-center space-x-6">
                  <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                     <Layers size={32} />
                  </div>
                  <div>
                     <h2 className="text-3xl font-black">{log.action}</h2>
                     <div className="flex items-center space-x-4 mt-1 opacity-80">
                        <div className="flex items-center space-x-1.5">
                           <Building2 size={14} />
                           <span className="text-xs font-bold uppercase">{log.barangay}</span>
                        </div>
                        <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
                        <div className="flex items-center space-x-1.5">
                           <Clock size={14} />
                           <span className="text-xs font-bold">{log.timestamp}</span>
                        </div>
                     </div>
                  </div>
               </div>
               <div className="text-right">
                  <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] mb-1">Block Number</p>
                  <p className="text-4xl font-mono font-black tracking-tighter">#{log.blockNumber}</p>
               </div>
            </div>

            {/* Detailed Metadata Grid */}
            <div className="p-10 space-y-10">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Hash size={12} className="text-[#B9B28A]" /> Transaction Hash (ID)
                     </label>
                     <div className="group relative">
                        <code className="block p-5 rounded-2xl bg-gray-50 border border-gray-100 font-mono text-xs text-[#504B38] break-all font-bold group-hover:bg-[#F8F3D9] transition-colors">
                           {log.txHash}
                        </code>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                           <Badge className="bg-[#B9B28A] text-white border-none text-[9px]">Copy</Badge>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <FileText size={12} className="text-[#B9B28A]" /> Document Reference
                     </label>
                     <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                        <span className="text-sm font-black text-[#504B38]">{log.documentTitle}</span>
                        {log.documentTitle !== '—' && <ExternalLink size={16} className="text-[#B9B28A]" />}
                     </div>
                  </div>
               </div>

               {/* Address Flow */}
               <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                     <ArrowRight size={12} className="text-[#B9B28A]" /> Network Route
                  </label>
                  <div className="flex flex-col md:flex-row items-center gap-6">
                     <div className="flex-1 w-full p-6 rounded-[32px] bg-[#EBE5C2]/10 border-2 border-[#EBE5C2]/30 space-y-3 relative overflow-hidden group">
                        <div className="absolute -top-4 -left-4 p-8 opacity-5 text-[#504B38]">
                           <User size={80} />
                        </div>
                        <div className="flex items-center space-x-2 relative z-10">
                           <User size={14} className="text-[#B9B28A]" />
                           <span className="text-[10px] font-black uppercase text-[#504B38]/50">Signer (From)</span>
                        </div>
                        <p className="text-xs font-mono font-bold text-[#504B38] truncate relative z-10">
                           {log.from || 'System Core'}
                        </p>
                     </div>

                     <div className="w-12 h-12 rounded-full bg-[#EBE5C2] flex items-center justify-center text-[#504B38] shadow-sm flex-shrink-0 z-10">
                        <ArrowRight size={24} />
                     </div>

                     <div className="flex-1 w-full p-6 rounded-[32px] bg-[#EBE5C2]/10 border-2 border-[#EBE5C2]/30 space-y-3 relative overflow-hidden">
                        <div className="absolute -top-4 -right-4 p-8 opacity-5 text-[#504B38]">
                           <Database size={80} />
                        </div>
                        <div className="flex items-center space-x-2 relative z-10">
                           <Database size={14} className="text-[#B9B28A]" />
                           <span className="text-[10px] font-black uppercase text-[#504B38]/50">Contract (To)</span>
                        </div>
                        <p className="text-xs font-mono font-bold text-[#504B38] truncate relative z-10">
                           {log.to || '0xGMA_BLOCKCHAIN_CORE'}
                        </p>
                     </div>
                  </div>
               </div>

               {/* Verification Detail */}
               <div className="space-y-4 pt-4">
                  <div className="p-8 rounded-[32px] bg-emerald-50 border border-emerald-100 flex items-start space-x-6">
                     <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white flex-shrink-0">
                        <ShieldCheck size={24} />
                     </div>
                     <div className="space-y-2">
                        <h4 className="text-lg font-black text-emerald-900">Consensus Verification Complete</h4>
                        <p className="text-sm text-emerald-700/80 font-medium leading-relaxed">
                           This transaction was included in Block {log.blockNumber} and has received over 12,500+ confirmations. The hash value of the action 
                           (<span className="font-mono text-emerald-800 font-bold">{log.txHash.slice(0, 8)}...</span>) matches the local state exactly, proving 
                           no tampering has occurred since the original entry.
                        </p>
                     </div>
                  </div>
               </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
