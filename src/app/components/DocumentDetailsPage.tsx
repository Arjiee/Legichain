import React, { useState } from 'react';
import { 
  ArrowLeft, 
  FileText, 
  ShieldCheck, 
  Calendar, 
  User,
  AlertTriangle,
  Download,
  Copy,
  Check,
  ExternalLink,
  Tag,
  Edit,
  Archive,
  Clock,
  MapPin,
  Database,
  Eye
} from 'lucide-react';
import { Document } from '../utils/documentData';
import { toast } from 'sonner';

interface DocumentDetailsPageProps {
  document: Document;
  onBack: () => void;
  onEdit?: (doc: Document) => void;
  onArchive?: (doc: Document) => void;
  onVerify?: (doc: Document) => void;
  isAdmin?: boolean;
}

export function DocumentDetailsPage({ 
  document, 
  onBack, 
  onEdit, 
  onArchive, 
  onVerify,
  isAdmin = false 
}: DocumentDetailsPageProps) {
  const [copiedHash, setCopiedHash] = useState(false);
  const [copiedBlock, setCopiedBlock] = useState(false);
  const [copiedDocId, setCopiedDocId] = useState(false);
  const [copiedCID, setCopiedCID] = useState(false);

  // --- DATA RESOLUTION ---
  // FIXED: Forces direct strict evaluation of real txHash strings to prevent "0x... (Awaiting Sync)" masks
  const resolvedTxHash = document.txHash && document.txHash !== '0x...' 
                         ? document.txHash 
                         : (document as any).transactionHash || 
                           (document as any).hash || 
                           document.tags?.find(t => t.startsWith('0x'));

  const resolvedCID = document.metadataCID || 
                      document.documentHash || 
                      (document as any).ipfsHash || 
                      (document as any).cid;

  const resolvedBlock = document.block || (document as any).blockNumber;
  
  const isSealed = (document.blockchainStatus === 'Verified' || (resolvedTxHash && resolvedTxHash !== '0x...'));

  const copyToClipboard = (text: string, type: string) => {
    if (!text || text === '---' || text === '0x...') return;
    navigator.clipboard.writeText(text);
    
    if (type === 'hash') setCopiedHash(true);
    if (type === 'block') setCopiedBlock(true);
    if (type === 'docId') setCopiedDocId(true);
    if (type === 'cid') setCopiedCID(true);

    setTimeout(() => {
      setCopiedHash(false);
      setCopiedBlock(false);
      setCopiedDocId(false);
      setCopiedCID(false);
    }, 2000);

    toast.success('Copied to clipboard!');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center text-sm font-bold text-[#504B38] hover:text-[#B9B28A] transition-colors cursor-pointer group"
      >
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Documents Registry
      </button>

      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#EBE5C2] to-[#F8F3D9] p-8 rounded-3xl border border-[#504B38]/10 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-6">
          <div className="flex items-center space-x-4 flex-1">
            <div className="p-4 bg-white rounded-2xl shadow-md">
              <FileText className="w-8 h-8 text-[#B9B28A]" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-2xl font-black text-[#504B38] tracking-tight">{document.title}</h1>
                <button
                  onClick={() => copyToClipboard(document.documentId, 'docId')}
                  className="inline-flex items-center px-2 py-1 bg-white/50 rounded-lg text-[10px] font-bold text-[#B9B28A] hover:text-[#504B38] transition-colors cursor-pointer"
                >
                  {copiedDocId ? <><Check className="w-3 h-3 mr-1" />Copied!</> : <><Copy className="w-3 h-3 mr-1" />{document.documentId}</>}
                </button>
              </div>
              <p className="text-xs text-[#504B38]/60 font-bold uppercase tracking-widest">{document.type || 'Official Record'}</p>
            </div>
          </div>

          {/* Administrative Control Triggers */}
          {isAdmin && (
            <div className="flex items-center gap-2 self-start sm:self-auto">
              {onEdit && (
                <button
                  onClick={() => onEdit(document)}
                  className="px-4 py-2 bg-white border border-[#B9B28A] text-[#B9B28A] text-xs font-bold rounded-xl hover:bg-[#B9B28A] hover:text-white transition-colors cursor-pointer inline-flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" /> Edit
                </button>
              )}
              {onVerify && !isSealed && (
                <button
                  onClick={() => onVerify(document)}
                  className="px-4 py-2 bg-[#B9B28A] text-white text-xs font-bold rounded-xl hover:bg-[#504B38] transition-colors cursor-pointer inline-flex items-center gap-2 shadow-lg"
                >
                  <ShieldCheck className="w-4 h-4" /> Seal to Blockchain
                </button>
              )}
            </div>
          )}
        </div>

        {/* Status Badges */}
        <div className="flex flex-wrap gap-3">
          <span className={`inline-flex items-center px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider ${
            isSealed ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-600 border border-amber-100'
          }`}>
            <ShieldCheck className={`w-3 h-3 mr-2 ${isSealed ? 'animate-pulse' : ''}`} />
            {isSealed ? 'Blockchain Verified' : 'Local Record Only'}
          </span>
          <span className="inline-flex items-center px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-600 border border-blue-100">
            <MapPin className="w-3 h-3 mr-2" /> {document.barangay}
          </span>
        </div>
      </div>

      {/* Main Layout grid columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column Stack */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Metadata Grid parameters */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#504B38]/10">
            <h3 className="text-sm font-black text-[#504B38] uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <Database className="w-4 h-4 text-[#B9B28A]" /> Registry Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoRow icon={<Calendar className="w-4 h-4" />} label="Filing Date" value={document.datePublished} />
              <InfoRow icon={<User className="w-4 h-4" />} label="Signing Authority" value={document.publishedBy || 'System Admin'} />
              {document.effectivityDate && (
                <InfoRow icon={<Clock className="w-4 h-4" />} label="Effectivity Date" value={document.effectivityDate} />
              )}
              <InfoRow icon={<MapPin className="w-4 h-4" />} label="Jurisdiction" value={`GMA, Cavite (${document.barangay})`} />
            </div>

            <div className="mt-8 pt-8 border-t border-gray-50">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Document Abstract</h4>
              <p className="text-gray-600 leading-relaxed font-medium italic">
                "{document.description || "No official description provided for this registry entry."}"
              </p>
            </div>
          </div>

          {/* Image Viewer Gallery Cards for Local Backups */}
          {document.attachedFiles && document.attachedFiles.length > 0 && (
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#504B38]/10 space-y-6">
              <div>
                <h3 className="text-sm font-black text-[#504B38] uppercase tracking-[0.2em]">Local Database Storage Backups</h3>
                <p className="text-[11px] font-bold text-gray-400 mt-0.5">Permanent media copies saved inside your local Supabase secure asset buckets.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {document.attachedFiles.map((url, index) => {
                  const cleanFileName = url.split('/').pop()?.split('-').slice(1).join('-') || `Attachment-${index + 1}`;
                  
                  return (
                    <div key={index} className="bg-gray-50 border border-gray-100 rounded-2xl overflow-hidden shadow-sm flex flex-col hover:border-[#B9B28A]/40 transition-all group">
                      
                      {/* Image Preview container */}
                      <div className="relative aspect-[4/3] bg-gray-200 overflow-hidden border-b border-gray-100">
                        <img 
                          src={url} 
                          alt={cleanFileName} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <a 
                            href={url} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="p-3 bg-white text-[#504B38] rounded-xl hover:bg-[#F8F3D9] transition-all transform translate-y-2 group-hover:translate-y-0 duration-300"
                          >
                            <Eye size={16} />
                          </a>
                          <a 
                            href={url} 
                            download 
                            className="p-3 bg-white text-[#504B38] rounded-xl hover:bg-[#F8F3D9] transition-all transform translate-y-2 group-hover:translate-y-0 duration-300 delay-75"
                          >
                            <Download size={16} />
                          </a>
                        </div>
                      </div>

                      {/* Attachment Label metrics */}
                      <div className="p-4 flex items-center justify-between gap-3 bg-white">
                        <div className="flex items-center space-x-2 overflow-hidden flex-1">
                          <FileText size={16} className="text-[#B9B28A] shrink-0" />
                          <span className="text-[11px] font-bold text-gray-700 truncate">{cleanFileName}</span>
                        </div>
                        <a 
                          href={url} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-[10px] font-black uppercase text-[#B9B28A] hover:text-[#504B38] tracking-widest shrink-0"
                        >
                          View Full
                        </a>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Column Stack (Protocol Evidence) */}
        <div className="space-y-8">
          <div className="bg-[#1C1C1C] p-8 rounded-[32px] text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <ShieldCheck size={120} />
            </div>
            
            <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-8 text-emerald-400 flex items-center gap-2 relative z-10">
              <ShieldCheck className="w-4 h-4" /> Protocol Evidence
            </h3>

            <div className="space-y-6 relative z-10">
              {/* TRANSACTION HASH */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Transaction Hash (TxID)</label>
                  {resolvedTxHash && resolvedTxHash !== '0x...' && (
                    <button onClick={() => copyToClipboard(resolvedTxHash, 'hash')} className="text-gray-500 hover:text-white transition-colors">
                      {copiedHash ? <Check size={12} /> : <Copy size={12} />}
                    </button>
                  )}
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <code className="text-[10px] font-mono text-gray-300 break-all leading-relaxed">
                    {resolvedTxHash && resolvedTxHash !== '0x...' ? resolvedTxHash : '0x... (Awaiting Sync)'}
                  </code>
                </div>
              </div>

              {/* CONTENT CID */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Content CID (IPFS)</label>
                  {resolvedCID && (
                    <button onClick={() => copyToClipboard(resolvedCID, 'cid')} className="text-gray-500 hover:text-white transition-colors">
                      {copiedCID ? <Check size={12} /> : <Copy size={12} />}
                    </button>
                  )}
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <code className="text-[10px] font-mono text-emerald-400/80 break-all leading-relaxed">
                    {resolvedCID || 'Pending Metadata...'}
                  </code>
                </div>
              </div>

              {/* BLOCK NUMBER */}
              <div className="flex justify-between items-center py-4 border-y border-white/5">
                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Block Height</span>
                <span className="text-xs font-mono font-bold text-gray-300">
                  {resolvedBlock && resolvedBlock !== '---' ? `#${resolvedBlock}` : '---'}
                </span>
              </div>

              {/* EXPLORER LINK BUTTON */}
              {resolvedTxHash && resolvedTxHash !== '0x...' ? (
                <a 
                  href={`https://amoy.polygonscan.com/tx/${resolvedTxHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-4 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all shadow-lg active:scale-95"
                >
                  Verify on PolygonScan <ExternalLink size={14} />
                </a>
              ) : (
                <div className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-center text-[9px] font-bold text-gray-500 uppercase italic">
                  Blockchain Sync Pending
                </div>
              )}
            </div>
          </div>

          {/* Categorization Tags */}
          {document.tags && document.tags.filter(t => !t.startsWith('0x')).length > 0 && (
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#504B38]/10">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Tag className="w-3 h-3" /> Categorization
              </h3>
              <div className="flex flex-wrap gap-2">
                {document.tags.filter(t => !t.startsWith('0x')).map((tag, index) => (
                  <span key={index} className="inline-flex items-center px-3 py-1 bg-[#F8F3D9] text-[#504B38] text-[10px] font-black uppercase tracking-tighter rounded-lg border border-[#504B38]/5">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start space-x-3 group">
      <div className="text-gray-300 group-hover:text-[#B9B28A] transition-colors mt-1">{icon}</div>
      <div className="flex-1 overflow-hidden">
        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">{label}</p>
        <p className="text-sm font-bold text-[#504B38] truncate">{value || '---'}</p>
      </div>
    </div>
  );
}