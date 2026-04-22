import { useState } from 'react';
import { ArrowLeft, Download, ShieldCheck, FileText, CheckCircle, ScrollText, FileCheck2, Stamp, Network, BarChart3, Share2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { mockDocuments } from '../utils/mockData';
import { categoryConfigs } from '../utils/types';

interface ResolutionViewerProps {
  resolutionId: string;
  onBack: () => void;
}

export function ResolutionViewer({ resolutionId, onBack }: ResolutionViewerProps) {
  const [showVerification, setShowVerification] = useState(false);
  const document = mockDocuments.find(r => r.id === resolutionId);

  if (!document) {
    return (
      <div className="p-8">
        <p>Document not found</p>
        <Button onClick={onBack}>Go Back</Button>
      </div>
    );
  }

  const categoryConfig = categoryConfigs.find(c => c.name === document.category);

  const getIconComponent = (iconName: string) => {
    const icons: Record<string, any> = {
      ScrollText,
      FileCheck2,
      Stamp,
      Network,
      FileText,
      BarChart3
    };
    return icons[iconName] || FileText;
  };

  const Icon = categoryConfig ? getIconComponent(categoryConfig.icon) : FileText;

  const handleVerify = () => {
    setShowVerification(true);
  };

  // Mock verification - in real app this would verify against blockchain
  const isAuthentic = true;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" onClick={onBack} className="mb-4 hover:bg-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Documents
          </Button>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className={`${categoryConfig?.bgColor} border-2 ${categoryConfig?.bgColor.replace('bg-', 'border-')} p-4 rounded-2xl`}>
                <Icon className={`w-10 h-10 ${categoryConfig?.color}`} />
              </div>
              <div>
                <h1 className="text-4xl mb-2">{document.title}</h1>
                <p className="text-gray-600 text-lg">{document.documentNumber}</p>
                {document.description && (
                  <p className="text-gray-600 mt-2 max-w-2xl">{document.description}</p>
                )}
              </div>
            </div>
            <Badge className="bg-green-500 px-4 py-2">
              <CheckCircle className="w-4 h-4 mr-2" />
              Blockchain Verified
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Details */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-2 shadow-lg">
              <CardHeader className={`${categoryConfig?.bgColor} border-b-2 ${categoryConfig?.bgColor.replace('bg-', 'border-')}`}>
                <CardTitle className={categoryConfig?.color}>Document Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div>
                  <p className="text-sm text-gray-600">Document Number</p>
                  <p className="text-lg">{document.documentNumber}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Date Approved</p>
                  <p className="text-lg">
                    {new Date(document.dateApproved).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Approved By</p>
                  <p className="text-lg">{document.approvedBy}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Category</p>
                  <Badge variant="outline" className={`${categoryConfig?.color} border-2 mt-1`}>
                    {document.category}
                  </Badge>
                </div>

                <div className="pt-4 border-t-2">
                  <p className="text-sm text-gray-600 mb-2">Status</p>
                  <Badge className={`${document.status === 'Published' ? 'bg-green-500' : 'bg-amber-500'} px-3 py-1`}>
                    {document.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 shadow-lg bg-gradient-to-br from-blue-50 to-purple-50">
              <CardHeader className="border-b-2">
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                  Blockchain Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div>
                  <p className="text-sm text-gray-600">SHA-256 Hash</p>
                  <p className="text-xs font-mono break-all bg-white p-3 rounded-lg mt-1 border-2">
                    {document.fileHash}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">IPFS CID</p>
                  <p className="text-xs font-mono break-all bg-white p-3 rounded-lg mt-1 border-2">
                    {document.ipfsCID}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Transaction ID</p>
                  <p className="text-xs font-mono break-all bg-white p-3 rounded-lg mt-1 border-2">
                    {document.blockchainTxId}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Timestamp</p>
                  <p className="text-sm bg-white p-2 rounded-lg mt-1 border-2">
                    {new Date(document.timestamp).toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 shadow-lg">
                <Download className="w-5 h-5 mr-2" />
                Download Document
              </Button>
              <Button 
                variant="outline" 
                className="w-full h-12 border-2"
                onClick={handleVerify}
              >
                <ShieldCheck className="w-5 h-5 mr-2" />
                View Blockchain Proof
              </Button>
              <Button 
                variant="outline" 
                className="w-full h-12 border-2"
              >
                <Share2 className="w-5 h-5 mr-2" />
                Share Document
              </Button>
            </div>
          </div>

          {/* Right Panel - Document Viewer */}
          <div className="lg:col-span-2">
            <Card className="h-[900px] border-2 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b-2">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Document Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[calc(100%-80px)] p-0">
                <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-b-lg flex items-center justify-center border-t-2">
                  <div className="text-center space-y-6 p-8">
                    <div className={`${categoryConfig?.bgColor} border-2 ${categoryConfig?.bgColor.replace('bg-', 'border-')} w-24 h-24 rounded-3xl flex items-center justify-center mx-auto shadow-lg`}>
                      <Icon className={`w-12 h-12 ${categoryConfig?.color}`} />
                    </div>
                    <div>
                      <p className="text-xl text-gray-700">PDF Document Viewer</p>
                      <p className="text-sm text-gray-500 mt-2 font-mono bg-white px-4 py-2 rounded-lg inline-block border-2">
                        {document.documentNumber}.pdf
                      </p>
                    </div>
                    <p className="text-gray-600 max-w-md mx-auto">
                      The document preview would be displayed here in the production version. 
                      Click Download to save a copy to your device.
                    </p>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Download className="w-4 h-4 mr-2" />
                      View Full Document
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Authenticity Verification Modal */}
        <Dialog open={showVerification} onOpenChange={setShowVerification}>
          <DialogContent className="sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-2xl flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-blue-600" />
                Blockchain Verification Proof
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-4">
                <div className="grid grid-cols-[160px_1fr] items-start gap-4">
                  <div className="text-sm text-gray-600">Original File Hash:</div>
                  <div className="text-xs font-mono break-all bg-gray-50 p-3 rounded-lg border-2">
                    {document.fileHash}
                  </div>
                </div>

                <div className="grid grid-cols-[160px_1fr] items-start gap-4">
                  <div className="text-sm text-gray-600">Current File Hash:</div>
                  <div className="text-xs font-mono break-all bg-gray-50 p-3 rounded-lg border-2">
                    {document.fileHash}
                  </div>
                </div>

                <div className="grid grid-cols-[160px_1fr] items-start gap-4">
                  <div className="text-sm text-gray-600">Blockchain Block:</div>
                  <div className="text-sm bg-gray-50 p-2 rounded-lg border-2">#152847</div>
                </div>

                <div className="grid grid-cols-[160px_1fr] items-start gap-4">
                  <div className="text-sm text-gray-600">IPFS CID:</div>
                  <div className="text-xs font-mono break-all bg-gray-50 p-3 rounded-lg border-2">
                    {document.ipfsCID}
                  </div>
                </div>

                <div className="grid grid-cols-[160px_1fr] items-start gap-4">
                  <div className="text-sm text-gray-600">Transaction ID:</div>
                  <div className="text-xs font-mono break-all bg-gray-50 p-3 rounded-lg border-2">
                    {document.blockchainTxId}
                  </div>
                </div>

                <div className="grid grid-cols-[160px_1fr] items-start gap-4">
                  <div className="text-sm text-gray-600">Timestamp:</div>
                  <div className="text-sm bg-gray-50 p-2 rounded-lg border-2">
                    {new Date(document.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Verification Result */}
              <div className={`p-6 rounded-xl ${isAuthentic ? 'bg-green-50 border-2 border-green-500' : 'bg-red-50 border-2 border-red-500'} shadow-lg`}>
                <div className="flex items-center gap-4">
                  {isAuthentic ? (
                    <>
                      <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                        <CheckCircle className="w-10 h-10 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl text-green-900">Authentic and Untampered ✓</h3>
                        <p className="text-sm text-green-700 mt-2">
                          This document matches the blockchain record perfectly and has not been modified since it was uploaded.
                          The cryptographic hash verification confirms its authenticity.
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                        <span className="text-white text-3xl">✗</span>
                      </div>
                      <div>
                        <h3 className="text-2xl text-red-900">Warning: File Modified ✗</h3>
                        <p className="text-sm text-red-700 mt-2">
                          This document does not match the blockchain record. It may have been tampered with.
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <Button onClick={() => setShowVerification(false)} className="w-full h-12 bg-blue-600 hover:bg-blue-700">
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
