import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Activity } from 'lucide-react';
import { mockSystemLogs } from '../utils/mockData';

export function SystemLogsPage() {
  return (
    <div className="min-h-screen bg-[#F8F3D9]">
      <div className="p-8 space-y-6">
        <div>
          <h1 className="text-3xl mb-2 text-[#504B38] font-bold">System Logs</h1>
          <p className="text-[#504B38]/70">Monitor all system activities and blockchain transactions</p>
        </div>

        <Card className="border-2 shadow-lg border-[#B9B28A] bg-white">
          <CardHeader className="bg-[#EBE5C2]/30 border-b-2 border-[#B9B28A]/20">
            <CardTitle className="flex items-center gap-2 text-[#504B38]">
              <Activity className="w-5 h-5 text-[#B9B28A]" />
              Activity Logs ({mockSystemLogs.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="border-2 border-[#EBE5C2] rounded-xl overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#F8F3D9]">
                    <TableHead className="text-[#504B38] font-bold">User</TableHead>
                    <TableHead className="text-[#504B38] font-bold">Action Performed</TableHead>
                    <TableHead className="text-[#504B38] font-bold">Document ID</TableHead>
                    <TableHead className="text-[#504B38] font-bold">Timestamp</TableHead>
                    <TableHead className="text-[#504B38] font-bold">IP Address</TableHead>
                    <TableHead className="text-[#504B38] font-bold">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockSystemLogs.map((log) => (
                    <TableRow key={log.id} className="hover:bg-[#EBE5C2]/20">
                      <TableCell className="font-medium text-[#504B38]">{log.user}</TableCell>
                      <TableCell className="text-[#504B38]">{log.action}</TableCell>
                      <TableCell>
                        <span className="px-3 py-1 bg-[#EBE5C2] text-[#504B38] rounded-lg text-sm font-mono border border-[#B9B28A]/30">
                          {log.documentId}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-[#504B38]/70">
                        {new Date(log.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-sm font-mono text-[#504B38]/70">
                        {log.ipAddress}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={log.status === 'Success' ? 'default' : 'destructive'}
                          className={`${log.status === 'Success' ? 'bg-emerald-500' : 'bg-red-500'} text-white border-none font-bold`}
                        >
                          {log.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
