import { Menu, User, Home, Brain, Bell, Settings, CreditCard } from 'lucide-react';
import { NavTab } from '@/src/constants';
import { motion } from 'motion/react';

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full glass-nav shadow-sm px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="p-2 transition-all hover:bg-surface-container/50 text-primary rounded-xl"
        >
          <Menu size={24} />
        </button>
        <h1 className="font-headline font-extrabold text-primary italic text-xl tracking-tight">
          Farmi AI
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-surface-container-highest overflow-hidden border-2 border-surface shadow-sm">
          <img 
            alt="User profile" 
            className="w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop"
          />
        </div>
      </div>
    </header>
  );
}

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs: { id: NavTab; label: string; icon: any }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'advisor', label: 'Advisor', icon: Brain },
    { id: 'alerts', label: 'Alerts', icon: Bell },
    { id: 'subs', label: 'Subs', icon: CreditCard },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 w-full z-50 glass-nav h-20 px-4 pb-safe border-t border-surface-container rounded-t-[2rem] shadow-[0_-10px_40px_rgba(17,29,35,0.06)] flex justify-around items-center">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center transition-all duration-400 relative scale-95 ${
              isActive ? 'text-primary' : 'text-on-surface-variant/60'
            }`}
          >
            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} fill={isActive ? "currentColor" : "none"} fillOpacity={0.1} />
            <span className="font-body text-[10px] font-semibold uppercase tracking-widest mt-1">
              {tab.label}
            </span>
            {isActive && (
              <motion.div 
                layoutId="navTab"
                className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full"
              />
            )}
            {tab.id === 'alerts' && (
              <span className="absolute top-0 right-1/4 w-2 h-2 bg-error rounded-full border-2 border-surface animate-pulse" />
            )}
          </button>
        );
      })}
    </nav>
  );
}
