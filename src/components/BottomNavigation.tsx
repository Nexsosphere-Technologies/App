import React from 'react';
import { Icon } from '@iconify/react';

interface NavItem {
  id: string;
  icon: string;
  label: string;
}

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, onTabChange }) => {
  const navItems: NavItem[] = [
    { id: 'home', icon: 'mdi:home', label: 'Home' },
    { id: 'identity', icon: 'mdi:card-account-details', label: 'Identity' },
    { id: 'reputation', icon: 'mdi:star', label: 'Reputation' },
    { id: 'earn', icon: 'mdi:leaf', label: 'Earn' },
    { id: 'settings', icon: 'mdi:cog', label: 'Settings' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-dark-card border-t border-dark-border safe-area-bottom animate-slide-in-up relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-red/5 via-transparent to-blue-500/5 animate-gradient-shift opacity-20 pointer-events-none"></div>
      
      {/* Floating sparkles */}
      <div className="absolute top-1 left-8 animate-sparkle opacity-30">
        <Icon icon="mdi:sparkles" className="w-1.5 h-1.5 text-primary-red" />
      </div>
      <div className="absolute top-2 right-12 animate-sparkle opacity-20" style={{ animationDelay: '1.5s' }}>
        <Icon icon="mdi:sparkles" className="w-1 h-1 text-blue-400" />
      </div>

      <div className="flex items-center justify-around py-1 sm:py-2 px-1 relative z-10">
        {navItems.map((item, index) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`flex flex-col items-center space-y-0.5 sm:space-y-1 py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg transition-all duration-300 min-w-0 flex-1 hover-scale ${
              activeTab === item.id
                ? 'text-primary-red bg-primary-red/10 animate-pulse-glow'
                : 'text-dark-text-secondary hover:text-dark-text hover-glow'
            }`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className={`flex-shrink-0 transition-transform duration-300 ${
              activeTab === item.id ? 'animate-bounce-gentle' : ''
            }`}>
              <Icon icon={item.icon} className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="text-xs font-medium truncate w-full text-center">
              {item.label}
            </span>

            {/* Active indicator */}
            {activeTab === item.id && (
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary-red rounded-full animate-heartbeat"></div>
            )}

            {/* Ripple effect on click */}
            <div className="absolute inset-0 rounded-lg overflow-hidden">
              <div className={`absolute inset-0 bg-primary-red/20 transform scale-0 rounded-full transition-transform duration-300 ${
                activeTab === item.id ? 'animate-ripple' : ''
              }`}></div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomNavigation;