import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView, trackEvent } from '../utils/analytics.js';

/**
 * Custom hook for analytics tracking
 */
export const useAnalytics = () => {
  const location = useLocation();

  // Track page views on route changes
  useEffect(() => {
    const pagePath = location.pathname + location.search;
    const pageTitle = document.title;
    
    trackPageView(pagePath, pageTitle);
  }, [location]);

  // Memoized event tracking function
  const track = useCallback((eventName, parameters) => {
    trackEvent(eventName, parameters);
  }, []);

  return { track };
};

/**
 * Hook for tracking component interactions
 */
export const useComponentTracking = (componentName) => {
  const trackInteraction = useCallback((action, details = {}) => {
    trackEvent('component_interaction', {
      category: 'ui_interaction',
      component: componentName,
      action,
      ...details
    });
  }, [componentName]);

  return { trackInteraction };
};

export default useAnalytics;