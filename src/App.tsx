import React from 'react';
import TopBar from './components/TopBar';
import TrustSnapshot from './components/TrustSnapshot';
import QuickActions from './components/QuickActions';
import RecentActivity from './components/RecentActivity';
import BottomNavigation from './components/BottomNavigation';

function App() {
  return (
    <div className="min-h-screen bg-dark-bg text-dark-text">
      <TopBar />
      <div className="max-w-md mx-auto">
        <TrustSnapshot score={85} maxScore={100} />
        <QuickActions />
        <RecentActivity />
      </div>
      <BottomNavigation />
    </div>
  );
}

export default App;