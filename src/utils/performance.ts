/**
 * Performance Monitoring and Optimization
 */

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  context?: Record<string, any>;
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetric[] = [];
  
  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }
  
  /**
   * Initialize performance monitoring
   */
  init(): void {
    this.observeWebVitals();
    this.observeResourceTiming();
    this.observeUserTiming();
  }
  
  /**
   * Record a performance metric
   */
  recordMetric(name: string, value: number, context?: Record<string, any>): void {
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
      context,
    };
    
    this.metrics.push(metric);
    
    // Keep only last 100 metrics
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100);
    }
    
    // Log in development
    if (import.meta.env.DEV) {
      console.log('Performance Metric:', metric);
    }
    
    // Send to monitoring service
    this.sendMetric(metric);
  }
  
  /**
   * Measure function execution time
   */
  measureFunction<T>(name: string, fn: () => T): T {
    const start = performance.now();
    const result = fn();
    const duration = performance.now() - start;
    
    this.recordMetric(`function_${name}`, duration);
    
    return result;
  }
  
  /**
   * Measure async function execution time
   */
  async measureAsyncFunction<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now();
    const result = await fn();
    const duration = performance.now() - start;
    
    this.recordMetric(`async_function_${name}`, duration);
    
    return result;
  }
  
  /**
   * Start a performance timer
   */
  startTimer(name: string): () => void {
    const start = performance.now();
    
    return () => {
      const duration = performance.now() - start;
      this.recordMetric(`timer_${name}`, duration);
    };
  }
  
  /**
   * Get all recorded metrics
   */
  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }
  
  /**
   * Clear all metrics
   */
  clearMetrics(): void {
    this.metrics = [];
  }
  
  /**
   * Observe Web Vitals
   */
  private observeWebVitals(): void {
    // Largest Contentful Paint
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        this.recordMetric('lcp', entry.startTime);
      }
    }).observe({ entryTypes: ['largest-contentful-paint'] });
    
    // First Input Delay
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        this.recordMetric('fid', (entry as any).processingStart - entry.startTime);
      }
    }).observe({ entryTypes: ['first-input'] });
    
    // Cumulative Layout Shift
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          this.recordMetric('cls', (entry as any).value);
        }
      }
    }).observe({ entryTypes: ['layout-shift'] });
  }
  
  /**
   * Observe resource timing
   */
  private observeResourceTiming(): void {
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const resource = entry as PerformanceResourceTiming;
        this.recordMetric('resource_load', resource.duration, {
          name: resource.name,
          type: resource.initiatorType,
          size: resource.transferSize,
        });
      }
    }).observe({ entryTypes: ['resource'] });
  }
  
  /**
   * Observe user timing
   */
  private observeUserTiming(): void {
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        this.recordMetric('user_timing', entry.duration, {
          name: entry.name,
          type: entry.entryType,
        });
      }
    }).observe({ entryTypes: ['measure'] });
  }
  
  /**
   * Send metric to monitoring service
   */
  private sendMetric(metric: PerformanceMetric): void {
    if (import.meta.env.VITE_API_BASE_URL) {
      fetch(`${import.meta.env.VITE_API_BASE_URL}/metrics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(metric),
      }).catch(error => {
        console.error('Failed to send performance metric:', error);
      });
    }
  }
}

export const performanceMonitor = PerformanceMonitor.getInstance();

// Convenience functions
export const recordMetric = (name: string, value: number, context?: Record<string, any>) => {
  performanceMonitor.recordMetric(name, value, context);
};

export const measureFunction = <T>(name: string, fn: () => T): T => {
  return performanceMonitor.measureFunction(name, fn);
};

export const measureAsyncFunction = <T>(name: string, fn: () => Promise<T>): Promise<T> => {
  return performanceMonitor.measureAsyncFunction(name, fn);
};

export const startTimer = (name: string): (() => void) => {
  return performanceMonitor.startTimer(name);
};