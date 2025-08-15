/**
 * Production Optimization Utilities for AbleHearts Foundation
 * Advanced optimization and monitoring for production deployment
 */

// Production environment detection
export const isProduction = import.meta.env.PROD;
export const isDevelopment = import.meta.env.DEV;

// Production optimization configuration
export const PRODUCTION_CONFIG = {
  // Performance thresholds
  PERFORMANCE_THRESHOLDS: {
    LCP: 2500, // Largest Contentful Paint (ms)
    FID: 100,  // First Input Delay (ms)
    CLS: 0.1,  // Cumulative Layout Shift
    FCP: 1800, // First Contentful Paint (ms)
    TTFB: 800  // Time to First Byte (ms)
  },

  // Resource optimization
  RESOURCE_LIMITS: {
    MAX_BUNDLE_SIZE: 1024 * 1024, // 1MB
    MAX_IMAGE_SIZE: 500 * 1024,   // 500KB
    MAX_FONT_SIZE: 100 * 1024,    // 100KB
    MAX_CSS_SIZE: 200 * 1024      // 200KB
  },

  // Monitoring intervals
  MONITORING: {
    PERFORMANCE_CHECK: 30000,     // 30 seconds
    MEMORY_CHECK: 60000,          // 1 minute
    ERROR_REPORT: 5000,           // 5 seconds
    ANALYTICS_BATCH: 10000        // 10 seconds
  },

  // Feature flags
  FEATURES: {
    ENABLE_SERVICE_WORKER: true,
    ENABLE_LAZY_LOADING: true,
    ENABLE_PRELOADING: true,
    ENABLE_COMPRESSION: true,
    ENABLE_CACHING: true
  }
};

// Production optimization manager
export class ProductionOptimizer {
  constructor() {
    this.isInitialized = false;
    this.optimizations = new Map();
    this.metrics = {
      optimizationsApplied: 0,
      performanceGains: {},
      errors: []
    };
  }

  // Initialize production optimizations
  async initialize() {
    if (this.isInitialized || !isProduction) return;

    try {
      await this.applyPerformanceOptimizations();
      await this.setupResourceOptimization();
      await this.initializeServiceWorker();
      await this.setupErrorTracking();
      await this.enableCompressionOptimizations();
      
      this.isInitialized = true;
      this.reportInitialization();
    } catch (error) {
      this.handleOptimizationError('initialization', error);
    }
  }

  // Apply performance optimizations
  async applyPerformanceOptimizations() {
    const optimizations = [
      this.optimizeImageLoading(),
      this.optimizeFontLoading(),
      this.optimizeScriptLoading(),
      this.optimizeCSSDelivery(),
      this.enableResourceHints()
    ];

    const results = await Promise.allSettled(optimizations);
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        this.metrics.optimizationsApplied++;
      } else {
        this.handleOptimizationError(`optimization_${index}`, result.reason);
      }
    });
  }

  // Optimize image loading
  optimizeImageLoading() {
    return new Promise((resolve) => {
      // Implement intersection observer for lazy loading
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.classList.add('loaded');
              imageObserver.unobserve(img);
            }
          }
        });
      }, {
        rootMargin: '50px 0px',
        threshold: 0.01
      });

      // Observe all images with data-src
      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });

      this.optimizations.set('imageLoading', imageObserver);
      resolve('Image loading optimized');
    });
  }

  // Optimize font loading
  optimizeFontLoading() {
    return new Promise((resolve) => {
      // Preload critical fonts
      const criticalFonts = [
        'https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrJJfecg.woff2'
      ];

      criticalFonts.forEach(fontUrl => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = fontUrl;
        link.as = 'font';
        link.type = 'font/woff2';
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
      });

      // Use font-display: swap for better performance
      const style = document.createElement('style');
      style.textContent = `
        @font-face {
          font-family: 'Poppins';
          font-display: swap;
        }
      `;
      document.head.appendChild(style);

      resolve('Font loading optimized');
    });
  }

  // Optimize script loading
  optimizeScriptLoading() {
    return new Promise((resolve) => {
      // Defer non-critical scripts
      const scripts = document.querySelectorAll('script[src]');
      scripts.forEach(script => {
        if (!script.hasAttribute('async') && !script.hasAttribute('defer')) {
          // Add defer to non-critical scripts
          if (!this.isCriticalScript(script.src)) {
            script.defer = true;
          }
        }
      });

      // Preload critical scripts
      const criticalScripts = this.getCriticalScripts();
      criticalScripts.forEach(scriptSrc => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = scriptSrc;
        link.as = 'script';
        document.head.appendChild(link);
      });

      resolve('Script loading optimized');
    });
  }

  // Optimize CSS delivery
  optimizeCSSDelivery() {
    return new Promise((resolve) => {
      // Inline critical CSS (if not already done)
      const criticalCSS = this.getCriticalCSS();
      if (criticalCSS) {
        const style = document.createElement('style');
        style.textContent = criticalCSS;
        document.head.insertBefore(style, document.head.firstChild);
      }

      // Preload non-critical CSS
      const nonCriticalCSS = document.querySelectorAll('link[rel="stylesheet"]');
      nonCriticalCSS.forEach(link => {
        if (!this.isCriticalCSS(link.href)) {
          link.rel = 'preload';
          link.as = 'style';
          link.onload = function() {
            this.rel = 'stylesheet';
          };
        }
      });

      resolve('CSS delivery optimized');
    });
  }

  // Enable resource hints
  enableResourceHints() {
    return new Promise((resolve) => {
      const hints = [
        { rel: 'dns-prefetch', href: 'https://www.googletagmanager.com' },
        { rel: 'dns-prefetch', href: 'https://fonts.googleapis.com' },
        { rel: 'dns-prefetch', href: 'https://connect.facebook.net' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true }
      ];

      hints.forEach(hint => {
        const link = document.createElement('link');
        Object.assign(link, hint);
        document.head.appendChild(link);
      });

      resolve('Resource hints enabled');
    });
  }

  // Setup resource optimization
  async setupResourceOptimization() {
    // Monitor resource sizes
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach(entry => {
        if (entry.transferSize > PRODUCTION_CONFIG.RESOURCE_LIMITS.MAX_IMAGE_SIZE) {
          this.reportLargeResource(entry);
        }
      });
    });

    observer.observe({ entryTypes: ['resource'] });
    this.optimizations.set('resourceMonitoring', observer);
  }

  // Initialize service worker
  async initializeServiceWorker() {
    if (!PRODUCTION_CONFIG.FEATURES.ENABLE_SERVICE_WORKER) return;
    if (!('serviceWorker' in navigator)) return;

    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      
      // Handle service worker updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            this.notifyUserOfUpdate();
          }
        });
      });

      this.optimizations.set('serviceWorker', registration);
    } catch (error) {
      this.handleOptimizationError('serviceWorker', error);
    }
  }

  // Setup error tracking
  setupErrorTracking() {
    // Global error handler
    window.addEventListener('error', (event) => {
      this.reportError({
        type: 'javascript',
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
        timestamp: Date.now()
      });
    });

    // Promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      this.reportError({
        type: 'promise_rejection',
        message: event.reason?.message || 'Unhandled promise rejection',
        stack: event.reason?.stack,
        timestamp: Date.now()
      });
    });

    // Resource error handler
    window.addEventListener('error', (event) => {
      if (event.target !== window) {
        this.reportError({
          type: 'resource',
          element: event.target.tagName,
          source: event.target.src || event.target.href,
          timestamp: Date.now()
        });
      }
    }, true);
  }

  // Enable compression optimizations
  enableCompressionOptimizations() {
    if (!PRODUCTION_CONFIG.FEATURES.ENABLE_COMPRESSION) return;

    // Enable compression for fetch requests
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
      const [url, options = {}] = args;
      
      // Add compression headers
      options.headers = {
        'Accept-Encoding': 'gzip, deflate, br',
        ...options.headers
      };

      return originalFetch(url, options);
    };
  }

  // Helper methods
  isCriticalScript(src) {
    const criticalPatterns = [
      '/main.',
      '/vendor.',
      '/polyfill',
      'analytics'
    ];
    return criticalPatterns.some(pattern => src.includes(pattern));
  }

  getCriticalScripts() {
    // Return array of critical script URLs
    return [
      '/assets/main.js',
      '/assets/vendor.js'
    ].filter(src => document.querySelector(`script[src*="${src}"]`));
  }

  isCriticalCSS(href) {
    const criticalPatterns = [
      '/main.',
      '/critical.',
      '/above-fold'
    ];
    return criticalPatterns.some(pattern => href.includes(pattern));
  }

  getCriticalCSS() {
    // Return critical CSS string (if available)
    return null; // Implement based on your critical CSS extraction
  }

  // Reporting methods
  reportLargeResource(entry) {
    this.reportError({
      type: 'large_resource',
      name: entry.name,
      size: entry.transferSize,
      threshold: PRODUCTION_CONFIG.RESOURCE_LIMITS.MAX_IMAGE_SIZE,
      timestamp: Date.now()
    });
  }

  reportError(error) {
    this.metrics.errors.push(error);
    
    // Send to analytics in production
    if (window.gtag) {
      window.gtag('event', 'production_error', {
        error_type: error.type,
        error_message: error.message,
        custom_parameter: JSON.stringify(error)
      });
    }
  }

  notifyUserOfUpdate() {
    // Notify user of available update
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Update Available', {
        body: 'A new version of the website is available. Please refresh to update.',
        icon: '/src/assets/fixed/icons/ableheartslogo.webp'
      });
    }
  }

  handleOptimizationError(optimization, error) {
    this.reportError({
      type: 'optimization_error',
      optimization,
      message: error.message,
      stack: error.stack,
      timestamp: Date.now()
    });
  }

  reportInitialization() {
    if (window.gtag) {
      window.gtag('event', 'production_optimizer_initialized', {
        optimizations_applied: this.metrics.optimizationsApplied,
        timestamp: Date.now()
      });
    }
  }

  // Get optimization report
  getOptimizationReport() {
    return {
      isInitialized: this.isInitialized,
      optimizationsApplied: this.metrics.optimizationsApplied,
      activeOptimizations: Array.from(this.optimizations.keys()),
      errors: this.metrics.errors,
      timestamp: Date.now()
    };
  }

  // Cleanup method
  cleanup() {
    this.optimizations.forEach(optimization => {
      if (optimization && typeof optimization.disconnect === 'function') {
        optimization.disconnect();
      }
    });
    this.optimizations.clear();
  }
}

// Bundle analyzer utility
export const bundleAnalyzer = {
  // Analyze current bundle size
  analyzeBundleSize: () => {
    const scripts = Array.from(document.querySelectorAll('script[src]'));
    const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
    
    return {
      scripts: scripts.map(script => ({
        src: script.src,
        async: script.async,
        defer: script.defer
      })),
      styles: styles.map(style => ({
        href: style.href,
        media: style.media
      })),
      totalScripts: scripts.length,
      totalStyles: styles.length
    };
  },

  // Check for unused resources
  findUnusedResources: () => {
    const usedResources = new Set();
    const allResources = performance.getEntriesByType('resource');
    
    // Mark resources as used if they appear in DOM
    document.querySelectorAll('*').forEach(element => {
      ['src', 'href', 'data-src'].forEach(attr => {
        const value = element.getAttribute(attr);
        if (value) usedResources.add(value);
      });
    });

    return allResources.filter(resource => !usedResources.has(resource.name));
  }
};

// Performance budget checker
export const performanceBudget = {
  // Check if performance budget is met
  checkBudget: () => {
    const navigation = performance.getEntriesByType('navigation')[0];
    const budget = PRODUCTION_CONFIG.PERFORMANCE_THRESHOLDS;
    
    const results = {
      passed: true,
      metrics: {},
      violations: []
    };

    // Check TTFB
    const ttfb = navigation.responseStart - navigation.requestStart;
    results.metrics.ttfb = ttfb;
    if (ttfb > budget.TTFB) {
      results.passed = false;
      results.violations.push(`TTFB: ${ttfb}ms > ${budget.TTFB}ms`);
    }

    // Check FCP
    const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0];
    if (fcpEntry) {
      results.metrics.fcp = fcpEntry.startTime;
      if (fcpEntry.startTime > budget.FCP) {
        results.passed = false;
        results.violations.push(`FCP: ${fcpEntry.startTime}ms > ${budget.FCP}ms`);
      }
    }

    return results;
  }
};

// Global production optimizer instance
export const globalProductionOptimizer = new ProductionOptimizer();

// Auto-initialize in production
if (isProduction && typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      globalProductionOptimizer.initialize();
    });
  } else {
    globalProductionOptimizer.initialize();
  }
}

export default {
  ProductionOptimizer,
  bundleAnalyzer,
  performanceBudget,
  globalProductionOptimizer,
  PRODUCTION_CONFIG
};