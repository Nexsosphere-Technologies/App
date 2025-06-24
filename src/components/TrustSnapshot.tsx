import React from 'react';
import { Icon } from '@iconify/react';

interface TrustSnapshotProps {
  score: number;
  maxScore: number;
}

const TrustSnapshot: React.FC<TrustSnapshotProps> = ({ score, maxScore }) => {
  const percentage = (score / maxScore) * 100;
  const circumference = 2 * Math.PI * 80;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getTrustLevel = (score: number) => {
    if (score >= 90) return 'Highly Trusted';
    if (score >= 75) return 'Very Trusted';
    if (score >= 60) return 'Building Strong';
    if (score >= 40) return 'Growing Trust';
    return 'New Member';
  };

  return (
    <div className="bg-gradient-to-br from-dark-card to-dark-bg border border-dark-border rounded-2xl p-4 sm:p-6 mx-2 sm:mx-4 my-4 sm:my-6 hover-lift animate-fade-in-scale relative overflow-hidden">
      {/* Floating sparkles */}
      <div className="absolute top-4 right-4 animate-sparkle">
        <Icon icon="mdi:sparkles" className="w-4 h-4 text-primary-red opacity-60" />
      </div>
      <div className="absolute top-8 right-8 animate-sparkle" style={{ animationDelay: '0.5s' }}>
        <Icon icon="mdi:sparkles" className="w-3 h-3 text-blue-400 opacity-40" />
      </div>
      <div className="absolute top-6 right-12 animate-sparkle" style={{ animationDelay: '1s' }}>
        <Icon icon="mdi:sparkles" className="w-2 h-2 text-green-400 opacity-50" />
      </div>

      <h2 className="text-base sm:text-lg font-semibold text-dark-text mb-4 sm:mb-6 text-center animate-slide-in-up">
        Your Trust Snapshot
      </h2>
      
      <div className="flex flex-col items-center space-y-3 sm:space-y-4">
        <div className="relative w-32 h-32 sm:w-48 sm:h-48 animate-float">
          <svg className="transform -rotate-90 w-32 h-32 sm:w-48 sm:h-48" viewBox="0 0 180 180">
            {/* Background circle */}
            <circle
              cx="90"
              cy="90"
              r="80"
              stroke="#262626"
              strokeWidth="12"
              fill="transparent"
              className="animate-pulse"
            />
            {/* Progress circle */}
            <circle
              cx="90"
              cy="90"
              r="80"
              stroke="url(#gradient)"
              strokeWidth="12"
              fill="transparent"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out animate-pulse-glow"
              style={{ animationDelay: '0.5s' }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="50%" stopColor="#16a34a" />
                <stop offset="100%" stopColor="#15803d" />
              </linearGradient>
            </defs>
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl sm:text-4xl font-bold text-green-500 animate-heartbeat">
              {score}
            </span>
            <span className="text-sm sm:text-lg text-dark-text-secondary animate-bounce-gentle">
              /{maxScore}
            </span>
          </div>

          {/* Floating particles around the circle */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-2 left-8 w-1 h-1 bg-primary-red rounded-full animate-float" style={{ animationDelay: '0s' }}></div>
            <div className="absolute top-8 right-2 w-1 h-1 bg-blue-400 rounded-full animate-float" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute bottom-4 left-4 w-1 h-1 bg-green-400 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-8 right-8 w-1 h-1 bg-purple-400 rounded-full animate-float" style={{ animationDelay: '1.5s' }}></div>
          </div>
        </div>
        
        <div className="text-center animate-slide-in-up" style={{ animationDelay: '0.3s' }}>
          <p className="text-lg sm:text-xl font-semibold text-dark-text mb-2 hover-glow transition-all duration-300">
            {getTrustLevel(score)}
          </p>
          <div className="flex items-center justify-center space-x-2 hover-scale transition-transform duration-300">
            <Icon icon="mdi:check-circle" className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0 animate-bounce-gentle" />
            <span className="text-sm sm:text-base text-dark-text-secondary">
              DID Status: Connected
            </span>
          </div>
        </div>
      </div>

      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-red/5 via-transparent to-blue-500/5 animate-gradient-shift opacity-30 pointer-events-none"></div>
    </div>
  );
};

export default TrustSnapshot;