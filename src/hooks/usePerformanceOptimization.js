import { useEffect, useCallback, useMemo } from 'react';
import { debounce, throttle } from '../utils/performance';

/**
 * Custom hook for performance optimizations
 */
export const usePerformanceOptimization = () => {
  // Memoized debounce function
  const createDebouncedFunction = useCallback((func, delay = 300) => {
    return debounce(func, delay);
  }, []);

  // Memoized throttle function
  const createThrottledFunction = useCallback((func, limit = 100) => {
    return throttle(func, limit);
  }, []);

  // Preload critical resources
  const preloadCriticalResources = useCallback(async () => {
    const criticalImages = [
      '/src/assets/fixed/icons/ableheartslogo.webp',
      '/src/assets/fixed/landingpageimage.webp'
    ];

    try {
      const { preloadImages } = await import('../utils/performance');
      await preloadImages(criticalImages);
    } catch (e) {
      // Failed to preload critical resources
    }
  }, []);

  // Initialize performance monitoring
  useEffect(() => {
    preloadCriticalResources();
  }, [preloadCriticalResources]);

  return {
    createDebouncedFunction,
    createThrottledFunction,
    preloadCriticalResources
  };
};

/**
 * Hook for optimized scroll handling
 */
export const useOptimizedScroll = (callback, options = {}) => {
  const { throttleMs = 16, debounceMs = 100 } = options;

  const throttledCallback = useMemo(
    () => throttle(callback, throttleMs),
    [callback, throttleMs]
  );

  const debouncedCallback = useMemo(
    () => debounce(callback, debounceMs),
    [callback, debounceMs]
  );

  useEffect(() => {
    window.addEventListener('scroll', throttledCallback, { passive: true });
    window.addEventListener('scrollend', debouncedCallback, { passive: true });

    return () => {
      window.removeEventListener('scroll', throttledCallback);
      window.removeEventListener('scrollend', debouncedCallback);
    };
  }, [throttledCallback, debouncedCallback]);
};

/**
 * Hook for optimized resize handling
 */
export const useOptimizedResize = (callback, debounceMs = 250) => {
  const debouncedCallback = useMemo(
    () => debounce(callback, debounceMs),
    [callback, debounceMs]
  );

  useEffect(() => {
    window.addEventListener('resize', debouncedCallback, { passive: true });

    return () => {
      window.removeEventListener('resize', debouncedCallback);
    };
  }, [debouncedCallback]);
};

/**
 * Hook for intersection observer optimization
 */
export const useIntersectionObserver = (options = {}) => {
  const {
    threshold = 0.1,
    rootMargin = '0px',
    triggerOnce = true
  } = options;

  const observerOptions = useMemo(() => ({
    threshold,
    rootMargin
  }), [threshold, rootMargin]);

  const createObserver = useCallback((callback) => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          callback(entry);
          if (triggerOnce) {
            observer.unobserve(entry.target);
          }
        }
      });
    }, observerOptions);
    return observer;
  }, [observerOptions, triggerOnce]);

  return { createObserver };
};