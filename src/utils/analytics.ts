/**
 * Analytics and User Tracking
 */

interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  timestamp: number;
}

class Analytics {
  private static instance: Analytics;
  private isEnabled: boolean;
  
  constructor() {
    this.isEnabled = import.meta.env.VITE_ENABLE_ANALYTICS === 'true';
  }
  
  static getInstance(): Analytics {
    if (!Analytics.instance) {
      Analytics.instance = new Analytics();
    }
    return Analytics.instance;
  }
  
  /**
   * Initialize analytics
   */
  init(): void {
    if (!this.isEnabled) return;
    
    // Initialize your analytics service (Google Analytics, Mixpanel, etc.)
    if (import.meta.env.VITE_ANALYTICS_ID) {
      this.initializeGoogleAnalytics();
    }
  }
  
  /**
   * Track user events
   */
  track(eventName: string, properties?: Record<string, any>): void {
    if (!this.isEnabled) return;
    
    const event: AnalyticsEvent = {
      name: eventName,
      properties,
      timestamp: Date.now(),
    };
    
    // Send to analytics service
    this.sendEvent(event);
    
    // Store locally for debugging
    if (import.meta.env.DEV) {
      console.log('Analytics Event:', event);
    }
  }
  
  /**
   * Track page views
   */
  trackPageView(page: string, properties?: Record<string, any>): void {
    this.track('page_view', {
      page,
      ...properties,
    });
  }
  
  /**
   * Track user actions
   */
  trackUserAction(action: string, properties?: Record<string, any>): void {
    this.track('user_action', {
      action,
      ...properties,
    });
  }
  
  /**
   * Track blockchain transactions
   */
  trackTransaction(type: string, properties?: Record<string, any>): void {
    this.track('blockchain_transaction', {
      type,
      ...properties,
    });
  }
  
  /**
   * Track errors
   */
  trackError(error: string, properties?: Record<string, any>): void {
    this.track('error', {
      error,
      ...properties,
    });
  }
  
  /**
   * Set user properties
   */
  setUserProperties(properties: Record<string, any>): void {
    if (!this.isEnabled) return;
    
    // Set user properties in analytics service
    if (typeof gtag !== 'undefined') {
      gtag('config', import.meta.env.VITE_ANALYTICS_ID, {
        custom_map: properties,
      });
    }
  }
  
  /**
   * Initialize Google Analytics
   */
  private initializeGoogleAnalytics(): void {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${import.meta.env.VITE_ANALYTICS_ID}`;
    document.head.appendChild(script);
    
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer.push(arguments);
    }
    
    gtag('js', new Date());
    gtag('config', import.meta.env.VITE_ANALYTICS_ID);
  }
  
  /**
   * Send event to analytics service
   */
  private sendEvent(event: AnalyticsEvent): void {
    // Google Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', event.name, event.properties);
    }
    
    // Custom analytics endpoint
    if (import.meta.env.VITE_API_BASE_URL) {
      fetch(`${import.meta.env.VITE_API_BASE_URL}/analytics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      }).catch(error => {
        console.error('Failed to send analytics event:', error);
      });
    }
  }
}

export const analytics = Analytics.getInstance();

// Convenience functions
export const trackEvent = (name: string, properties?: Record<string, any>) => {
  analytics.track(name, properties);
};

export const trackPageView = (page: string, properties?: Record<string, any>) => {
  analytics.trackPageView(page, properties);
};

export const trackUserAction = (action: string, properties?: Record<string, any>) => {
  analytics.trackUserAction(action, properties);
};

export const trackTransaction = (type: string, properties?: Record<string, any>) => {
  analytics.trackTransaction(type, properties);
};

export const trackError = (error: string, properties?: Record<string, any>) => {
  analytics.trackError(error, properties);
};