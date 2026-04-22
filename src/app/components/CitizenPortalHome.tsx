import { useState } from 'react';
import { Search, FileText, Calendar, Eye, User, Shield, Filter } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { mockDocuments } from '../utils/mockData';
import { PersistentSidebar } from './PersistentSidebar';

interface CitizenPortalHomeProps {
  onViewResolution: (id: string) => void;
  onLogout: () => void;
  onNavigate?: (view: string) => void;
}

export function CitizenPortalHome({ onViewResolution, onLogout, onNavigate }: CitizenPortalHomeProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterYear, setFilterYear] = useState('all');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const publishedDocuments = mockDocuments.filter(r => r.status === 'Published');

  const filteredDocuments = publishedDocuments.filter((document) => {
    const matchesSearch = 
      document.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      document.documentNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const year = new Date(document.dateApproved).getFullYear().toString();
    const matchesYear = filterYear === 'all' || year === filterYear;
    return matchesSearch && matchesYear;
  });

  const handleSidebarNavigate = (view: string) => {
    if (onNavigate) {
      onNavigate(view);
    }
  };

  return (
    <div className="min-h-screen animate-in zoom-in duration-300 bg-[#F8F3D9]">
      <PersistentSidebar 
        currentView="home"
        onNavigate={handleSidebarNavigate}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      {/* Main Content Area */}
      <div>
        {/* Header */}
        <header className="sticky top-0 z-40 border-b backdrop-blur-sm bg-[#EBE5C2]/90 border-[#504B38]/20">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="w-12 h-12 rounded-xl hover:scale-110 transition-all duration-300 group relative bg-[#B9B28A] border-2 border-[#504B38]/30 shadow-sm cursor-pointer"
                >
                  <div className="relative w-6 h-6 mx-auto flex flex-col justify-center gap-1.5">
                    <div className={`h-0.5 rounded-full transition-all duration-500 bg-white ${isSidebarOpen ? 'rotate-45 translate-y-2' : 'rotate-0'}`} style={{ width: '24px' }} />
                    <div className={`h-0.5 rounded-full transition-all duration-500 bg-white ${isSidebarOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}`} style={{ width: '20px' }} />
                    <div className={`h-0.5 rounded-full transition-all duration-500 bg-white ${isSidebarOpen ? '-rotate-45 -translate-y-2' : 'rotate-0'}`} style={{ width: '24px' }} />
                  </div>
                </button>
                
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-white shadow-sm">
                  <Shield className="w-6 h-6 text-[#504B38]" strokeWidth={1.5} />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-[#504B38] tracking-tight">GMA Blockchain</h1>
                  <p className="text-xs text-[#504B38]/60 font-black uppercase tracking-widest">Home</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleSidebarNavigate('koneksyong-lokal')}
                  className="px-4 py-2 rounded-lg transition-all hover:bg-[#504B38] hover:text-white bg-[#B9B28A] text-white font-bold text-sm shadow-sm cursor-pointer"
                >
                  Koneksyong Lokal
                </button>
                <Button 
                  variant="outline" 
                  onClick={onLogout}
                  className="border-2 hover:bg-[#504B38]/10 border-[#504B38]/30 text-[#504B38] font-bold"
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <div className="py-16 bg-[#EBE5C2] border-b border-[#504B38]/10">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <div className="space-y-4">
                <div className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center shadow-md bg-white">
                  <Shield className="w-10 h-10 text-[#B9B28A]" strokeWidth={1.5} />
                </div>
                
                <h2 className="text-4xl font-black text-[#504B38] tracking-tight">
                  Official Document Repository
                </h2>
                <p className="text-lg text-[#504B38]/70 font-medium">
                  Access verified barangay records and official documents
                </p>
              </div>

              {/* Search Bar */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-[#504B38]/10">
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#504B38]/40" />
                    <Input
                      placeholder="Search documents by title or number..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-12 h-12 border-2 rounded-lg focus-visible:ring-[#B9B28A]"
                      style={{ borderColor: '#EBE5C2' }}
                    />
                  </div>
                  <Select value={filterYear} onValueChange={setFilterYear}>
                    <SelectTrigger className="md:w-[150px] h-12 border-2 rounded-lg" style={{ borderColor: '#EBE5C2' }}>
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Years</SelectItem>
                      <SelectItem value="2025">2025</SelectItem>
                      <SelectItem value="2024">2024</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button 
                    className="h-12 px-8 rounded-lg bg-[#B9B28A] hover:bg-[#504B38] text-white font-bold cursor-pointer"
                  >
                    Search
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto pt-4">
                <div className="text-center py-4 px-6 rounded-xl bg-white/50 border border-[#504B38]/10 shadow-sm">
                  <div className="text-3xl font-black text-[#504B38]">{publishedDocuments.length}</div>
                  <div className="text-xs font-bold uppercase tracking-widest text-[#504B38]/60 mt-1">Total Documents</div>
                </div>
                <div className="text-center py-4 px-6 rounded-xl bg-white/50 border border-[#504B38]/10 shadow-sm">
                  <div className="text-3xl font-black text-[#504B38]">{publishedDocuments.length}</div>
                  <div className="text-xs font-bold uppercase tracking-widest text-[#504B38]/60 mt-1">Verified</div>
                </div>
                <div className="text-center py-4 px-6 rounded-xl bg-white/50 border border-[#504B38]/10 shadow-sm">
                  <div className="text-3xl font-black text-[#504B38]">6</div>
                  <div className="text-xs font-bold uppercase tracking-widest text-[#504B38]/60 mt-1">Active Areas</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Document List Section */}
        <div className="container mx-auto px-6 py-16">
          <div className="mb-8">
            <h3 className="text-2xl font-black text-[#504B38]">
              Available Documents
            </h3>
            <p className="text-[#504B38]/60 font-bold">
              {filteredDocuments.length} document{filteredDocuments.length !== 1 ? 's' : ''} found
            </p>
          </div>

          <div 
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom duration-500`}
          >
            {filteredDocuments.map((document) => {
              return (
                <Card 
                  key={document.id} 
                  className="border-2 hover:shadow-md transition-all duration-300 rounded-xl overflow-hidden hover:scale-[1.02] bg-white"
                  style={{ borderColor: '#EBE5C2' }}
                >
                  <div className="h-2 bg-[#B9B28A]" />
                  <CardHeader className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-tight bg-emerald-50 text-emerald-600 border border-emerald-100">
                        <Shield className="w-3 h-3" strokeWidth={2} />
                        <span>Verified Record</span>
                      </div>
                    </div>
                    <CardTitle className="text-lg font-bold leading-tight text-[#504B38]">
                      {document.title}
                    </CardTitle>
                    <p className="text-sm font-mono font-bold text-[#B9B28A]">
                      {document.documentNumber}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-[#504B38]/70 font-medium">
                        <Calendar className="w-4 h-4" strokeWidth={1.5} />
                        <span>{new Date(document.dateApproved).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[#504B38]/70 font-medium">
                        <User className="w-4 h-4" strokeWidth={1.5} />
                        <span>{document.approvedBy}</span>
                      </div>
                      <Button 
                        className="w-full rounded-lg mt-2 bg-[#B9B28A] hover:bg-[#504B38] text-white font-bold cursor-pointer transition-colors"
                        onClick={() => onViewResolution(document.id)}
                      >
                        <Eye className="w-4 h-4 mr-2" strokeWidth={1.5} />
                        View Document
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredDocuments.length === 0 && (
            <div className="text-center py-16">
              <FileText className="w-16 h-16 mx-auto mb-4 text-[#EBE5C2]" strokeWidth={1.5} />
              <p className="text-lg text-[#504B38]/60 font-black">No documents found matching your search</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="py-12 mt-16 bg-[#EBE5C2] border-t border-[#504B38]/10">
          <div className="container mx-auto px-6 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-white shadow-sm">
                <Shield className="w-6 h-6 text-[#504B38]" strokeWidth={1.5} />
              </div>
              <h2 className="text-xl font-black text-[#504B38]">GMA Blockchain</h2>
            </div>
            <p className="text-[#504B38]/60 font-black uppercase tracking-widest text-xs">
              Barangay Document Portal
            </p>
            <p className="text-sm mt-4 text-[#504B38]/40 font-medium">
              © 2026 GMA Blockchain. Digital Governance System
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
