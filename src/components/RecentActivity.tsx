import React from 'react';
import { CheckCircle, TrendingUp, Award } from 'lucide-react';

interface ActivityItem {
  id: number;
  type: 'credential' | 'reputation' | 'reward';
  title: string;
  description: string;
  time: string;
  icon: React.ReactNode;
  color: string;
}

const RecentActivity: React.FC = () => {
  const activities: ActivityItem[] = [
    {
      id: 1,
      type: 'credential',
      title: 'New Credential',
      description: 'University Degree issued by MIT',
      time: '2 hours ago',
      icon: <Award className="w-5 h-5" />,
      color: 'text-blue-500'
    },
    {
      id: 2,
      type: 'reputation',
      title: 'Reputation Update',
      description: '+5 pts from Professional Network',
      time: '5 hours ago',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'text-green-500'
    },
    {
      id: 3,
      type: 'reward',
      title: 'Staking Rewards Claimed',
      description: '0.15 NEXDEN tokens earned',
      time: '1 day ago',
      icon: <CheckCircle className="w-5 h-5" />,
      color: 'text-primary-red'
    },
    {
      id: 4,
      type: 'credential',
      title: 'Identity Verified',
      description: 'Government ID verification completed',
      time: '2 days ago',
      icon: <Award className="w-5 h-5" />,
      color: 'text-purple-500'
    }
  ];

  return (
    <div className="px-4 mb-20">
      <h3 className="text-lg font-semibold text-dark-text mb-4">Recent Activity</h3>
      <div className="space-y-3">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="bg-dark-card border border-dark-border rounded-xl p-4 hover:border-primary-red-light/30 transition-colors"
          >
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg bg-dark-bg ${activity.color}`}>
                {activity.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-dark-text font-medium truncate">
                    {activity.title}
                  </h4>
                  <span className="text-xs text-dark-text-secondary flex-shrink-0 ml-2">
                    {activity.time}
                  </span>
                </div>
                <p className="text-sm text-dark-text-secondary mt-1">
                  {activity.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;