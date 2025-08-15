/**
 * Security utilities for form protection and data validation
 */

// Input sanitization
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
};

// Email validation with security considerations
export const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const sanitizedEmail = sanitizeInput(email);
  
  return {
    isValid: emailRegex.test(sanitizedEmail) && sanitizedEmail.length <= 254,
    sanitized: sanitizedEmail
  };
};

// Phone number validation
export const validatePhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  const sanitizedPhone = sanitizeInput(phone).replace(/\s+/g, '');
  
  return {
    isValid: phoneRegex.test(sanitizedPhone),
    sanitized: sanitizedPhone
  };
};

// Form data validation and sanitization
export const validateFormData = (formData, rules = {}) => {
  const errors = {};
  const sanitizedData = {};
  
  Object.keys(formData).forEach(field => {
    const value = formData[field];
    const rule = rules[field] || {};
    
    // Sanitize input
    sanitizedData[field] = sanitizeInput(value);
    
    // Required field validation
    if (rule.required && (!value || value.trim() === '')) {
      errors[field] = `${field} is required`;
      return;
    }
    
    // Skip further validation if field is empty and not required
    if (!value || value.trim() === '') return;
    
    // Length validation
    if (rule.minLength && value.length < rule.minLength) {
      errors[field] = `${field} must be at least ${rule.minLength} characters`;
    }
    
    if (rule.maxLength && value.length > rule.maxLength) {
      errors[field] = `${field} must not exceed ${rule.maxLength} characters`;
    }
    
    // Email validation
    if (rule.type === 'email') {
      const emailValidation = validateEmail(value);
      if (!emailValidation.isValid) {
        errors[field] = 'Please enter a valid email address';
      }
      sanitizedData[field] = emailValidation.sanitized;
    }
    
    // Phone validation
    if (rule.type === 'phone') {
      const phoneValidation = validatePhone(value);
      if (!phoneValidation.isValid) {
        errors[field] = 'Please enter a valid phone number';
      }
      sanitizedData[field] = phoneValidation.sanitized;
    }
    
    // Custom pattern validation
    if (rule.pattern && !rule.pattern.test(value)) {
      errors[field] = rule.message || `${field} format is invalid`;
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitizedData
  };
};

// Rate limiting for form submissions
class RateLimiter {
  constructor(maxAttempts = 5, windowMs = 15 * 60 * 1000) { // 5 attempts per 15 minutes
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
    this.attempts = new Map();
  }
  
  isAllowed(identifier) {
    const now = Date.now();
    const userAttempts = this.attempts.get(identifier) || [];
    
    // Remove old attempts outside the window
    const recentAttempts = userAttempts.filter(time => now - time < this.windowMs);
    
    if (recentAttempts.length >= this.maxAttempts) {
      return false;
    }
    
    // Record this attempt
    recentAttempts.push(now);
    this.attempts.set(identifier, recentAttempts);
    
    return true;
  }
  
  getRemainingTime(identifier) {
    const userAttempts = this.attempts.get(identifier) || [];
    if (userAttempts.length === 0) return 0;
    
    const oldestAttempt = Math.min(...userAttempts);
    const timeUntilReset = this.windowMs - (Date.now() - oldestAttempt);
    
    return Math.max(0, timeUntilReset);
  }
}

// Create rate limiter instances
export const formRateLimiter = new RateLimiter(3, 10 * 60 * 1000); // 3 attempts per 10 minutes
export const newsletterRateLimiter = new RateLimiter(2, 60 * 60 * 1000); // 2 attempts per hour

// CSRF token generation and validation
export const generateCSRFToken = () => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Content Security Policy helpers
export const getCSPNonce = () => {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array));
};

// Secure storage utilities
export const secureStorage = {
  set: (key, value, expirationHours = 24) => {
    const item = {
      value,
      expiry: Date.now() + (expirationHours * 60 * 60 * 1000)
    };
    
    try {
      localStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn('Failed to store item securely:', error);
      }
    }
  },
  
  get: (key) => {
    try {
      const itemStr = localStorage.getItem(key);
      if (!itemStr) return null;
      
      const item = JSON.parse(itemStr);
      
      // Check if expired
      if (Date.now() > item.expiry) {
        localStorage.removeItem(key);
        return null;
      }
      
      return item.value;
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn('Failed to retrieve item securely:', error);
      }
      return null;
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn('Failed to remove item securely:', error);
      }
    }
  },
  
  clear: () => {
    try {
      localStorage.clear();
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn('Failed to clear storage securely:', error);
      }
    }
  }
};

// Environment-based security configuration
export const SECURITY_CONFIG = {
  ENABLE_RATE_LIMITING: import.meta.env.VITE_ENABLE_SECURITY_HEADERS === 'true' && import.meta.env.PROD,
  ENABLE_CSRF_PROTECTION: import.meta.env.VITE_ENABLE_CSRF_PROTECTION === 'true' && import.meta.env.PROD,
  ENABLE_INPUT_SANITIZATION: true,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
};

// File upload security
export const validateFileUpload = (file) => {
  const errors = [];
  
  if (!file) {
    errors.push('No file selected');
    return { isValid: false, errors };
  }
  
  // Check file size
  if (file.size > SECURITY_CONFIG.MAX_FILE_SIZE) {
    errors.push(`File size must be less than ${SECURITY_CONFIG.MAX_FILE_SIZE / (1024 * 1024)}MB`);
  }
  
  // Check file type
  if (!SECURITY_CONFIG.ALLOWED_FILE_TYPES.includes(file.type)) {
    errors.push('File type not allowed');
  }
  
  // Check file name for suspicious patterns
  const suspiciousPatterns = [/\.exe$/i, /\.bat$/i, /\.cmd$/i, /\.scr$/i, /\.js$/i];
  if (suspiciousPatterns.some(pattern => pattern.test(file.name))) {
    errors.push('File type not allowed');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// XSS protection
export const escapeHtml = (text) => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

// URL validation
export const isValidURL = (url) => {
  try {
    const urlObj = new URL(url);
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
};

export default {
  sanitizeInput,
  validateEmail,
  validatePhone,
  validateFormData,
  formRateLimiter,
  newsletterRateLimiter,
  generateCSRFToken,
  secureStorage,
  validateFileUpload,
  escapeHtml,
  isValidURL,
  SECURITY_CONFIG
};