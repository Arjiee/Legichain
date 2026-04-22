import { Calendar, Clock, FileText, CheckCircle, XCircle, AlertCircle, Shield, Download, Eye } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { PersistentSidebar } from './PersistentSidebar';
import { useState } from 'react';

interface Transaction {
  id: string;
  date: string;
  time: string;
  documentType: string;
  documentName: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  user: string;
}

interface RecentTransactionsProps {
  onLogout: () => void;
  onNavigate?: (view: string) => void;
}

export function RecentTransactions({ onLogout, onNavigate }: RecentTransactionsProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSidebarNavigate = (view: string) => {
    if (onNavigate) {
      onNavigate(view);
    }
  };

  const transactions: Transaction[] = [
    {
      id: '1',
      date: '2025-01-15',
      time: '10:30 AM',
      documentType: 'Barangay Resolution',
      documentName: 'Resolution No. 2025-001: Community Development Program',
      status: 'Approved',
      user: 'John Doe'
    },
    {
      id: '2',
      date: '2025-01-15',
      time: '09:15 AM',
      documentType: 'Executive Order',
      documentName: 'EO 2025-003: Budget Allocation for Public Works',
      status: 'Approved',
      user: 'Jane Smith'
    },
    {
      id: '3',
      date: '2025-01-14',
      time: '11:00 AM',
      documentType: 'Report & Financial Aid',
      documentName: 'Q4 2024 Financial Report and Disbursement',
      status: 'Approved',
      user: 'Lisa Santos'
    },
    {
      id: '4',
      date: '2025-01-14',
      time: '02:20 PM',
      documentType: 'Bids and Awards Committee',
      documentName: 'BAC Resolution 2025-001: Infrastructure Project Bidding',
      status: 'Approved',
      user: 'Robert Cruz'
    },
    {
      id: '5',
      date: '2025-01-13',
      time: '03:30 PM',
      documentType: 'Barangay Resolution',
      documentName: 'Resolution No. 2025-002: Youth Development Initiative',
      status: 'Rejected',
      user: 'Michael Reyes'
    },
    {
      id: '6',
      date: '2025-01-13',
      time: '01:15 PM',
      documentType: 'Executive Order',
      documentName: 'EO 2025-004: Emergency Response Protocol',
      status: 'Approved',
      user: 'Sarah Lee'
    },
    {
      id: '7',
      date: '2025-01-12',
      time: '10:00 AM',
      documentType: 'Barangay Ordinance',
      documentName: 'Ordinance No. 2025-003: Traffic Management',
      status: 'Pending',
      user: 'David Martinez'
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved':
        return <CheckCircle className="w-5 h-5 text-emerald-600" strokeWidth={2} />;
      case 'Pending':
        return <AlertCircle className="w-5 h-5 text-orange-600" strokeWidth={2} />;
      case 'Rejected':
        return <XCircle className="w-5 h-5 text-red-600" strokeWidth={2} />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      Approved: { bg: 'rgba(16, 185, 129, 0.1)', color: '#059669', border: '#10b981' },
      Pending: { bg: 'rgba(249, 115, 22, 0.1)', color: '#ea580c', border: '#f97316' },
      Rejected: { bg: 'rgba(220, 38, 38, 0.1)', color: '#b91c1c', border: '#ef4444' }
    };

    const style = styles[status as keyof typeof styles];

    return (
      <Badge 
        variant="outline" 
        className="border-2 flex items-center gap-1.5"
        style={{ 
          background: style.bg,
          color: style.color,
          borderColor: style.border
        }}
      >
        {getStatusIcon(status)}
        {status}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen animate-in zoom-in duration-300" style={{ background: 'linear-gradient(135deg, #F5F5F5 0%, #E8E8E8 100%)' }}>
      <PersistentSidebar 
        currentView="history"
        onNavigate={handleSidebarNavigate}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      {/* Header */}
      <header className="sticky top-0 z-40 border-b backdrop-blur-sm" style={{ 
        background: 'rgba(196, 12, 12, 0.95)',
        borderColor: 'rgba(204, 86, 30, 0.3)'
      }}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Hamburger Menu Button - Left Side */}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="w-12 h-12 rounded-xl hover:scale-110 transition-all duration-300 group relative"
                style={{
                  background: isSidebarOpen 
                    ? 'linear-gradient(135deg, #CC561E 0%, #FF6500 100%)' 
                    : 'linear-gradient(135deg, #C40C0C 0%, #FF6500 100%)',
                  border: '2px solid #F6CE71',
                  boxShadow: isSidebarOpen 
                    ? '0 0 30px rgba(204, 86, 30, 0.6), 0 0 15px rgba(204, 86, 30, 0.4)' 
                    : '0 0 30px rgba(196, 12, 12, 0.6), 0 0 15px rgba(196, 12, 12, 0.4)'
                }}
              >
                <div className="relative w-6 h-6 mx-auto flex flex-col justify-center gap-1.5">
                  {/* Top Line */}
                  <div 
                    className={`h-0.5 rounded-full transition-all duration-500 ${isSidebarOpen ? 'rotate-45 translate-y-2' : 'rotate-0'}`}
                    style={{ 
                      width: '24px',
                      background: 'linear-gradient(90deg, #F6CE71 0%, white 100%)',
                      boxShadow: '0 0 8px rgba(246, 206, 113, 0.6)',
                      transformOrigin: 'center'
                    }}
                  />
                  {/* Middle Line */}
                  <div 
                    className={`h-0.5 rounded-full transition-all duration-500 ${isSidebarOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}`}
                    style={{ 
                      width: '20px',
                      background: 'linear-gradient(90deg, #F6CE71 0%, white 100%)',
                      boxShadow: '0 0 8px rgba(246, 206, 113, 0.6)'
                    }}
                  />
                  {/* Bottom Line */}
                  <div 
                    className={`h-0.5 rounded-full transition-all duration-500 ${isSidebarOpen ? '-rotate-45 -translate-y-2' : 'rotate-0'}`}
                    style={{ 
                      width: '24px',
                      background: 'linear-gradient(90deg, #F6CE71 0%, white 100%)',
                      boxShadow: '0 0 8px rgba(246, 206, 113, 0.6)',
                      transformOrigin: 'center'
                    }}
                  />
                  {/* Glow effect on hover */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"
                    style={{
                      background: 'radial-gradient(circle, rgba(246, 206, 113, 0.3) 0%, transparent 70%)',
                      filter: 'blur(8px)'
                    }}
                  />
                </div>
              </button>

              {/* Logo */}
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#CC561E' }}>
                <Shield className="w-6 h-6 text-white" strokeWidth={1.5} />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-white tracking-tight">GMA Blockchain</h1>
                <p className="text-xs" style={{ color: '#F6CE71' }}>History</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={onLogout}
                className="border-2 hover:scale-105 transition-all"
                style={{
                  borderColor: '#F6CE71',
                  color: '#F6CE71',
                  background: 'transparent'
                }}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="py-12" style={{ background: 'linear-gradient(135deg, #C40C0C 0%, #FF6500 100%)' }}>
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-4">
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
                style={{ 
                  background: 'linear-gradient(135deg, #CC561E 0%, #FF6500 100%)',
                  boxShadow: '0 0 30px rgba(204, 86, 30, 0.5)'
                }}
              >
                <FileText className="w-8 h-8 text-white" strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="text-3xl font-semibold text-white tracking-tight">
                  Recent Transactions
                </h2>
                <p className="text-lg mt-1" style={{ color: '#F6CE71' }}>
                  Complete document transaction history
                </p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
              <div 
                className="p-4 rounded-xl backdrop-blur-sm border"
                style={{ 
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderColor: 'rgba(246, 206, 113, 0.3)'
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm" style={{ color: '#F6CE71' }}>Total</p>
                    <p className="text-2xl font-semibold text-white mt-1">{transactions.length}</p>
                  </div>
                  <FileText className="w-8 h-8" style={{ color: '#F6CE71' }} strokeWidth={1.5} />
                </div>
              </div>

              <div 
                className="p-4 rounded-xl backdrop-blur-sm border"
                style={{ 
                  background: 'rgba(16, 185, 129, 0.1)',
                  borderColor: 'rgba(16, 185, 129, 0.3)'
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-emerald-200">Approved</p>
                    <p className="text-2xl font-semibold text-white mt-1">
                      {transactions.filter(t => t.status === 'Approved').length}
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-emerald-400" strokeWidth={1.5} />
                </div>
              </div>

              <div 
                className="p-4 rounded-xl backdrop-blur-sm border"
                style={{ 
                  background: 'rgba(249, 115, 22, 0.1)',
                  borderColor: 'rgba(249, 115, 22, 0.3)'
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-orange-200">Pending</p>
                    <p className="text-2xl font-semibold text-white mt-1">
                      {transactions.filter(t => t.status === 'Pending').length}
                    </p>
                  </div>
                  <AlertCircle className="w-8 h-8 text-orange-400" strokeWidth={1.5} />
                </div>
              </div>

              <div 
                className="p-4 rounded-xl backdrop-blur-sm border"
                style={{ 
                  background: 'rgba(239, 68, 68, 0.1)',
                  borderColor: 'rgba(239, 68, 68, 0.3)'
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-red-200">Rejected</p>
                    <p className="text-2xl font-semibold text-white mt-1">
                      {transactions.filter(t => t.status === 'Rejected').length}
                    </p>
                  </div>
                  <XCircle className="w-8 h-8 text-red-400" strokeWidth={1.5} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div 
            className="rounded-xl overflow-hidden border-2 shadow-2xl animate-in slide-in-from-bottom duration-500"
            style={{ 
              background: 'white',
              borderColor: '#F6CE71'
            }}
          >
            {/* Table Header */}
            <div 
              className="px-6 py-4 border-b-2"
              style={{ 
                background: 'linear-gradient(135deg, #C40C0C 0%, #FF6500 100%)',
                borderColor: '#F6CE71'
              }}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Transaction Records</h3>
                <Button
                  className="rounded-lg"
                  style={{ 
                    background: '#F6CE71',
                    color: '#C40C0C'
                  }}
                >
                  <Download className="w-4 h-4 mr-2" strokeWidth={2} />
                  Export
                </Button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ background: 'rgba(196, 12, 12, 0.05)' }}>
                    <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#C40C0C' }}>
                      Date & Time
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#C40C0C' }}>
                      Document Type
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#C40C0C' }}>
                      Document Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#C40C0C' }}>
                      Status
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold" style={{ color: '#C40C0C' }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction, index) => (
                    <tr 
                      key={transaction.id}
                      className="border-t hover:bg-gray-50 transition-colors duration-200 animate-in slide-in-from-bottom"
                      style={{ 
                        borderColor: '#E5E7EB',
                        animationDelay: `${index * 50}ms`,
                        animationDuration: '400ms'
                      }}
                    >
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2" style={{ color: '#C40C0C' }}>
                            <Calendar className="w-4 h-4" strokeWidth={1.5} />
                            <span className="text-sm font-medium">
                              {new Date(transaction.date).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric', 
                                year: 'numeric' 
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2" style={{ color: '#CC561E' }}>
                            <Clock className="w-4 h-4" strokeWidth={1.5} />
                            <span className="text-sm">{transaction.time}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge 
                          variant="outline" 
                          className="border-2"
                          style={{ 
                            borderColor: '#C40C0C',
                            color: '#C40C0C',
                            background: 'rgba(196, 12, 12, 0.05)'
                          }}
                        >
                          {transaction.documentType}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium" style={{ color: '#C40C0C' }}>
                          {transaction.documentName}
                        </p>
                        <p className="text-xs mt-1" style={{ color: '#CC561E' }}>
                          Processed by: {transaction.user}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(transaction.status)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            className="p-2 rounded-lg hover:scale-110 transition-all"
                            style={{ 
                              background: 'rgba(204, 86, 30, 0.1)',
                              color: '#CC561E'
                            }}
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" strokeWidth={2} />
                          </button>
                          <button
                            className="p-2 rounded-lg hover:scale-110 transition-all"
                            style={{ 
                              background: 'rgba(246, 206, 113, 0.2)',
                              color: '#C40C0C'
                            }}
                            title="Download"
                          >
                            <Download className="w-4 h-4" strokeWidth={2} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div 
              className="px-6 py-4 border-t flex items-center justify-between"
              style={{ 
                background: 'rgba(196, 12, 12, 0.02)',
                borderColor: '#E5E7EB'
              }}
            >
              <p className="text-sm" style={{ color: '#CC561E' }}>
                Showing {transactions.length} transactions
              </p>
              <div className="flex gap-2">
                <button 
                  className="px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all hover:scale-105"
                  style={{ 
                    borderColor: '#F6CE71',
                    color: '#C40C0C',
                    background: 'white'
                  }}
                >
                  Previous
                </button>
                <button 
                  className="px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all hover:scale-105"
                  style={{ 
                    borderColor: '#F6CE71',
                    color: 'white',
                    background: '#FF6500'
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 mt-16" style={{ background: '#C40C0C' }}>
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#CC561E' }}>
              <Shield className="w-6 h-6 text-white" strokeWidth={1.5} />
            </div>
            <h2 className="text-xl font-semibold text-white">GMA Blockchain</h2>
          </div>
          <p style={{ color: '#F6CE71' }}>
            Barangay Document Portal
          </p>
          <p className="text-sm mt-2" style={{ color: '#CC561E' }}>
            © 2025 GMA Blockchain. Digital Governance System
          </p>
        </div>
      </footer>
    </div>
  );
}
