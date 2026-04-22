import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { ShieldCheck, Lock, User, Eye, EyeOff, AlertCircle, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

const CREDENTIALS = [
  { username: 'admin', password: 'admin123', role: 'Barangay Administrator' },
  { username: 'captain', password: 'captain123', role: 'Barangay Captain' },
];

export function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    await new Promise(r => setTimeout(r, 800));

    const account = CREDENTIALS.find(
      acc => acc.username === username && acc.password === password
    );

    if (account) {
      sessionStorage.setItem('legichain_admin', 'true');
      sessionStorage.setItem('legichain_user', JSON.stringify({ username: account.username, role: account.role }));
      navigate('/admin', { replace: true });
    } else {
      setError('Invalid username or password. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#EBF4F6]">
      {/* Left Panel - Brand */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#09637E] to-[#088395] flex-col justify-between p-12 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5" />
        <div className="absolute -bottom-32 -left-20 w-96 h-96 rounded-full bg-white/5" />
        <div className="absolute top-1/2 right-10 w-48 h-48 rounded-full bg-white/5" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-lg">
              <ShieldCheck className="w-6 h-6 text-[#09637E]" />
            </div>
            <span className="text-2xl font-black text-white tracking-tight">LegiChain</span>
          </div>
          <p className="text-white/60 text-sm font-medium ml-1">Barangay Project Monitoring Platform</p>
        </div>

        <div className="relative z-10 space-y-8">
          <div>
            <h1 className="text-4xl font-black text-white leading-tight mb-4">
              Transparent Governance,<br />
              <span className="text-[#7AB2B2]">Secured by Blockchain.</span>
            </h1>
            <p className="text-white/70 font-medium leading-relaxed">
              Manage and monitor barangay projects across General Mariano Alvarez, Cavite with immutable blockchain verification and full financial transparency.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Barangays', value: '5' },
              { label: 'Project Categories', value: '4' },
              { label: 'Blockchain Verified', value: '100%' },
              { label: 'Public Access', value: '24/7' },
            ].map(stat => (
              <div key={stat.label} className="bg-white/10 rounded-2xl p-4 border border-white/20">
                <p className="text-2xl font-black text-white">{stat.value}</p>
                <p className="text-xs font-bold text-white/50 uppercase tracking-wider mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-white/40 text-xs font-medium">
            © 2026 LegiChain · GMA, Cavite · All rights reserved
          </p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-[#09637E] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-black text-[#09637E] tracking-tight">LegiChain</span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-black text-[#09637E] tracking-tight">Admin Portal</h2>
            <p className="text-gray-500 font-medium mt-2">
              Sign in to manage barangay projects and records
            </p>
          </div>

          {/* Demo credentials hint */}
          <div className="mb-6 p-4 rounded-2xl bg-[#EBF4F6] border border-[#09637E]/20">
            <p className="text-xs font-bold text-[#09637E] uppercase tracking-wider mb-2">Demo Credentials</p>
            <div className="space-y-1">
              <p className="text-xs text-gray-600 font-medium">Username: <span className="font-mono font-bold text-[#09637E]">admin</span> · Password: <span className="font-mono font-bold text-[#09637E]">admin123</span></p>
              <p className="text-xs text-gray-600 font-medium">Username: <span className="font-mono font-bold text-[#09637E]">captain</span> · Password: <span className="font-mono font-bold text-[#09637E]">captain123</span></p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Username */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#09637E]">Username</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#09637E]/40" />
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-[#09637E]/20 rounded-2xl text-sm font-medium focus:outline-none focus:border-[#088395] transition-colors"
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#09637E]">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#09637E]/40" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-12 py-3.5 bg-white border-2 border-[#09637E]/20 rounded-2xl text-sm font-medium focus:outline-none focus:border-[#088395] transition-colors"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#09637E]/40 hover:text-[#09637E] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </motion.div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#088395] text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-[#09637E] transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Access Admin Portal
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#09637E]/60 hover:text-[#09637E] transition-colors"
            >
              ← Back to Public Portal
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
