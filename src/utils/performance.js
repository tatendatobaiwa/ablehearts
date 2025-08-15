/**
 * Performance optimization utilities
 */

// Image lazy loading with intersection observer
export const createImageObserver = (callback) => {
  const options = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1
  };

  return new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        callback(entry.target);
      }
    });
  }, options);
};

// Preload critical images
export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

// Preload multiple images
export const preloadImages = async (imageSrcs) => {
  try {
    const promises = imageSrcs.map(src => preloadImage(src));
    await Promise.all(promises);
    // Critical images preloaded successfully
  } catch (error) {
    // Some images failed to preload: error
  }
};

// Debounce function for performance optimization
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function for scroll events
export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Resource hints for better loading
export const addResourceHints = () => {
  const head = document.head;
  
  // DNS prefetch for external domains
  const dnsPrefetchDomains = [
    'https://fonts.googleapis.com',
    'https://www.googletagmanager.com',
    'https://connect.facebook.net'
  ];
  
  dnsPrefetchDomains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = domain;
    head.appendChild(link);
  });
  
  // Preconnect to critical domains
  const preconnectDomains = [
    'https://fonts.gstatic.com'
  ];
  
  preconnectDomains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = domain;
    link.crossOrigin = 'anonymous';
    head.appendChild(link);
  });
};

// Cache management
export const cacheManager = {
  set: (key, data, ttl = 3600000) => { // 1 hour default
    const item = {
      data,
      timestamp: Date.now(),
      ttl
    };
    try {
      localStorage.setItem(`cache_${key}`, JSON.stringify(item));
    } catch (error) {
      // Cache storage failed: error
    }
  },
  
  get: (key) => {
    try {
      const item = localStorage.getItem(`cache_${key}`);
      if (!item) return null;
      
      const parsed = JSON.parse(item);
      const now = Date.now();
      
      if (now - parsed.timestamp > parsed.ttl) {
        localStorage.removeItem(`cache_${key}`);
        return null;
      }
      
      return parsed.data;
    } catch (error) {
      // Cache retrieval failed: error
      return null;
    }
  },
  
  clear: () => {
    try {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('cache_')) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      // Cache clear failed: error
    }
  }
};

// Bundle size optimization - dynamic imports
export const loadComponent = async (componentPath) => {
  try {
    const module = await import(/* @vite-ignore */ componentPath);
    return module.default || module;
  } catch (error) {
    // Failed to load component: componentPath, error
    throw error;
  }
};

// Memory usage monitoring
export const monitorMemoryUsage = () => {
  if ('memory' in performance) {
    const memory = performance.memory;
    // Memory Usage: used MB, total MB, limit MB
  }
};

// Critical resource loading
export const loadCriticalResources = async () => {
  // Preload critical images
  const criticalImages = [
    '/src/assets/fixed/icons/ableheartslogo.webp',
    '/src/assets/fixed/landingpageimage.webp'
  ];
  
  await preloadImages(criticalImages);
  
  // Add resource hints
  addResourceHints();
  
  // Monitor memory if in development
  if (import.meta.env.DEV) {
    setTimeout(monitorMemoryUsage, 5000);
  }
};

// Service Worker registration for caching
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      // Service Worker registered successfully
      
      // Listen for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New content available, notify user
            // New content available, please refresh
          }
        });
      });
    } catch (error) {
      // Service Worker registration failed: error
    }
  }
};

// Web Vitals measurement
export const measureWebVitals = () => {
  // Measure First Contentful Paint
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.name === 'first-contentful-paint') {
        // FCP: entry.startTime
      }
    }
  });
  
  observer.observe({ entryTypes: ['paint'] });
  
  // Measure Largest Contentful Paint
  new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries();
    const lastEntry = entries[entries.length - 1];
    // LCP: lastEntry.startTime
  }).observe({ entryTypes: ['largest-contentful-paint'] });
  
  // Measure Cumulative Layout Shift
  let clsValue = 0;
  new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      if (!entry.hadRecentInput) {
        clsValue += entry.value;
      }
    }
    // CLS: clsValue
  }).observe({ entryTypes: ['layout-shift'] });
};

export default {
  createImageObserver,
  preloadImage,
  preloadImages,
  debounce,
  throttle,
  addResourceHints,
  cacheManager,
  loadComponent,
  monitorMemoryUsage,
  loadCriticalResources,
  registerServiceWorker,
  measureWebVitals
};