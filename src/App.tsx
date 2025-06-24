import React, { useState } from 'react';
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

function App() {
  const [activeTab, setActiveTab] = useState('home');

  const handleDiscoverClick = () => {
    setActiveTab('discover');
  };

  const handleNotificationClick = () => {
    setActiveTab('notifications');
  };

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
        return (
          <div className="max-w-md mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold text-dark-text mb-4">Settings</h2>
            <p className="text-dark-text-secondary">Settings page coming soon...</p>
          </div>
        );
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