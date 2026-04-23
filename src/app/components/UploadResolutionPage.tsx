import { useState } from 'react';
import { Upload, FileText, Loader2, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { categories } from '../utils/mockData';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { toast } from 'sonner';

// Real Web3 Imports
import { completeWeb3Upload } from '../utils/web3Utils';
import { LEGICHAIN_CONTRACT_ADDRESS } from '../config/web3Config';
import { useData } from './DataContext';

export function UploadResolutionPage() {
  const { handleRefreshData } = useData(); // To refresh the ledger after upload
  const [uploading, setUploading] = useState(false);
  const [uploadStep, setUploadStep] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // State for real blockchain results
  const [blockchainResult, setBlockchainResult] = useState({
    ipfsHash: '',
    txHash: '',
    timestamp: ''
  });

  const [formData, setFormData] = useState({
    title: '',
    resolutionNumber: '',
    dateApproved: '',
    category: '',
  });

  // Updated steps to match real web3Utils logic
  const uploadSteps = [
    'Uploading Document to IPFS...',
    'Registering Metadata...',
    'Minting on Polygon Blockchain...',
    'Finalizing Record...'
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return toast.error("Please select a document file.");
    if (LEGICHAIN_CONTRACT_ADDRESS === '0x0000000000000000000000000000000000000000') {
      return toast.error("Contract address not configured in .env");
    }

    setUploading(true);
    setUploadStep(0);

    try {
      // Execute the full IPFS + Blockchain flow
      const result = await completeWeb3Upload(
        {
          title: formData.title,
          type: formData.category,
          documentId: formData.resolutionNumber,
          datePublished: formData.dateApproved,
          barangay: "Poblacion", // Default or extract from context
        },
        [formData.category, "Official"], // Tags
        [selectedFile],
        LEGICHAIN_CONTRACT_ADDRESS,
        (step) => {
          // Map internal steps to UI indices
          if (step === 'ipfs') setUploadStep(0);
          if (step === 'metadata') setUploadStep(1);
          if (step === 'minting') setUploadStep(2);
        }
      );

      // Success state
      setUploadStep(3);
      setBlockchainResult({
        ipfsHash: result.documentHash,
        txHash: result.txHash,
        timestamp: new Date().toISOString()
      });

      toast.success("Document immutably recorded on the blockchain!");
      
      // Refresh global data to show the new document in the ledger
      await handleRefreshData();

    } catch (error: any) {
      console.error("Upload failed:", error);
      toast.error(`Blockchain Error: ${error.message || "Failed to record document"}`);
      setUploading(false);
    }
  };

  const resetForm = () => {
    setUploading(false);
    setUploadStep(0);
    setSelectedFile(null);
    setBlockchainResult({ ipfsHash: '', txHash: '', timestamp: '' });
    setFormData({ title: '', resolutionNumber: '', dateApproved: '', category: '' });
  };

  return (
    <div className="min-h-screen bg-[#F8F3D9]/30">
      <div className="p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-4xl font-black text-[#504B38] tracking-tight">Upload Document</h1>
              <p className="text-[#504B38]/60 font-bold">Secure official records via IPFS & Polygon</p>
            </div>
            <ShieldCheck className="w-12 h-12 text-[#B9B28A]/40" />
          </div>

          <form onSubmit={handleUpload}>
            <Card className="border-2 border-[#504B38]/10 shadow-xl rounded-[32px] overflow-hidden bg-white">
              <CardHeader className="bg-[#EBE5C2]/20 border-b border-[#EBE5C2]">
                <CardTitle className="text-[#504B38] font-black">Official Metadata</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Document Title</Label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., Waste Management Ordinance 2026"
                      className="h-14 border-2 border-[#EBE5C2] rounded-2xl focus:ring-[#B9B28A] font-bold"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Resolution/Ordinance #</Label>
                    <Input
                      value={formData.resolutionNumber}
                      onChange={(e) => setFormData({ ...formData, resolutionNumber: e.target.value })}
                      placeholder="RES-2026-001"
                      className="h-14 border-2 border-[#EBE5C2] rounded-2xl font-bold"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Date Approved</Label>
                    <Input
                      type="date"
                      value={formData.dateApproved}
                      onChange={(e) => setFormData({ ...formData, dateApproved: e.target.value })}
                      className="h-14 border-2 border-[#EBE5C2] rounded-2xl font-bold"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Category</Label>
                  <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                    <SelectTrigger className="h-14 border-2 border-[#EBE5C2] rounded-2xl font-bold">
                      <SelectValue placeholder="Select classification" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c} value={c} className="font-bold">{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Secure File Attachment</Label>
                  <div className="group border-2 border-dashed border-[#EBE5C2] rounded-[24px] p-10 text-center hover:border-[#B9B28A] hover:bg-[#F8F3D9]/30 transition-all cursor-pointer relative">
                    <input type="file" id="file" accept=".pdf,.jpg,.jpeg" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                    {selectedFile ? (
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
                          <CheckCircle2 className="w-10 h-10" />
                        </div>
                        <p className="font-black text-[#504B38]">{selectedFile.name}</p>
                        <p className="text-xs text-gray-400">Ready for cryptographic hashing</p>
                      </div>
                    ) : (
                      <div>
                        <Upload className="w-12 h-12 mx-auto text-[#B9B28A] mb-4 group-hover:scale-110 transition-transform" />
                        <p className="font-black text-[#504B38]">Drop Official Document Here</p>
                        <p className="text-xs text-gray-400 mt-1">PDF or JPEG (Maximum 10MB)</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Display real results after upload */}
                {blockchainResult.txHash && (
                  <div className="bg-emerald-50 border-2 border-emerald-100 rounded-3xl p-6 space-y-4 animate-in fade-in zoom-in duration-500">
                    <h3 className="font-black text-emerald-700 flex items-center gap-2 text-sm uppercase tracking-wider">
                      <ShieldCheck className="w-5 h-5" /> Verified Blockchain Entry
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-[9px] font-black text-emerald-800/50 uppercase">IPFS Content ID (CID)</Label>
                        <div className="font-mono text-[10px] bg-white/50 p-3 rounded-xl border border-emerald-200 break-all">
                          {blockchainResult.ipfsHash}
                        </div>
                      </div>
                      <div>
                        <Label className="text-[9px] font-black text-emerald-800/50 uppercase">Transaction Hash</Label>
                        <div className="font-mono text-[10px] bg-white/50 p-3 rounded-xl border border-emerald-200 break-all">
                          {blockchainResult.txHash}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  {!blockchainResult.txHash ? (
                    <Button type="submit" className="flex-1 bg-[#504B38] hover:bg-[#B9B28A] h-16 rounded-2xl text-lg font-black shadow-lg transition-all">
                      <Upload className="w-6 h-6 mr-2" />
                      Seal & Upload to Blockchain
                    </Button>
                  ) : (
                    <Button type="button" onClick={resetForm} className="flex-1 bg-emerald-600 hover:bg-emerald-700 h-16 rounded-2xl text-lg font-black shadow-lg">
                      Upload Another Document
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>

      {/* Real Upload Progress Modal */}
      <Dialog open={uploading && !blockchainResult.txHash} onOpenChange={setUploading}>
        <DialogContent className="sm:max-w-md border-4 border-[#B9B28A] rounded-[32px]">
          <div className="p-6 space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-black text-[#504B38]">Blockchain Protocol</h2>
              <p className="text-sm text-gray-400 font-bold">Do not close this window while processing</p>
            </div>
            <div className="space-y-4">
              {uploadSteps.map((step, index) => (
                <div key={index} className="flex items-center gap-4">
                  {index < uploadStep ? (
                    <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                  ) : index === uploadStep ? (
                    <div className="w-10 h-10 bg-[#B9B28A]/20 rounded-full flex items-center justify-center">
                      <Loader2 className="w-6 h-6 text-[#B9B28A] animate-spin" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 border-2 border-gray-100 rounded-full"></div>
                  )}
                  <span className={`font-bold ${index <= uploadStep ? 'text-[#504B38]' : 'text-gray-300'}`}>
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}