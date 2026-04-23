import React from 'react';
import { ArrowLeft, FileText, ShieldCheck, Calendar, MapPin, ExternalLink, User, Database } from 'lucide-center';
import { Document } from '../utils/documentData';

interface PublicDocumentDetailsPageProps {
  document: Document;
  onBack: () => void;
}

// CRITICAL: Ensure this name matches the import in PublicApp.tsx exactly
export function PublicDocumentDetailsPage({ document, onBack }: PublicDocumentDetailsPageProps) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Back Navigation */}
      <button 
        onClick={onBack} 
        className="flex items-center gap-2 text-[11px] font-black text-[#09637E] hover:gap-3 transition-all uppercase tracking-widest"
      >
        <ArrowLeft size={16} /> Back to Documents Registry
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Core Data */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-10 rounded-[40px] border border-[#09637E]/10 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8">
               <Database className="text-gray-50 w-24 h-24" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-4 bg-[#EBF4F6] rounded-2xl text-[#088395]">
                  <FileText size={28} />
                </div>
                <div>
                  <span className="text-[10px] font-black text-[#088395] uppercase tracking-[0.2em]">{document.type}</span>
                  <h1 className="text-3xl font-black text-[#1C1C1C] tracking-tight leading-tight">{document.title}</h1>
                  <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-1">{document.documentId}</p>
                </div>
              </div>

              <div className="bg-gray-50/50 p-6 rounded-3xl mb-8">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Record Abstract</h4>
                <p className="text-sm font-medium text-gray-600 leading-relaxed">
                  {document.description || "This record serves as an official administrative document within the LegiChain registry for GMA, Cavite."}
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-6">
                <DetailMeta icon={<Calendar />} label="Publication Date" value={document.datePublished} />
                <DetailMeta icon={<MapPin />} label="Jurisdiction" value={document.barangay} />
                <DetailMeta icon={<User />} label="Authorized Official" value={document.publishedBy || 'System Protocol'} />
              </div>
            </div>
          </div>

          {/* Blockchain Evidence Card */}
          <div className="bg-[#1C1C1C] p-10 rounded-[40px] text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-2xl group-hover:bg-emerald-500/10 transition-all duration-700" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500 rounded-lg">
                    <ShieldCheck size={20} className="text-white" />
                  </div>
                  <h3 className="text-lg font-black uppercase tracking-widest">LegiChain Proof</h3>
                </div>
                <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-[9px] font-black uppercase tracking-widest">
                  Confirmed on Polygon
                </div>
              </div>
              
              <div className="grid gap-6">
                <ProofField label="Transaction Hash" value={document.txHash || '0x...'} />
                <ProofField label="Metadata CID (IPFS)" value={document.metadataCID || document.documentHash || 'Pending...'} isEmerald />
              </div>

              <div className="mt-10 pt-8 border-t border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest max-w-xs">
                  This cryptographic proof ensures the document has not been altered since its publication.
                </p>
                <a 
                  href={`https://amoy.polygonscan.com/tx/${document.txHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-[#1C1C1C] rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#088395] hover:text-white transition-all shadow-lg active:scale-95"
                >
                  Verify on PolygonScan <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Identity Card */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[40px] border border-[#09637E]/10 flex flex-col items-center text-center">
             <div className="w-20 h-20 bg-emerald-50 rounded-[28px] flex items-center justify-center text-emerald-600 mb-6">
                <ShieldCheck size={40} />
             </div>
             <h4 className="text-xl font-black text-[#1C1C1C] mb-2 uppercase tracking-tight">Verified Record</h4>
             <p className="text-xs text-gray-400 font-bold leading-relaxed mb-6">
               This document has been immutably sealed in the municipal ledger.
             </p>
             <div className="w-full h-1 bg-emerald-500 rounded-full mb-4 opacity-20" />
             <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Integrity Guaranteed</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper components remain internal to the file
function DetailMeta({ icon, label, value }: any) {
  return (
    <div>
      <div className="flex items-center gap-2 text-gray-300 mb-1">
        {React.cloneElement(icon, { size: 14 })}
        <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
      </div>
      <p className="text-sm font-black text-[#1C1C1C] truncate">{value || '---'}</p>
    </div>
  );
}

function ProofField({ label, value, isEmerald = false }: any) {
  return (
    <div>
      <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">{label}</label>
      <div className={`mt-2 p-4 bg-white/5 rounded-2xl font-mono text-[10px] break-all border border-white/5 ${isEmerald ? 'text-emerald-400' : 'text-gray-300'}`}>
        {value}
      </div>
    </div>
  );
}