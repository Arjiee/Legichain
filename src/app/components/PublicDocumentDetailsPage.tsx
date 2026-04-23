import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, FileText, ShieldCheck, Calendar, 
  MapPin, ExternalLink, User, Database, Eye, 
  Maximize2, AlertCircle, Copy, CheckCircle2
} from 'lucide-react'; 
import { Document } from '../utils/documentData';
import { PINATA_CONFIG } from '../config/web3Config';

interface PublicDocumentDetailsPageProps {
  document: Document;
  onBack: () => void;
}

export function PublicDocumentDetailsPage({ document, onBack }: PublicDocumentDetailsPageProps) {
  const [imgError, setImgError] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // 1. DATA RESOLUTION (Matched to your Log)
  
  // Your log shows the image is in 'images' key as a string: "ipfs://..."
  const rawImage = (document as any).images || document.documentImage;
  const imageUrl = rawImage 
    ? `${PINATA_CONFIG.gateway}${rawImage.replace('ipfs://', '')}`
    : null;

  // Your log shows txHash is "0x..."
  const txHash = document.txHash;
  const isPlaceholderHash = txHash === "0x..." || !txHash;

  // Your log shows CID is in 'metadataCID'
  const cid = document.metadataCID || document.documentHash || (document as any).ipfsHash;

  const handleCopy = (text: string, field: string) => {
    if (!text || text === '---' || text === '0x...') return;
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button 
        onClick={onBack} 
        className="flex items-center gap-2 text-[11px] font-black text-[#09637E] hover:gap-3 transition-all uppercase tracking-widest cursor-pointer group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
        Back to Documents Registry
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white p-10 rounded-[40px] border border-[#09637E]/10 shadow-sm relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-10">
                <div className="p-5 bg-[#EBF4F6] rounded-[24px] text-[#088395] shadow-inner">
                  <FileText size={32} />
                </div>
                <div>
                  <span className="text-[10px] font-black text-[#088395] uppercase tracking-[0.25em] mb-1 block">{document.type}</span>
                  <h1 className="text-3xl font-black text-[#1C1C1C] tracking-tight leading-tight">{document.title}</h1>
                  <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-1">ID: {document.documentId}</p>
                </div>
              </div>

              {/* IMAGE SECTION */}
              <div className="mb-10">
                {imageUrl && !imgError ? (
                  <div className="group relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#088395] to-emerald-500 rounded-[32px] blur opacity-10"></div>
                    <div className="relative bg-gray-50 rounded-[30px] border-2 border-gray-100 overflow-hidden shadow-inner flex items-center justify-center min-h-[350px]">
                      <img 
                        src={imageUrl} 
                        alt="Registry Source" 
                        className="w-full h-auto max-h-[600px] object-contain mx-auto"
                        onError={() => setImgError(true)}
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <a href={imageUrl} target="_blank" className="px-6 py-3 bg-white rounded-xl text-[10px] font-black uppercase">View on IPFS</a>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-16 bg-gray-50 rounded-[30px] border-2 border-dashed border-gray-200 text-center">
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No Image Preview</p>
                  </div>
                )}
              </div>

              <div className="bg-gray-50/50 p-8 rounded-3xl mb-8 border border-gray-100 italic text-gray-600 text-sm">
                "{document.description}"
              </div>

              <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-50">
                <DetailMeta label="Barangay" value={document.barangay} />
                <DetailMeta label="Date" value={document.datePublished} />
                <DetailMeta label="Official" value={document.publishedBy} />
              </div>
            </div>
          </div>

          {/* PROTOCOL EVIDENCE SECTION */}
          <div className="bg-[#1C1C1C] p-10 rounded-[40px] text-white shadow-2xl relative overflow-hidden border border-white/5">
            <div className="relative z-10 space-y-8">
              <div className="flex items-center justify-between">
                 <h3 className="text-lg font-black uppercase tracking-widest">Protocol Evidence</h3>
                 <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-[8px] font-black uppercase">Polygon Amoy</div>
              </div>

              <div className="grid gap-6">
                {/* TX HASH */}
                <ProofField 
                  label="Transaction Hash (TxID)" 
                  value={txHash || '---'} 
                  isCopyable 
                  onCopy={() => handleCopy(txHash || '', 'tx')}
                  isCopied={copiedField === 'tx'}
                  warning={isPlaceholderHash}
                />

                {/* CID */}
                <ProofField 
                  label="Content CID (IPFS Hash)" 
                  value={cid || '---'} 
                  isEmerald 
                  isCopyable 
                  onCopy={() => handleCopy(cid || '', 'cid')}
                  isCopied={copiedField === 'cid'}
                />
              </div>

              {/* POLYGONSCAN BUTTON */}
              {!isPlaceholderHash ? (
                <a 
                  href={`https://amoy.polygonscan.com/tx/${txHash}`} 
                  target="_blank" 
                  className="mt-6 flex items-center justify-center gap-2 w-full py-4 bg-white text-black rounded-2xl text-[10px] font-black uppercase hover:bg-emerald-500 hover:text-white transition-all"
                >
                  Verify on PolygonScan <ExternalLink size={14} />
                </a>
              ) : (
                <div className="mt-6 p-4 bg-white/5 rounded-2xl border border-white/5 text-center text-[9px] text-gray-500 font-bold uppercase italic">
                  Blockchain Receipt Pending (Update txHash in Database)
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Status Column */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[40px] border border-[#09637E]/10 text-center shadow-sm">
             <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mx-auto mb-4">
                <ShieldCheck size={32} />
             </div>
             <h4 className="text-lg font-black text-[#1C1C1C] uppercase tracking-tight">Verified</h4>
             <p className="text-[10px] text-gray-400 font-bold leading-relaxed mt-2">Permanently sealed in the municipal ledger.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Internal Helpers
function DetailMeta({ label, value }: any) {
  return (
    <div>
      <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest block mb-1">{label}</span>
      <p className="text-sm font-black text-[#1C1C1C] truncate">{value || '---'}</p>
    </div>
  );
}

function ProofField({ label, value, isEmerald = false, warning = false, isCopyable = false, onCopy = () => {}, isCopied = false }: any) {
  return (
    <div className="group/field">
      <div className="flex justify-between mb-2">
        <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">{label}</label>
        {isCopyable && value && value !== '---' && value !== '0x...' && (
          <button onClick={onCopy} className="text-white/20 hover:text-white transition-colors cursor-pointer">
            {isCopied ? <CheckCircle2 size={12} className="text-emerald-400" /> : <Copy size={12} />}
          </button>
        )}
      </div>
      <div className={`p-4 bg-white/5 rounded-xl font-mono text-[10px] break-all border border-white/5 ${isEmerald ? 'text-emerald-400' : 'text-gray-400'} ${warning ? 'border-amber-500/20 italic text-white/20' : ''}`}>
        {value}
      </div>
    </div>
  );
}