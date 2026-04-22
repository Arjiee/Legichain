import { ScrollText, FileCheck2, Briefcase, Award, BarChart3, Home, Network, Shield, FileText } from 'lucide-react';

interface PersistentSidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function PersistentSidebar({ currentView, onNavigate, isOpen, onClose }: PersistentSidebarProps) {
  const menuItems = [
    { id: 'home', label: 'Home', icon: Home, description: 'Citizen portal home' },
    { id: 'history', label: 'Blockchain Explorer', icon: Network, description: 'View all transactions' },
    { id: 'transparency', label: 'Ordinance Records', icon: BarChart3, description: 'Public data & stats' },
  ];

  return (
    <>
      {/* Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-[#504B38]/20 backdrop-blur-[1px] z-40 animate-in fade-in duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar - Slides from Left */}
      <aside 
        className={`fixed left-0 top-0 h-screen border-r shadow-xl z-50 flex flex-col transition-all duration-500 ease-in-out ${
          isOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
        }`}
        style={{ 
          width: '320px',
          background: '#EBE5C2',
          borderColor: 'rgba(80, 75, 56, 0.2)'
        }}
      >
        {/* Logo Section */}
        <div 
          className="p-6 border-b relative overflow-hidden" 
          style={{ borderColor: 'rgba(80, 75, 56, 0.2)' }}
        >
          <div className="flex items-center gap-3 relative z-10">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md bg-white"
            >
              <Shield className="w-7 h-7 text-[#B9B28A]" strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="font-bold text-[#504B38] tracking-tight">GMA Blockchain</h1>
              <p className="text-xs text-[#504B38]/60 font-bold uppercase tracking-widest">Citizen Access</p>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 p-5 space-y-2 overflow-y-auto">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onClose();
                }}
                className={`w-full flex items-center gap-3 px-3 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                  isActive 
                    ? 'shadow-sm scale-[1.02] font-bold' 
                    : 'hover:bg-[#504B38]/10'
                }`}
                style={{
                  background: isActive ? '#B9B28A' : 'transparent',
                  color: isActive ? 'white' : '#504B38'
                }}
              >
                {/* Icon container */}
                <div 
                  className={`relative w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 ${isActive ? 'bg-white/20' : 'bg-[#504B38]/10'}`}
                >
                  <Icon 
                    className="w-5 h-5 relative z-10" 
                    strokeWidth={1.5}
                  />
                </div>
                
                {/* Text content */}
                <div className="flex-1 text-left relative z-10">
                  <p className="text-sm">
                    {item.label}
                  </p>
                  <p className={`text-[10px] ${isActive ? 'text-white/70' : 'text-[#504B38]/50'}`}>
                    {item.description}
                  </p>
                </div>
              </button>
            );
          })}
        </nav>

        {/* FOI Section */}
        <div className="p-5 border-t" style={{ borderColor: 'rgba(80, 75, 56, 0.2)' }}>
          <button
            onClick={() => {
              onNavigate('foi');
              onClose();
            }}
            className={`w-full flex items-center gap-3 px-3 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden hover:scale-[1.02] ${
              currentView === 'foi' ? 'shadow-sm font-bold' : 'hover:bg-[#504B38]/10'
            }`}
            style={{
              background: currentView === 'foi' ? '#504B38' : '#F8F3D9',
              color: currentView === 'foi' ? 'white' : '#504B38',
              border: '1px solid rgba(80, 75, 56, 0.2)'
            }}
          >
            <div 
              className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 relative z-10 ${currentView === 'foi' ? 'bg-white/20' : 'bg-[#504B38]/10'}`}
            >
              <Network className="w-5 h-5" strokeWidth={1.5} />
            </div>
            
            <div className="flex-1 text-left relative z-10">
              <p className="text-sm font-medium">Koneksyong Lokal</p>
              <p className="text-[10px] opacity-70">FOI Access Office</p>
            </div>
          </button>
        </div>
      </aside>
    </>
  );
}