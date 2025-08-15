import { useEffect, useState, memo } from 'react';
import PropTypes from 'prop-types';
import {
  initializeSecurity,
  securityMonitoring,
  privacyProtection,
  RateLimiter
} from '../utils/securityEnhancements';
import SecurityContext, { useSecurity } from '../context/SecurityContext';

/**
 * Security Provider Component
 * Manages security features and privacy protection
 */
export const SecurityProvider = memo(({ children }) => {
  const [securityState, setSecurityState] = useState({
    isInitialized: false,
    cookieConsent: null,
    rateLimiter: new RateLimiter(10, 60000), // 10 requests per minute
    anonymousId: null,
    securityLevel: 'standard'
  });

  // Initialize security features
  useEffect(() => {
    initializeSecurity();
    
    // Get or generate anonymous ID
    let anonymousId = localStorage.getItem('anonymous_id');
    if (!anonymousId) {
      anonymousId = privacyProtection.generateAnonymousID();
      localStorage.setItem('anonymous_id', anonymousId);
    }

    // Get cookie consent
    const cookieConsent = privacyProtection.cookieConsent.get();

    setSecurityState(prev => ({
      ...prev,
      isInitialized: true,
      anonymousId,
      cookieConsent
    }));

    // Log initialization
    securityMonitoring.logSecurityEvent('security_provider_initialized', {
      anonymousId,
      hasConsent: !!cookieConsent
    });
  }, []);

  // Security context value
  const securityValue = {
    ...securityState,
    
    // Cookie consent management
    setCookieConsent: (consent) => {
      privacyProtection.cookieConsent.set(consent);
      setSecurityState(prev => ({
        ...prev,
        cookieConsent: consent
      }));
      
      securityMonitoring.logSecurityEvent('cookie_consent_updated', {
        consent,
        anonymousId: securityState.anonymousId
      });
    },

    // Check if specific consent is given
    hasConsent: (type) => {
      return privacyProtection.cookieConsent.hasConsent(type);
    },

    // Rate limiting check
    checkRateLimit: (identifier) => {
      return securityState.rateLimiter.isAllowed(identifier);
    },

    // Get remaining requests
    getRemainingRequests: (identifier) => {
      return securityState.rateLimiter.getRemainingRequests(identifier);
    },

    // Log security event
    logSecurityEvent: (event, details = {}) => {
      securityMonitoring.logSecurityEvent(event, {
        ...details,
        anonymousId: securityState.anonymousId
      });
    },

    // Update security level
    setSecurityLevel: (level) => {
      setSecurityState(prev => ({
        ...prev,
        securityLevel: level
      }));
      
      securityMonitoring.logSecurityEvent('security_level_changed', {
        newLevel: level,
        anonymousId: securityState.anonymousId
      });
    }
  };

  return (
    <SecurityContext.Provider value={securityValue}>
      {children}
    </SecurityContext.Provider>
  );
});

SecurityProvider.displayName = 'SecurityProvider';

SecurityProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default SecurityProvider;
export { useSecurity };