import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, FileImage, Trash2, Loader2, CheckCircle2, Wallet, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAccount } from 'wagmi';
import { Document } from '../utils/documentData';
import { completeWeb3Upload } from '../utils/web3Utils';
import { LEGICHAIN_CONTRACT_ADDRESS } from '../config/web3Config';

interface DocumentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (doc: Document) => Promise<void>;
  editDoc?: Document | null;
}

interface UploadedFile {
  file: File;
  preview: string;
  id: string;
}

type UploadStep = 'idle' | 'pinning' | 'signing' | 'success' | 'error';

const BARANGAYS = ['Poblacion 1', 'Poblacion 2', 'Poblacion 3', 'Poblacion 4', 'Poblacion 5'];
const DOC_TYPES: Document['type'][] = ['Ordinance', 'Resolution', 'Executive Order', 'Bids & Awards', 'Financial Aid'];
const DOC_STATUSES: Document['status'][] = ['Active', 'Draft', 'Under Review', 'Archived'];
const ADMINS = ['Admin Juan Reyes', 'Admin Maria Santos', 'Admin Pedro Cruz', 'Admin Lisa Ramos', 'Admin Carlos Torres'];

const METADATA_TAGS = [
  'Infrastructure',
  'Health',
  'Sanitation',
  'Environment',
  'Safety',
  'Social Services',
  'Livelihood',
  'Education',
  'Agriculture',
  'Public Works',
  'Community Development'
];

const BLANK: Document = {
  id: '',
  documentId: '',
  type: 'Ordinance',
  title: '',
  barangay: 'Poblacion 1',
  datePublished: new Date().toISOString().split('T')[0],
  publishedBy: ADMINS[0],
  status: 'Active',
  blockchainStatus: 'Not Verified',
  violationCount: 0,
  description: '',
};

const genId = () => Date.now().toString();
const genDocId = (type: string) => {
  const prefix = type === 'Ordinance' ? 'ORD' : type === 'Resolution' ? 'RES' : type === 'Executive Order' ? 'EO' : type === 'Bids & Awards' ? 'BAC' : 'FA';
  return `${prefix}-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100).padStart(3, '0')}`;
};
const genDocumentId = () => `DOC-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100).padStart(3, '0')}`;

export function DocumentFormModal({ isOpen, onClose, onSave, editDoc }: DocumentFormModalProps) {
  const { address, isConnected } = useAccount();
  const [form, setForm] = useState<Document>(BLANK);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [uploadStep, setUploadStep] = useState<UploadStep>('idle');
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editDoc) {
      setForm(editDoc);
      setSelectedTags([]);
      setFiles([]);
    } else {
      const type: Document['type'] = 'Ordinance';
      setForm({
        ...BLANK,
        id: genId(),
        documentId: genDocumentId(),
        ordinanceNumber: genDocId(type),
        datePublished: new Date().toISOString().split('T')[0],
      });
      setSelectedTags([]);
      setFiles([]);
    }
    setUploadStep('idle');
    setError('');
    setIsDragging(false);
  }, [editDoc, isOpen]);

  const update = (field: keyof Document, value: any) => setForm(prev => ({ ...prev, [field]: value }));

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    addFiles(droppedFiles);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).filter(f => f.type.startsWith('image/'));
      addFiles(selectedFiles);
    }
  };

  const addFiles = (newFiles: File[]) => {
    const uploadedFiles: UploadedFile[] = newFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: `${Date.now()}-${Math.random()}`
    }));
    setFiles(prev => [...prev, ...uploadedFiles]);
  };

  const removeFile = (id: string) => {
    setFiles(prev => {
      const file = prev.find(f => f.id === id);
      if (file) URL.revokeObjectURL(file.preview);
      return prev.filter(f => f.id !== id);
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleWeb3Upload = async () => {
    // Validate required fields
    if (!form.title.trim()) {
      setError('Document title is required.');
      return;
    }
    if (!form.description.trim()) {
      setError('Description is required.');
      return;
    }

    // Check if wallet is connected for real blockchain upload
    if (!isConnected && LEGICHAIN_CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000') {
      setError('Please connect your wallet to upload to blockchain.');
      return;
    }

    try {
      setError('');

      // Check if we should use real blockchain or simulated
      const useRealBlockchain = LEGICHAIN_CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000' && isConnected;

      if (useRealBlockchain) {
        // REAL WEB3 UPLOAD
        const imageFiles = files.map(f => f.file);

        const result = await completeWeb3Upload(
          form,
          selectedTags,
          imageFiles,
          LEGICHAIN_CONTRACT_ADDRESS,
          (step) => {
            if (step === 'ipfs') setUploadStep('pinning');
            if (step === 'metadata') setUploadStep('pinning');
            if (step === 'minting') setUploadStep('signing');
          }
        );

        setUploadStep('success');

        // Prepare document data for Supabase with blockchain info
        const documentWithWeb3: Document = {
          ...form,
          blockchainStatus: 'Verified',
          description: `${form.description}\n\nMetadata Tags: ${selectedTags.join(', ')}\nImages: ${result.imagesHash || 'None'}\nDocument Hash: ${result.documentHash}\nTx: ${result.txHash}`,
        };

        await onSave(documentWithWeb3);

      } else {
        // SIMULATED WEB3 UPLOAD (for testing without wallet)
        setUploadStep('pinning');
        await new Promise(resolve => setTimeout(resolve, 2000));

        setUploadStep('signing');
        await new Promise(resolve => setTimeout(resolve, 3000));

        setUploadStep('success');

        // Prepare document data for Supabase
        const documentWithWeb3: Document = {
          ...form,
          blockchainStatus: 'Not Verified',
          description: `${form.description}\n\nMetadata Tags: ${selectedTags.join(', ')}\nImages Uploaded: ${files.length} (simulated)`,
        };

        await onSave(documentWithWeb3);
      }

      // Reset after 2 seconds
      setTimeout(() => {
        onClose();
        setUploadStep('idle');
      }, 2000);

    } catch (e: any) {
      setUploadStep('error');
      setError(e.message || 'Failed to upload to blockchain.');
    }
  };

  const getStepMessage = () => {
    switch (uploadStep) {
      case 'pinning': return 'Pinning to IPFS...';
      case 'signing': return 'Signing Transaction...';
      case 'success': return 'Success!';
      case 'error': return 'Failed';
      default: return editDoc ? 'Save Changes' : 'Create Document';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            className="relative w-full max-w-4xl bg-white rounded-[32px] shadow-2xl border-2 border-[#088395] max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="p-8 border-b border-gray-100 bg-[#EBF4F6] rounded-t-[32px] flex justify-between items-center flex-shrink-0">
              <div>
                <h2 className="text-2xl font-black text-[#1C1C1C] flex items-center gap-2">
                  <Wallet className="w-6 h-6 text-[#088395]" />
                  {editDoc ? 'Edit Document' : 'Add New Document'}
                </h2>
                <p className="text-xs text-gray-500 font-bold mt-1">
                  {editDoc ? `Editing: ${editDoc.documentId}` : 'Web3 Upload • Polygon Amoy • IPFS Storage'}
                </p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Body */}
            <div className="p-8 overflow-y-auto space-y-6 flex-1">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm font-bold">
                  {error}
                </div>
              )}

              {/* Wallet Connection Status */}
              {LEGICHAIN_CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000' && (
                <div className={`p-4 rounded-2xl border-2 ${
                  isConnected
                    ? 'bg-green-50 border-green-200'
                    : 'bg-amber-50 border-amber-200'
                }`}>
                  <div className="flex items-center gap-2">
                    {isConnected ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="text-sm font-bold text-green-900">Wallet Connected</p>
                          <p className="text-xs text-green-700">Documents will be uploaded to Polygon Amoy blockchain</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <Wallet className="w-5 h-5 text-amber-600" />
                        <div>
                          <p className="text-sm font-bold text-amber-900">Wallet Not Connected</p>
                          <p className="text-xs text-amber-700">Click "Connect Wallet" in the navbar to enable blockchain upload</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Image Upload Section */}
              <div className="p-6 bg-[#EBF4F6] rounded-2xl border-2 border-[#7AB2B2] space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileImage className="w-5 h-5 text-[#088395]" />
                  <h3 className="text-sm font-black text-gray-700 uppercase tracking-widest">
                    Upload Supporting Images
                  </h3>
                </div>

                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                    isDragging
                      ? 'border-[#088395] bg-white'
                      : 'border-[#7AB2B2] hover:border-[#088395] hover:bg-white/50'
                  }`}
                >
                  <Upload className="w-10 h-10 mx-auto mb-2 text-[#088395]" />
                  <p className="font-bold text-gray-700 mb-1 text-sm">
                    Drag & drop images here, or click to browse
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB each</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>

                {/* File Preview Gallery */}
                {files.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-gray-600 uppercase tracking-widest">
                      Selected Files ({files.length})
                    </p>
                    <div className="flex gap-3 overflow-x-auto pb-2">
                      {files.map(f => (
                        <div
                          key={f.id}
                          className="relative flex-shrink-0 w-28 h-28 bg-white rounded-xl overflow-hidden border-2 border-[#088395] group"
                        >
                          <img src={f.preview} alt="" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeFile(f.id);
                              }}
                              className="p-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                            >
                              <Trash2 className="w-4 h-4 text-white" />
                            </button>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 bg-[#088395] text-white text-xs p-1 text-center font-bold">
                            {formatFileSize(f.file.size)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Document Information Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Document Title *</label>
                  <input value={form.title} onChange={e => update('title', e.target.value)}
                    placeholder="e.g. Ordinance No. 01-2024 — Waste Segregation Act"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#088395] focus:outline-none" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Document Type *</label>
                  <select value={form.type} onChange={e => update('type', e.target.value as Document['type'])}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#088395] focus:outline-none">
                    {DOC_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Barangay *</label>
                  <select value={form.barangay} onChange={e => update('barangay', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#088395] focus:outline-none">
                    {BARANGAYS.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Status</label>
                  <select value={form.status} onChange={e => update('status', e.target.value as Document['status'])}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#088395] focus:outline-none">
                    {DOC_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Published By</label>
                  <select value={form.publishedBy} onChange={e => update('publishedBy', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#088395] focus:outline-none">
                    {ADMINS.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Date Published</label>
                  <input type="date" value={form.datePublished?.split('T')[0] || ''} onChange={e => update('datePublished', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#088395] focus:outline-none" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Ordinance / Resolution Number</label>
                  <input value={form.ordinanceNumber || ''} onChange={e => update('ordinanceNumber', e.target.value)}
                    placeholder="e.g. ORD-2024-001"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#088395] focus:outline-none" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Effectivity Date</label>
                  <input type="date" value={form.effectivityDate?.split('T')[0] || ''} onChange={e => update('effectivityDate', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#088395] focus:outline-none" />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Description *</label>
                  <textarea value={form.description} onChange={e => update('description', e.target.value)} rows={3}
                    placeholder="Brief summary of the document's purpose and content..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#088395] focus:outline-none resize-none" />
                </div>
              </div>

              {/* Metadata Tags */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
                  Metadata Tags (Optional)
                </label>
                <div className="flex flex-wrap gap-2">
                  {METADATA_TAGS.map(tag => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      type="button"
                      className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                        selectedTags.includes(tag)
                          ? 'bg-[#088395] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Progress Bar */}
              {uploadStep !== 'idle' && (
                <div className="space-y-3 p-4 bg-[#EBF4F6] rounded-2xl border border-[#7AB2B2]">
                  <div className="flex items-center justify-between text-sm font-bold">
                    <span className={uploadStep === 'error' ? 'text-red-600' : 'text-[#088395]'}>
                      {getStepMessage()}
                    </span>
                    {uploadStep === 'success' && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                  </div>
                  <div className="flex gap-2">
                    {['pinning', 'signing', 'success'].map((step, i) => (
                      <div
                        key={step}
                        className={`h-2 flex-1 rounded-full transition-all ${
                          uploadStep === 'error'
                            ? 'bg-red-200'
                            : ['pinning', 'signing', 'success'].indexOf(uploadStep) >= i
                            ? 'bg-[#088395]'
                            : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-gray-600 font-bold">
                    <span>1. IPFS</span>
                    <span>2. Blockchain</span>
                    <span>3. Complete</span>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-8 bg-gray-50 border-t border-gray-100 rounded-b-[32px] flex justify-end gap-4 flex-shrink-0">
              <button
                onClick={onClose}
                disabled={uploadStep === 'pinning' || uploadStep === 'signing'}
                className="px-8 py-3 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-2xl hover:bg-gray-50 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleWeb3Upload}
                disabled={uploadStep === 'pinning' || uploadStep === 'signing' || uploadStep === 'success'}
                className="px-8 py-3 bg-[#088395] text-white font-bold rounded-2xl hover:bg-[#09637E] transition-all shadow-md flex items-center gap-2 disabled:opacity-60"
              >
                {uploadStep === 'pinning' || uploadStep === 'signing' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {getStepMessage()}
                  </>
                ) : uploadStep === 'success' ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Success!
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    {editDoc ? 'Save Changes' : 'Create Document'}
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
