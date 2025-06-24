import React from 'react';
import { Bell, Shield, Compass } from 'lucide-react';

interface TopBarProps {
  onDiscoverClick?: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onDiscoverClick }) => {
  return (
    <div className="bg-dark-bg border-b border-dark-border px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <div className="bg-gradient-to-br from-primary-red to-primary-red-dark p-2 rounded-lg">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl font-bold text-dark-text">NexDentify</h1>
      </div>
      
      <div className="flex items-center space-x-3">
        <button
          onClick={onDiscoverClick}
          className="text-dark-text-secondary hover:text-dark-text transition-colors"
        >
          <Compass className="w-6 h-6" />
        </button>
        
        <div className="relative">
          <Bell className="w-6 h-6 text-dark-text-secondary hover:text-dark-text transition-colors cursor-pointer" />
          <div className="absolute -top-1 -right-1 bg-primary-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            3
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;