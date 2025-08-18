import { useState, useEffect, memo, useCallback } from 'react';
import { useSecurity } from '../context/SecurityContext';
import { safeJSONStorage } from '../utils/safeStorage';
import { createLogger } from '../utils/logger';
import { updateAnalyticsConsent, initializeAnalytics } from '../utils/analytics';
import './CookieConsent.css';

const logger = createLogger('CookieConsent');
const CookieConsent = memo(() => {
  const { cookieConsent, setCookieConsent, isInitialized } = useSecurity();
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true, // Always required - cannot be disabled
    functional: false,
    analytics: false,
    marketing: false
  });

  // Cookie categories with detailed information
  const cookieCategories = {
    necessary: {
      title: 'Strictly Necessary Cookies',
      description: 'These cookies are essential for the website to function properly and cannot be disabled.',
      examples: 'Session management, security tokens, accessibility preferences',
      retention: 'Session or up to 1 year',
      required: true
    },
    functional: {
      title: 'Functional Cookies',
      description: 'These cookies enable enhanced functionality and personalization.',
      examples: 'Language preferences, region selection, accessibility settings',
      retention: 'Up to 2 years',
      required: false
    },
    analytics: {
      title: 'Analytics & Performance Cookies',
      description: 'These cookies help us measure and improve the performance of our site.',
      examples: 'Google Analytics, page views, user interactions',
      retention: 'Up to 2 years',
      required: false
    },
    marketing: {
      title: 'Marketing & Advertising Cookies',
      description: 'These cookies are used to deliver advertisements more relevant to you and your interests.',
      examples: 'Social media integration, targeted advertising, conversion tracking',
      retention: 'Up to 2 years',
      required: false
    }
  };

  // Check if consent banner should be shown
  useEffect(() => {
    // Wait for security provider initialization to avoid flicker on first load
    if (!isInitialized) return;

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
            functional: cookieConsent.functional || false,
            analytics: cookieConsent.analytics || false,
            marketing: cookieConsent.marketing || false
          }));
          setShowBanner(false); // Ensure banner stays hidden when consent is valid
        }
      }
    };

    checkConsentStatus();
  }, [cookieConsent, isInitialized]);

  // Handle accept all cookies
  const handleAcceptAll = useCallback(async () => {
    setIsLoading(true);
    
    try {
      const consent = {
        necessary: true,
        functional: true,
        analytics: true,
        marketing: true,
        timestamp: Date.now(),
        version: '1.0',
        userAgent: navigator.userAgent,
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
      setShowDetails(false);
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
        functional: false,
        analytics: false,
        marketing: false,
        timestamp: Date.now(),
        version: '1.0',
        userAgent: navigator.userAgent,
        consentMethod: 'reject_all',
        legalBasis: 'legitimate_interest'
      };
      
      // Store consent with audit trail
      setCookieConsent(consent);
      safeJSONStorage.setItem('cookie_consent_history', [
        ...(safeJSONStorage.getItem('cookie_consent_history', [])),
        { ...consent, action: 'reject_all' }
      ]);
      
      // Disable analytics
      updateAnalyticsConsent(false);
      
      logger.info('User rejected non-essential cookies', { consentMethod: 'reject_all' });
      setShowBanner(false);
      setShowDetails(false);
    } catch (error) {
      logger.error('Error saving cookie consent', error);
    } finally {
      setIsLoading(false);
    }
  }, [setCookieConsent]);

  // Handle save custom preferences
  const handleSavePreferences = useCallback(async () => {
    setIsLoading(true);
    
    try {
      const consent = {
        ...preferences,
        timestamp: Date.now(),
        version: '1.0',
        userAgent: navigator.userAgent,
        consentMethod: 'custom_preferences',
        legalBasis: 'consent'
      };
      
      // Store consent with audit trail
      setCookieConsent(consent);
      safeJSONStorage.setItem('cookie_consent_history', [
        ...(safeJSONStorage.getItem('cookie_consent_history', [])),
        { ...consent, action: 'save_preferences' }
      ]);
      
      // Update analytics consent
      updateAnalyticsConsent(preferences.analytics);
      
      logger.info('User saved custom preferences', { 
        consentMethod: 'custom_preferences',
        preferences 
      });
      setShowBanner(false);
      setShowDetails(false);
    } catch (error) {
      logger.error('Error saving cookie preferences', error);
    } finally {
      setIsLoading(false);
    }
  }, [preferences, setCookieConsent]);

  // Handle show customize
  const handleShowCustomize = useCallback(() => {
    setShowDetails(true);
    // Load current preferences if they exist
    if (cookieConsent) {
      setPreferences(prev => ({
        ...prev,
        functional: cookieConsent.functional || false,
        analytics: cookieConsent.analytics || false,
        marketing: cookieConsent.marketing || false
      }));
    }
  }, [cookieConsent]);

  // Listen for global manage-cookies event
  useEffect(() => {
    const openHandler = () => {
      setShowBanner(true);
      handleShowCustomize();
    };
    window.addEventListener('open-cookie-preferences', openHandler);
    return () => window.removeEventListener('open-cookie-preferences', openHandler);
  }, [handleShowCustomize]);

  // Handle hide customize
  const handleHideCustomize = useCallback(() => {
    setShowDetails(false);
  }, []);

  // Handle preference toggle
  const handlePreferenceToggle = useCallback((category) => {
    if (category === 'necessary') return; // Cannot toggle necessary cookies
    
    setPreferences(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  }, []);

  // Get current date for display
  const getCurrentDate = () => {
    return new Date().toLocaleDateString();
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className={`cookie-consent-overlay ${showBanner ? 'show' : ''}`}>
      <div className="cookie-consent-banner">
        {/* Simple banner view */}
        {!showDetails && (
          <div className="cookie-banner-simple">
            <div className="cookie-banner-content">
              <h3>We value your privacy</h3>
              <p>
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
                >
                  Accept All
                </button>
                <button 
                  className="cookie-btn cookie-btn-reject" 
                  onClick={handleRejectAll}
                  disabled={isLoading}
                >
                  Reject All
                </button>
                <button 
                  className="cookie-btn cookie-btn-customize" 
                  onClick={handleShowCustomize}
                  disabled={isLoading}
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
        )}

        {/* Detailed preferences view */}
        {showDetails && (
          <div className="cookie-banner-detailed show">
            <div className="cookie-banner-header">
              <h3>Cookie Preferences</h3>
              <button 
                className="cookie-close-btn" 
                onClick={handleHideCustomize}
                aria-label="Close cookie preferences"
              >
                ✕
              </button>
            </div>
            
            <div className="cookie-banner-content">
              <div className="cookie-preferences-intro">
                <p>
                  <strong>Take control of your privacy.</strong> Choose which cookies you want to accept. 
                  You can change these settings at any time.
                </p>
                <p>
                  <small>
                    <em>Last updated: {getCurrentDate()}</em> | 
                    <strong> Your consent expires after 12 months</strong>
                  </small>
                </p>
              </div>
              
              <div className="cookie-categories">
                {Object.entries(cookieCategories).map(([key, category]) => (
                  <div key={key} className="cookie-category">
                    <div className="cookie-category-header">
                      <div className="cookie-category-title-section">
                        <h4>{category.title}</h4>
                        {category.required && (
                          <span className="cookie-required-badge">Required</span>
                        )}
                      </div>
                      <label className="cookie-toggle">
                        <input 
                          type="checkbox" 
                          checked={preferences[key]} 
                          disabled={category.required}
                          onChange={() => handlePreferenceToggle(key)}
                        />
                        <span className={`cookie-slider ${category.required ? 'disabled' : ''}`}></span>
                      </label>
                    </div>
                    <div className="cookie-category-details">
                      <p className="cookie-category-description">
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
                  Save Preferences
                </button>
                <button 
                  className="cookie-btn cookie-btn-accept" 
                  onClick={handleAcceptAll}
                  disabled={isLoading}
                >
                  Accept All
                </button>
              </div>

              <div className="cookie-banner-links">
                <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
                <a href="/terms-of-use" target="_blank" rel="noopener noreferrer">Terms of Use</a>
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