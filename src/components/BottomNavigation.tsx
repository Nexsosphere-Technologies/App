import React from 'react';
import { Home, CreditCard, Star, Leaf, Settings, Compass } from 'lucide-react';

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
    { id: 'home', icon: <Home className="w-5 h-5" />, label: 'Home' },
    { id: 'identity', icon: <CreditCard className="w-5 h-5" />, label: 'Identity' },
    { id: 'reputation', icon: <Star className="w-5 h-5" />, label: 'Reputation' },
    { id: 'earn', icon: <Leaf className="w-5 h-5" />, label: 'Earn' },
    { id: 'discover', icon: <Compass className="w-5 h-5" />, label: 'Discover' },
    { id: 'settings', icon: <Settings className="w-5 h-5" />, label: 'Settings' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-dark-card border-t border-dark-border">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`flex flex-col items-center space-y-1 py-2 px-2 rounded-lg transition-colors ${
              activeTab === item.id
                ? 'text-primary-red bg-primary-red/10'
                : 'text-dark-text-secondary hover:text-dark-text'
            }`}
          >
            {item.icon}
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomNavigation;