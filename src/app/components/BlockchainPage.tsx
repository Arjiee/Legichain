import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { ArrowRight, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, FileText, Shield } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Badge } from './ui/badge';

interface Transaction {
  txHash: string;
  block: string;
  age: string;
  from: string;
  to: string;
  value: string;
  txFee: string;
  status: 'Success' | 'Pending' | 'Failed';
  timestamp: string;
  gasUsed: string;
  documentType?: string;
  hasContract?: boolean;
}

// Sample blockchain transaction data
const mockTransactions: Transaction[] = [
  {
    txHash: '0x3dcf36945ae87b21a0b5b97a1d565261ac5930e99c4b6e9d20c29d9cdce90faf',
    block: '6192835',
    age: '22 secs ago',
    from: '0xb59f870e68851e1e5bc44a93fd384d99f12abfe6',
    to: '0x3f5CE5FBFe3E9af3971dD833D26BA9b5C936f0bE',
    value: '0.003 Ether',
    txFee: '0.00090537',
    status: 'Success',
    timestamp: '2025-12-09 14:32:15',
    gasUsed: '21000',
    documentType: 'Barangay Resolution',
    hasContract: false
  },
  {
    txHash: '0xd9217a9a5498bb260a4115f1b7562e0e3da2d98b3f2aae12db23f2cd86b34f1e',
    block: '6192835',
    age: '22 secs ago',
    from: '0xa52105ed7b0a44629eea1c0e60f4115f1de5b97f',
    to: '0x734eff45608b03a0c69e3e76ca4bb14d29ffe92e',
    value: '0.01 Ether',
    txFee: '0.00090537',
    status: 'Success',
    timestamp: '2025-12-09 14:29:42',
    gasUsed: '21000',
    documentType: 'Executive Order',
    hasContract: false
  },
  {
    txHash: '0x4a625e468cc5f1a0b5697b1bb3d09ebef3a2a56d8c7f9e2d1c0b9a8f7e6d5c4b',
    block: '6192835',
    age: '22 secs ago',
    from: '0x362e8b2499035012ea8a75a9c4d1e5bc44a93fd3',
    to: '0x003fffeffbc04a8f3d4e5be6ccf7d9ae3b2a1f0e',
    value: '0 Ether',
    txFee: '0.00010432',
    status: 'Success',
    timestamp: '2025-12-09 14:26:18',
    gasUsed: '21000',
    documentType: 'Barangay Ordinance',
    hasContract: true
  },
  {
    txHash: '0xc347be366bc91b55689e2c2d9ae13f1de0ba4f6e9d8c7b6a5f4e3d2c1b0a9f8e',
    block: '6192835',
    age: '22 secs ago',
    from: '0x20fcbd54ce82f6178d34a2e5bc79c1a93fd384d9',
    to: '0x003fffeffbc04a8f3d4e5be6ccf7d9ae3b2a1f0e',
    value: '0 Ether',
    txFee: '0.00029908',
    status: 'Success',
    timestamp: '2025-12-09 14:22:54',
    gasUsed: '21000',
    documentType: 'Bids and Awards',
    hasContract: true
  },
  {
    txHash: '0x2b05d52cc6c9bec7aa9d098e6d5b0c3a2f1e9d8c7b6a5f4e3d2c1b0a9f8e7d6c',
    block: '6192835',
    age: '22 secs ago',
    from: '0xWaterholePool',
    to: '0xe124eb3c15a70d487f7c95b3a1e5bc44a93fd384',
    value: '0.737706152 Ether',
    txFee: '0.000063',
    status: 'Success',
    timestamp: '2025-12-09 14:19:31',
    gasUsed: '21000',
    documentType: 'Report & Financial Aid',
    hasContract: false
  },
];

export function BlockchainPage() {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalTransactions = 296266836; // Mock total
  const displayedPages = 10000;

  const truncateHash = (hash: string, showDots: boolean = true) => {
    if (hash.startsWith('0xW')) return hash;
    return showDots ? `${hash.slice(0, 18)}...` : hash.slice(0, 18);
  };

  const truncateAddress = (address: string) => {
    if (address.startsWith('0xW')) return address;
    return `${address.slice(0, 18)}...`;
  };

  const handleTransactionClick = (tx: Transaction) => {
    setSelectedTransaction(tx);
  };

  // Simplified logic for example
  const currentTransactions = mockTransactions;

  return (
    <div className="min-h-screen bg-[#F8F3D9]">
      <div className="p-8 space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-[#504B38]">
            Transactions
          </h1>
        </div>

        <div className="p-4 rounded-xl border-2 bg-[#EBE5C2]/20 border-[#504B38]/30">
          <p className="text-[#504B38] font-medium">
            More than &gt; <span className="font-bold">{totalTransactions.toLocaleString()}</span> transactions found (showing the last 500k records)
          </p>
        </div>

        <Card className="border-2 shadow-sm rounded-2xl overflow-hidden border-[#504B38]/10 bg-white">
          <div className="flex items-center justify-end gap-2 p-4 border-b border-[#EBE5C2] bg-[#EBE5C2]/10">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg border-2 transition-all hover:bg-[#EBE5C2]/30 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-bold border-[#504B38]/30 text-[#504B38] bg-white"
            >
              First
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg border-2 transition-all hover:bg-[#EBE5C2]/30 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-bold border-[#504B38]/30 text-[#504B38] bg-white"
            >
              Prev
            </button>
            
            <div className="px-4 py-1.5 text-sm font-bold text-[#504B38]">
              Page <span className="font-black">{currentPage}</span> of <span className="font-black">{displayedPages.toLocaleString()}</span>
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(displayedPages, prev + 1))}
              disabled={currentPage === displayedPages}
              className="px-3 py-1.5 rounded-lg border-2 transition-all hover:bg-[#EBE5C2]/30 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-bold border-[#504B38]/30 text-[#504B38] bg-white"
            >
              Next
            </button>
            <button
              onClick={() => setCurrentPage(displayedPages)}
              disabled={currentPage === displayedPages}
              className="px-3 py-1.5 rounded-lg border-2 transition-all hover:bg-[#EBE5C2]/30 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-bold border-[#504B38]/30 text-[#504B38] bg-white"
            >
              Last
            </button>
          </div>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#F8F3D9]">
                    <th className="text-left px-4 py-4 font-bold text-sm text-[#504B38]">TxHash</th>
                    <th className="text-left px-4 py-4 font-bold text-sm text-[#504B38]">Block</th>
                    <th className="text-left px-4 py-4 font-bold text-sm text-[#504B38]">Age</th>
                    <th className="text-left px-4 py-4 font-bold text-sm text-[#504B38]">From</th>
                    <th className="px-2 py-4"></th>
                    <th className="text-left px-4 py-4 font-bold text-sm text-[#504B38]">To</th>
                    <th className="text-left px-4 py-4 font-bold text-sm text-[#504B38]">Value</th>
                    <th className="text-left px-4 py-4 font-bold text-sm text-[#504B38]/60">[TxFee]</th>
                  </tr>
                </thead>
                <tbody>
                  {currentTransactions.map((tx, index) => (
                    <tr
                      key={index}
                      className="border-t border-[#EBE5C2]/30 transition-colors hover:bg-[#EBE5C2]/10"
                    >
                      <td className="px-4 py-4">
                        <button
                          onClick={() => handleTransactionClick(tx)}
                          className="hover:text-[#B9B28A] transition-all font-mono text-sm font-medium text-[#504B38]"
                        >
                          {truncateHash(tx.txHash)}
                        </button>
                      </td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => handleTransactionClick(tx)}
                          className="hover:text-[#B9B28A] text-sm font-bold text-[#504B38]"
                        >
                          {tx.block}
                        </button>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-400 font-medium">{tx.age}</td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => handleTransactionClick(tx)}
                          className="font-mono text-sm hover:text-[#B9B28A] text-[#504B38]"
                        >
                          {truncateAddress(tx.from)}
                        </button>
                      </td>
                      <td className="px-2 py-4">
                        <div className="flex justify-center">
                          <div className="w-6 h-6 rounded-full bg-[#EBE5C2]/50 flex items-center justify-center">
                            <ArrowRight className="w-3.5 h-3.5 text-[#504B38]" strokeWidth={3} />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          {tx.hasContract && <FileText className="w-3.5 h-3.5 text-[#504B38]/60" />}
                          <button
                            onClick={() => handleTransactionClick(tx)}
                            className="font-mono text-sm hover:text-[#B9B28A] text-[#504B38] truncate"
                          >
                            {truncateAddress(tx.to)}
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm font-bold text-[#504B38]">{tx.value}</td>
                      <td className="px-4 py-4 text-sm font-medium text-gray-400">{tx.txFee}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-end gap-2 p-4 border-t border-[#EBE5C2] bg-[#EBE5C2]/10">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-lg border-2 transition-all hover:bg-[#EBE5C2]/30 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-bold border-[#504B38]/30 text-[#504B38] bg-white"
              >
                First
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-lg border-2 transition-all hover:bg-[#EBE5C2]/30 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-bold border-[#504B38]/30 text-[#504B38] bg-white"
              >
                Prev
              </button>
              <div className="px-4 py-1.5 text-sm font-bold text-[#504B38]">
                Page <span className="font-black">{currentPage}</span> of <span className="font-black">{displayedPages.toLocaleString()}</span>
              </div>
              <button
                onClick={() => setCurrentPage(prev => Math.min(displayedPages, prev + 1))}
                disabled={currentPage === displayedPages}
                className="px-3 py-1.5 rounded-lg border-2 transition-all hover:bg-[#EBE5C2]/30 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-bold border-[#504B38]/30 text-[#504B38] bg-white"
              >
                Next
              </button>
              <button
                onClick={() => setCurrentPage(displayedPages)}
                disabled={currentPage === displayedPages}
                className="px-3 py-1.5 rounded-lg border-2 transition-all hover:bg-[#EBE5C2]/30 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-bold border-[#504B38]/30 text-[#504B38] bg-white"
              >
                Last
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={selectedTransaction !== null} onOpenChange={() => setSelectedTransaction(null)}>
        <DialogContent className="max-w-2xl border-4 shadow-xl border-[#B9B28A] rounded-3xl overflow-hidden p-0">
          <DialogHeader className="bg-[#EBE5C2] p-8 text-[#504B38]">
            <DialogTitle className="text-2xl font-black flex items-center gap-2">
              <Shield className="w-6 h-6 text-[#B9B28A]" />
              Transaction Details
            </DialogTitle>
            <DialogDescription className="text-[#504B38]/80 font-medium">
              Blockchain cryptographic proof of record
            </DialogDescription>
          </DialogHeader>
          
          {selectedTransaction && (
            <div className="p-8 space-y-6 bg-white">
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-[#F8F3D9] border border-[#504B38]/20">
                  <p className="text-[10px] font-black uppercase text-[#504B38]/60 tracking-widest mb-1">Status</p>
                  <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-none font-bold">
                    {selectedTransaction.status}
                  </Badge>
                </div>
                <div className="p-4 rounded-2xl bg-[#F8F3D9] border border-[#504B38]/20">
                  <p className="text-[10px] font-black uppercase text-[#504B38]/60 tracking-widest mb-1">Block</p>
                  <p className="font-black text-[#504B38]">{selectedTransaction.block}</p>
                </div>
                <div className="p-4 rounded-2xl bg-[#F8F3D9] border border-[#504B38]/20">
                  <p className="text-[10px] font-black uppercase text-[#504B38]/60 tracking-widest mb-1">Confirmations</p>
                  <p className="font-black text-[#504B38]">2,541</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="group">
                  <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 px-1">Transaction Hash</p>
                  <div className="p-4 rounded-xl bg-gray-50 border-2 border-gray-100 font-mono text-xs break-all text-[#504B38] font-bold group-hover:border-[#B9B28A] transition-colors">
                    {selectedTransaction.txHash}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 px-1">From</p>
                    <div className="p-4 rounded-xl bg-gray-50 border-2 border-gray-100 font-mono text-xs truncate text-[#504B38] font-bold">
                      {selectedTransaction.from}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 px-1">Interacted With (To)</p>
                    <div className="p-4 rounded-xl bg-gray-50 border-2 border-gray-100 font-mono text-xs truncate text-[#504B38] font-bold">
                      {selectedTransaction.to}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                  <div>
                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Value</p>
                    <p className="text-xl font-black text-[#504B38]">{selectedTransaction.value}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Tx Fee</p>
                    <p className="font-bold text-[#504B38]">{selectedTransaction.txFee} Ether</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
