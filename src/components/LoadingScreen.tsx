import React from 'react';
import { Shield, Loader2 } from 'lucide-react';

interface LoadingScreenProps {
  message?: string;
  progress?: number;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = 'Loading NexDentify...', 
  progress 
}) => {
  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center">
      <div className="text-center space-y-6 max-w-md w-full px-4">
        {/* Logo */}
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-red to-primary-red-dark rounded-2xl flex items-center justify-center mx-auto animate-pulse-glow">
            <Shield className="w-10 h-10 text-white" />
          </div>
          
          {/* Spinning loader */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-24 h-24 text-primary-red animate-spin opacity-30" />
          </div>
        </div>

        {/* App name */}
        <h1 className="text-2xl font-bold text-dark-text">
          NexDentify
        </h1>

        {/* Loading message */}
        <p className="text-dark-text-secondary">
          {message}
        </p>

        {/* Progress bar */}
        {progress !== undefined && (
          <div className="w-full bg-dark-card rounded-full h-2">
            <div
              className="bg-gradient-to-r from-primary-red to-primary-red-dark h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        )}

        {/* Loading dots */}
        <div className="flex justify-center space-x-1">
          <div className="w-2 h-2 bg-primary-red rounded-full animate-loading-dots"></div>
          <div className="w-2 h-2 bg-primary-red rounded-full animate-loading-dots" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-primary-red rounded-full animate-loading-dots" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;