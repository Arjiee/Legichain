import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';

export function SettingsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="p-8 space-y-6">
        <div>
          <h1 className="text-3xl mb-2">Settings</h1>
          <p className="text-gray-600">Manage system configuration and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Barangay Information */}
          <Card className="border-2 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b-2">
              <CardTitle>Barangay Information</CardTitle>
              <CardDescription>Update barangay details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <Label htmlFor="barangayName">Barangay Name</Label>
                <Input id="barangayName" defaultValue="Barangay San Miguel" className="border-2" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="municipality">Municipality/City</Label>
                <Input id="municipality" defaultValue="Manila" className="border-2" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="province">Province</Label>
                <Input id="province" defaultValue="Metro Manila" className="border-2" />
              </div>
              <Button className="w-full h-12 bg-blue-600 hover:bg-blue-700">
                Save Changes
              </Button>
            </CardContent>
          </Card>

          {/* Blockchain Settings */}
          <Card className="border-2 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b-2">
              <CardTitle>Blockchain Configuration</CardTitle>
              <CardDescription>Configure blockchain network settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <Label htmlFor="networkUrl">Network RPC URL</Label>
                <Input id="networkUrl" defaultValue="https://rpc.blockchain.network" className="border-2" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contractAddress">Smart Contract Address</Label>
                <Input id="contractAddress" defaultValue="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb" className="border-2" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ipfsGateway">IPFS Gateway</Label>
                <Input id="ipfsGateway" defaultValue="https://ipfs.io/ipfs/" className="border-2" />
              </div>
              <Button className="w-full h-12 bg-blue-600 hover:bg-blue-700">
                Update Configuration
              </Button>
            </CardContent>
          </Card>

          {/* System Preferences */}
          <Card className="border-2 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b-2">
              <CardTitle>System Preferences</CardTitle>
              <CardDescription>Configure system behavior</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-publish Documents</Label>
                  <p className="text-sm text-gray-500">
                    Automatically publish documents after upload
                  </p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-gray-500">
                    Send notifications for new documents
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Public Access</Label>
                  <p className="text-sm text-gray-500">
                    Allow citizens to view documents
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Require 2FA</Label>
                  <p className="text-sm text-gray-500">
                    Require two-factor authentication for admins
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="border-2 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b-2">
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage security and access control</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                <Input id="sessionTimeout" type="number" defaultValue="30" className="border-2" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                <Input id="maxLoginAttempts" type="number" defaultValue="5" className="border-2" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                <Input id="passwordExpiry" type="number" defaultValue="90" className="border-2" />
              </div>
              <Button className="w-full h-12 bg-blue-600 hover:bg-blue-700">
                Apply Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}