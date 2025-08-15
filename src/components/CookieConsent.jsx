import { useState, useEffect, memo, useCallback } from 'react';
import { useSecurity } from '../context/SecurityContext';
import { safeJSONStorage } from '../utils/safeStorage';
import { createLogger } from '../utils/logger';
import { updateAnalyticsConsent, initializeAnalytics } from '../utils/analytics';
import './CookieConsent.css';

const logger = createLogger('CookieConsent');

/**
 * Production-Level Cookie Consent Component
 * GDPR/CCPA/PIPEDA compliant cookie consent management
 * Features:
 * - Granular cookie control
 * - Legal compliance tracking
 * - Accessibility optimized
 * - Consent withdrawal
 * - Audit trail
 */
const CookieConsent = memo(() => {
  const { cookieConsent, setCookieConsent } = useSecurity();
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true, // Always required - cannot be disabled
    analytics: false,
    marketing: false,
    functional: true,
    performance: false
  });

  // Cookie categories with detailed information
  const cookieCategories = {
    necessary: {
      title: 'Strictly Necessary Cookies',
      description: 'These cookies are essential for the website to function properly and cannot be disabled. They are usually set in response to actions made by you which amount to a request for services, such as setting your privacy preferences, logging in or filling in forms.',
      examples: 'Session management, security tokens, accessibility preferences',
      retention: 'Session or up to 1 year',
      required: true
    },
    functional: {
      title: 'Functional Cookies',
      description: 'These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third party providers whose services we have added to our pages.',
      examples: 'Language preferences, region selection, accessibility settings',
      retention: 'Up to 2 years',
      required: false
    },
    analytics: {
      title: 'Analytics & Performance Cookies',
      description: 'These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us know which pages are most and least popular and see how visitors move around the site.',
      examples: 'Google Analytics, page views, user interactions',
      retention: 'Up to 2 years',
      required: false
    },
    performance: {
      title: 'Performance Cookies',
      description: 'These cookies help us optimize website performance by collecting information about how you use our website, including which pages you visit most often and any error messages you receive.',
      examples: 'Performance monitoring, error tracking, load times',
      retention: 'Up to 1 year',
      required: false
    },
    marketing: {
      title: 'Marketing & Advertising Cookies',
      description: 'These cookies are used to deliver advertisements more relevant to you and your interests. They are also used to limit the number of times you see an advertisement and help measure the effectiveness of advertising campaigns.',
      examples: 'Social media integration, targeted advertising, conversion tracking',
      retention: 'Up to 2 years',
      required: false
    }
  };

  // Check if consent banner should be shown
  useEffect(() => {
    const checkConsentStatus = () => {
      if (!cookieConsent) {
        setShowBanner(true);
        logger.info('Cookie consent banner displayed - no previous consent found');
      } else {
        // Check if consent is expired (older than 12 months)
        const consentAge = Date.now() - (cookieConsent.timestamp || 0);
        const oneYear = 365 * 24 * 60 * 60 * 1000; // 1 year in milliseconds
        
        if (consentAge > oneYear) {
          setShowBanner(true);
          logger.info('Cookie consent banner displayed - consent expired');
        } else {
          // Update preferences from stored consent
          setPreferences(prev => ({
            ...prev,
            analytics: cookieConsent.analytics || false,
            marketing: cookieConsent.marketing || false,
            functional: cookieConsent.functional !== false, // Default to true
            performance: cookieConsent.performance || false
          }));
        }
      }
    };

    checkConsentStatus();
  }, [cookieConsent]);

  // Handle accept all cookies
  const handleAcceptAll = useCallback(async () => {
    setIsLoading(true);
    
    try {
      const consent = {
        necessary: true,
        analytics: true,
        marketing: true,
        functional: true,
        performance: true,
        timestamp: Date.now(),
        version: '1.0',
        userAgent: navigator.userAgent,
        ipHash: 'hashed', // In production, hash the IP for privacy
        consentMethod: 'accept_all',
        legalBasis: 'consent'
      };
      
      // Store consent with audit trail
      setCookieConsent(consent);
      safeJSONStorage.setItem('cookie_consent_history', [
        ...(safeJSONStorage.getItem('cookie_consent_history', [])),
        { ...consent, action: 'accept_all' }
      ]);
      
      // Update analytics consent and initialize if needed
      updateAnalyticsConsent(true);
      
      logger.info('User accepted all cookies', { consentMethod: 'accept_all' });
      setShowBanner(false);
    } catch (error) {
      logger.error('Error saving cookie consent', error);
    } finally {
      setIsLoading(false);
    }
  }, [setCookieConsent]);

  // Handle reject non-essential cookies
  const handleRejectAll = useCallback(async () => {
    setIsLoading(true);
    
    try {
      const consent = {
        necessary: true,
        analytics: false,
        marketing: false,
        functional: false, // More restrictive reject
        performance: false,
        timestamp: Date.now(),
        version: '1.0',
        userAgent: navigator.userAgent,
        ipHash: 'hashed',
        consentMethod: 'reject_all',
        legalBasis: 'legitimate_interest'
      };
      
      // Store consent with audit trail
      setCookieConsent(consent);
      safeJSONStorage.setItem('cookie_consent_history', [
        ...(safeJSONStorage.getItem('cookie_consent_history', [])),
        { ...consent, action: 'reject_all' }
      ]);
      
      // Update analytics consent
      updateAnalyticsConsent(false);
      
      logger.info('User rejected non-essential cookies', { consentMethod: 'reject_all' });
      setShowBanner(false);
    } catch (error) {
      logger.error('Error saving cookie consent', error);
    } finally {
      setIsLoading(false);
    }
  }, [setCookieConsent]);

  // Handle save preferences
  const handleSavePreferences = useCallback(async () => {
    setIsLoading(true);
    
    try {
      const consent = {
        ...preferences,
        timestamp: Date.now(),
        version: '1.0',
        userAgent: navigator.userAgent,
        ipHash: 'hashed',
        consentMethod: 'custom_preferences',
        legalBasis: 'consent'
      };
      
      // Store consent with audit trail
      setCookieConsent(consent);
      safeJSONStorage.setItem('cookie_consent_history', [
        ...(safeJSONStorage.getItem('cookie_consent_history', [])),
        { ...consent, action: 'save_preferences' }
      ]);
      
      // Update analytics consent based on user preferences
      updateAnalyticsConsent(preferences.analytics === true);
      
      logger.info('User saved custom cookie preferences', { 
        consentMethod: 'custom_preferences',
        preferences: Object.keys(preferences).filter(key => preferences[key])
      });
      
      setShowBanner(false);
      setShowDetails(false);
    } catch (error) {
      logger.error('Error saving cookie preferences', error);
    } finally {
      setIsLoading(false);
    }
  }, [preferences, setCookieConsent]);

  // Handle preference change
  const handlePreferenceChange = useCallback((type, value) => {
    setPreferences(prev => ({
      ...prev,
      [type]: value
    }));
    
    logger.debug('Cookie preference changed', { type, value });
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((event, action) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  }, []);

  if (!showBanner) {
    return null;
  }

  return (
    <div 
      className="cookie-consent-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-description"
    >
      <div className="cookie-consent-banner">
        {!showDetails ? (
          // Simple banner view
          <div className="cookie-banner-simple">
            <div className="cookie-banner-content">
              <h3 id="cookie-consent-title">We value your privacy</h3>
              <p id="cookie-consent-description">
                We use cookies to enhance your browsing experience, serve personalized content, 
                and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.
                <br />
                <strong>Your privacy matters:</strong> You can customize your preferences or reject non-essential cookies.
              </p>
              
              <div className="cookie-banner-actions">
                <button 
                  className="cookie-btn cookie-btn-accept"
                  onClick={handleAcceptAll}
                  disabled={isLoading}
                  aria-describedby="accept-all-description"
                >
                  {isLoading ? 'Processing...' : 'Accept All'}
                </button>
                <button 
                  className="cookie-btn cookie-btn-reject"
                  onClick={handleRejectAll}
                  disabled={isLoading}
                  aria-describedby="reject-all-description"
                >
                  {isLoading ? 'Processing...' : 'Reject All'}
                </button>
                <button 
                  className="cookie-btn cookie-btn-customize"
                  onClick={() => setShowDetails(true)}
                  disabled={isLoading}
                  aria-describedby="customize-description"
                >
                  Customize Settings
                </button>
              </div>
              
              <div className="cookie-banner-legal">
                <p>
                  <small>
                    By continuing to use this site, you agree to our use of necessary cookies. 
                    Read our <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</a> and 
                    <a href="/terms-of-use" target="_blank" rel="noopener noreferrer">Terms of Use</a> for more information.
                  </small>
                </p>
              </div>
            </div>
          </div>
        ) : (
          // Detailed preferences view
          <div className="cookie-banner-detailed">
            <div className="cookie-banner-header">
              <h3 id="cookie-preferences-title">Cookie Preferences</h3>
              <button 
                className="cookie-close-btn"
                onClick={() => setShowDetails(false)}
                aria-label="Close cookie preferences and return to simple view"
                onKeyDown={(e) => handleKeyDown(e, () => setShowDetails(false))}
              >
                ✕
              </button>
            </div>
            
            <div className="cookie-banner-content">
              <div className="cookie-preferences-intro">
                <p>
                  <strong>Take control of your privacy.</strong> Choose which cookies you want to accept. 
                  You can change these settings at any time by clicking the cookie icon in the bottom corner of our website.
                </p>
                <p>
                  <small>
                    <em>Last updated: {new Date().toLocaleDateString()}</em> | 
                    <strong> Your consent expires after 12 months</strong>
                  </small>
                </p>
              </div>
              
              <div className="cookie-categories" role="group" aria-labelledby="cookie-preferences-title">
                {/* Render cookie categories dynamically */}
                {Object.entries(cookieCategories).map(([key, category]) => (
                  <div key={key} className="cookie-category" role="group" aria-labelledby={`${key}-title`}>
                    <div className="cookie-category-header">
                      <div className="cookie-category-title-section">
                        <h4 id={`${key}-title`}>{category.title}</h4>
                        {category.required && <span className="cookie-required-badge">Required</span>}
                      </div>
                      <label className="cookie-toggle" aria-label={`Toggle ${category.title}`}>
                        <input 
                          type="checkbox" 
                          checked={category.required ? true : preferences[key]}
                          disabled={category.required}
                          onChange={(e) => !category.required && handlePreferenceChange(key, e.target.checked)}
                          aria-describedby={`${key}-description`}
                        />
                        <span className={`cookie-slider ${category.required ? 'disabled' : ''}`}></span>
                      </label>
                    </div>
                    <div className="cookie-category-details">
                      <p id={`${key}-description`} className="cookie-category-description">
                        {category.description}
                      </p>
                      <div className="cookie-category-meta">
                        <p><strong>Examples:</strong> {category.examples}</p>
                        <p><strong>Data retention:</strong> {category.retention}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cookie-banner-actions">
                <button 
                  className="cookie-btn cookie-btn-save"
                  onClick={handleSavePreferences}
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save Preferences'}
                </button>
                <button 
                  className="cookie-btn cookie-btn-accept"
                  onClick={handleAcceptAll}
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : 'Accept All'}
                </button>
              </div>

              <div className="cookie-banner-links">
                <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">
                  Privacy Policy
                </a>
                <a href="/terms-of-use" target="_blank" rel="noopener noreferrer">
                  Terms of Use
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

CookieConsent.displayName = 'CookieConsent';

export default CookieConsent;