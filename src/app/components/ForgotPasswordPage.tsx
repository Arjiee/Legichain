import { useState } from 'react';
import { Shield, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

interface ForgotPasswordPageProps {
  onBack: () => void;
}

export function ForgotPasswordPage({ onBack }: ForgotPasswordPageProps) {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden animate-in fade-in duration-700"
      style={{ background: 'linear-gradient(135deg, #C40C0C 0%, #FF6500 50%, #C40C0C 100%)' }}
    >
      {/* Tech Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-64 h-64 border border-white rounded-lg rotate-12"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 border border-white rounded-lg -rotate-12"></div>
      </div>

      <Card 
        className="w-full max-w-md shadow-2xl relative z-10 border-2 rounded-2xl overflow-hidden"
        style={{ 
          borderColor: '#F6CE71',
          background: 'white'
        }}
      >
        <div className="h-2" style={{ background: 'linear-gradient(90deg, #CC561E 0%, #F6CE71 100%)' }} />
        
        <CardHeader className="space-y-4 pb-6 pt-6" style={{ background: 'rgba(246, 206, 113, 0.05)' }}>
          {!isSubmitted && (
            <Button
              variant="ghost"
              onClick={onBack}
              className="w-fit hover:scale-105 transition-transform"
              style={{ color: '#CC561E' }}
            >
              <ArrowLeft className="w-4 h-4 mr-2" strokeWidth={1.5} />
              Back to Login
            </Button>
          )}
          <div className="text-center">
            <div 
              className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg mb-4"
              style={{ background: 'linear-gradient(135deg, #C40C0C 0%, #CC561E 100%)' }}
            >
              <Shield className="w-9 h-9 text-white" strokeWidth={1.5} />
            </div>
            <CardTitle className="text-3xl font-semibold tracking-tight" style={{ color: '#C40C0C' }}>
              Reset Password
            </CardTitle>
            <CardDescription className="mt-2 text-base" style={{ color: '#CC561E' }}>
              {isSubmitted 
                ? 'Check your email for reset instructions' 
                : 'Enter your email to receive a password reset link'}
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="pt-6 pb-8 px-8">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" style={{ color: '#C40C0C' }}>Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: '#CC561E' }} strokeWidth={1.5} />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-11 h-12 border-2 rounded-lg transition-all focus:scale-[1.02]"
                    style={{ 
                      borderColor: '#F6CE71',
                      background: '#F9F9F9'
                    }}
                    required
                  />
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full h-12 shadow-lg rounded-lg hover:scale-[1.02] transition-transform"
                style={{
                  background: 'linear-gradient(135deg, #C40C0C 0%, #CC561E 100%)',
                  color: 'white'
                }}
              >
                Send Reset Link
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-6 animate-in fade-in duration-500">
              <div 
                className="mx-auto w-20 h-20 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(204, 86, 30, 0.1)' }}
              >
                <CheckCircle className="w-12 h-12" style={{ color: '#CC561E' }} strokeWidth={1.5} />
              </div>
              <div className="space-y-2">
                <p className="font-semibold" style={{ color: '#C40C0C' }}>
                  Email Sent Successfully!
                </p>
                <p className="text-sm" style={{ color: '#CC561E' }}>
                  We've sent a password reset link to <strong>{email}</strong>
                </p>
                <p className="text-xs" style={{ color: '#CC561E' }}>
                  Please check your inbox and follow the instructions.
                </p>
              </div>
              <Button 
                onClick={onBack}
                className="w-full h-12 rounded-lg hover:scale-[1.02] transition-transform"
                style={{
                  background: 'linear-gradient(135deg, #C40C0C 0%, #CC561E 100%)',
                  color: 'white'
                }}
              >
                Back to Login
              </Button>
            </div>
          )}
          
          {!isSubmitted && (
            <div className="mt-6 text-center">
              <p className="text-sm" style={{ color: '#CC561E' }}>
                Remember your password?{' '}
                <button
                  type="button"
                  onClick={onBack}
                  className="font-medium hover:scale-105 inline-block transition-transform"
                  style={{ color: '#C40C0C' }}
                >
                  Sign in
                </button>
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
