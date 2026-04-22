import { useState } from 'react';
import { X, FileText, BookOpen, Briefcase, Award, DollarSign, Home, Network, User, LogOut, Shield, BarChart3 } from 'lucide-react';
import { Button } from './ui/button';

interface CitizenSidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onLogout: () => void;
}

export function CitizenSidebar({ currentView, onNavigate, onLogout }: CitizenSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'history', label: 'Blockchain Explorer', icon: Network },
    { id: 'transparency', label: 'Ordinance Records', icon: BarChart3 },
    { id: 'foi', label: 'Koneksyong Lokal', icon: FileText },
  ];

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 w-14 h-14 rounded-2xl hover:scale-110 transition-all duration-300 group"
        style={{
          background: isOpen ? '#B9B28A' : 'white',
          border: '2px solid #504B38',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
        }}
      >
        {isOpen ? (
          <X className="w-7 h-7 text-white" strokeWidth={2.5} />
        ) : (
          <div className="relative w-7 h-7 flex flex-col justify-center gap-1.5">
            <div className="h-0.5 rounded-full transition-all duration-300 bg-[#504B38]" style={{ width: '28px' }} />
            <div className="h-0.5 rounded-full transition-all duration-300 bg-[#B9B28A]" style={{ width: '22px' }} />
            <div className="h-0.5 rounded-full transition-all duration-300 bg-[#504B38]" style={{ width: '28px' }} />
          </div>
        )}
      </Button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-[#504B38]/20 backdrop-blur-sm z-40 animate-in fade-in duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-full w-80 z-40 shadow-2xl transform transition-all duration-500 ease-in-out ${
          isOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
        }`}
        style={{ 
          background: '#EBE5C2',
        }}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b" style={{ borderColor: 'rgba(80, 75, 56, 0.2)' }}>
            <div className="flex items-center gap-3">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-md bg-white"
              >
                <Shield className="w-8 h-8 text-[#B9B28A]" strokeWidth={1.5} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#504B38] tracking-tight">GMA Blockchain</h1>
                <p className="text-xs text-[#504B38]/60 font-bold uppercase tracking-widest">Citizen Portal</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-5 space-y-2 overflow-y-auto">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group ${
                    isActive ? 'shadow-md scale-[1.02] font-bold bg-[#B9B28A] text-white' : 'text-[#504B38] hover:bg-[#504B38]/10'
                  }`}
                >
                  <Icon className="w-5 h-5" strokeWidth={1.5} />
                  <span className="text-sm">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="p-5 border-t" style={{ borderColor: 'rgba(80, 75, 56, 0.2)' }}>
            <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl mb-3 bg-[#F8F3D9]/50 border border-[#504B38]/10">
              <div className="w-11 h-11 rounded-full flex items-center justify-center bg-white shadow-sm">
                <User className="w-6 h-6 text-[#504B38]" strokeWidth={1.5} />
              </div>
              <div className="flex-1 min-w-0 text-[#504B38]">
                <p className="text-sm font-bold truncate">Citizen User</p>
                <p className="text-[10px] truncate opacity-60">Verified Identity</p>
              </div>
            </div>

            <button
              onClick={() => {
                onLogout();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all hover:bg-[#504B38]/10 text-[#504B38] border border-[#504B38]/20 font-bold"
            >
              <LogOut className="w-5 h-5" strokeWidth={1.5} />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}