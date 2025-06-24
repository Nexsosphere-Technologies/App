import React, { useState, useEffect, Suspense } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingScreen from './components/LoadingScreen';
import TopBar from './components/TopBar';
import TrustSnapshot from './components/TrustSnapshot';
import QuickActions from './components/QuickActions';
import RecentActivity from './components/RecentActivity';
import BottomNavigation from './components/BottomNavigation';
import OnboardingFlow from './components/OnboardingFlow';

// Lazy load components for better performance
const IdentityPage = React.lazy(() => import('./components/IdentityPage'));
const ReputationPage = React.lazy(() => import('./components/ReputationPage'));
const EarnPage = React.lazy(() => import('./components/EarnPage'));
const DiscoverPage = React.lazy(() => import('./components/DiscoverPage'));
const NotificationsPage = React.lazy(() => import('./components/NotificationsPage'));
const SettingsPage = React.lazy(() => import('./components/SettingsPage'));

// Import utilities
import { config, validateEnvironment } from './config/environment';
import { analytics, trackPageView } from './utils/analytics';
import { performanceMonitor } from './utils/performance';
import { errorHandler } from './utils/errorHandler';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    initializeApp();
  }, []);

  useEffect(() => {
    // Track page views
    trackPageView(activeTab);
  }, [activeTab]);

  const initializeApp = async () => {
    try {
      // Validate environment
      if (!validateEnvironment()) {
        throw new Error('Invalid environment configuration');
      }

      // Initialize monitoring
      performanceMonitor.init();
      analytics.init();

      // Check onboarding status
      const onboardingComplete = localStorage.getItem('nexdentify-onboarded');
      setIsOnboarded(!!onboardingComplete);

      // Simulate app initialization
      await new Promise(resolve => setTimeout(resolve, 1000));

    } catch (error) {
      console.error('App initialization failed:', error);
      errorHandler.handleError(error as Error, { context: 'app_initialization' });
      setInitError((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnboardingComplete = () => {
    setIsOnboarded(true);
    trackPageView('onboarding_complete');
  };

  const handleDiscoverClick = () => {
    setActiveTab('discover');
  };

  const handleNotificationClick = () => {
    setActiveTab('notifications');
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  // Show loading screen during initialization
  if (isLoading) {
    return <LoadingScreen message="Initializing NexDentify..." />;
  }

  // Show error screen if initialization failed
  if (initError) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold text-red-400">Initialization Failed</h2>
          <p className="text-dark-text-secondary">{initError}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-primary-red to-primary-red-dark text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Show onboarding flow if user hasn't completed it
  if (!isOnboarded) {
    return (
      <ErrorBoundary>
        <OnboardingFlow onComplete={handleOnboardingComplete} />
      </ErrorBoundary>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'identity':
        return (
          <Suspense fallback={<LoadingScreen message="Loading Identity..." />}>
            <IdentityPage />
          </Suspense>
        );
      case 'reputation':
        return (
          <Suspense fallback={<LoadingScreen message="Loading Reputation..." />}>
            <ReputationPage />
          </Suspense>
        );
      case 'earn':
        return (
          <Suspense fallback={<LoadingScreen message="Loading Earn..." />}>
            <EarnPage />
          </Suspense>
        );
      case 'discover':
        return (
          <Suspense fallback={<LoadingScreen message="Loading Discover..." />}>
            <DiscoverPage />
          </Suspense>
        );
      case 'notifications':
        return (
          <Suspense fallback={<LoadingScreen message="Loading Notifications..." />}>
            <NotificationsPage />
          </Suspense>
        );
      case 'settings':
        return (
          <Suspense fallback={<LoadingScreen message="Loading Settings..." />}>
            <SettingsPage />
          </Suspense>
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
    <ErrorBoundary>
      <div className="min-h-screen bg-dark-bg text-dark-text">
        <TopBar 
          onDiscoverClick={handleDiscoverClick}
          onNotificationClick={handleNotificationClick}
        />
        
        <main>
          {renderContent()}
        </main>
        
        <BottomNavigation 
          activeTab={activeTab} 
          onTabChange={handleTabChange} 
        />
      </div>
    </ErrorBoundary>
  );
}

export default App;