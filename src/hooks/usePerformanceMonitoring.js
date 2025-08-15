import { useEffect, useState, useCallback, useRef } from 'react';
import { globalPerformanceMonitor, performanceUtils } from '../utils/performanceMonitoring';

/**
 * Performance monitoring hooks for React components
 */

// Main performance monitoring hook
export const usePerformanceMonitoring = (componentName) => {
  const [performanceData] = useState(null);
  const renderStartTime = useRef(null);

  // Track component render performance
  useEffect(() => {
    renderStartTime.current = performance.now();
    
    return () => {
      if (renderStartTime.current) {
        const renderTime = performance.now() - renderStartTime.current;
        
        // Track slow renders (>16ms for 60fps)
        if (renderTime > 16) {
          globalPerformanceMonitor.trackUserInteraction('slow_render', {
            component: componentName,
            renderTime,
            timestamp: Date.now()
          });
        }
      }
    };
  });

  // Get current performance data
  const getPerformanceData = useCallback(() => {
    return globalPerformanceMonitor.generateReport();
  }, []);

  // Track custom performance metrics
  const trackMetric = useCallback((metricName, value, metadata = {}) => {
    globalPerformanceMonitor.metrics.custom = globalPerformanceMonitor.metrics.custom || {};
    globalPerformanceMonitor.metrics.custom[metricName] = {
      value,
      metadata,
      timestamp: Date.now(),
      component: componentName
    };
  }, [componentName]);

  return {
    performanceData,
    getPerformanceData,
    trackMetric
  };
};

// Hook for measuring component lifecycle performance
export const useComponentPerformance = (componentName) => {
  const mountTime = useRef(null);
  const updateCount = useRef(0);
  const [performanceMetrics, setPerformanceMetrics] = useState({
    mountTime: 0,
    updateCount: 0,
    lastUpdateTime: 0
  });

  // Track mount time
  useEffect(() => {
    mountTime.current = performance.now();
    
    return () => {
      if (mountTime.current) {
        const totalMountTime = performance.now() - mountTime.current;
        performanceUtils.mark(`${componentName}-unmount`);
        
        // Track component lifecycle
        globalPerformanceMonitor.sendToAnalytics('component_lifecycle', {
          component: componentName,
          mountTime: totalMountTime,
          updateCount: updateCount.current
        });
      }
    };
  }, [componentName]);

  // Track updates
  useEffect(() => {
    updateCount.current += 1;
    const updateTime = performance.now();
    
    setPerformanceMetrics(prev => ({
      ...prev,
      updateCount: updateCount.current,
      lastUpdateTime: updateTime
    }));
  }, [setPerformanceMetrics]);

  return performanceMetrics;
};

// Hook for tracking user interactions
export const useInteractionTracking = () => {
  const trackClick = useCallback((elementName, metadata = {}) => {
    globalPerformanceMonitor.trackUserInteraction('click', {
      element: elementName,
      ...metadata,
      timestamp: Date.now()
    });
  }, []);

  const trackFormSubmission = useCallback((formName, duration, success = true) => {
    globalPerformanceMonitor.trackUserInteraction('form_submission', {
      form: formName,
      duration,
      success,
      timestamp: Date.now()
    });
  }, []);

  const trackPageView = useCallback((pageName, loadTime) => {
    globalPerformanceMonitor.trackUserInteraction('page_view', {
      page: pageName,
      loadTime,
      timestamp: Date.now()
    });
  }, []);

  const trackError = useCallback((errorType, errorMessage, context = {}) => {
    globalPerformanceMonitor.metrics.errors.push({
      type: errorType,
      message: errorMessage,
      context,
      timestamp: Date.now()
    });
  }, []);

  return {
    trackClick,
    trackFormSubmission,
    trackPageView,
    trackError
  };
};

// Hook for monitoring Core Web Vitals
export const useWebVitals = () => {
  const [vitals, setVitals] = useState({
    lcp: null,
    fid: null,
    cls: null,
    fcp: null,
    ttfb: null
  });

  useEffect(() => {
    const updateVitals = () => {
      const currentVitals = globalPerformanceMonitor.metrics.vitals;
      setVitals(currentVitals);
    };

    // Update vitals every 5 seconds
    const interval = setInterval(updateVitals, 5000);
    updateVitals(); // Initial update

    return () => clearInterval(interval);
  }, []);

  const getVitalScore = useCallback((vital, value) => {
    const thresholds = {
      lcp: { good: 2500, poor: 4000 },
      fid: { good: 100, poor: 300 },
      cls: { good: 0.1, poor: 0.25 },
      fcp: { good: 1800, poor: 3000 },
      ttfb: { good: 800, poor: 1800 }
    };

    const threshold = thresholds[vital];
    if (!threshold) return 'unknown';

    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
    return 'poor';
  }, []);

  return {
    vitals,
    getVitalScore
  };
};

// Hook for resource monitoring
export const useResourceMonitoring = () => {
  const [resources, setResources] = useState([]);
  const [slowResources, setSlowResources] = useState([]);

  useEffect(() => {
    const updateResources = () => {
      const currentResources = globalPerformanceMonitor.metrics.resources;
      setResources(currentResources);
      setSlowResources(currentResources.filter(r => r.slow));
    };

    // Update resources every 10 seconds
    const interval = setInterval(updateResources, 10000);
    updateResources(); // Initial update

    return () => clearInterval(interval);
  }, []);

  const getResourcesByType = useCallback((type) => {
    return resources.filter(resource => resource.type === type);
  }, [resources]);

  const getTotalResourceSize = useCallback(() => {
    return resources.reduce((total, resource) => total + (resource.size || 0), 0);
  }, [resources]);

  return {
    resources,
    slowResources,
    getResourcesByType,
    getTotalResourceSize
  };
};

// Hook for memory monitoring
export const useMemoryMonitoring = () => {
  const [memoryInfo, setMemoryInfo] = useState(null);
  const [memoryWarning, setMemoryWarning] = useState(false);

  useEffect(() => {
    if (!('memory' in performance)) return;

    const updateMemoryInfo = () => {
      const memory = performance.memory;
      const memoryData = {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit,
        usagePercentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100
      };

      setMemoryInfo(memoryData);
      
      // Warn if memory usage is high (>80%)
      setMemoryWarning(memoryData.usagePercentage > 80);
    };

    const interval = setInterval(updateMemoryInfo, 30000);
    updateMemoryInfo(); // Initial update

    return () => clearInterval(interval);
  }, []);

  return {
    memoryInfo,
    memoryWarning
  };
};

// Hook for performance optimization suggestions
export const usePerformanceOptimization = () => {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const updateRecommendations = () => {
      const currentRecommendations = globalPerformanceMonitor.generateRecommendations();
      setRecommendations(currentRecommendations);
    };

    // Update recommendations every 30 seconds
    const interval = setInterval(updateRecommendations, 30000);
    updateRecommendations(); // Initial update

    return () => clearInterval(interval);
  }, []);

  return {
    recommendations
  };
};

export default {
  usePerformanceMonitoring,
  useComponentPerformance,
  useInteractionTracking,
  useWebVitals,
  useResourceMonitoring,
  useMemoryMonitoring,
  usePerformanceOptimization
};