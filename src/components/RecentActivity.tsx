import React, { useState } from 'react';
import { Icon } from '@iconify/react';

interface ActivityItem {
  id: number;
  type: 'credential' | 'reputation' | 'reward';
  title: string;
  description: string;
  time: string;
  icon: string;
  color: string;
}

const RecentActivity: React.FC = () => {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);

  const activities: ActivityItem[] = [
    {
      id: 1,
      type: 'credential',
      title: 'New Credential',
      description: 'University Degree issued by MIT',
      time: '2 hours ago',
      icon: 'mdi:award',
      color: 'text-blue-500'
    },
    {
      id: 2,
      type: 'reputation',
      title: 'Reputation Update',
      description: '+5 pts from Professional Network',
      time: '5 hours ago',
      icon: 'mdi:trending-up',
      color: 'text-green-500'
    },
    {
      id: 3,
      type: 'reward',
      title: 'Staking Rewards Claimed',
      description: '0.15 NEXDEN tokens earned',
      time: '1 day ago',
      icon: 'mdi:check-circle',
      color: 'text-primary-red'
    },
    {
      id: 4,
      type: 'credential',
      title: 'Identity Verified',
      description: 'Government ID verification completed',
      time: '2 days ago',
      icon: 'mdi:shield-check',
      color: 'text-purple-500'
    }
  ];

  return (
    <div className="px-2 sm:px-4 mb-20">
      <h3 className="text-base sm:text-lg font-semibold text-dark-text mb-3 sm:mb-4 px-2 animate-slide-in-left">
        Recent Activity
      </h3>
      <div className="space-y-2 sm:space-y-3 px-2 stagger-animation">
        {activities.map((activity, index) => (
          <div
            key={activity.id}
            onMouseEnter={() => setHoveredItem(activity.id)}
            onMouseLeave={() => setHoveredItem(null)}
            className="bg-dark-card border border-dark-border rounded-xl p-3 sm:p-4 transition-all duration-300 hover-lift hover-glow cursor-pointer relative overflow-hidden"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-red/5 via-transparent to-blue-500/5 animate-gradient-shift opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            
            {/* Floating sparkles on hover */}
            {hoveredItem === activity.id && (
              <>
                <div className="absolute top-2 right-2 animate-sparkle">
                  <Icon icon="mdi:sparkles" className="w-3 h-3 text-primary-red opacity-60" />
                </div>
                <div className="absolute top-4 right-6 animate-sparkle" style={{ animationDelay: '0.3s' }}>
                  <Icon icon="mdi:lightning-bolt" className="w-2 h-2 text-yellow-400 opacity-50" />
                </div>
              </>
            )}

            <div className="flex items-start space-x-3 relative z-10">
              <div className={`p-1.5 sm:p-2 rounded-lg bg-dark-bg ${activity.color} flex-shrink-0 transition-transform duration-300 ${
                hoveredItem === activity.id ? 'animate-bounce-gentle' : ''
              }`}>
                <Icon icon={activity.icon} className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <h4 className={`text-sm sm:text-base text-dark-text font-medium truncate pr-2 transition-all duration-300 ${
                    hoveredItem === activity.id ? 'text-primary-red' : ''
                  }`}>
                    {activity.title}
                  </h4>
                  <span className="text-xs text-dark-text-secondary flex-shrink-0 whitespace-nowrap animate-fade-in-scale">
                    {activity.time}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-dark-text-secondary mt-1 line-clamp-2 transition-all duration-300">
                  {activity.description}
                </p>
              </div>
            </div>

            {/* Progress bar animation */}
            <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary-red to-blue-500 transition-all duration-500 ease-out"
                 style={{ 
                   width: hoveredItem === activity.id ? '100%' : '0%',
                   opacity: hoveredItem === activity.id ? 1 : 0
                 }}>
            </div>

            {/* Floating particles */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-3 left-8 w-1 h-1 bg-primary-red/30 rounded-full animate-float" style={{ animationDelay: `${index * 0.2}s` }}></div>
              <div className="absolute bottom-3 right-8 w-1 h-1 bg-blue-400/30 rounded-full animate-float" style={{ animationDelay: `${index * 0.3}s` }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;