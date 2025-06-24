import React from 'react';
import { Home, CreditCard, Star, Leaf, Settings } from 'lucide-react';

interface NavItem {
  id: string;
  icon: React.ReactNode;
  label: string;
}

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, onTabChange }) => {
  const navItems: NavItem[] = [
    { id: 'home', icon: <Home className="w-4 h-4 sm:w-5 sm:h-5" />, label: 'Home' },
    { id: 'identity', icon: <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />, label: 'Identity' },
    { id: 'reputation', icon: <Star className="w-4 h-4 sm:w-5 sm:h-5" />, label: 'Reputation' },
    { id: 'earn', icon: <Leaf className="w-4 h-4 sm:w-5 sm:h-5" />, label: 'Earn' },
    { id: 'settings', icon: <Settings className="w-4 h-4 sm:w-5 sm:h-5" />, label: 'Settings' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-dark-card border-t border-dark-border safe-area-bottom">
      <div className="flex items-center justify-around py-1 sm:py-2 px-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`flex flex-col items-center space-y-0.5 sm:space-y-1 py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg transition-colors min-w-0 flex-1 ${
              activeTab === item.id
                ? 'text-primary-red bg-primary-red/10'
                : 'text-dark-text-secondary hover:text-dark-text'
            }`}
          >
            <div className="flex-shrink-0">
              {item.icon}
            </div>
            <span className="text-xs font-medium truncate w-full text-center">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomNavigation;