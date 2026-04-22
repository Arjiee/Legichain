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
  MapPin
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

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    
    if (type === 'hash') setCopiedHash(true);
    if (type === 'block') setCopiedBlock(true);
    if (type === 'docId') setCopiedDocId(true);

    setTimeout(() => {
      setCopiedHash(false);
      setCopiedBlock(false);
      setCopiedDocId(false);
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
        Back to Documents
      </button>

      {/* Header */}
      <div className="bg-gradient-to-br from-[#EBE5C2] to-[#F8F3D9] p-8 rounded-3xl border border-[#504B38]/10">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-3 flex-1">
            <div className="p-3 bg-white rounded-xl shadow-lg">
              <FileText className="w-6 h-6 text-[#B9B28A]" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-black text-[#504B38]">{document.title}</h1>
                <button
                  onClick={() => copyToClipboard(document.documentId, 'docId')}
                  className="inline-flex items-center text-xs font-bold text-[#B9B28A] hover:text-[#504B38] transition-colors cursor-pointer"
                >
                  {copiedDocId ? <><Check className="w-3 h-3 mr-1" />Copied!</> : <><Copy className="w-3 h-3 mr-1" />{document.documentId}</>}
                </button>
              </div>
              <p className="text-xs text-gray-600 font-medium">{document.ordinanceNumber || 'Official Document'}</p>
            </div>
          </div>

          {/* Action Buttons */}
          {isAdmin && (
            <div className="flex items-center gap-2">
              {onEdit && (
                <button
                  onClick={() => onEdit(document)}
                  className="px-4 py-2 bg-white border border-[#B9B28A] text-[#B9B28A] text-xs font-bold rounded-xl hover:bg-[#B9B28A] hover:text-white transition-colors cursor-pointer inline-flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
              )}
              {onArchive && document.status !== 'Archived' && (
                <button
                  onClick={() => onArchive(document)}
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-50 transition-colors cursor-pointer inline-flex items-center gap-2"
                >
                  <Archive className="w-4 h-4" />
                  Archive
                </button>
              )}
              {onVerify && document.blockchainStatus === 'Not Verified' && (
                <button
                  onClick={() => onVerify(document)}
                  className="px-4 py-2 bg-[#B9B28A] text-white text-xs font-bold rounded-xl hover:bg-[#504B38] transition-colors cursor-pointer inline-flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Verify on Blockchain
                </button>
              )}
            </div>
          )}
        </div>

        {/* Status Pills */}
        <div className="flex flex-wrap gap-3">
          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold ${
            document.type === 'Ordinance' ? 'bg-blue-100 text-blue-700' :
            document.type === 'Resolution' ? 'bg-purple-100 text-purple-700' :
            document.type === 'Executive Order' ? 'bg-indigo-100 text-indigo-700' :
            document.type === 'Bids & Awards' ? 'bg-orange-100 text-orange-700' :
            'bg-green-100 text-green-700'
          }`}>
            {document.type}
          </span>
          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold ${
            document.status === 'Active' ? 'bg-green-100 text-green-700' :
            document.status === 'Archived' ? 'bg-gray-100 text-gray-700' :
            document.status === 'Draft' ? 'bg-yellow-100 text-yellow-700' :
            'bg-orange-100 text-orange-700'
          }`}>
            {document.status}
          </span>
          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold ${
            document.blockchainStatus === 'Verified' ? 'bg-emerald-100 text-emerald-700' :
            document.blockchainStatus === 'Pending' ? 'bg-amber-100 text-amber-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            <ShieldCheck className="w-3 h-3 mr-1" />
            {document.blockchainStatus}
          </span>
          {document.violationCount > 0 && (
            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-red-100 text-red-700">
              <AlertTriangle className="w-3 h-3 mr-1" />
              {document.violationCount} {document.violationCount === 1 ? 'Violation' : 'Violations'}
            </span>
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Document Info */}
        <div className="lg:col-span-2 space-y-8">
          {/* Document Metadata */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#504B38]/10">
            <h3 className="text-lg font-bold text-[#504B38] mb-4">Document Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <InfoRow icon={<MapPin className="w-4 h-4" />} label="Barangay" value={document.barangay} />
              <InfoRow icon={<Calendar className="w-4 h-4" />} label="Date Published" value={new Date(document.datePublished).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} />
              <InfoRow icon={<User className="w-4 h-4" />} label="Published By" value={document.publishedBy} />
              {document.effectivityDate && (
                <InfoRow icon={<Clock className="w-4 h-4" />} label="Effectivity Date" value={new Date(document.effectivityDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} />
              )}
              {document.lastModified && (
                <InfoRow icon={<Clock className="w-4 h-4" />} label="Last Modified" value={new Date(document.lastModified).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} />
              )}
            </div>
          </div>

          {/* Document Description */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#504B38]/10">
            <h3 className="text-lg font-bold text-[#504B38] mb-4">Description</h3>
            <p className="text-gray-600 leading-relaxed font-medium">{document.description}</p>
          </div>

          {/* Full Content */}
          {document.fullContent && (
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#504B38]/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-[#504B38]">Full Document Content</h3>
                <button className="inline-flex items-center px-3 py-1.5 bg-[#B9B28A] text-white text-xs font-bold rounded-lg hover:bg-[#504B38] transition-colors cursor-pointer">
                  <Download className="w-3 h-3 mr-2" />
                  Download PDF
                </button>
              </div>
              <div className="prose prose-sm max-w-none bg-gray-50 p-6 rounded-xl border border-gray-100">
                <pre className="whitespace-pre-wrap font-sans text-xs text-gray-700 leading-relaxed">{document.fullContent}</pre>
              </div>
            </div>
          )}

          {/* Attached Files */}
          {document.attachedFiles && document.attachedFiles.length > 0 && (
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#504B38]/10">
              <h3 className="text-lg font-bold text-[#504B38] mb-4">Attached Files</h3>
              <div className="space-y-2">
                {document.attachedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors group">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <FileText className="w-4 h-4 text-red-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{file}</span>
                    </div>
                    <button className="inline-flex items-center px-3 py-1.5 bg-white border border-gray-200 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-50 transition-colors cursor-pointer opacity-0 group-hover:opacity-100">
                      <Download className="w-3 h-3 mr-1" />
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Blockchain & Tags */}
        <div className="space-y-8">
          {/* Blockchain Verification */}
          {document.blockchainStatus !== 'Not Verified' && document.txHash && (
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#504B38]/10">
              <h3 className="text-lg font-bold text-[#504B38] mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                Blockchain Verification
              </h3>
              <div className="space-y-4">
                {/* Transaction Hash */}
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Transaction Hash</label>
                  <div className="bg-[#F8F3D9] p-3 rounded-xl flex items-center justify-between">
                    <code className="text-xs font-mono text-[#504B38] break-all flex-1">{document.txHash?.slice(0, 20)}...{document.txHash?.slice(-10)}</code>
                    <button
                      onClick={() => copyToClipboard(document.txHash || '', 'hash')}
                      className="ml-2 text-[#B9B28A] hover:text-[#504B38] cursor-pointer"
                    >
                      {copiedHash ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Block Number */}
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Block Number</label>
                  <div className="bg-[#F8F3D9] p-3 rounded-xl flex items-center justify-between">
                    <code className="text-sm font-mono font-bold text-[#504B38]">#{document.block}</code>
                    <button
                      onClick={() => copyToClipboard(document.block || '', 'block')}
                      className="text-[#B9B28A] hover:text-[#504B38] cursor-pointer"
                    >
                      {copiedBlock ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Verified By */}
                {document.verifiedBy && (
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Verified By</label>
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">{document.verifiedBy}</span>
                    </div>
                  </div>
                )}

                {/* Verification Timestamp */}
                {document.verificationTimestamp && (
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Verification Date</label>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">
                        {new Date(document.verificationTimestamp).toLocaleString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                )}

                {/* View on Explorer */}
                <button className="w-full inline-flex items-center justify-center px-4 py-2 bg-[#B9B28A] text-white text-xs font-bold rounded-xl hover:bg-[#504B38] transition-colors cursor-pointer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View on Blockchain Explorer
                </button>
              </div>
            </div>
          )}

          {/* Tags */}
          {document.tags && document.tags.length > 0 && (
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#504B38]/10">
              <h3 className="text-lg font-bold text-[#504B38] mb-4 flex items-center gap-2">
                <Tag className="w-5 h-5 text-[#B9B28A]" />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {document.tags.map((tag, index) => (
                  <span key={index} className="inline-flex items-center px-3 py-1.5 rounded-full bg-[#F8F3D9] text-[#504B38] text-xs font-bold border border-[#504B38]/10">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Violation Stats */}
          {document.violationCount > 0 && (
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#504B38]/10">
              <h3 className="text-lg font-bold text-[#504B38] mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                Violation Statistics
              </h3>
              <div className="text-center p-6 bg-red-50 rounded-2xl border border-red-100">
                <p className="text-4xl font-black text-red-600 mb-2">{document.violationCount}</p>
                <p className="text-xs font-bold text-red-700 uppercase tracking-widest">
                  {document.violationCount === 1 ? 'Violation Case' : 'Violation Cases'} Linked
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper component
function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start space-x-3 py-2">
      <div className="text-gray-400 mt-1">{icon}</div>
      <div className="flex-1">
        <p className="text-xs font-medium text-gray-500">{label}</p>
        <p className="text-sm font-bold text-[#504B38] mt-0.5">{value}</p>
      </div>
    </div>
  );
}
