/**
 * Advanced Security Utilities
 * Comprehensive security measures for production deployment
 */

// Content Security Policy generator
export const generateCSP = () => {
  const csp = {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      "'unsafe-inline'", // Required for Vite in development
      "https://connect.facebook.net",
      "https://www.googletagmanager.com"
    ],
    'style-src': [
      "'self'",
      "'unsafe-inline'", // Required for styled-components
      "https://fonts.googleapis.com"
    ],
    'font-src': [
      "'self'",
      "https://fonts.gstatic.com",
      "data:"
    ],
    'img-src': [
      "'self'",
      "data:",
      "https:",
      "blob:"
    ],
    'connect-src': [
      "'self'",
      "https://api.emailjs.com",
      "https://firestore.googleapis.com",
      "https://firebase.googleapis.com"
    ],
    'frame-src': [
      "https://www.facebook.com"
    ],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'none'"],
    'upgrade-insecure-requests': []
  };

  return Object.entries(csp)
    .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
    .join('; ');
};

// Input sanitization with advanced XSS protection
export const advancedSanitize = (input, options = {}) => {
  if (typeof input !== 'string') return input;

  const {
    allowHTML = false,
    maxLength = 1000,
    stripScripts = true,
    stripEvents = true
  } = options;

  let sanitized = input.trim();

  // Length validation
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  if (!allowHTML) {
    // Remove all HTML tags
    sanitized = sanitized.replace(/<[^>]*>/g, '');
  }

  if (stripScripts) {
    // Remove script tags and javascript: protocols
    sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    sanitized = sanitized.replace(/javascript:/gi, '');
    sanitized = sanitized.replace(/vbscript:/gi, '');
    sanitized = sanitized.replace(/data:/gi, '');
  }

  if (stripEvents) {
    // Remove event handlers
    sanitized = sanitized.replace(/on\w+\s*=/gi, '');
  }

  // Remove potentially dangerous characters
  sanitized = sanitized.replace(/[<>'"&]/g, (char) => {
    const entities = {
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '&': '&amp;'
    };
    return entities[char] || char;
  });

  return sanitized;
};

// Rate limiting with sliding window
export class AdvancedRateLimiter {
  constructor(maxRequests = 10, windowMs = 60000, blockDurationMs = 300000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.blockDurationMs = blockDurationMs;
    this.requests = new Map();
    this.blockedIPs = new Map();
  }

  isAllowed(identifier) {
    const now = Date.now();
    
    // Check if IP is blocked
    if (this.blockedIPs.has(identifier)) {
      const blockTime = this.blockedIPs.get(identifier);
      if (now - blockTime < this.blockDurationMs) {
        return false;
      } else {
        this.blockedIPs.delete(identifier);
      }
    }

    // Get or create request history
    if (!this.requests.has(identifier)) {
      this.requests.set(identifier, []);
    }

    const requestHistory = this.requests.get(identifier);
    
    // Remove old requests outside the window
    const validRequests = requestHistory.filter(
      timestamp => now - timestamp < this.windowMs
    );

    // Check if limit exceeded
    if (validRequests.length >= this.maxRequests) {
      this.blockedIPs.set(identifier, now);
      return false;
    }

    // Add current request
    validRequests.push(now);
    this.requests.set(identifier, validRequests);

    return true;
  }

  getRemainingRequests(identifier) {
    const now = Date.now();
    
    if (!this.requests.has(identifier)) {
      return this.maxRequests;
    }

    const requestHistory = this.requests.get(identifier);
    const validRequests = requestHistory.filter(
      timestamp => now - timestamp < this.windowMs
    );

    return Math.max(0, this.maxRequests - validRequests.length);
  }

  reset(identifier) {
    this.requests.delete(identifier);
    this.blockedIPs.delete(identifier);
  }
}

// Secure session management
export const secureSession = {
  // Generate secure session ID
  generateSessionId: () => {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  },

  // Validate session integrity
  validateSession: (sessionData) => {
    if (!sessionData || typeof sessionData !== 'object') {
      return false;
    }

    const { timestamp, signature, data } = sessionData;
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours

    // Check timestamp
    if (!timestamp || now - timestamp > maxAge) {
      return false;
    }

    // Validate signature (simplified - in production use proper HMAC)
    const expectedSignature = btoa(JSON.stringify(data) + timestamp);
    if (signature !== expectedSignature) {
      return false;
    }

    return true;
  },

  // Create secure session
  createSession: (data) => {
    const timestamp = Date.now();
    const signature = btoa(JSON.stringify(data) + timestamp);
    
    return {
      id: secureSession.generateSessionId(),
      timestamp,
      signature,
      data
    };
  }
};

// Security monitoring
export const securityMonitor = {
  // Track security events
  events: [],

  // Log security event
  logEvent: (type, details = {}) => {
    const event = {
      type,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      ...details
    };

    securityMonitor.events.push(event);

    // Keep only last 100 events
    if (securityMonitor.events.length > 100) {
      securityMonitor.events = securityMonitor.events.slice(-100);
    }

    // Log to console in development
    if (import.meta.env.DEV) {
      console.warn('Security Event:', event);
    }
  },

  // Detect suspicious activity
  detectSuspiciousActivity: () => {
    const recentEvents = securityMonitor.events.filter(
      event => Date.now() - event.timestamp < 300000 // Last 5 minutes
    );

    const suspiciousPatterns = [
      // Too many failed attempts
      recentEvents.filter(e => e.type === 'validation_failed').length > 5,
      // Rapid requests
      recentEvents.length > 50,
      // XSS attempts
      recentEvents.some(e => e.type === 'xss_attempt')
    ];

    return suspiciousPatterns.some(pattern => pattern);
  },

  // Get security report
  getSecurityReport: () => {
    const now = Date.now();
    const last24h = securityMonitor.events.filter(
      event => now - event.timestamp < 86400000
    );

    const eventTypes = {};
    last24h.forEach(event => {
      eventTypes[event.type] = (eventTypes[event.type] || 0) + 1;
    });

    return {
      totalEvents: last24h.length,
      eventTypes,
      suspiciousActivity: securityMonitor.detectSuspiciousActivity(),
      lastEvent: securityMonitor.events[securityMonitor.events.length - 1]
    };
  }
};

// Secure form validation
export const secureFormValidation = {
  // Email validation with security checks
  validateEmail: (email) => {
    const sanitized = advancedSanitize(email, { maxLength: 254 });
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    
    const isValid = emailRegex.test(sanitized) && 
                   !sanitized.includes('..') && 
                   !sanitized.startsWith('.') && 
                   !sanitized.endsWith('.');

    if (!isValid) {
      securityMonitor.logEvent('invalid_email', { email: sanitized });
    }

    return { isValid, sanitized };
  },

  // Phone validation
  validatePhone: (phone) => {
    const sanitized = advancedSanitize(phone.replace(/\s+/g, ''), { maxLength: 20 });
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    
    const isValid = phoneRegex.test(sanitized);

    if (!isValid) {
      securityMonitor.logEvent('invalid_phone', { phone: sanitized });
    }

    return { isValid, sanitized };
  },

  // Text validation
  validateText: (text, options = {}) => {
    const { minLength = 1, maxLength = 1000, allowHTML = false } = options;
    const sanitized = advancedSanitize(text, { maxLength, allowHTML });
    
    const isValid = sanitized.length >= minLength && sanitized.length <= maxLength;

    if (!isValid) {
      securityMonitor.logEvent('invalid_text', { 
        length: sanitized.length, 
        minLength, 
        maxLength 
      });
    }

    return { isValid, sanitized };
  }
};

// Initialize security measures
export const initializeSecurity = () => {
  // Set up CSP if supported
  if (typeof document !== 'undefined') {
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Content-Security-Policy';
    meta.content = generateCSP();
    document.head.appendChild(meta);
  }

  // Monitor for XSS attempts
  if (typeof window !== 'undefined') {
    const originalAlert = window.alert;
    window.alert = function(...args) {
      securityMonitor.logEvent('xss_attempt', { args });
      return originalAlert.apply(this, args);
    };
  }

  securityMonitor.logEvent('security_initialized');
};

export default {
  generateCSP,
  advancedSanitize,
  AdvancedRateLimiter,
  secureSession,
  securityMonitor,
  secureFormValidation,
  initializeSecurity
};