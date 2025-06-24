import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { useTheme } from '../contexts/ThemeContext';
import { useAlgorand } from '../hooks/useAlgorand';
import ThemeSelector from './ThemeSelector';
import WalletConnect from './WalletConnect';

interface TopBarProps {
  onDiscoverClick?: () => void;
  onNotificationClick?: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onDiscoverClick, onNotificationClick }) => {
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [clickedButton, setClickedButton] = useState<string | null>(null);
  const { isConnected, address } = useAlgorand();

  const handleButtonClick = (buttonId: string, callback?: () => void) => {
    setClickedButton(buttonId);
    setTimeout(() => setClickedButton(null), 300);
    if (callback) callback();
  };

  return (
    <>
      <div className="bg-dark-bg border-b border-dark-border px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between animate-slide-in-up relative overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-red/5 via-transparent to-blue-500/5 animate-gradient-shift opacity-30 pointer-events-none"></div>
        
        {/* Floating sparkles */}
        <div className="absolute top-2 right-20 animate-sparkle opacity-40">
          <Icon icon="mdi:sparkles" className="w-2 h-2 text-primary-red" />
        </div>
        <div className="absolute top-4 right-32 animate-sparkle opacity-30" style={{ animationDelay: '1s' }}>
          <Icon icon="mdi:sparkles" className="w-1.5 h-1.5 text-blue-400" />
        </div>

        <div className="flex items-center space-x-2 animate-slide-in-left relative z-10">
          <div className="bg-gradient-to-br from-primary-red to-primary-red-dark p-1.5 sm:p-2 rounded-lg animate-pulse-glow hover-scale transition-transform duration-300">
            <Icon icon="mdi:shield-check" className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-dark-text hover-glow transition-all duration-300">
            NexDentify
          </h1>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-3 animate-slide-in-right relative z-10">
          {/* Wallet Connect Button */}
          <button
            onClick={() => handleButtonClick('wallet', () => setShowWalletModal(true))}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 hover-scale hover-glow ${
              isConnected 
                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                : 'bg-primary-red/20 text-primary-red border border-primary-red/30'
            } ${clickedButton === 'wallet' ? 'animate-wiggle' : ''}`}
            title={isConnected ? 'Wallet Connected' : 'Connect Wallet'}
          >
            <Icon 
              icon={isConnected ? "mdi:wallet-outline" : "mdi:wallet-plus"} 
              className="w-4 h-4 sm:w-5 sm:h-5" 
            />
            <span className="hidden sm:inline text-xs font-medium">
              {isConnected ? `${address.substring(0, 6)}...` : 'Connect'}
            </span>
          </button>

          <button
            onClick={() => handleButtonClick('theme', () => setShowThemeModal(true))}
            className={`text-dark-text-secondary hover:text-dark-text transition-all duration-300 p-1 hover-scale hover-glow ${
              clickedButton === 'theme' ? 'animate-wiggle' : ''
            }`}
            title="Change Theme"
          >
            <Icon icon="mdi:palette" className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          
          <button
            onClick={() => handleButtonClick('discover', onDiscoverClick)}
            className={`text-dark-text-secondary hover:text-dark-text transition-all duration-300 p-1 hover-scale hover-glow ${
              clickedButton === 'discover' ? 'animate-wiggle' : ''
            }`}
          >
            <Icon icon="mdi:compass" className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          
          <div className="relative">
            <button
              onClick={() => handleButtonClick('notifications', onNotificationClick)}
              className={`text-dark-text-secondary hover:text-dark-text transition-all duration-300 p-1 hover-scale hover-glow ${
                clickedButton === 'notifications' ? 'animate-wiggle' : ''
              }`}
            >
              <Icon icon="mdi:bell" className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <div className="absolute -top-1 -right-1 bg-primary-red text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center animate-heartbeat">
              3
            </div>
          </div>
        </div>
      </div>

      {/* Theme Modal */}
      {showThemeModal && (
        <ThemeSelector isModal={true} onClose={() => setShowThemeModal(false)} />
      )}

      {/* Wallet Modal */}
      {showWalletModal && (
        <WalletConnect isModal={true} onClose={() => setShowWalletModal(false)} />
      )}
    </>
  );
};

export default TopBar;