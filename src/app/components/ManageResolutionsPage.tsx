import { useState } from 'react';
import { ArrowRight, FileText, Search } from 'lucide-react';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { mockDocuments } from '../utils/mockData';
import { Document } from '../utils/types';

interface ManageResolutionsPageProps {
  onViewResolution: (id: string) => void;
  onViewTransaction: (document: Document) => void;
}

export function ManageResolutionsPage({ onViewResolution, onViewTransaction }: ManageResolutionsPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredDocuments = mockDocuments.filter((document) => {
    const matchesSearch = 
      document.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      document.documentNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || document.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const totalDocuments = filteredDocuments.length;
  const totalPages = Math.ceil(totalDocuments / itemsPerPage);

  const currentDocuments = filteredDocuments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const truncateHash = (hash: string) => {
    return `${hash.slice(0, 18)}...`;
  };

  const handleDocumentClick = (document: Document) => {
    onViewTransaction(document);
  };

  return (
    <div className="min-h-screen bg-[#F8F3D9]">
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-semibold tracking-tight" style={{ color: '#504B38' }}>
            Blockchain
          </h1>
          <p style={{ color: '#504B38' }}>Document transactions recorded on the blockchain</p>
        </div>

        {/* Search & Filter Bar */}
        <Card className="border-2 shadow-sm rounded-xl bg-white" style={{ borderColor: '#504B38' }}>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="md:col-span-2">
                <div className="relative">
                  <Search 
                    className="absolute left-3 top-3 w-4 h-4 text-[#504B38]" 
                    strokeWidth={1.5}
                  />
                  <Input
                    placeholder="Search by keyword, document number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-2 rounded-lg"
                    style={{ borderColor: '#EBE5C2' }}
                  />
                </div>
              </div>

              {/* Status Filter */}
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="border-2 rounded-lg" style={{ borderColor: '#EBE5C2' }}>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Published">Published</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Info Banner */}
        <div className="p-4 rounded-xl border-2" style={{ 
          background: '#EBE5C2/20',
          borderColor: '#B9B28A'
        }}>
          <p style={{ color: '#504B38' }}>
            <span className="font-semibold">{totalDocuments.toLocaleString()}</span> blockchain document transactions found
          </p>
        </div>

        {/* Documents Table Card */}
        <Card className="border-2 shadow-sm rounded-xl overflow-hidden bg-white" style={{ borderColor: '#504B38' }}>
          {/* Pagination Top */}
          <div className="flex items-center justify-end gap-2 p-4 border-b" style={{ borderColor: '#EBE5C2' }}>
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg border transition-all hover:bg-[#EBE5C2]/30 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium border-[#504B38]/30 text-[#504B38] bg-white"
            >
              First
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg border transition-all hover:bg-[#EBE5C2]/30 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium border-[#504B38]/30 text-[#504B38] bg-white"
            >
              Prev
            </button>
            
            <div className="px-4 py-1.5 text-sm font-medium text-[#504B38]">
              Page <span className="font-semibold">{currentPage}</span> of <span className="font-semibold">{totalPages.toLocaleString()}</span>
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg border transition-all hover:bg-[#EBE5C2]/30 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium border-[#504B38]/30 text-[#504B38] bg-white"
            >
              Next
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg border transition-all hover:bg-[#EBE5C2]/30 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium border-[#504B38]/30 text-[#504B38] bg-white"
            >
              Last
            </button>
          </div>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ background: '#F8F3D9' }}>
                    <th className="text-left px-4 py-3 font-medium text-sm text-[#504B38]">Document No.</th>
                    <th className="text-left px-4 py-3 font-medium text-sm text-[#504B38]">Title</th>
                    <th className="text-center px-2 py-3"></th>
                    <th className="text-left px-4 py-3 font-medium text-sm text-[#504B38]">Blockchain Hash</th>
                    <th className="text-left px-4 py-3 font-medium text-sm text-[#504B38]">Date Approved</th>
                    <th className="text-left px-4 py-3 font-medium text-sm text-[#504B38]">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {currentDocuments.map((document, index) => (
                    <tr
                      key={document.id}
                      className="border-t transition-colors cursor-pointer hover:bg-[#EBE5C2]/10"
                      style={{ borderColor: '#EBE5C2' }}
                      onClick={() => handleDocumentClick(document)}
                    >
                      <td className="px-4 py-3 font-mono text-sm text-[#B9B28A]">
                        {document.documentNumber}
                      </td>
                      <td className="px-4 py-3 max-w-xs">
                        <span className="text-sm truncate block text-[#504B38]">
                          {document.title}
                        </span>
                      </td>
                      <td className="px-2 py-3">
                        <div className="flex justify-center">
                          <ArrowRight className="w-4 h-4 text-[#B9B28A]" strokeWidth={2} />
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <FileText className="w-3.5 h-3.5 flex-shrink-0 text-[#504B38]/60" strokeWidth={1.5} />
                          <span className="font-mono text-sm text-[#B9B28A]">
                            {truncateHash(document.fileHash)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-[#504B38]/80">
                        {new Date(document.dateApproved).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant="outline"
                          className="border-2"
                          style={{
                            borderColor: '#B9B28A',
                            background: document.status === 'Published' ? '#EBE5C2' : 'white',
                            color: '#504B38'
                          }}
                        >
                          {document.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Bottom */}
            <div className="flex items-center justify-end gap-2 p-4 border-t" style={{ borderColor: '#EBE5C2' }}>
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-lg border transition-all hover:bg-[#EBE5C2]/30 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium border-[#504B38]/30 text-[#504B38] bg-white"
              >
                First
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-lg border transition-all hover:bg-[#EBE5C2]/30 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium border-[#504B38]/30 text-[#504B38] bg-white"
              >
                Prev
              </button>
              <div className="px-4 py-1.5 text-sm font-medium text-[#504B38]">
                Page <span className="font-semibold">{currentPage}</span> of <span className="font-semibold">{totalPages.toLocaleString()}</span>
              </div>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-lg border transition-all hover:bg-[#EBE5C2]/30 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium border-[#504B38]/30 text-[#504B38] bg-white"
              >
                Next
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-lg border transition-all hover:bg-[#EBE5C2]/30 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium border-[#504B38]/30 text-[#504B38] bg-white"
              >
                Last
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
