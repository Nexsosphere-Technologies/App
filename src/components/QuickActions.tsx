import React, { useState } from 'react';
import { Search, QrCode, Wallet, TrendingUp, Sparkles } from 'lucide-react';

interface ActionButton {
  icon: React.ReactNode;
  label: string;
  color: string;
}

const QuickActions: React.FC = () => {
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);

  const actions: ActionButton[] = [
    {
      icon: <Search className="w-5 h-5 sm:w-6 sm:h-6" />,
      label: 'Request Credential',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: <QrCode className="w-5 h-5 sm:w-6 sm:h-6" />,
      label: 'Present Credential',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: <Wallet className="w-5 h-5 sm:w-6 sm:h-6" />,
      label: 'View Wallet',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />,
      label: 'Stake NEXDEN',
      color: 'from-primary-red to-primary-red-dark'
    }
  ];

  const handleClick = (index: number) => {
    setClickedIndex(index);
    setTimeout(() => setClickedIndex(null), 600);
  };

  return (
    <div className="px-2 sm:px-4 mb-4 sm:mb-6">
      <h3 className="text-base sm:text-lg font-semibold text-dark-text mb-3 sm:mb-4 px-2 animate-slide-in-left">
        Quick Actions
      </h3>
      <div className="flex space-x-2 sm:space-x-3 overflow-x-auto pb-2 px-2 stagger-animation">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={() => handleClick(index)}
            className={`flex-shrink-0 bg-gradient-to-br ${action.color} p-3 sm:p-4 rounded-xl text-white min-w-[100px] sm:min-w-[120px] transition-all duration-300 shadow-lg relative overflow-hidden btn-ripple hover-lift hover-glow ${
              clickedIndex === index ? 'animate-pulse-glow' : ''
            }`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Floating sparkle effect */}
            <div className="absolute top-1 right-1 animate-sparkle opacity-60">
              <Sparkles className="w-2 h-2" />
            </div>
            
            <div className="flex flex-col items-center space-y-1 sm:space-y-2 relative z-10">
              <div className={`transition-transform duration-300 ${clickedIndex === index ? 'animate-wiggle' : ''}`}>
                {action.icon}
              </div>
              <span className="text-xs sm:text-sm font-medium text-center leading-tight">
                {action.label}
              </span>
            </div>

            {/* Animated background particles */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-2 left-2 w-1 h-1 bg-white/30 rounded-full animate-float" style={{ animationDelay: `${index * 0.2}s` }}></div>
              <div className="absolute bottom-2 right-2 w-1 h-1 bg-white/20 rounded-full animate-float" style={{ animationDelay: `${index * 0.3}s` }}></div>
            </div>

            {/* Morphing border effect */}
            <div className="absolute inset-0 border-2 border-white/20 animate-morphing pointer-events-none"></div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;