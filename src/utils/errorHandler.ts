/**
 * Global Error Handling Utilities
 */

export interface ErrorReport {
  message: string;
  stack?: string;
  context?: Record<string, any>;
  timestamp: number;
  userAgent: string;
  url: string;
}

class ErrorHandler {
  private static instance: ErrorHandler;
  
  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }
  
  /**
   * Handle and report errors
   */
  handleError(error: Error, context?: Record<string, any>): void {
    const errorReport: ErrorReport = {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };
    
    // Log to console in development
    if (import.meta.env.DEV) {
      console.error('Error Report:', errorReport);
    }
    
    // Send to error reporting service in production
    if (import.meta.env.PROD && import.meta.env.VITE_ENABLE_ERROR_REPORTING === 'true') {
      this.reportError(errorReport);
    }
    
    // Store locally for debugging
    this.storeErrorLocally(errorReport);
  }
  
  /**
   * Report error to external service
   */
  private async reportError(errorReport: ErrorReport): Promise<void> {
    try {
      // Replace with your error reporting service (Sentry, LogRocket, etc.)
      await fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorReport),
      });
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
    }
  }
  
  /**
   * Store error locally for debugging
   */
  private storeErrorLocally(errorReport: ErrorReport): void {
    try {
      const errors = this.getStoredErrors();
      errors.push(errorReport);
      
      // Keep only last 50 errors
      const recentErrors = errors.slice(-50);
      
      localStorage.setItem('nexdentify-errors', JSON.stringify(recentErrors));
    } catch (storageError) {
      console.error('Failed to store error locally:', storageError);
    }
  }
  
  /**
   * Get stored errors for debugging
   */
  getStoredErrors(): ErrorReport[] {
    try {
      const stored = localStorage.getItem('nexdentify-errors');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }
  
  /**
   * Clear stored errors
   */
  clearStoredErrors(): void {
    localStorage.removeItem('nexdentify-errors');
  }
}

export const errorHandler = ErrorHandler.getInstance();

/**
 * Global error boundary for React
 */
export const handleGlobalError = (error: Error, errorInfo?: any) => {
  errorHandler.handleError(error, { errorInfo });
};

/**
 * Async error handler for promises
 */
export const handleAsyncError = (error: Error, context?: Record<string, any>) => {
  errorHandler.handleError(error, context);
};

/**
 * Network error handler
 */
export const handleNetworkError = (error: Error, request?: any) => {
  errorHandler.handleError(error, { 
    type: 'network',
    request: request ? {
      url: request.url,
      method: request.method,
      headers: request.headers,
    } : undefined
  });
};

/**
 * Blockchain transaction error handler
 */
export const handleTransactionError = (error: Error, transaction?: any) => {
  errorHandler.handleError(error, {
    type: 'blockchain',
    transaction: transaction ? {
      type: transaction.type,
      from: transaction.from,
      to: transaction.to,
      amount: transaction.amount,
    } : undefined
  });
};