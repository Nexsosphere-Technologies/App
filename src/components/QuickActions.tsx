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
      icon: <Search className="w-6 h-6" />,
      label: 'Request Credential',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: <QrCode className="w-6 h-6" />,
      label: 'Present Credential',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: <Wallet className="w-6 h-6" />,
      label: 'View Wallet',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      label: 'Stake NEXDEN',
      color: 'from-primary-red to-primary-red-dark'
    }
  ];

  return (
    <div className="px-4 mb-6">
      <h3 className="text-lg font-semibold text-dark-text mb-4">Quick Actions</h3>
      <div className="flex space-x-3 overflow-x-auto pb-2">
        {actions.map((action, index) => (
          <button
            key={index}
            className={`flex-shrink-0 bg-gradient-to-br ${action.color} p-4 rounded-xl text-white min-w-[120px] hover:scale-105 transition-transform duration-200 shadow-lg`}
          >
            <div className="flex flex-col items-center space-y-2">
              {action.icon}
              <span className="text-sm font-medium text-center leading-tight">
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