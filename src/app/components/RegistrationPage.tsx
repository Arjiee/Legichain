import { useState } from 'react';
import { Shield, User, Mail, Lock, ArrowLeft, Phone, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';

interface RegistrationPageProps {
  onBack: () => void;
}

export function RegistrationPage({ onBack }: RegistrationPageProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    toast.success('Account created successfully!');
    setTimeout(() => onBack(), 1500);
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden animate-in slide-in-from-bottom duration-500"
      style={{ background: 'linear-gradient(135deg, #F8F3D9 0%, #EBE5C2 50%, #F8F3D9 100%)' }}
    >
      {/* Tech Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-64 h-64 border border-[#504B38] rounded-lg rotate-12"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 border border-[#504B38] rounded-lg -rotate-12"></div>
      </div>

      <Card 
        className="w-full max-w-2xl shadow-2xl relative z-10 border-2 rounded-2xl overflow-hidden"
        style={{ 
          borderColor: '#B9B28A',
          background: 'white'
        }}
      >
        <div className="h-2" style={{ background: 'linear-gradient(90deg, #504B38 0%, #B9B28A 100%)' }} />
        
        <CardHeader className="space-y-4 pb-6 pt-6" style={{ background: 'rgba(185, 178, 138, 0.05)' }}>
          <Button
            variant="ghost"
            onClick={onBack}
            className="w-fit hover:scale-105 transition-transform"
            style={{ color: '#504B38' }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" strokeWidth={1.5} />
            Back to Login
          </Button>
          <div className="text-center">
            <div 
              className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg mb-4"
              style={{ background: 'linear-gradient(135deg, #504B38 0%, #B9B28A 100%)' }}
            >
              <User className="w-9 h-9 text-white" strokeWidth={1.5} />
            </div>
            <CardTitle className="text-3xl font-semibold tracking-tight" style={{ color: '#504B38' }}>
              Create Account
            </CardTitle>
            <CardDescription className="mt-2 text-base" style={{ color: '#B9B28A' }}>
              Register for GMA Blockchain Portal
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="pt-6 pb-8 px-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" style={{ color: '#504B38' }}>First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Juan"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className="h-12 border-2 rounded-lg transition-all focus:scale-[1.02]"
                  style={{ borderColor: '#EBE5C2', background: '#F9F9F9' }}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName" style={{ color: '#504B38' }}>Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Dela Cruz"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  className="h-12 border-2 rounded-lg transition-all focus:scale-[1.02]"
                  style={{ borderColor: '#EBE5C2', background: '#F9F9F9' }}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" style={{ color: '#504B38' }}>Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: '#B9B28A' }} strokeWidth={1.5} />
                <Input
                  id="email"
                  type="email"
                  placeholder="juan@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="pl-11 h-12 border-2 rounded-lg transition-all focus:scale-[1.02]"
                  style={{ borderColor: '#EBE5C2', background: '#F9F9F9' }}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" style={{ color: '#504B38' }}>Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: '#B9B28A' }} strokeWidth={1.5} />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+63 912 345 6789"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="pl-11 h-12 border-2 rounded-lg transition-all focus:scale-[1.02]"
                  style={{ borderColor: '#EBE5C2', background: '#F9F9F9' }}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" style={{ color: '#504B38' }}>Address</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: '#B9B28A' }} strokeWidth={1.5} />
                <Input
                  id="address"
                  type="text"
                  placeholder="Barangay address"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="pl-11 h-12 border-2 rounded-lg transition-all focus:scale-[1.02]"
                  style={{ borderColor: '#EBE5C2', background: '#F9F9F9' }}
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password" style={{ color: '#504B38' }}>Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: '#B9B28A' }} strokeWidth={1.5} />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="pl-11 h-12 border-2 rounded-lg transition-all focus:scale-[1.02]"
                    style={{ borderColor: '#EBE5C2', background: '#F9F9F9' }}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" style={{ color: '#504B38' }}>Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: '#B9B28A' }} strokeWidth={1.5} />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    className="pl-11 h-12 border-2 rounded-lg transition-all focus:scale-[1.02]"
                    style={{ borderColor: '#EBE5C2', background: '#F9F9F9' }}
                    required
                  />
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 shadow-lg rounded-lg mt-6 hover:scale-[1.02] transition-transform text-white font-bold"
              style={{
                background: 'linear-gradient(135deg, #504B38 0%, #B9B28A 100%)',
              }}
            >
              Create Account
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
