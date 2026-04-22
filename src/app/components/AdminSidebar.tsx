import { 
  LayoutDashboard, 
  Upload, 
  FileText, 
  Activity, 
  Users, 
  Settings, 
  LogOut,
  Shield,
  Link2
} from 'lucide-react';
import { cn } from './ui/utils';

interface AdminSidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'upload', label: 'Upload Document', icon: Upload },
  { id: 'manage', label: 'Blockchain', icon: FileText },
  { id: 'logs', label: 'System Logs', icon: Activity },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function AdminSidebar({ currentPage, onNavigate, onLogout }: AdminSidebarProps) {
  return (
    <div 
      className="w-72 min-h-screen flex flex-col shadow-xl"
      style={{ background: '#EBE5C2' }}
    >
      {/* Logo */}
      <div className="p-6 border-b" style={{ borderColor: 'rgba(80, 75, 56, 0.2)' }}>
        <div className="flex items-center gap-3">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md bg-white"
          >
            <Shield className="w-7 h-7 text-[#504B38]" strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#504B38] tracking-tight">GMA Blockchain</h1>
            <p className="text-xs text-[#504B38]/60 font-bold uppercase tracking-widest">Admin Portal</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                isActive 
                  ? "shadow-md scale-105 font-bold" 
                  : "hover:bg-[#504B38]/10"
              )}
              style={{
                background: isActive ? '#B9B28A' : 'transparent',
                color: isActive ? 'white' : '#504B38'
              }}
            >
              <Icon className="w-5 h-5" strokeWidth={1.5} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t" style={{ borderColor: 'rgba(80, 75, 56, 0.2)' }}>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-[#504B38]/10"
          style={{
            color: '#504B38'
          }}
        >
          <LogOut className="w-5 h-5" strokeWidth={1.5} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}
