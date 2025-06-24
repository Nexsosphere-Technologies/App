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
import ErrorBoundary from './components/ErrorBoundary';
import LoadingScreen from './components/LoadingScreen';
import { environment, isDevelopment } from './config/environment';
import { ErrorHandler } from './utils/errorHandler';
import { PerformanceMonitor } from './utils/performance';
import { analytics } from './utils/analytics';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Initialize error handler
      ErrorHandler.initialize({
        enableReporting: environment.ENABLE_ERROR_REPORTING,
        enableLogging: environment.ENABLE_DEBUG,
        environment: environment.APP_ENV
      });

      // Initialize performance monitoring
      if (environment.ENABLE_ANALYTICS) {
        PerformanceMonitor.initialize();
      }

      // Initialize analytics
      if (environment.ENABLE_ANALYTICS && environment.GA_TRACKING_ID) {
        analytics.init();
      }

      // Check onboarding status
      const onboardingComplete = localStorage.getItem('nexdentify-onboarded');
      setIsOnboarded(!!onboardingComplete);

      // Log successful initialization in development
      if (isDevelopment) {
        console.log('✅ NexDentify initialized successfully');
        console.log('🌐 Network:', environment.ALGORAND_NETWORK);
        console.log('🔗 Algod Server:', environment.ALGOD_SERVER);
        console.log('📊 Indexer Server:', environment.INDEXER_SERVER);
      }

      setIsInitialized(true);
    } catch (error) {
      console.error('Failed to initialize app:', error);
      
      // In development, continue with limited functionality
      if (isDevelopment) {
        console.warn('⚠️ App initialization failed, continuing with limited functionality');
        setInitError('Development mode: Some features may not work properly due to configuration issues.');
        setIsInitialized(true);
        
        // Check onboarding status even if initialization failed
        const onboardingComplete = localStorage.getItem('nexdentify-onboarded');
        setIsOnboarded(!!onboardingComplete);
      } else {
        // In production, show error
        setInitError('Failed to initialize application. Please check your configuration.');
        ErrorHandler.handleError(error as Error, 'App initialization failed');
      }
    }
  };

  const handleOnboardingComplete = () => {
    setIsOnboarded(true);
  };

  const handleDiscoverClick = () => {
    setActiveTab('discover');
  };

  const handleNotificationClick = () => {
    setActiveTab('notifications');
  };

  // Show loading screen while initializing
  if (!isInitialized) {
    return <LoadingScreen message="Initializing NexDentify..." />;
  }

  // Show error screen if initialization failed in production
  if (initError && !isDevelopment) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-dark-text">Initialization Error</h1>
          <p className="text-dark-text-secondary">{initError}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary-red text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Show development warning if there are configuration issues
  const showDevWarning = isDevelopment && initError;

  // Show onboarding flow if user hasn't completed it
  if (!isOnboarded) {
    return (
      <ErrorBoundary>
        {showDevWarning && (
          <div className="bg-yellow-500/10 border-b border-yellow-500/30 p-3 text-center">
            <p className="text-yellow-400 text-sm">
              <strong>Development Mode:</strong> {initError}
            </p>
          </div>
        )}
        <OnboardingFlow onComplete={handleOnboardingComplete} />
      </ErrorBoundary>
    );
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
    <ErrorBoundary>
      <div className="min-h-screen bg-dark-bg text-dark-text">
        {showDevWarning && (
          <div className="bg-yellow-500/10 border-b border-yellow-500/30 p-3 text-center">
            <p className="text-yellow-400 text-sm">
              <strong>Development Mode:</strong> {initError}
            </p>
          </div>
        )}
        <TopBar 
          onDiscoverClick={handleDiscoverClick}
          onNotificationClick={handleNotificationClick}
        />
        {renderContent()}
        <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </ErrorBoundary>
  );
}

export default App;