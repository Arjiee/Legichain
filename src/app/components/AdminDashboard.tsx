import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { FileText, CheckCircle, Clock, Database, Calendar, User, Activity } from 'lucide-react';
import { dashboardStats, mockDocuments } from '../utils/mockData';
import { Badge } from './ui/badge';

export function AdminDashboard() {
  const recentDocuments = mockDocuments.slice(0, 8);

  const stats = [
    {
      title: 'Total Documents',
      value: dashboardStats.totalDocuments,
      icon: FileText,
      gradient: 'linear-gradient(135deg, #504B38 0%, #B9B28A 100%)'
    },
    {
      title: 'Verified Documents',
      value: dashboardStats.verifiedDocuments,
      icon: CheckCircle,
      gradient: 'linear-gradient(135deg, #B9B28A 0%, #EBE5C2 100%)'
    },
    {
      title: 'Pending Uploads',
      value: dashboardStats.pendingUploads,
      icon: Clock,
      gradient: 'linear-gradient(135deg, #EBE5C2 0%, #B9B28A 100%)'
    },
    {
      title: 'System Records',
      value: dashboardStats.blockchainTransactions,
      icon: Database,
      gradient: 'linear-gradient(135deg, #B9B28A 0%, #504B38 100%)'
    },
  ];

  return (
    <div className="min-h-screen" style={{ background: '#F8F3D9' }}>
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-semibold tracking-tight" style={{ color: '#504B38' }}>
            Dashboard
          </h1>
          <p style={{ color: '#504B38' }} className="font-medium">Administrative Control Panel</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card 
                key={stat.title} 
                className="border-2 shadow-sm hover:shadow-md transition-all duration-300 rounded-xl overflow-hidden"
                style={{ borderColor: '#504B38', background: 'white' }}
              >
                <div className="h-1.5" style={{ background: stat.gradient }} />
                <CardHeader className="flex flex-row items-center justify-between pb-2 pt-6">
                  <CardTitle className="text-sm font-bold" style={{ color: '#504B38' }}>{stat.title}</CardTitle>
                  <div 
                    className="p-3 rounded-xl"
                    style={{ background: '#EBE5C2' }}
                  >
                    <Icon className="w-5 h-5" style={{ color: '#504B38' }} strokeWidth={1.5} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-black" style={{ color: '#504B38' }}>{stat.value}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Activity */}
        <Card className="border-2 shadow-sm rounded-xl bg-white" style={{ borderColor: '#504B38' }}>
          <CardHeader className="border-b" style={{ borderColor: 'rgba(80, 75, 56, 0.2)' }}>
            <CardTitle className="flex items-center gap-2 font-bold" style={{ color: '#504B38' }}>
              <Clock className="w-5 h-5" style={{ color: '#504B38' }} strokeWidth={1.5} />
              Recent Document Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y" style={{ borderColor: 'rgba(80, 75, 56, 0.2)' }}>
              {recentDocuments.map((document, index) => (
                <div
                  key={document.id}
                  className="p-5 hover:bg-[#EBE5C2]/10 transition-all duration-200"
                  style={{
                    background: index % 2 === 0 ? 'white' : '#F8F3D9'
                  }}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: '#EBE5C2' }}
                      >
                        <FileText className="w-6 h-6" style={{ color: '#504B38' }} strokeWidth={1.5} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold truncate text-[#504B38]">
                          {document.title}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          <p className="text-sm font-mono font-bold" style={{ color: '#B9B28A' }}>
                            {document.documentNumber}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-4 flex-shrink-0">
                      <div>
                        <Badge 
                          variant="outline"
                          className="border-2 mb-2 font-bold"
                          style={{
                            borderColor: '#B9B28A',
                            background: '#EBE5C2',
                            color: '#504B38'
                          }}
                        >
                          {document.status}
                        </Badge>
                        <div className="flex items-center gap-2 text-sm font-medium" style={{ color: '#504B38' }}>
                          <Calendar className="w-3.5 h-3.5" strokeWidth={1.5} />
                          {new Date(document.dateApproved).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions Info */}
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: 'Upload Documents', icon: FileText, text: 'Add new official barangay documents to the system' },
            { title: 'Manage Users', icon: User, text: 'Control user access and permissions' },
            { title: 'System Logs', icon: Activity, text: 'Monitor all system activities and changes' },
          ].map((item, i) => (
            <Card 
              key={i}
              className="border-2 rounded-xl p-6 bg-white"
              style={{ 
                borderColor: '#504B38',
                background: 'linear-gradient(135deg, rgba(235, 229, 194, 0.1) 0%, rgba(185, 178, 138, 0.1) 100%)'
              }}
            >
              <div className="flex items-start gap-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: '#B9B28A' }}
                >
                  <item.icon className="w-6 h-6 text-white" strokeWidth={1.5} />
                </div>
                <div>
                  <h4 className="font-bold mb-1 text-[#504B38]">{item.title}</h4>
                  <p className="text-sm font-medium text-[#504B38]/70">{item.text}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
