import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { FileText, CheckCircle, Clock, Database, Calendar, User, Activity, Loader2 } from 'lucide-react';
import { useData } from './DataContext'; // Real data hook
import { Badge } from './ui/badge';

export function AdminDashboard() {
  const { 
    dbDocuments, 
    blockchainTxs, 
    loadingDocuments, 
    loadingBlockchain,
    projectStats 
  } = useData();

  // Get the 8 most recent documents from the live state
  const recentDocuments = [...dbDocuments]
    .sort((a, b) => new Date(b.datePublished).getTime() - new Date(a.datePublished).getTime())
    .slice(0, 8);

  // Derived stats from live data
  const stats = [
    {
      title: 'Total Documents',
      value: loadingDocuments ? '...' : dbDocuments.length,
      icon: FileText,
      gradient: 'linear-gradient(135deg, #504B38 0%, #B9B28A 100%)'
    },
    {
      title: 'Verified Documents',
      value: loadingDocuments ? '...' : dbDocuments.filter(d => d.blockchainStatus === 'Verified').length,
      icon: CheckCircle,
      gradient: 'linear-gradient(135deg, #B9B28A 0%, #EBE5C2 100%)'
    },
    {
      title: 'Pending Verification',
      value: loadingDocuments ? '...' : dbDocuments.filter(d => d.blockchainStatus !== 'Verified').length,
      icon: Clock,
      gradient: 'linear-gradient(135deg, #EBE5C2 0%, #B9B28A 100%)'
    },
    {
      title: 'System Records',
      value: loadingBlockchain ? '...' : blockchainTxs.length + dbDocuments.length,
      icon: Database,
      gradient: 'linear-gradient(135deg, #B9B28A 0%, #504B38 100%)'
    },
  ];

  return (
    <div className="min-h-screen" style={{ background: '#F8F3D9' }}>
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight" style={{ color: '#504B38' }}>
            Admin Dashboard
          </h1>
          <p style={{ color: '#504B38' }} className="font-bold opacity-70">
            Real-time synchronization with Polygon Amoy Testnet
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card 
                key={stat.title} 
                className="border-2 shadow-sm hover:shadow-lg transition-all duration-300 rounded-[24px] overflow-hidden group bg-white"
                style={{ borderColor: 'rgba(80, 75, 56, 0.1)' }}
              >
                <div className="h-1.5" style={{ background: stat.gradient }} />
                <CardHeader className="flex flex-row items-center justify-between pb-2 pt-6">
                  <CardTitle className="text-[10px] font-black uppercase tracking-widest text-gray-400">{stat.title}</CardTitle>
                  <div className="p-3 rounded-2xl bg-[#F8F3D9] group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" style={{ color: '#B9B28A' }} strokeWidth={2} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-black" style={{ color: '#504B38' }}>
                    {stat.value}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Activity Table */}
        <Card className="border-2 shadow-sm rounded-[32px] bg-white overflow-hidden" style={{ borderColor: 'rgba(80, 75, 56, 0.1)' }}>
          <CardHeader className="border-b bg-gray-50/50 py-6" style={{ borderColor: 'rgba(80, 75, 56, 0.1)' }}>
            <CardTitle className="flex items-center gap-2 font-black text-xl text-[#504B38]">
              <Activity className="w-6 h-6 text-[#B9B28A]" strokeWidth={2.5} />
              Recent Registry Updates
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loadingDocuments ? (
              <div className="py-20 flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-[#B9B28A]" />
                <p className="font-bold text-[#504B38]/60">Syncing with Blockchain...</p>
              </div>
            ) : recentDocuments.length === 0 ? (
              <div className="py-20 text-center text-gray-400 font-bold">No recent activity found.</div>
            ) : (
              <div className="divide-y" style={{ borderColor: 'rgba(80, 75, 56, 0.05)' }}>
                {recentDocuments.map((doc, index) => (
                  <div
                    key={doc.id}
                    className="p-6 hover:bg-[#F8F3D9]/30 transition-all duration-200 group cursor-pointer"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-5 flex-1">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-gray-50 group-hover:bg-white transition-colors border border-gray-100">
                          <FileText className="w-6 h-6 text-[#B9B28A]" strokeWidth={1.5} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-black text-[#504B38] group-hover:text-[#B9B28A] transition-colors truncate">
                            {doc.title}
                          </p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider bg-gray-100 px-2 py-0.5 rounded">
                              {doc.documentId}
                            </span>
                            <span className="text-[10px] font-bold text-[#B9B28A]">
                              {doc.barangay}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex items-center gap-6">
                        <div className="hidden md:block">
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Status</p>
                          <Badge 
                            className={`border-none font-bold text-[10px] px-3 py-1 rounded-full ${
                              doc.blockchainStatus === 'Verified' 
                                ? 'bg-emerald-500 text-white' 
                                : 'bg-amber-500 text-white'
                            }`}
                          >
                            {doc.blockchainStatus}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center justify-end gap-1">
                            <Calendar className="w-3 h-3" /> Date
                          </p>
                          <p className="text-xs font-bold text-[#504B38]">
                            {new Date(doc.datePublished).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions / Integration Info */}
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: 'Blockchain Verification', icon: CheckCircle, text: 'Validate hashed documents against the Polygon ledger.' },
            { title: 'Metadata Resilience', icon: Database, text: 'Ensure IPFS JSON descriptors are synced and pinned.' },
            { title: 'Access Control', icon: User, text: 'Manage administrative roles for official document seals.' },
          ].map((item, i) => (
            <Card 
              key={i}
              className="border-2 rounded-[24px] p-8 bg-white hover:border-[#B9B28A] transition-colors"
              style={{ borderColor: 'rgba(80, 75, 56, 0.05)' }}
            >
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-14 h-14 rounded-[20px] flex items-center justify-center bg-[#F8F3D9]">
                  <item.icon className="w-7 h-7 text-[#B9B28A]" strokeWidth={2} />
                </div>
                <div>
                  <h4 className="font-black text-[#504B38] mb-2">{item.title}</h4>
                  <p className="text-xs font-bold text-[#504B38]/50 leading-relaxed">{item.text}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}