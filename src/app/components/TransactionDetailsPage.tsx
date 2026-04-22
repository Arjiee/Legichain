import { ArrowLeft, Copy, CheckCircle2, ExternalLink, FileText, ArrowRight } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useState } from 'react';
import { Document } from '../utils/types';

interface TransactionDetailsPageProps {
  document: Document;
  onBack: () => void;
  onViewDocument?: (id: string) => void;
}

export function TransactionDetailsPage({ document, onBack, onViewDocument }: TransactionDetailsPageProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const truncateAddress = (address: string, startLength = 10, endLength = 8) => {
    return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
  };

  // Mock data for display
  const blockNumber = '6192835';
  const confirmations = '2547';
  const timestamp = new Date(document.dateApproved);
  const daysAgo = Math.floor((Date.now() - timestamp.getTime()) / (1000 * 60 * 60 * 24));
  
  // Extract addresses from blockchain transaction ID
  const fromAddress = document.blockchainTxId.slice(0, 42);
  const toAddress = '0x3f5CE5FBFe3E9af3971dD833D26bA9b5C936f0bE';

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #F5F5F5 0%, #E8E8E8 100%)' }}>
      <div className="p-8 space-y-6 max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all hover:scale-105"
          style={{
            borderColor: '#F6CE71',
            color: '#CC561E',
            background: 'white'
          }}
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
          <span className="font-medium">Back to Blockchain</span>
        </button>

        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-semibold tracking-tight" style={{ color: '#C40C0C' }}>
            Transaction Details
          </h1>
          <p style={{ color: '#CC561E' }}>
            Transaction Action: <span className="font-semibold">Transfer Document - {document.documentNumber}</span>
          </p>
        </div>

        {/* Main Transaction Details Card */}
        <Card className="border-2 shadow-lg rounded-xl" style={{ borderColor: '#F6CE71' }}>
          <CardContent className="p-8">
            <div className="space-y-6">
              {/* Transaction Hash */}
              <div className="flex items-start justify-between py-4 border-b" style={{ borderColor: 'rgba(204, 86, 30, 0.1)' }}>
                <div className="flex-shrink-0" style={{ width: '200px' }}>
                  <p className="font-medium" style={{ color: '#CC561E' }}>Transaction Hash:</p>
                </div>
                <div className="flex-1 flex items-center gap-3">
                  <p className="font-mono text-sm break-all" style={{ color: '#C40C0C' }}>
                    {document.blockchainTxId}
                  </p>
                  <button
                    onClick={() => copyToClipboard(document.blockchainTxId, 'txHash')}
                    className="flex-shrink-0 p-2 rounded-lg hover:bg-gray-100 transition-all"
                    style={{ color: '#CC561E' }}
                  >
                    {copiedField === 'txHash' ? (
                      <CheckCircle2 className="w-4 h-4" style={{ color: '#10B981' }} strokeWidth={1.5} />
                    ) : (
                      <Copy className="w-4 h-4" strokeWidth={1.5} />
                    )}
                  </button>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-start justify-between py-4 border-b" style={{ borderColor: 'rgba(204, 86, 30, 0.1)' }}>
                <div className="flex-shrink-0" style={{ width: '200px' }}>
                  <p className="font-medium" style={{ color: '#CC561E' }}>Status:</p>
                </div>
                <div className="flex-1">
                  <Badge
                    variant="outline"
                    className="border-2"
                    style={{
                      borderColor: '#10B981',
                      background: 'rgba(16, 185, 129, 0.1)',
                      color: '#10B981'
                    }}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" strokeWidth={2} />
                    Success
                  </Badge>
                </div>
              </div>

              {/* Block */}
              <div className="flex items-start justify-between py-4 border-b" style={{ borderColor: 'rgba(204, 86, 30, 0.1)' }}>
                <div className="flex-shrink-0" style={{ width: '200px' }}>
                  <p className="font-medium" style={{ color: '#CC561E' }}>Block:</p>
                </div>
                <div className="flex-1 flex items-center gap-3">
                  <button
                    className="font-semibold hover:underline"
                    style={{ color: '#FF6500' }}
                  >
                    {blockNumber}
                  </button>
                  <Badge
                    variant="outline"
                    className="border"
                    style={{
                      borderColor: 'rgba(204, 86, 30, 0.2)',
                      background: 'rgba(204, 86, 30, 0.05)',
                      color: '#CC561E'
                    }}
                  >
                    {confirmations} Block Confirmations
                  </Badge>
                </div>
              </div>

              {/* Timestamp */}
              <div className="flex items-start justify-between py-4 border-b" style={{ borderColor: 'rgba(204, 86, 30, 0.1)' }}>
                <div className="flex-shrink-0" style={{ width: '200px' }}>
                  <p className="font-medium" style={{ color: '#CC561E' }}>Timestamp:</p>
                </div>
                <div className="flex-1">
                  <p style={{ color: '#C40C0C' }}>
                    {timestamp.toLocaleString()} <span style={{ color: '#CC561E' }}>({daysAgo} days ago)</span>
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px" style={{ background: 'rgba(204, 86, 30, 0.1)' }} />

              {/* From */}
              <div className="flex items-start justify-between py-4 border-b" style={{ borderColor: 'rgba(204, 86, 30, 0.1)' }}>
                <div className="flex-shrink-0" style={{ width: '200px' }}>
                  <p className="font-medium" style={{ color: '#CC561E' }}>From:</p>
                </div>
                <div className="flex-1 flex items-center gap-3">
                  <button
                    className="font-mono text-sm hover:underline"
                    style={{ color: '#FF6500' }}
                  >
                    {fromAddress}
                  </button>
                  <button
                    onClick={() => copyToClipboard(fromAddress, 'from')}
                    className="flex-shrink-0 p-2 rounded-lg hover:bg-gray-100 transition-all"
                    style={{ color: '#CC561E' }}
                  >
                    {copiedField === 'from' ? (
                      <CheckCircle2 className="w-4 h-4" style={{ color: '#10B981' }} strokeWidth={1.5} />
                    ) : (
                      <Copy className="w-4 h-4" strokeWidth={1.5} />
                    )}
                  </button>
                </div>
              </div>

              {/* Interacted With (To) */}
              <div className="flex items-start justify-between py-4 border-b" style={{ borderColor: 'rgba(204, 86, 30, 0.1)' }}>
                <div className="flex-shrink-0" style={{ width: '200px' }}>
                  <p className="font-medium" style={{ color: '#CC561E' }}>Interacted With (To):</p>
                </div>
                <div className="flex-1 flex items-center gap-3">
                  <div 
                    className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(204, 86, 30, 0.1)' }}
                  >
                    <FileText className="w-3.5 h-3.5" style={{ color: '#CC561E' }} strokeWidth={1.5} />
                  </div>
                  <button
                    className="font-mono text-sm hover:underline"
                    style={{ color: '#FF6500' }}
                  >
                    {toAddress}
                  </button>
                  <button
                    onClick={() => copyToClipboard(toAddress, 'to')}
                    className="flex-shrink-0 p-2 rounded-lg hover:bg-gray-100 transition-all"
                    style={{ color: '#CC561E' }}
                  >
                    {copiedField === 'to' ? (
                      <CheckCircle2 className="w-4 h-4" style={{ color: '#10B981' }} strokeWidth={1.5} />
                    ) : (
                      <Copy className="w-4 h-4" strokeWidth={1.5} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ERC-721 Tokens Transferred */}
        <Card className="border-2 shadow-lg rounded-xl" style={{ borderColor: '#F6CE71' }}>
          <CardContent className="p-8">
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-4 border-b" style={{ borderColor: 'rgba(204, 86, 30, 0.1)' }}>
                <FileText className="w-5 h-5" style={{ color: '#CC561E' }} strokeWidth={1.5} />
                <h2 className="text-xl font-semibold" style={{ color: '#C40C0C' }}>
                  Document Tokens Transferred
                </h2>
              </div>

              {/* Token Transfer Card */}
              <div 
                className="p-6 rounded-xl border-2"
                style={{ 
                  background: 'rgba(204, 86, 30, 0.03)',
                  borderColor: 'rgba(204, 86, 30, 0.15)'
                }}
              >
                <div className="space-y-4">
                  {/* Token Info Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ background: '#CC561E' }}
                      >
                        <FileText className="w-6 h-6 text-white" strokeWidth={1.5} />
                      </div>
                      <div>
                        <p className="text-sm" style={{ color: '#CC561E' }}>Token ID</p>
                        <p className="font-semibold" style={{ color: '#C40C0C' }}>
                          {document.documentNumber}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="border-2"
                      style={{
                        borderColor: '#CC561E',
                        background: 'rgba(204, 86, 30, 0.1)',
                        color: '#CC561E'
                      }}
                    >
                      {document.category}
                    </Badge>
                  </div>

                  {/* Document Name */}
                  <div className="px-4 py-3 rounded-lg" style={{ background: 'white' }}>
                    <p className="text-sm mb-1" style={{ color: '#CC561E' }}>Document Title</p>
                    <p className="font-semibold" style={{ color: '#C40C0C' }}>
                      {document.title}
                    </p>
                  </div>

                  {/* Transfer Details */}
                  <div className="grid grid-cols-1 gap-3">
                    {/* From */}
                    <div className="flex items-center gap-3 p-4 rounded-lg" style={{ background: 'white' }}>
                      <div className="flex-shrink-0" style={{ width: '60px' }}>
                        <p className="text-sm font-medium" style={{ color: '#CC561E' }}>From:</p>
                      </div>
                      <button
                        className="font-mono text-sm hover:underline flex-1 text-left"
                        style={{ color: '#FF6500' }}
                      >
                        {fromAddress}
                      </button>
                      <button
                        onClick={() => copyToClipboard(fromAddress, 'tokenFrom')}
                        className="flex-shrink-0 p-2 rounded-lg hover:bg-gray-100 transition-all"
                        style={{ color: '#CC561E' }}
                      >
                        {copiedField === 'tokenFrom' ? (
                          <CheckCircle2 className="w-4 h-4" style={{ color: '#10B981' }} strokeWidth={1.5} />
                        ) : (
                          <Copy className="w-4 h-4" strokeWidth={1.5} />
                        )}
                      </button>
                    </div>

                    {/* Arrow */}
                    <div className="flex justify-center">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ background: 'rgba(204, 86, 30, 0.1)' }}
                      >
                        <ArrowRight className="w-5 h-5" style={{ color: '#10B981' }} strokeWidth={2} />
                      </div>
                    </div>

                    {/* To */}
                    <div className="flex items-center gap-3 p-4 rounded-lg" style={{ background: 'white' }}>
                      <div className="flex-shrink-0" style={{ width: '60px' }}>
                        <p className="text-sm font-medium" style={{ color: '#CC561E' }}>To:</p>
                      </div>
                      <button
                        className="font-mono text-sm hover:underline flex-1 text-left"
                        style={{ color: '#FF6500' }}
                      >
                        {toAddress}
                      </button>
                      <button
                        onClick={() => copyToClipboard(toAddress, 'tokenTo')}
                        className="flex-shrink-0 p-2 rounded-lg hover:bg-gray-100 transition-all"
                        style={{ color: '#CC561E' }}
                      >
                        {copiedField === 'tokenTo' ? (
                          <CheckCircle2 className="w-4 h-4" style={{ color: '#10B981' }} strokeWidth={1.5} />
                        ) : (
                          <Copy className="w-4 h-4" strokeWidth={1.5} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Additional Details */}
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t" style={{ borderColor: 'rgba(204, 86, 30, 0.1)' }}>
                    <div className="p-3 rounded-lg" style={{ background: 'white' }}>
                      <p className="text-sm mb-1" style={{ color: '#CC561E' }}>File Hash</p>
                      <p className="font-mono text-xs truncate" style={{ color: '#C40C0C' }}>
                        {document.fileHash}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg" style={{ background: 'white' }}>
                      <p className="text-sm mb-1" style={{ color: '#CC561E' }}>IPFS CID</p>
                      <p className="font-mono text-xs truncate" style={{ color: '#C40C0C' }}>
                        {document.ipfsCID}
                      </p>
                    </div>
                  </div>

                  {/* View Document Button */}
                  <div className="pt-3">
                    <Button
                      onClick={() => onViewDocument && onViewDocument(document.id)}
                      className="w-full rounded-lg font-medium transition-all hover:scale-105"
                      style={{
                        background: '#CC561E',
                        color: 'white'
                      }}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" strokeWidth={1.5} />
                      View Full Document
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
