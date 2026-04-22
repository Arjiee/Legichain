import React, { useState } from 'react';
import { 
  Plus, 
  FileText, 
  Search, 
  Trash2, 
  Edit2, 
  Eye, 
  Upload, 
  X, 
  CheckCircle2,
  Calendar,
  Building2,
  Filter,
  FileIcon,
  ExternalLink,
  Download,
  ShieldCheck,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface AdminDocsPageProps {
  documents: any[];
  barangays: any[];
  onAddDocument: (doc: any) => void;
  onUpdateDocument: (doc: any) => void;
  onDeleteDocument: (id: string) => void;
}

export function AdminDocsPage({ 
  documents, 
  barangays, 
  onAddDocument, 
  onUpdateDocument, 
  onDeleteDocument 
}: AdminDocsPageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [editingDoc, setEditingDoc] = useState<any>(null);
  const [viewingDoc, setViewingDoc] = useState<any>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    type: 'Resolution',
    barangayId: '1',
    date: new Date().toISOString().split('T')[0],
    desc: ''
  });

  const docTypes = ["Ordinance", "Resolution", "Executive Order", "Bids & Awards", "Financial Aid"];

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || doc.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleOpenModal = (doc: any = null) => {
    if (doc) {
      setEditingDoc(doc);
      setFormData({
        title: doc.title,
        type: doc.type,
        barangayId: doc.barangayId,
        date: doc.date,
        desc: doc.desc || ''
      });
    } else {
      setEditingDoc(null);
      setFormData({
        title: '',
        type: 'Resolution',
        barangayId: '1',
        date: new Date().toISOString().split('T')[0],
        desc: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDoc) {
      onUpdateDocument({ ...editingDoc, ...formData });
      toast.success('Document metadata updated successfully');
    } else {
      const newDoc = {
        id: 'd' + Date.now(),
        ...formData,
        verified: true, // Auto-verify for demo
        txHash: "0x" + Math.random().toString(16).slice(2, 42),
        block: Math.floor(Math.random() * 1000000) + 18900000,
      };
      onAddDocument(newDoc);
      toast.success('Document attached and recorded on blockchain');
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#504B38] tracking-tight">Documents</h1>
          <p className="text-gray-500 font-bold">Manage official records and blockchain attachments</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="px-6 py-4 bg-[#B9B28A] text-white font-bold rounded-2xl flex items-center shadow-lg hover:bg-[#504B38] transition-all cursor-pointer group"
        >
          <Plus className="mr-2 w-5 h-5 group-hover:rotate-90 transition-transform" />
          Attach Document
        </button>
      </div>

      <Card className="border-2 border-[#504B38]/10 rounded-3xl shadow-sm bg-white overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#504B38]/40" />
            <Input 
              placeholder="Search by title..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 border-2 border-[#EBE5C2] rounded-xl focus-visible:ring-[#B9B28A]"
            />
          </div>
          <div className="flex items-center space-x-3 bg-[#F8F3D9] p-1 rounded-xl border border-[#504B38]/10">
            <Filter size={16} className="ml-3 text-[#504B38]/50" />
            <select 
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-transparent border-none text-sm font-bold text-[#504B38] focus:ring-0 cursor-pointer pr-8"
            >
              <option value="all">All Types</option>
              {docTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#F8F3D9] text-[10px] uppercase tracking-widest text-[#504B38]/60 font-bold">
                <th className="px-6 py-4">Document Details</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Barangay</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredDocs.map(doc => (
                <tr key={doc.id} className="hover:bg-[#EBE5C2]/10 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-[#B9B28A]/10 flex items-center justify-center text-[#B9B28A]">
                        <FileText size={20} />
                      </div>
                      <div>
                        <span className="text-sm font-bold text-[#504B38] block">{doc.title}</span>
                        <span className="text-[10px] text-gray-400 font-medium">Date: {doc.date}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="outline" className="border-[#B9B28A]/30 text-[#504B38] text-[10px] font-bold">
                      {doc.type}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-gray-600 font-bold">
                      {barangays.find(b => b.id === doc.barangayId)?.name}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => setViewingDoc(doc)}
                        className="p-2 hover:bg-[#B9B28A]/10 rounded-lg text-[#B9B28A] cursor-pointer transition-colors"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      <button 
                        onClick={() => handleOpenModal(doc)}
                        className="p-2 hover:bg-blue-50 rounded-lg text-blue-500 cursor-pointer transition-colors"
                        title="Edit Metadata"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this document?')) {
                            onDeleteDocument(doc.id);
                            toast.error('Document removed from system');
                          }
                        }}
                        className="p-2 hover:bg-red-50 rounded-lg text-red-500 cursor-pointer transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredDocs.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-400 italic font-medium">
                    No documents found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 1. Edit Metadata / Update Document Information Panel - Optimized for Landscape */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-[#504B38]/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 0 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-6xl bg-white rounded-[40px] shadow-2xl overflow-hidden border-2 border-[#B9B28A] max-h-[90vh] flex flex-col"
            >
              <form onSubmit={handleSubmit} className="flex flex-col h-full">
                {/* Modal Header */}
                <div className="p-8 border-b border-gray-50 bg-[#F8F3D9] flex justify-between items-start flex-shrink-0">
                  <div>
                    <h3 className="text-2xl font-black text-[#504B38] mb-1">
                      {editingDoc ? 'Update Document Information' : 'Attach New Document'}
                    </h3>
                    <p className="text-xs text-gray-500 font-bold">
                      {editingDoc ? 'Edit official metadata and system records for this document' : 'Upload and record a new official document on the blockchain'}
                    </p>
                  </div>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white rounded-full transition-colors cursor-pointer text-[#504B38]">
                    <X size={24} />
                  </button>
                </div>

                {/* Modal Body - Landscape Optimized Grid */}
                <div className="p-8 overflow-y-auto custom-scrollbar">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                    
                    {/* Left Column: File Attachment / Preview (Span 4) */}
                    <div className="lg:col-span-4 space-y-6">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-[#504B38]/40 uppercase tracking-widest block">File Attachment / Upload Preview</label>
                        <div className="border-2 border-dashed border-[#EBE5C2] rounded-[32px] p-8 text-center bg-gray-50 hover:border-[#B9B28A] hover:bg-white transition-all cursor-pointer group min-h-[280px] flex flex-col items-center justify-center">
                          {editingDoc ? (
                            <div className="space-y-4">
                              <div className="w-20 h-20 bg-[#B9B28A]/20 rounded-3xl flex items-center justify-center text-[#B9B28A] mx-auto shadow-inner">
                                <FileIcon size={40} />
                              </div>
                              <div className="text-center">
                                <p className="text-sm font-bold text-[#504B38] mb-1">official_document_{editingDoc.id.slice(0,5)}.pdf</p>
                                <p className="text-[10px] text-gray-400 font-medium">Size: 2.4 MB • Format: PDF</p>
                              </div>
                              <Badge className="bg-[#EBE5C2] text-[#504B38] border-none font-bold py-1.5 px-4 rounded-full">Immutable Storage</Badge>
                            </div>
                          ) : (
                            <>
                              <Upload className="w-14 h-14 mx-auto text-[#B9B28A] mb-4 group-hover:scale-110 transition-transform" />
                              <p className="text-sm font-bold text-[#504B38]">Drag & Drop Document</p>
                              <p className="text-[10px] text-gray-400 font-medium mt-3 leading-relaxed max-w-[180px] mx-auto">
                                Supporting PDF, DOCX, JPG, or PNG formats up to 10MB
                              </p>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="p-5 rounded-3xl bg-[#F8F3D9]/50 border border-[#B9B28A]/20 flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                          <ShieldCheck size={20} />
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-[#504B38]/40 uppercase tracking-widest">Verification Status</p>
                          <p className="text-emerald-700 font-bold text-xs">Blockchain Ready</p>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Metadata Fields (Span 8) */}
                    <div className="lg:col-span-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        {/* Full Width Title */}
                        <div className="md:col-span-2 space-y-2">
                          <label className="text-[10px] font-black text-[#504B38]/40 uppercase tracking-widest block">Document Title</label>
                          <Input 
                            required
                            value={formData.title}
                            onChange={e => setFormData({...formData, title: e.target.value})}
                            placeholder="e.g. Resolution No. 12-2025: Waste Management Initiative" 
                            className="h-14 border-2 border-[#EBE5C2] rounded-2xl focus-visible:ring-[#B9B28A] text-base font-bold text-[#504B38] px-6"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-[#504B38]/40 uppercase tracking-widest block">Document Type</label>
                          <div className="relative">
                            <select 
                              className="w-full h-14 border-2 border-[#EBE5C2] rounded-2xl px-6 text-sm font-bold text-[#504B38] focus:outline-none focus:ring-2 focus:ring-[#B9B28A] appearance-none bg-white cursor-pointer"
                              value={formData.type}
                              onChange={e => setFormData({...formData, type: e.target.value})}
                            >
                              {docTypes.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-[#504B38]/40">
                              <Filter size={18} />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-[#504B38]/40 uppercase tracking-widest block">Barangay Name</label>
                          <div className="relative">
                            <select 
                              className="w-full h-14 border-2 border-[#EBE5C2] rounded-2xl px-6 text-sm font-bold text-[#504B38] focus:outline-none focus:ring-2 focus:ring-[#B9B28A] appearance-none bg-white cursor-pointer"
                              value={formData.barangayId}
                              onChange={e => setFormData({...formData, barangayId: e.target.value})}
                            >
                              {barangays.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                            </select>
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-[#504B38]/40">
                              <Building2 size={18} />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-[#504B38]/40 uppercase tracking-widest block">Date Approved</label>
                          <div className="relative">
                            <Input 
                              required
                              type="date"
                              value={formData.date}
                              onChange={e => setFormData({...formData, date: e.target.value})}
                              className="h-14 border-2 border-[#EBE5C2] rounded-2xl focus-visible:ring-[#B9B28A] font-bold px-6"
                            />
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-[#504B38]/40">
                              <Calendar size={18} />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-[#504B38]/40 uppercase tracking-widest block">Storage Path</label>
                          <div className="h-14 flex items-center px-6 rounded-2xl bg-[#F8F3D9] border-2 border-[#EBE5C2] text-[#504B38]/60 font-mono text-[11px] truncate">
                            ipfs://QmX7Jk8fN9pL2mQ4rS6tV8wY0zB3cD5eF7gH9iJ1kL3mN5oP7
                          </div>
                        </div>

                        <div className="md:col-span-2 space-y-2">
                          <label className="text-[10px] font-black text-[#504B38]/40 uppercase tracking-widest block">Official Description / Summary</label>
                          <textarea 
                            className="w-full p-6 border-2 border-[#EBE5C2] rounded-[32px] text-sm font-medium text-[#504B38] focus:outline-none focus:ring-2 focus:ring-[#B9B28A] min-h-[140px] bg-white resize-none"
                            placeholder="Provide a comprehensive summary of the document contents for public record..."
                            value={formData.desc}
                            onChange={e => setFormData({...formData, desc: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-8 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-6 flex-shrink-0">
                  <div className="flex items-center space-x-2 order-2 sm:order-1 w-full sm:w-auto">
                    {editingDoc && (
                      <button 
                        type="button"
                        onClick={() => {
                          if (confirm('Permanently remove this document from the GMA Blockchain system?')) {
                            onDeleteDocument(editingDoc.id);
                            setIsModalOpen(false);
                            toast.error('Document deleted successfully');
                          }
                        }}
                        className="w-full sm:w-auto px-8 py-4 text-red-500 font-bold rounded-2xl hover:bg-red-50 transition-all cursor-pointer flex items-center justify-center border border-transparent hover:border-red-200"
                      >
                        <Trash2 size={18} className="mr-2" />
                        Delete Document
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-4 w-full sm:w-auto order-1 sm:order-2">
                    <button 
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 sm:flex-none px-12 py-4 border-2 border-[#EBE5C2] text-[#504B38] font-bold rounded-2xl hover:bg-white transition-all cursor-pointer shadow-sm"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="flex-1 sm:flex-none px-12 py-4 bg-[#504B38] text-white font-bold rounded-2xl hover:bg-[#B9B28A] transition-all cursor-pointer shadow-xl flex items-center justify-center min-w-[200px]"
                    >
                      {editingDoc ? 'Update Record Information' : 'Attach & Record Document'}
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. View Details Panel - Optimized for Landscape */}
      <AnimatePresence>
        {viewingDoc && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setViewingDoc(null)}
              className="absolute inset-0 bg-[#504B38]/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, x: 50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95, x: 50 }}
              className="relative w-full max-w-6xl bg-white rounded-[40px] shadow-2xl overflow-hidden border-2 border-[#B9B28A] max-h-[90vh] flex flex-col"
            >
              {/* Header with Title and Type */}
              <div className="p-8 border-b border-gray-50 bg-[#EBE5C2]/15 flex justify-between items-center flex-shrink-0">
                <div className="flex items-center space-x-6">
                  <div className="w-16 h-16 rounded-3xl bg-white shadow-md border border-[#EBE5C2] flex items-center justify-center text-[#504B38]">
                    <FileText size={32} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100 font-bold px-3 py-0.5 rounded-full text-[10px] flex items-center">
                        <ShieldCheck size={12} className="mr-1" /> Verified on Blockchain
                      </Badge>
                      <Badge className="bg-[#B9B28A] text-white border-none font-bold px-3 py-0.5 rounded-full text-[10px]">
                        {viewingDoc.type}
                      </Badge>
                    </div>
                    <h3 className="text-3xl font-black text-[#504B38] tracking-tight">{viewingDoc.title}</h3>
                  </div>
                </div>
                <button onClick={() => setViewingDoc(null)} className="p-2 hover:bg-white rounded-full transition-colors cursor-pointer text-[#504B38]">
                  <X size={28} />
                </button>
              </div>

              {/* Main Body Grid */}
              <div className="p-8 overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                  
                  {/* Left Column: Visual/Status/Download (Span 4) */}
                  <div className="lg:col-span-4 space-y-8">
                    <div className="aspect-[4/3] rounded-[32px] bg-gray-50 border-2 border-[#EBE5C2] overflow-hidden group relative flex items-center justify-center">
                      <div className="text-center p-8">
                        <FileIcon size={64} className="mx-auto text-[#B9B28A]/40 mb-4 group-hover:scale-110 transition-transform" />
                        <p className="text-xs font-bold text-[#504B38]/60 uppercase tracking-widest">Document Preview</p>
                      </div>
                      <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                         <button className="bg-white text-[#504B38] px-6 py-3 rounded-2xl font-black text-sm shadow-xl flex items-center hover:bg-[#F8F3D9] transition-colors">
                            <Eye size={18} className="mr-2" /> Fullscreen View
                         </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <button className="w-full py-5 bg-[#504B38] text-white font-black rounded-3xl shadow-xl flex items-center justify-center group hover:bg-[#B9B28A] transition-all cursor-pointer">
                        <Download size={20} className="mr-3 group-hover:translate-y-1 transition-transform" />
                        Download Official Document
                      </button>
                      <button className="w-full py-4 bg-white border-2 border-[#EBE5C2] text-[#504B38] font-bold rounded-3xl flex items-center justify-center hover:bg-[#F8F3D9] transition-colors cursor-pointer">
                        <ExternalLink size={18} className="mr-3" />
                        Public Transparency Link
                      </button>
                    </div>

                    <div className="p-6 rounded-[32px] bg-[#F8F3D9] border-2 border-[#B9B28A]/20">
                       <p className="text-[10px] font-black text-[#504B38]/40 uppercase tracking-widest mb-4">Verification Audit</p>
                       <div className="space-y-4">
                          <div className="flex justify-between items-center text-xs">
                             <span className="text-[#504B38]/60 font-medium">Recorded Date</span>
                             <span className="text-[#504B38] font-bold">Feb 3, 2026</span>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                             <span className="text-[#504B38]/60 font-medium">Network</span>
                             <span className="text-[#504B38] font-bold">Ethereum Mainnet</span>
                          </div>
                          <div className="pt-2 border-t border-[#504B38]/10 flex items-center justify-center text-emerald-600 font-black text-[10px] uppercase">
                             <ShieldCheck size={14} className="mr-1.5" /> Immutable Chain Integrity
                          </div>
                       </div>
                    </div>
                  </div>

                  {/* Right Column: Metadata Details (Span 8) */}
                  <div className="lg:col-span-8 space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-[#504B38]/40 uppercase tracking-widest block">Barangay Name</label>
                        <div className="flex items-center space-x-3 p-4 bg-white border border-[#EBE5C2] rounded-2xl shadow-sm">
                          <Building2 size={20} className="text-[#B9B28A]" />
                          <span className="font-bold text-[#504B38] text-sm">
                            {barangays.find(b => b.id === viewingDoc.barangayId)?.name}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-[#504B38]/40 uppercase tracking-widest block">Date Published</label>
                        <div className="flex items-center space-x-3 p-4 bg-white border border-[#EBE5C2] rounded-2xl shadow-sm">
                          <Calendar size={20} className="text-[#B9B28A]" />
                          <span className="font-bold text-[#504B38] text-sm">{viewingDoc.date}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-[#504B38]/40 uppercase tracking-widest block">Time Elapsed</label>
                        <div className="flex items-center space-x-3 p-4 bg-white border border-[#EBE5C2] rounded-2xl shadow-sm">
                          <Clock size={20} className="text-[#B9B28A]" />
                          <span className="font-bold text-[#504B38] text-sm">2 days ago</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-[#504B38]/40 uppercase tracking-widest block">Official Description</label>
                      <div className="p-8 rounded-[32px] bg-white border-2 border-[#F8F3D9] shadow-sm">
                        <p className="text-gray-600 font-medium leading-relaxed text-base">
                          {viewingDoc.desc || "This official record has been immutably recorded on the GMA Blockchain ledger. It represents a formal legislative or administrative action passed by the Barangay Council and is made available for public transparency and auditing. All metadata associated with this document, including the file itself, is hashed and secured using distributed ledger technology."}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-[#504B38]/40 uppercase tracking-widest block">Blockchain Verification Proof (TxHash / Block)</label>
                      <div className="p-8 rounded-[32px] bg-[#504B38] text-white shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                           <ShieldCheck size={120} />
                        </div>
                        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                          <div className="md:col-span-8 space-y-6">
                            <div>
                              <p className="text-[9px] font-black text-[#B9B28A] uppercase tracking-widest mb-2 flex items-center">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-2 animate-pulse" />
                                Ethereum Transaction Hash
                              </p>
                              <p className="text-xs font-mono break-all font-bold tracking-tight bg-white/5 p-4 rounded-xl border border-white/10">
                                {viewingDoc.txHash}
                              </p>
                            </div>
                            <div className="flex gap-8">
                              <div>
                                <p className="text-[9px] font-black text-[#B9B28A] uppercase tracking-widest mb-1">Block Height</p>
                                <p className="text-lg font-mono font-black">{viewingDoc.block}</p>
                              </div>
                              <div>
                                <p className="text-[9px] font-black text-[#B9B28A] uppercase tracking-widest mb-1">Gas Used</p>
                                <p className="text-lg font-mono font-black">21,000</p>
                              </div>
                            </div>
                          </div>
                          <div className="md:col-span-4 flex justify-end">
                            <button className="px-8 py-4 bg-white text-[#504B38] font-black rounded-2xl text-xs uppercase tracking-widest hover:bg-[#F8F3D9] transition-all cursor-pointer shadow-lg">
                              Explorer Detail
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-8 bg-gray-50 border-t border-gray-100 flex justify-end items-center flex-shrink-0">
                <button 
                  onClick={() => setViewingDoc(null)}
                  className="px-12 py-4 bg-[#504B38] text-white font-black rounded-2xl hover:bg-[#B9B28A] transition-all cursor-pointer shadow-lg min-w-[200px]"
                >
                  Close Detail Overview
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f8f9fa;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #EBE5C2;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #B9B28A;
        }
      `}} />
    </div>
  );
}
