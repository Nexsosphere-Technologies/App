import React from 'react';
import { CheckCircle } from 'lucide-react';

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
    <div className="bg-gradient-to-br from-dark-card to-dark-bg border border-dark-border rounded-2xl p-6 mx-4 my-6">
      <h2 className="text-lg font-semibold text-dark-text mb-6 text-center">Your Trust Snapshot</h2>
      
      <div className="flex flex-col items-center space-y-4">
        <div className="relative w-48 h-48">
          <svg className="transform -rotate-90 w-48 h-48" viewBox="0 0 180 180">
            {/* Background circle */}
            <circle
              cx="90"
              cy="90"
              r="80"
              stroke="#262626"
              strokeWidth="12"
              fill="transparent"
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
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="100%" stopColor="#16a34a" />
              </linearGradient>
            </defs>
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold text-green-500">{score}</span>
            <span className="text-lg text-dark-text-secondary">/{maxScore}</span>
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-xl font-semibold text-dark-text mb-2">{getTrustLevel(score)}</p>
          <div className="flex items-center justify-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-dark-text-secondary">DID Status: Connected</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustSnapshot;