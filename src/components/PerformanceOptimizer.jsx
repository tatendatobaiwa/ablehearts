import { memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

/**
 * Performance Optimizer Component
 * Monitors and optimizes runtime performance
 */
const PerformanceOptimizer = memo(({ children }) => {
  const [performanceData, setPerformanceData] = useState({
    fcp: 0,
    lcp: 0,
    fid: 0,
    cls: 0,
    ttfb: 0
  });

  const [isLowEndDevice, setIsLowEndDevice] = useState(false);

  // Detect device capabilities
  useEffect(() => {
    const detectDeviceCapabilities = () => {
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      const memory = navigator.deviceMemory || 4;
      const cores = navigator.hardwareConcurrency || 4;

      const isLowEnd = (
        memory <= 2 ||
        cores <= 2 ||
        (connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g'))
      );

      setIsLowEndDevice(isLowEnd);

      // Apply performance optimizations for low-end devices
      if (isLowEnd) {
        document.body.classList.add('low-end-device');
        
        // Reduce animation complexity
        document.documentElement.style.setProperty('--animation-duration', '0.1s');
        
        // Disable non-critical animations
        const style = document.createElement('style');
        style.textContent = `
          .low-end-device * {
            animation-duration: 0.1s !important;
            transition-duration: 0.1s !important;
          }
          .low-end-device .background-blobs,
          .low-end-device .decorative-elements {
            display: none !important;
          }
        `;
        document.head.appendChild(style);
      }
    };

    detectDeviceCapabilities();
  }, []);

  // Monitor Core Web Vitals
  useEffect(() => {
    const measureWebVitals = async () => {
      try {
        // First Contentful Paint
        const paintEntries = performance.getEntriesByType('paint');
        const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
        
        // Time to First Byte
        const navigationEntry = performance.getEntriesByType('navigation')[0];
        const ttfb = navigationEntry ? navigationEntry.responseStart - navigationEntry.requestStart : 0;

        setPerformanceData(prev => ({
          ...prev,
          fcp: fcpEntry ? fcpEntry.startTime : 0,
          ttfb
        }));

        // Largest Contentful Paint
        if ('PerformanceObserver' in window) {
          const supported = PerformanceObserver.supportedEntryTypes || [];

          // Largest Contentful Paint
          if (supported.includes('largest-contentful-paint')) {
            try {
              const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                if (lastEntry) {
                  setPerformanceData(prev => ({ ...prev, lcp: lastEntry.startTime }));
                }
              });
              lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
            } catch {}
          }

          // First Input Delay
          if (supported.includes('first-input')) {
            try {
              const fidObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                  setPerformanceData(prev => ({ ...prev, fid: entry.processingStart - entry.startTime }));
                });
              });
              fidObserver.observe({ entryTypes: ['first-input'] });
            } catch {}
          }

          // Cumulative Layout Shift
          if (supported.includes('layout-shift')) {
            try {
              let clsValue = 0;
              const clsObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                  if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                    setPerformanceData(prev => ({ ...prev, cls: clsValue }));
                  }
                }
              });
              clsObserver.observe({ entryTypes: ['layout-shift'] });
            } catch {}
          }
        }
      } catch (error) {
        console.warn('Performance monitoring error:', error);
      }
    };

    measureWebVitals();
  }, []);

  // Resource optimization
  useEffect(() => {
    const optimizeResources = () => {
      // Preload critical resources
      const criticalImages = [
        '/ableheartslogo.webp',
        '/src/assets/fixed/landingpageimage.webp'
      ];

      criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
      });

      // Lazy load non-critical resources
      const lazyLoadImages = () => {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target;
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              imageObserver.unobserve(img);
            }
          });
        });

        images.forEach(img => imageObserver.observe(img));
      };

      // Defer non-critical JavaScript
      const deferNonCriticalJS = () => {
        const scripts = document.querySelectorAll('script[data-defer]');
        scripts.forEach(script => {
          const newScript = document.createElement('script');
          newScript.src = script.src;
          newScript.async = true;
          document.body.appendChild(newScript);
        });
      };

      setTimeout(lazyLoadImages, 100);
      setTimeout(deferNonCriticalJS, 1000);
    };

    optimizeResources();
  }, []);

  // Memory management
  useEffect(() => {
    const cleanupMemory = () => {
      // Clean up unused event listeners
      const unusedElements = document.querySelectorAll('[data-cleanup]');
      unusedElements.forEach(element => {
        element.removeEventListener('click', () => {});
        element.removeEventListener('scroll', () => {});
      });

      // Clear unused caches
      if ('caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => {
            if (name.includes('old-') || name.includes('temp-')) {
              caches.delete(name);
            }
          });
        });
      }
    };

    const memoryCleanupInterval = setInterval(cleanupMemory, 300000); // Every 5 minutes

    return () => clearInterval(memoryCleanupInterval);
  }, []);

  // Performance budget monitoring
  const checkPerformanceBudget = () => {
    const budgets = {
      fcp: 1800, // 1.8s
      lcp: 2500, // 2.5s
      fid: 100,  // 100ms
      cls: 0.1,  // 0.1
      ttfb: 600  // 600ms
    };

    const violations = [];
    Object.entries(budgets).forEach(([metric, budget]) => {
      if (performanceData[metric] > budget) {
        violations.push({ metric, value: performanceData[metric], budget });
      }
    });

    return violations;
  };

  // Show performance warnings in development
  useEffect(() => {
    if (import.meta.env.DEV) {
      const violations = checkPerformanceBudget();
      if (violations.length > 0) {
        console.warn('Performance Budget Violations:', violations);
      }
    }
  }, [performanceData]);

  return (
    <>
      {children}
      
      {/* Performance monitoring overlay for development */}
      {import.meta.env.DEV && (
        <div className="performance-monitor">
          <div className="performance-metrics">
            <div>FCP: {Math.round(performanceData.fcp)}ms</div>
            <div>LCP: {Math.round(performanceData.lcp)}ms</div>
            <div>FID: {Math.round(performanceData.fid)}ms</div>
            <div>CLS: {performanceData.cls.toFixed(3)}</div>
            <div>TTFB: {Math.round(performanceData.ttfb)}ms</div>
            {isLowEndDevice && <div className="low-end-indicator">Low-End Device</div>}
          </div>
        </div>
      )}

      <style>{`
        .performance-monitor {
          position: fixed;
          top: 10px;
          left: 10px;
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 10px;
          border-radius: 4px;
          font-family: monospace;
          font-size: 12px;
          z-index: 10000;
          pointer-events: none;
        }

        .performance-metrics div {
          margin-bottom: 2px;
        }

        .low-end-indicator {
          color: orange;
          font-weight: bold;
        }

        /* Low-end device optimizations */
        .low-end-device .background-blobs,
        .low-end-device .decorative-elements,
        .low-end-device .parallax-elements {
          display: none !important;
        }

        .low-end-device * {
          animation-duration: 0.1s !important;
          transition-duration: 0.1s !important;
        }

        .low-end-device img {
          image-rendering: -webkit-optimize-contrast;
          image-rendering: crisp-edges;
        }
      `}</style>
    </>
  );
});

PerformanceOptimizer.displayName = 'PerformanceOptimizer';

PerformanceOptimizer.propTypes = {
  children: PropTypes.node.isRequired
};

export default PerformanceOptimizer;