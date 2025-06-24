import React from 'react';
import { Search, QrCode, Wallet, TrendingUp } from 'lucide-react';

interface ActionButton {
  icon: React.ReactNode;
  label: string;
  color: string;
}

const QuickActions: React.FC = () => {
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

  return (
    <div className="px-2 sm:px-4 mb-4 sm:mb-6">
      <h3 className="text-base sm:text-lg font-semibold text-dark-text mb-3 sm:mb-4 px-2">Quick Actions</h3>
      <div className="flex space-x-2 sm:space-x-3 overflow-x-auto pb-2 px-2">
        {actions.map((action, index) => (
          <button
            key={index}
            className={`flex-shrink-0 bg-gradient-to-br ${action.color} p-3 sm:p-4 rounded-xl text-white min-w-[100px] sm:min-w-[120px] hover:scale-105 transition-transform duration-200 shadow-lg`}
          >
            <div className="flex flex-col items-center space-y-1 sm:space-y-2">
              {action.icon}
              <span className="text-xs sm:text-sm font-medium text-center leading-tight">
                {action.label}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;