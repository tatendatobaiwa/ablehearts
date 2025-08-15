/**
 * Advanced Performance Monitoring for AbleHearts Foundation
 * Comprehensive performance tracking and optimization
 */

// Performance metrics collection
export class PerformanceMonitor {
  constructor() {
    this.metrics = {
      navigation: {},
      vitals: {},
      resources: [],
      errors: [],
      userInteractions: []
    };
    this.observers = new Map();
    this.isInitialized = false;
  }

  // Initialize performance monitoring
  initialize() {
    if (this.isInitialized) return;

    this.collectNavigationMetrics();
    this.setupWebVitalsMonitoring();
    this.setupResourceMonitoring();
    this.setupErrorTracking();
    this.setupUserInteractionTracking();
    this.setupMemoryMonitoring();

    this.isInitialized = true;
    this.reportInitialization();
  }

  // Collect navigation timing metrics
  collectNavigationMetrics() {
    if (!performance.getEntriesByType) return;

    const navigation = performance.getEntriesByType('navigation')[0];
    if (navigation) {
      this.metrics.navigation = {
        // DNS and connection
        dnsLookup: navigation.domainLookupEnd - navigation.domainLookupStart,
        tcpConnection: navigation.connectEnd - navigation.connectStart,
        tlsHandshake: navigation.secureConnectionStart > 0 
          ? navigation.connectEnd - navigation.secureConnectionStart 
          : 0,

        // Request and response
        requestTime: navigation.responseStart - navigation.requestStart,
        responseTime: navigation.responseEnd - navigation.responseStart,
        
        // DOM processing
        domProcessing: navigation.domContentLoadedEventStart - navigation.responseEnd,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        
        // Complete load
        windowLoad: navigation.loadEventEnd - navigation.loadEventStart,
        totalLoadTime: navigation.loadEventEnd - navigation.navigationStart,

        // Time to Interactive approximation
        timeToInteractive: navigation.domContentLoadedEventEnd - navigation.navigationStart,

        // Transfer size
        transferSize: navigation.transferSize || 0,
        encodedBodySize: navigation.encodedBodySize || 0,
        decodedBodySize: navigation.decodedBodySize || 0
      };
    }
  }

  // Setup Core Web Vitals monitoring
  setupWebVitalsMonitoring() {
    // Largest Contentful Paint (LCP)
    this.observePerformanceEntries('largest-contentful-paint', (entries) => {
      const lastEntry = entries[entries.length - 1];
      this.metrics.vitals.lcp = {
        value: lastEntry.startTime,
        element: lastEntry.element?.tagName || 'unknown',
        url: lastEntry.url || '',
        timestamp: Date.now()
      };
    });

    // First Input Delay (FID)
    this.observePerformanceEntries('first-input', (entries) => {
      const firstInput = entries[0];
      this.metrics.vitals.fid = {
        value: firstInput.processingStart - firstInput.startTime,
        eventType: firstInput.name,
        timestamp: Date.now()
      };
    });

    // Cumulative Layout Shift (CLS)
    let clsValue = 0;
    this.observePerformanceEntries('layout-shift', (entries) => {
      for (const entry of entries) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      }
      this.metrics.vitals.cls = {
        value: clsValue,
        timestamp: Date.now()
      };
    });

    // First Contentful Paint (FCP)
    this.observePerformanceEntries('paint', (entries) => {
      const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
      if (fcpEntry) {
        this.metrics.vitals.fcp = {
          value: fcpEntry.startTime,
          timestamp: Date.now()
        };
      }
    });

    // Time to First Byte (TTFB)
    const navigation = performance.getEntriesByType('navigation')[0];
    if (navigation) {
      this.metrics.vitals.ttfb = {
        value: navigation.responseStart - navigation.requestStart,
        timestamp: Date.now()
      };
    }
  }

  // Setup resource monitoring
  setupResourceMonitoring() {
    this.observePerformanceEntries('resource', (entries) => {
      entries.forEach(entry => {
        const resource = {
          name: entry.name,
          type: this.getResourceType(entry),
          duration: entry.duration,
          size: entry.transferSize || 0,
          cached: entry.transferSize === 0 && entry.decodedBodySize > 0,
          timestamp: Date.now()
        };

        // Track slow resources
        if (entry.duration > 1000) {
          resource.slow = true;
        }

        this.metrics.resources.push(resource);
      });
    });
  }

  // Setup error tracking
  setupErrorTracking() {
    // JavaScript errors
    window.addEventListener('error', (event) => {
      this.metrics.errors.push({
        type: 'javascript',
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
        timestamp: Date.now()
      });
    });

    // Promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.metrics.errors.push({
        type: 'promise_rejection',
        message: event.reason?.message || 'Unhandled promise rejection',
        stack: event.reason?.stack,
        timestamp: Date.now()
      });
    });

    // Resource loading errors
    window.addEventListener('error', (event) => {
      if (event.target !== window) {
        this.metrics.errors.push({
          type: 'resource',
          element: event.target.tagName,
          source: event.target.src || event.target.href,
          timestamp: Date.now()
        });
      }
    }, true);
  }

  // Setup user interaction tracking
  setupUserInteractionTracking() {
    const interactionTypes = ['click', 'keydown', 'scroll', 'touchstart'];
    
    interactionTypes.forEach(type => {
      document.addEventListener(type, (event) => {
        this.trackUserInteraction(type, event);
      }, { passive: true });
    });
  }

  // Setup memory monitoring
  setupMemoryMonitoring() {
    if ('memory' in performance) {
      setInterval(() => {
        const memory = performance.memory;
        this.metrics.memory = {
          usedJSHeapSize: memory.usedJSHeapSize,
          totalJSHeapSize: memory.totalJSHeapSize,
          jsHeapSizeLimit: memory.jsHeapSizeLimit,
          timestamp: Date.now()
        };
      }, 30000); // Check every 30 seconds
    }
  }

  // Helper method to observe performance entries
  observePerformanceEntries(entryType, callback) {
    if (!PerformanceObserver) return;

    try {
      const observer = new PerformanceObserver((list) => {
        callback(list.getEntries());
      });
      
      observer.observe({ entryTypes: [entryType] });
      this.observers.set(entryType, observer);
    } catch (error) {
      // Observer not supported for this entry type
    }
  }

  // Track user interactions
  trackUserInteraction(type, event) {
    const interaction = {
      type,
      timestamp: Date.now(),
      target: event.target?.tagName || 'unknown'
    };

    // Add specific data based on interaction type
    if (type === 'click') {
      interaction.x = event.clientX;
      interaction.y = event.clientY;
    } else if (type === 'scroll') {
      interaction.scrollY = window.scrollY;
    }

    this.metrics.userInteractions.push(interaction);

    // Keep only last 100 interactions
    if (this.metrics.userInteractions.length > 100) {
      this.metrics.userInteractions = this.metrics.userInteractions.slice(-100);
    }
  }

  // Get resource type from performance entry
  getResourceType(entry) {
    if (entry.initiatorType) return entry.initiatorType;
    
    const url = entry.name;
    if (url.includes('.js')) return 'script';
    if (url.includes('.css')) return 'stylesheet';
    if (url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) return 'image';
    if (url.match(/\.(woff|woff2|ttf|otf)$/i)) return 'font';
    
    return 'other';
  }

  // Generate performance report
  generateReport() {
    const report = {
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      connection: this.getConnectionInfo(),
      metrics: this.metrics,
      scores: this.calculatePerformanceScores(),
      recommendations: this.generateRecommendations()
    };

    return report;
  }

  // Get connection information
  getConnectionInfo() {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection) {
      return {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData
      };
    }
    return null;
  }

  // Calculate performance scores
  calculatePerformanceScores() {
    const scores = {};

    // LCP Score (Good: <2.5s, Needs Improvement: 2.5-4s, Poor: >4s)
    if (this.metrics.vitals.lcp) {
      const lcp = this.metrics.vitals.lcp.value;
      scores.lcp = lcp <= 2500 ? 'good' : lcp <= 4000 ? 'needs-improvement' : 'poor';
    }

    // FID Score (Good: <100ms, Needs Improvement: 100-300ms, Poor: >300ms)
    if (this.metrics.vitals.fid) {
      const fid = this.metrics.vitals.fid.value;
      scores.fid = fid <= 100 ? 'good' : fid <= 300 ? 'needs-improvement' : 'poor';
    }

    // CLS Score (Good: <0.1, Needs Improvement: 0.1-0.25, Poor: >0.25)
    if (this.metrics.vitals.cls) {
      const cls = this.metrics.vitals.cls.value;
      scores.cls = cls <= 0.1 ? 'good' : cls <= 0.25 ? 'needs-improvement' : 'poor';
    }

    // FCP Score (Good: <1.8s, Needs Improvement: 1.8-3s, Poor: >3s)
    if (this.metrics.vitals.fcp) {
      const fcp = this.metrics.vitals.fcp.value;
      scores.fcp = fcp <= 1800 ? 'good' : fcp <= 3000 ? 'needs-improvement' : 'poor';
    }

    return scores;
  }

  // Generate performance recommendations
  generateRecommendations() {
    const recommendations = [];
    const scores = this.calculatePerformanceScores();

    if (scores.lcp === 'poor' || scores.lcp === 'needs-improvement') {
      recommendations.push({
        metric: 'LCP',
        issue: 'Largest Contentful Paint is slow',
        suggestions: [
          'Optimize images and use modern formats (WebP, AVIF)',
          'Implement lazy loading for non-critical images',
          'Reduce server response times',
          'Preload critical resources'
        ]
      });
    }

    if (scores.fid === 'poor' || scores.fid === 'needs-improvement') {
      recommendations.push({
        metric: 'FID',
        issue: 'First Input Delay is high',
        suggestions: [
          'Reduce JavaScript execution time',
          'Split large bundles and load code on demand',
          'Use web workers for heavy computations',
          'Optimize third-party scripts'
        ]
      });
    }

    if (scores.cls === 'poor' || scores.cls === 'needs-improvement') {
      recommendations.push({
        metric: 'CLS',
        issue: 'Cumulative Layout Shift is high',
        suggestions: [
          'Set explicit dimensions for images and videos',
          'Reserve space for dynamic content',
          'Avoid inserting content above existing content',
          'Use CSS transforms instead of changing layout properties'
        ]
      });
    }

    // Check for slow resources
    const slowResources = this.metrics.resources.filter(r => r.slow);
    if (slowResources.length > 0) {
      recommendations.push({
        metric: 'Resources',
        issue: `${slowResources.length} slow loading resources detected`,
        suggestions: [
          'Optimize large resources',
          'Use CDN for static assets',
          'Implement resource compression',
          'Consider removing unused resources'
        ]
      });
    }

    return recommendations;
  }

  // Report initialization
  reportInitialization() {
    if (import.meta.env.DEV) {
      // Development logging
    } else {
      // Production reporting
      this.sendToAnalytics('performance_monitor_initialized', {
        timestamp: Date.now(),
        url: window.location.href
      });
    }
  }

  // Send data to analytics
  sendToAnalytics(eventName, data) {
    // Integration with existing analytics
    if (window.gtag) {
      window.gtag('event', eventName, {
        custom_parameter: JSON.stringify(data)
      });
    }
  }

  // Cleanup observers
  cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
  }
}

// Performance monitoring utilities
export const performanceUtils = {
  // Measure function execution time
  measureFunction: (fn, name) => {
    return function(...args) {
      const start = performance.now();
      const result = fn.apply(this, args);
      const end = performance.now();
      
      // Log performance in development
      if (import.meta.env.DEV) {
        // Function ${name} took ${end - start} milliseconds
      }
      
      return result;
    };
  },

  // Measure async function execution time
  measureAsyncFunction: (fn, name) => {
    return async function(...args) {
      const start = performance.now();
      const result = await fn.apply(this, args);
      const end = performance.now();
      
      // Log performance in development
      if (import.meta.env.DEV) {
        // Async function ${name} took ${end - start} milliseconds
      }
      
      return result;
    };
  },

  // Mark performance milestones
  mark: (name) => {
    if (performance.mark) {
      performance.mark(name);
    }
  },

  // Measure between marks
  measure: (name, startMark, endMark) => {
    if (performance.measure) {
      performance.measure(name, startMark, endMark);
    }
  },

  // Get performance entries
  getEntries: (type) => {
    return performance.getEntriesByType(type) || [];
  }
};

// Global performance monitor instance
export const globalPerformanceMonitor = new PerformanceMonitor();

// Initialize on load
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      globalPerformanceMonitor.initialize();
    });
  } else {
    globalPerformanceMonitor.initialize();
  }
}

export default {
  PerformanceMonitor,
  performanceUtils,
  globalPerformanceMonitor
};