/**
 * Production-Ready Analytics utility for tracking user interactions and page views
 * Supports Google Analytics 4 with GDPR/CCPA compliance
 * Integrates with cookie consent system
 */

import { safeJSONStorage } from './safeStorage';
import { createLogger } from './logger';

const logger = createLogger('Analytics');

// Configuration
const ANALYTICS_CONFIG = {
  GA4_MEASUREMENT_ID: import.meta.env.VITE_GA4_MEASUREMENT_ID || import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  DEBUG_MODE: import.meta.env.DEV,
  ENABLED: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  REQUIRE_CONSENT: true, // Always require consent for GDPR compliance
};

/**
 * Check if analytics consent has been granted
 */
const hasAnalyticsConsent = () => {
  if (!ANALYTICS_CONFIG.REQUIRE_CONSENT) return true;
  
  const consent = safeJSONStorage.getItem('cookie_consent');
  return consent && consent.analytics === true;
};

/**
 * Initialize Google Analytics 4 with consent management
 */
export const initializeAnalytics = () => {
  if (!ANALYTICS_CONFIG.ENABLED || !ANALYTICS_CONFIG.GA4_MEASUREMENT_ID) {
    logger.info('Analytics disabled or missing measurement ID');
    return;
  }

  // Check if consent is required and granted
  if (ANALYTICS_CONFIG.REQUIRE_CONSENT && !hasAnalyticsConsent()) {
    logger.info('Analytics consent not granted, skipping initialization');
    return;
  }

  try {
    // Load Google Analytics 4 script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_CONFIG.GA4_MEASUREMENT_ID}`;
    script.onerror = () => {
      logger.error('Failed to load Google Analytics script');
    };
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    window.gtag = gtag;

    // Configure gtag with privacy settings
    gtag('js', new Date());
    gtag('config', ANALYTICS_CONFIG.GA4_MEASUREMENT_ID, {
      debug_mode: ANALYTICS_CONFIG.DEBUG_MODE,
      send_page_view: true,
      anonymize_ip: true, // GDPR compliance
      allow_google_signals: hasAnalyticsConsent(), // Respect consent
      allow_ad_personalization_signals: hasAnalyticsConsent(),
      cookie_expires: 63072000, // 2 years in seconds
      cookie_update: true,
      cookie_flags: 'SameSite=Strict;Secure', // Enhanced security
    });

    // Set consent mode
    gtag('consent', 'default', {
      analytics_storage: hasAnalyticsConsent() ? 'granted' : 'denied',
      ad_storage: 'denied', // Always deny ad storage for privacy
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      functionality_storage: 'granted',
      security_storage: 'granted',
    });

    logger.info('Google Analytics 4 initialized successfully', {
      measurementId: ANALYTICS_CONFIG.GA4_MEASUREMENT_ID,
      consentGranted: hasAnalyticsConsent()
    });

  } catch (error) {
    logger.error('Error initializing Google Analytics', error);
  }
};

/**
 * Update consent settings for Google Analytics
 */
export const updateAnalyticsConsent = (consentGranted) => {
  if (!window.gtag) {
    logger.warn('Google Analytics not initialized, cannot update consent');
    return;
  }

  try {
    window.gtag('consent', 'update', {
      analytics_storage: consentGranted ? 'granted' : 'denied',
    });

    logger.info('Analytics consent updated', { consentGranted });

    // Re-initialize if consent was granted
    if (consentGranted && ANALYTICS_CONFIG.ENABLED) {
      initializeAnalytics();
    }
  } catch (error) {
    logger.error('Error updating analytics consent', error);
  }
};

/**
 * Track page views with consent checking
 */
export const trackPageView = (pagePath, pageTitle) => {
  if (!ANALYTICS_CONFIG.ENABLED || !hasAnalyticsConsent() || !window.gtag) {
    logger.debug('Page view not tracked - analytics disabled or consent not granted', {
      enabled: ANALYTICS_CONFIG.ENABLED,
      consent: hasAnalyticsConsent(),
      gtag: !!window.gtag
    });
    return;
  }

  try {
    window.gtag('config', ANALYTICS_CONFIG.GA4_MEASUREMENT_ID, {
      page_path: pagePath,
      page_title: pageTitle,
      custom_map: {
        dimension1: 'user_consent_status'
      }
    });

    // Track additional page metadata
    window.gtag('event', 'page_view', {
      page_title: pageTitle,
      page_location: window.location.href,
      page_path: pagePath,
      user_consent_status: 'granted'
    });

    logger.debug('Page view tracked', { pagePath, pageTitle });
  } catch (error) {
    logger.error('Error tracking page view', error);
  }
};

/**
 * Track custom events with consent checking and enhanced parameters
 */
export const trackEvent = (eventName, parameters = {}) => {
  if (!ANALYTICS_CONFIG.ENABLED || !hasAnalyticsConsent() || !window.gtag) {
    logger.debug('Event not tracked - analytics disabled or consent not granted', {
      eventName,
      enabled: ANALYTICS_CONFIG.ENABLED,
      consent: hasAnalyticsConsent()
    });
    return;
  }

  try {
    const eventParams = {
      event_category: parameters.category || 'general',
      event_label: parameters.label || '',
      value: parameters.value || 0,
      user_consent_status: 'granted',
      timestamp: new Date().toISOString(),
      ...parameters,
    };

    window.gtag('event', eventName, eventParams);

    logger.debug('Event tracked', { eventName, parameters: eventParams });
  } catch (error) {
    logger.error('Error tracking event', { eventName, error });
  }
};

// Predefined event tracking functions
export const trackButtonClick = (buttonName, location) => {
  trackEvent('button_click', {
    category: 'ui_interaction',
    label: buttonName,
    location: location,
  });
};

export const trackFormSubmission = (formName, success = true) => {
  trackEvent('form_submit', {
    category: 'form_interaction',
    label: formName,
    success: success,
  });
};

export const trackDownload = (fileName, fileType) => {
  trackEvent('file_download', {
    category: 'content_interaction',
    label: fileName,
    file_type: fileType,
  });
};

export const trackOutboundLink = (url, linkText) => {
  trackEvent('click', {
    event_category: 'outbound_link',
    event_label: linkText,
    transport_type: 'beacon',
    custom_parameters: {
      destination_url: url,
    },
  });
};

export const trackDonation = (amount, method) => {
  trackEvent('donation', {
    category: 'ecommerce',
    currency: 'BWP', // Botswana Pula
    value: amount,
    payment_method: method,
  });
};

export const trackVolunteerSignup = (program) => {
  trackEvent('volunteer_signup', {
    category: 'conversion',
    label: program,
  });
};

export const trackNewsletterSignup = (source) => {
  trackEvent('newsletter_signup', {
    category: 'conversion',
    label: source,
  });
};

export const trackShopInteraction = (action, productName, productPrice) => {
  trackEvent('shop_interaction', {
    category: 'ecommerce',
    action: action, // 'view', 'add_to_cart', 'purchase'
    label: productName,
    value: productPrice,
  });
};

export const trackGalleryView = (eventName, imageCount) => {
  trackEvent('gallery_view', {
    category: 'content_interaction',
    label: eventName,
    image_count: imageCount,
  });
};

export const trackAccessibilityFeature = (feature, enabled) => {
  trackEvent('accessibility_toggle', {
    category: 'accessibility',
    label: feature,
    enabled: enabled,
  });
};

// Performance tracking
export const trackPerformance = () => {
  if (!ANALYTICS_CONFIG.ENABLED || !window.gtag || !window.performance) {
    return;
  }

  // Track Core Web Vitals
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'navigation') {
        trackEvent('page_timing', {
          category: 'performance',
          metric_name: 'page_load_time',
          value: Math.round(entry.loadEventEnd - entry.loadEventStart),
        });
      }
    }
  });

  observer.observe({ entryTypes: ['navigation'] });

  // Track Largest Contentful Paint (LCP)
  new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries();
    const lastEntry = entries[entries.length - 1];
    trackEvent('web_vitals', {
      category: 'performance',
      metric_name: 'LCP',
      value: Math.round(lastEntry.startTime),
    });
  }).observe({ entryTypes: ['largest-contentful-paint'] });

  // Track First Input Delay (FID)
  new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries();
    entries.forEach((entry) => {
      trackEvent('web_vitals', {
        category: 'performance',
        metric_name: 'FID',
        value: Math.round(entry.processingStart - entry.startTime),
      });
    });
  }).observe({ entryTypes: ['first-input'] });
};

// Error tracking
export const trackError = (error, errorInfo = {}) => {
  if (!ANALYTICS_CONFIG.ENABLED) {
    // Error tracked (debug): error, errorInfo
    return;
  }

  trackEvent('exception', {
    category: 'error',
    description: error.message || error.toString(),
    fatal: errorInfo.fatal || false,
    error_stack: error.stack,
    error_component: errorInfo.componentStack,
  });
};

// User engagement tracking
export const trackUserEngagement = () => {
  let startTime = Date.now();
  let isActive = true;

  // Track time on page
  const trackTimeOnPage = () => {
    if (isActive) {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      trackEvent('user_engagement', {
        category: 'engagement',
        metric_name: 'time_on_page',
        value: timeSpent,
      });
    }
  };

  // Track when user becomes inactive
  const handleVisibilityChange = () => {
    if (document.hidden) {
      isActive = false;
      trackTimeOnPage();
    } else {
      isActive = true;
      startTime = Date.now();
    }
  };

  // Track scroll depth
  let maxScrollDepth = 0;
  const trackScrollDepth = () => {
    const scrollDepth = Math.round(
      (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
    );
    
    if (scrollDepth > maxScrollDepth) {
      maxScrollDepth = scrollDepth;
      
      // Track at 25%, 50%, 75%, and 100% scroll milestones
      if ([25, 50, 75, 100].includes(scrollDepth)) {
        trackEvent('scroll_depth', {
          category: 'engagement',
          label: `${scrollDepth}%`,
          value: scrollDepth,
        });
      }
    }
  };

  // Set up event listeners
  document.addEventListener('visibilitychange', handleVisibilityChange);
  window.addEventListener('scroll', trackScrollDepth, { passive: true });
  window.addEventListener('beforeunload', trackTimeOnPage);

  // Cleanup function
  return () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    window.removeEventListener('scroll', trackScrollDepth);
    window.removeEventListener('beforeunload', trackTimeOnPage);
  };
};

// Export configuration for external use
export { ANALYTICS_CONFIG };