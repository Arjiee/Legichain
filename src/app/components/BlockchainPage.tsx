import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Shield, Loader2, ExternalLink, RefreshCw } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Badge } from './ui/badge';
import { getAllBlockchainDocumentsWithMetadata } from '../utils/blockchainReader';
import { Document } from '../utils/documentData';
import { POLYGON_AMOY_CHAIN } from '../config/web3Config';

export function BlockchainPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

  // Function to pull live data from the blockchain registry
  async function fetchBlockchainData() {
    try {
      setIsLoading(true);
      // This helper resolves the total count, fetches all structures, 
      // and resolves IPFS JSON in parallel
      const data = await getAllBlockchainDocumentsWithMetadata();
      setDocuments(data);
    } catch (error) {
      console.error("Failed to load blockchain records:", error);
    } finally {
      setIsLoading(false);
    }
  }

  // Effect to sync with the network on component mount
  useEffect(() => {
    fetchBlockchainData();
  }, []);

  const truncateHash = (hash: string) => {
    if (!hash) return 'N/A';
    return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
  };

  return (
    <div className="min-h-screen bg-[#F8F3D9]">
      <div className="p-8 space-y-6">
        <div className="flex justify-between items-end">
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tight text-[#504B38]">
              Blockchain Ledger
            </h1>
            <p className="text-[#504B38]/60 font-bold">
              Immutable records verified on {POLYGON_AMOY_CHAIN.name}
            </p>
          </div>
          <button 
            onClick={fetchBlockchainData}
            disabled={isLoading}
            className="p-3 bg-[#B9B28A]/20 hover:bg-[#B9B28A]/40 rounded-xl transition-all text-[#504B38] disabled:opacity-50"
            title="Sync with network"
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <Card className="border-2 shadow-sm rounded-2xl overflow-hidden border-[#504B38]/10 bg-white">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#F8F3D9]">
                    <th className="text-left px-6 py-4 font-bold text-sm text-[#504B38]">Registry ID</th>
                    <th className="text-left px-6 py-4 font-bold text-sm text-[#504B38]">Document Details</th>
                    <th className="text-left px-6 py-4 font-bold text-sm text-[#504B38]">Barangay</th>
                    <th className="text-left px-6 py-4 font-bold text-sm text-[#504B38]">Network Status</th>
                    <th className="text-left px-6 py-4 font-bold text-sm text-[#504B38]">Tx Proof</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EBE5C2]/30">
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="py-24 text-center">
                        <Loader2 className="w-12 h-12 animate-spin mx-auto text-[#B9B28A] mb-4" />
                        <p className="font-bold text-[#504B38] animate-pulse">Querying Smart Contract Ledger...</p>
                      </td>
                    </tr>
                  ) : documents.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-24 text-center text-gray-400 font-bold">
                        No verified records found on the blockchain.
                      </td>
                    </tr>
                  ) : (
                    documents.map((doc) => (
                      <tr 
                        key={doc.id} 
                        className="hover:bg-[#EBE5C2]/10 transition-colors cursor-pointer group"
                        onClick={() => setSelectedDoc(doc)}
                      >
                        <td className="px-6 py-4 font-mono text-xs font-bold text-[#B9B28A]">
                          {doc.documentId}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-black text-[#504B38] group-hover:text-[#B9B28A] transition-colors">
                              {doc.title}
                            </span>
                            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                              {doc.type}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-[#504B38]/70">
                          {doc.barangay}
                        </td>
                        <td className="px-6 py-4">
                          <Badge className="bg-emerald-500 hover:bg-emerald-600 border-none font-bold py-1 px-3 rounded-full text-[10px]">
                            {doc.blockchainStatus}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 font-mono text-[10px] text-gray-400">
                          {truncateHash(doc.txHash || '')}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Blockchain Proof Modal */}
      <Dialog open={!!selectedDoc} onOpenChange={() => setSelectedDoc(null)}>
        <DialogContent className="max-w-3xl border-4 shadow-2xl border-[#B9B28A] rounded-[40px] overflow-hidden p-0">
          <DialogHeader className="bg-[#EBE5C2] p-10 text-[#504B38]">
            <DialogTitle className="text-3xl font-black flex items-center gap-3">
              <Shield className="w-8 h-8 text-[#B9B28A]" />
              Immutable Proof
            </DialogTitle>
            <DialogDescription className="text-[#504B38]/80 font-bold text-base">
              Cryptographic verification record for: {selectedDoc?.title}
            </DialogDescription>
          </DialogHeader>
          
          {selectedDoc && (
            <div className="p-10 space-y-8 bg-white">
              <div className="grid grid-cols-3 gap-6">
                <div className="p-5 rounded-3xl bg-[#F8F3D9] border border-[#504B38]/10 text-center">
                  <p className="text-[10px] font-black uppercase text-[#504B38]/40 tracking-widest mb-1">Status</p>
                  <p className="font-black text-emerald-600 text-sm">FULLY VERIFIED</p>
                </div>
                <div className="p-5 rounded-3xl bg-[#F8F3D9] border border-[#504B38]/10 text-center">
                  <p className="text-[10px] font-black uppercase text-[#504B38]/40 tracking-widest mb-1">Block</p>
                  <p className="font-black text-[#504B38] text-sm">{selectedDoc.block || 'Confirmed'}</p>
                </div>
                <div className="p-5 rounded-3xl bg-[#F8F3D9] border border-[#504B38]/10 text-center">
                  <p className="text-[10px] font-black uppercase text-[#504B38]/40 tracking-widest mb-1">Registry</p>
                  <p className="font-black text-[#B9B28A] text-sm">Token #{selectedDoc.id}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="group">
                  <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 px-1 flex justify-between">
                    Transaction Hash 
                    <span className="text-[#B9B28A] group-hover:underline cursor-pointer flex items-center gap-1">
                      View on Explorer <ExternalLink className="w-3 h-3" />
                    </span>
                  </p>
                  <div className="p-5 rounded-2xl bg-gray-50 border-2 border-gray-100 font-mono text-xs break-all text-[#504B38] font-bold shadow-inner">
                    {selectedDoc.txHash || 'Pending confirmation on Polygon Amoy...'}
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 px-1">IPFS Metadata Content Identifier (CID)</p>
                  <div className="p-5 rounded-2xl bg-gray-50 border-2 border-gray-100 font-mono text-xs break-all text-[#B9B28A] font-bold shadow-inner">
                    {selectedDoc.id.length > 20 ? selectedDoc.id : `Resolved via Token Registry Registry: BC-${selectedDoc.id}`}
                  </div>
                </div>
                
                <div className="pt-6 border-t border-gray-100">
                  <p className="text-xs text-gray-500 font-medium leading-relaxed italic text-center">
                    "This document has been hashed and anchored to the Polygon Amoy blockchain. Its metadata and contents are stored immutably on IPFS, ensuring public transparency and preventing any unauthorized alteration of official barangay records."
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}