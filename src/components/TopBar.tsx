import React from 'react';
import { Bell, Shield, Compass } from 'lucide-react';

interface TopBarProps {
  onDiscoverClick?: () => void;
  onNotificationClick?: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onDiscoverClick, onNotificationClick }) => {
  return (
    <div className="bg-dark-bg border-b border-dark-border px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <div className="bg-gradient-to-br from-primary-red to-primary-red-dark p-1.5 sm:p-2 rounded-lg">
          <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
        <h1 className="text-lg sm:text-xl font-bold text-dark-text">NexDentify</h1>
      </div>
      
      <div className="flex items-center space-x-2 sm:space-x-3">
        <button
          onClick={onDiscoverClick}
          className="text-dark-text-secondary hover:text-dark-text transition-colors p-1"
        >
          <Compass className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        
        <div className="relative">
          <button
            onClick={onNotificationClick}
            className="text-dark-text-secondary hover:text-dark-text transition-colors p-1"
          >
            <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <div className="absolute -top-1 -right-1 bg-primary-red text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
            3
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;