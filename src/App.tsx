import React, { useState, useEffect } from 'react';
import TopBar from './components/TopBar';
import TrustSnapshot from './components/TrustSnapshot';
import QuickActions from './components/QuickActions';
import RecentActivity from './components/RecentActivity';
import BottomNavigation from './components/BottomNavigation';
import IdentityPage from './components/IdentityPage';
import ReputationPage from './components/ReputationPage';
import EarnPage from './components/EarnPage';
import DiscoverPage from './components/DiscoverPage';
import NotificationsPage from './components/NotificationsPage';
import SettingsPage from './components/SettingsPage';
import OnboardingFlow from './components/OnboardingFlow';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isOnboarded, setIsOnboarded] = useState(false);

  useEffect(() => {
    // Check if user has completed onboarding
    const onboardingComplete = localStorage.getItem('nexdentify-onboarded');
    setIsOnboarded(!!onboardingComplete);
  }, []);

  const handleOnboardingComplete = () => {
    setIsOnboarded(true);
  };

  const handleDiscoverClick = () => {
    setActiveTab('discover');
  };

  const handleNotificationClick = () => {
    setActiveTab('notifications');
  };

  // Show onboarding flow if user hasn't completed it
  if (!isOnboarded) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'identity':
        return <IdentityPage />;
      case 'reputation':
        return <ReputationPage />;
      case 'earn':
        return <EarnPage />;
      case 'discover':
        return <DiscoverPage />;
      case 'notifications':
        return <NotificationsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return (
          <div className="max-w-md mx-auto">
            <TrustSnapshot score={85} maxScore={100} />
            <QuickActions />
            <RecentActivity />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg text-dark-text">
      <TopBar 
        onDiscoverClick={handleDiscoverClick}
        onNotificationClick={handleNotificationClick}
      />
      {renderContent()}
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

export default App;