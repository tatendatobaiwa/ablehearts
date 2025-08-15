/**
 * Safe DOM access utilities for SSR compatibility
 */

import { createLogger } from './logger';

const logger = createLogger('SafeDOM');

/**
 * Check if we're in a browser environment
 * @returns {boolean} True if in browser
 */
export const isBrowser = () => {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
};

/**
 * Safe document access
 */
export const safeDocument = {
  /**
   * Safely get element by ID
   * @param {string} id - Element ID
   * @returns {Element|null} Element or null
   */
  getElementById(id) {
    if (!isBrowser()) {
      logger.debug('Document not available (SSR environment)');
      return null;
    }
    try {
      return document.getElementById(id);
    } catch (error) {
      logger.warn('Error accessing document.getElementById:', error.message);
      return null;
    }
  },

  /**
   * Safely create element
   * @param {string} tagName - Tag name
   * @returns {Element|null} Element or null
   */
  createElement(tagName) {
    if (!isBrowser()) {
      logger.debug('Document not available (SSR environment)');
      return null;
    }
    try {
      return document.createElement(tagName);
    } catch (error) {
      logger.warn('Error creating element:', error.message);
      return null;
    }
  },

  /**
   * Safely access document head
   * @returns {Element|null} Head element or null
   */
  getHead() {
    if (!isBrowser()) {
      logger.debug('Document not available (SSR environment)');
      return null;
    }
    try {
      return document.head;
    } catch (error) {
      logger.warn('Error accessing document.head:', error.message);
      return null;
    }
  },

  /**
   * Safely access document body
   * @returns {Element|null} Body element or null
   */
  getBody() {
    if (!isBrowser()) {
      logger.debug('Document not available (SSR environment)');
      return null;
    }
    try {
      return document.body;
    } catch (error) {
      logger.warn('Error accessing document.body:', error.message);
      return null;
    }
  },

  /**
   * Safely query selector
   * @param {string} selector - CSS selector
   * @returns {Element|null} Element or null
   */
  querySelector(selector) {
    if (!isBrowser()) {
      logger.debug('Document not available (SSR environment)');
      return null;
    }
    try {
      return document.querySelector(selector);
    } catch (error) {
      logger.warn('Error with querySelector:', error.message);
      return null;
    }
  }
};

/**
 * Safe window access
 */
export const safeWindow = {
  /**
   * Safely add event listener to window
   * @param {string} event - Event name
   * @param {Function} handler - Event handler
   * @param {Object} options - Event options
   */
  addEventListener(event, handler, options = {}) {
    if (!isBrowser()) {
      logger.debug('Window not available (SSR environment)');
      return;
    }
    try {
      window.addEventListener(event, handler, options);
    } catch (error) {
      logger.warn('Error adding window event listener:', error.message);
    }
  },

  /**
   * Safely remove event listener from window
   * @param {string} event - Event name
   * @param {Function} handler - Event handler
   */
  removeEventListener(event, handler) {
    if (!isBrowser()) {
      logger.debug('Window not available (SSR environment)');
      return;
    }
    try {
      window.removeEventListener(event, handler);
    } catch (error) {
      logger.warn('Error removing window event listener:', error.message);
    }
  },

  /**
   * Safely access window location
   * @returns {Location|null} Location object or null
   */
  getLocation() {
    if (!isBrowser()) {
      logger.debug('Window not available (SSR environment)');
      return null;
    }
    try {
      return window.location;
    } catch (error) {
      logger.warn('Error accessing window.location:', error.message);
      return null;
    }
  },

  /**
   * Safely reload page
   */
  reload() {
    if (!isBrowser()) {
      logger.debug('Window not available (SSR environment)');
      return;
    }
    try {
      window.location.reload();
    } catch (error) {
      logger.warn('Error reloading page:', error.message);
    }
  }
};

/**
 * Safe browser API checks
 */
export const browserAPIs = {
  /**
   * Check if IntersectionObserver is available
   * @returns {boolean} True if available
   */
  hasIntersectionObserver() {
    return isBrowser() && typeof IntersectionObserver !== 'undefined';
  },

  /**
   * Check if ResizeObserver is available
   * @returns {boolean} True if available
   */
  hasResizeObserver() {
    return isBrowser() && typeof ResizeObserver !== 'undefined';
  },

  /**
   * Check if fetch is available
   * @returns {boolean} True if available
   */
  hasFetch() {
    return isBrowser() && typeof fetch !== 'undefined';
  },

  /**
   * Check if localStorage is available
   * @returns {boolean} True if available
   */
  hasLocalStorage() {
    if (!isBrowser()) return false;
    try {
      const testKey = '__test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }
};

export default {
  isBrowser,
  safeDocument,
  safeWindow,
  browserAPIs
};