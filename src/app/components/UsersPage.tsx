import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { UserPlus, Edit, Trash2 } from 'lucide-react';

const mockUsers = [
  { id: '1', name: 'Admin User', email: 'admin@barangay.gov.ph', role: 'Admin', status: 'Active' },
  { id: '2', name: 'Maria Santos', email: 'clerk@barangay.gov.ph', role: 'Clerk', status: 'Active' },
  { id: '3', name: 'Juan dela Cruz', email: 'secretary@barangay.gov.ph', role: 'Secretary', status: 'Active' },
  { id: '4', name: 'Rosa Reyes', email: 'rosa@example.com', role: 'Citizen', status: 'Active' },
  { id: '5', name: 'Pedro Garcia', email: 'pedro@example.com', role: 'Citizen', status: 'Inactive' },
];

export function UsersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl mb-2">Users</h1>
            <p className="text-gray-600">Manage system users and permissions</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 h-12 px-6 shadow-lg">
            <UserPlus className="w-5 h-5 mr-2" />
            Add New User
          </Button>
        </div>

        <Card className="border-2 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b-2">
            <CardTitle>All Users ({mockUsers.length})</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="border-2 rounded-xl overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockUsers.map((user) => (
                    <TableRow key={user.id} className="hover:bg-blue-50/50">
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-2">{user.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={user.status === 'Active' ? 'default' : 'secondary'}
                          className={`${user.status === 'Active' ? 'bg-green-500' : 'bg-gray-500'} border-2`}
                        >
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button size="sm" variant="ghost" className="hover:bg-blue-100">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
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