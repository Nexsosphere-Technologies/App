import React, { useState } from 'react';
import { 
  Shield, 
  Star, 
  Coins, 
  Users, 
  TrendingUp, 
  Lock, 
  Globe, 
  Award, 
  CheckCircle, 
  ArrowRight,
  Key,
  Eye,
  Fingerprint,
  Smartphone
} from 'lucide-react';

interface WelcomeScreensProps {
  onGetStarted: () => void;
}

const WelcomeScreens: React.FC<WelcomeScreensProps> = ({ onGetStarted }) => {
  const [currentScreen, setCurrentScreen] = useState(0);

  const screens = [
    {
      id: 'intro',
      title: 'Welcome to NexDentify',
      subtitle: 'Your Gateway to Decentralized Identity',
      description: 'Take control of your digital identity with blockchain-powered verifiable credentials and reputation management.',
      icon: <Shield className="w-16 h-16 text-white" />,
      gradient: 'from-primary-red to-primary-red-dark',
      features: [
        'Decentralized Identity (DID) Management',
        'Verifiable Credentials Storage',
        'Reputation Building & Tracking',
        'Secure Blockchain Integration'
      ]
    },
    {
      id: 'identity',
      title: 'Own Your Identity',
      subtitle: 'Complete Control, Maximum Privacy',
      description: 'Create and manage your decentralized identity without relying on centralized authorities. Your data, your control.',
      icon: <Key className="w-16 h-16 text-white" />,
      gradient: 'from-blue-500 to-blue-600',
      features: [
        'Self-sovereign identity management',
        'No central authority required',
        'Cryptographically secure',
        'Interoperable across platforms'
      ]
    },
    {
      id: 'credentials',
      title: 'Verifiable Credentials',
      subtitle: 'Trusted Digital Certificates',
      description: 'Collect and present tamper-proof digital credentials from trusted issuers. Prove your qualifications instantly.',
      icon: <Award className="w-16 h-16 text-white" />,
      gradient: 'from-green-500 to-green-600',
      features: [
        'University degrees & certifications',
        'Employment verification',
        'Professional licenses',
        'Health records & vaccination status'
      ]
    },
    {
      id: 'reputation',
      title: 'Build Your Reputation',
      subtitle: 'Earn Trust Through Verification',
      description: 'Build a verifiable reputation score based on your credentials, community attestations, and network participation.',
      icon: <Star className="w-16 h-16 text-white" />,
      gradient: 'from-purple-500 to-purple-600',
      features: [
        'Algorithmic reputation scoring',
        'Community-driven attestations',
        'Transparent trust metrics',
        'Portable across platforms'
      ]
    },
    {
      id: 'rewards',
      title: 'Earn NEXDEN Rewards',
      subtitle: 'Stake, Earn, and Grow',
      description: 'Stake NEXDEN tokens to earn rewards while contributing to network security and your reputation score.',
      icon: <Coins className="w-16 h-16 text-white" />,
      gradient: 'from-orange-500 to-orange-600',
      features: [
        'Competitive staking rewards',
        'Reputation-based bonuses',
        'Governance participation',
        'Liquidity farming opportunities'
      ]
    },
    {
      id: 'ecosystem',
      title: 'Connected Ecosystem',
      subtitle: 'Seamless Integration',
      description: 'Connect with trusted platforms, DeFi protocols, and services that recognize your NexDentify reputation.',
      icon: <Globe className="w-16 h-16 text-white" />,
      gradient: 'from-cyan-500 to-cyan-600',
      features: [
        'DeFi protocol integrations',
        'Trusted platform partnerships',
        'Cross-chain compatibility',
        'Growing ecosystem benefits'
      ]
    }
  ];

  const currentScreenData = screens[currentScreen];

  const handleNext = () => {
    if (currentScreen < screens.length - 1) {
      setCurrentScreen(currentScreen + 1);
    } else {
      onGetStarted();
    }
  };

  const handlePrevious = () => {
    if (currentScreen > 0) {
      setCurrentScreen(currentScreen - 1);
    }
  };

  const handleSkip = () => {
    onGetStarted();
  };

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-dark-text-secondary">
              {currentScreen + 1} of {screens.length}
            </span>
            <button
              onClick={handleSkip}
              className="text-sm text-primary-red hover:text-primary-red-light transition-colors"
            >
              Skip
            </button>
          </div>
          <div className="flex space-x-2">
            {screens.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentScreen
                    ? 'bg-primary-red flex-1'
                    : index < currentScreen
                    ? 'bg-primary-red/60 w-8'
                    : 'bg-dark-border w-8'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Screen Content */}
        <div className="bg-dark-card border border-dark-border rounded-2xl p-8 text-center space-y-8">
          {/* Icon */}
          <div className={`w-24 h-24 bg-gradient-to-br ${currentScreenData.gradient} rounded-3xl flex items-center justify-center mx-auto`}>
            {currentScreenData.icon}
          </div>

          {/* Title and Description */}
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-bold text-dark-text mb-2">
                {currentScreenData.title}
              </h1>
              <p className="text-primary-red font-semibold">
                {currentScreenData.subtitle}
              </p>
            </div>
            <p className="text-dark-text-secondary leading-relaxed">
              {currentScreenData.description}
            </p>
          </div>

          {/* Features */}
          <div className="space-y-3">
            {currentScreenData.features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3 text-left">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-dark-text text-sm">{feature}</span>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <button
              onClick={handleNext}
              className="w-full bg-gradient-to-r from-primary-red to-primary-red-dark text-white py-4 rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity flex items-center justify-center space-x-2"
            >
              <span>{currentScreen === screens.length - 1 ? 'Get Started' : 'Continue'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            {currentScreen > 0 && (
              <button
                onClick={handlePrevious}
                className="w-full bg-dark-bg border border-dark-border text-dark-text py-3 rounded-xl font-semibold hover:border-primary-red-light/30 transition-colors"
              >
                Previous
              </button>
            )}
          </div>
        </div>

        {/* Bottom Indicators */}
        <div className="mt-6 flex justify-center space-x-2">
          {screens.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentScreen(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentScreen
                  ? 'bg-primary-red'
                  : 'bg-dark-border hover:bg-dark-text-secondary'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreens;