/**
 * Enhanced Security Utilities for AbleHearts Foundation
 * Additional security features beyond basic configuration
 */

// Content Security Policy management
export const CSP_POLICIES = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    "'unsafe-inline'", // Required for inline scripts
    'https://www.googletagmanager.com',
    'https://connect.facebook.net',
    'https://www.google-analytics.com'
  ],
  'style-src': [
    "'self'",
    "'unsafe-inline'", // Required for styled-components
    'https://fonts.googleapis.com'
  ],
  'font-src': [
    "'self'",
    'https://fonts.gstatic.com'
  ],
  'img-src': [
    "'self'",
    'data:',
    'https:',
    'blob:'
  ],
  'connect-src': [
    "'self'",
    'https://www.google-analytics.com',
    'https://analytics.google.com',
    'https://firestore.googleapis.com',
    'https://firebase.googleapis.com'
  ],
  'frame-src': [
    "'none'"
  ],
  'object-src': [
    "'none'"
  ],
  'base-uri': [
    "'self'"
  ],
  'form-action': [
    "'self'"
  ]
};

// Generate CSP header string
export const generateCSPHeader = () => {
  return Object.entries(CSP_POLICIES)
    .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
    .join('; ');
};

// Input validation and sanitization
export const inputValidation = {
  // Email validation with comprehensive regex
  validateEmail: (email) => {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email) && email.length <= 254;
  },

  // Phone number validation (international format)
  validatePhone: (phone) => {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    return phoneRegex.test(cleanPhone);
  },

  // Name validation (letters, spaces, hyphens, apostrophes)
  validateName: (name) => {
    const nameRegex = /^[a-zA-Z\s\-']{2,50}$/;
    return nameRegex.test(name.trim());
  },

  // URL validation
  validateURL: (url) => {
    try {
      const urlObj = new URL(url);
      return ['http:', 'https:'].includes(urlObj.protocol);
    } catch {
      return false;
    }
  },

  // Sanitize HTML content
  sanitizeHTML: (html) => {
    const div = document.createElement('div');
    div.textContent = html;
    return div.innerHTML;
  },

  // Remove potentially dangerous characters
  sanitizeInput: (input) => {
    if (typeof input !== 'string') return '';
    return input
      .replace(/[<>]/g, '') // Remove angle brackets
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim();
  }
};

// Rate limiting for client-side requests
export class RateLimiter {
  constructor(maxRequests = 10, windowMs = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = new Map();
  }

  isAllowed(identifier) {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    // Clean old requests
    if (this.requests.has(identifier)) {
      const userRequests = this.requests.get(identifier);
      const validRequests = userRequests.filter(time => time > windowStart);
      this.requests.set(identifier, validRequests);
    }

    const currentRequests = this.requests.get(identifier) || [];
    
    if (currentRequests.length >= this.maxRequests) {
      return false;
    }

    currentRequests.push(now);
    this.requests.set(identifier, currentRequests);
    return true;
  }

  getRemainingRequests(identifier) {
    const currentRequests = this.requests.get(identifier) || [];
    return Math.max(0, this.maxRequests - currentRequests.length);
  }
}

// Security headers management
export const securityHeaders = {
  // Set security headers for fetch requests
  getSecureHeaders: () => ({
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
  }),

  // Apply security headers to document
  applySecurityHeaders: () => {
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Content-Security-Policy';
    meta.content = generateCSPHeader();
    document.head.appendChild(meta);
  }
};

// Secure form submission
export const secureFormSubmission = {
  // Generate CSRF token
  generateCSRFToken: () => {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  },

  // Validate form data before submission
  validateFormData: (formData, schema) => {
    const errors = {};
    
    for (const [field, rules] of Object.entries(schema)) {
      const value = formData[field];
      
      if (rules.required && (!value || value.trim() === '')) {
        errors[field] = `${field} is required`;
        continue;
      }
      
      if (value && rules.type) {
        switch (rules.type) {
          case 'email':
            if (!inputValidation.validateEmail(value)) {
              errors[field] = 'Invalid email format';
            }
            break;
          case 'phone':
            if (!inputValidation.validatePhone(value)) {
              errors[field] = 'Invalid phone number';
            }
            break;
          case 'name':
            if (!inputValidation.validateName(value)) {
              errors[field] = 'Invalid name format';
            }
            break;
          case 'url':
            if (!inputValidation.validateURL(value)) {
              errors[field] = 'Invalid URL format';
            }
            break;
        }
      }
      
      if (value && rules.minLength && value.length < rules.minLength) {
        errors[field] = `${field} must be at least ${rules.minLength} characters`;
      }
      
      if (value && rules.maxLength && value.length > rules.maxLength) {
        errors[field] = `${field} must not exceed ${rules.maxLength} characters`;
      }
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  // Secure form submission with validation
  submitSecurely: async (url, formData, schema, options = {}) => {
    const { isValid, errors } = secureFormSubmission.validateFormData(formData, schema);
    
    if (!isValid) {
      throw new Error(`Validation failed: ${JSON.stringify(errors)}`);
    }

    const sanitizedData = {};
    for (const [key, value] of Object.entries(formData)) {
      sanitizedData[key] = inputValidation.sanitizeInput(value);
    }

    const headers = {
      'Content-Type': 'application/json',
      ...securityHeaders.getSecureHeaders(),
      ...options.headers
    };

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(sanitizedData),
      credentials: 'same-origin'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
};

// Privacy protection utilities
export const privacyProtection = {
  // Anonymize IP address
  anonymizeIP: (ip) => {
    const parts = ip.split('.');
    if (parts.length === 4) {
      return `${parts[0]}.${parts[1]}.${parts[2]}.0`;
    }
    return ip;
  },

  // Generate anonymous user ID
  generateAnonymousID: () => {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substr(2, 9);
    return `anon_${timestamp}_${randomPart}`;
  },

  // Cookie consent management
  cookieConsent: {
    set: (consent) => {
      const consentData = {
        analytics: consent.analytics || false,
        marketing: consent.marketing || false,
        functional: consent.functional || true,
        timestamp: Date.now()
      };
      localStorage.setItem('cookie_consent', JSON.stringify(consentData));
    },

    get: () => {
      try {
        const consent = localStorage.getItem('cookie_consent');
        return consent ? JSON.parse(consent) : null;
      } catch {
        return null;
      }
    },

    hasConsent: (type) => {
      const consent = privacyProtection.cookieConsent.get();
      return consent && consent[type] === true;
    }
  }
};

// Security monitoring
export const securityMonitoring = {
  // Log security events
  logSecurityEvent: (event, details = {}) => {
    const securityEvent = {
      type: event,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      details
    };

    // Only log security events in production or when explicitly enabled
    if (!import.meta.env.PROD && import.meta.env.VITE_ENABLE_SECURITY_LOGGING !== 'true') {
      return; // Skip logging in development unless explicitly enabled
    }

    // In production, send to security monitoring service
    if (import.meta.env.PROD) {
      // Send to monitoring service
      // fetch('/api/security/log', { method: 'POST', body: JSON.stringify(securityEvent) });
    } else {
      // Only log to console in development if explicitly enabled
      console.info('Security Event:', securityEvent);
    }
  },

  // Detect suspicious activity
  detectSuspiciousActivity: () => {
    // Check for rapid form submissions
    const formSubmissions = JSON.parse(localStorage.getItem('form_submissions') || '[]');
    const recentSubmissions = formSubmissions.filter(
      time => Date.now() - time < 60000 // Last minute
    );

    if (recentSubmissions.length > 5) {
      securityMonitoring.logSecurityEvent('rapid_form_submissions', {
        count: recentSubmissions.length
      });
      return true;
    }

    return false;
  }
};

// Initialize security features
export const initializeSecurity = () => {
  // Apply security headers
  securityHeaders.applySecurityHeaders();

  // Set up security monitoring
  window.addEventListener('error', (event) => {
    securityMonitoring.logSecurityEvent('javascript_error', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno
    });
  });

  // Monitor for suspicious activity
  setInterval(() => {
    securityMonitoring.detectSuspiciousActivity();
  }, 30000); // Check every 30 seconds
};

export default {
  CSP_POLICIES,
  generateCSPHeader,
  inputValidation,
  RateLimiter,
  securityHeaders,
  secureFormSubmission,
  privacyProtection,
  securityMonitoring,
  initializeSecurity
};