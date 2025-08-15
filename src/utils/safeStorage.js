/**
 * Safe storage utilities with fallbacks for SSR and private browsing
 */

import { createLogger } from './logger';

const logger = createLogger('SafeStorage');

/**
 * Check if localStorage is available
 * @returns {boolean} True if localStorage is available
 */
const isLocalStorageAvailable = () => {
  try {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return false;
    }
    
    // Test if we can actually use localStorage
    const testKey = '__localStorage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch (error) {
    logger.warn('localStorage not available:', error.message);
    return false;
  }
};

/**
 * In-memory storage fallback
 */
class MemoryStorage {
  constructor() {
    this.storage = new Map();
  }

  getItem(key) {
    return this.storage.get(key) || null;
  }

  setItem(key, value) {
    this.storage.set(key, value);
  }

  removeItem(key) {
    this.storage.delete(key);
  }

  clear() {
    this.storage.clear();
  }

  get length() {
    return this.storage.size;
  }

  key(index) {
    const keys = Array.from(this.storage.keys());
    return keys[index] || null;
  }
}

// Create fallback storage
const memoryStorage = new MemoryStorage();

/**
 * Safe storage interface that falls back to memory storage
 */
export const safeStorage = {
  /**
   * Get item from storage
   * @param {string} key - Storage key
   * @returns {string|null} Stored value or null
   */
  getItem(key) {
    try {
      if (isLocalStorageAvailable()) {
        return localStorage.getItem(key);
      }
      return memoryStorage.getItem(key);
    } catch (error) {
      logger.warn('Error getting item from storage:', error.message);
      return null;
    }
  },

  /**
   * Set item in storage
   * @param {string} key - Storage key
   * @param {string} value - Value to store
   */
  setItem(key, value) {
    try {
      if (isLocalStorageAvailable()) {
        localStorage.setItem(key, value);
      } else {
        memoryStorage.setItem(key, value);
      }
    } catch (error) {
      logger.warn('Error setting item in storage:', error.message);
    }
  },

  /**
   * Remove item from storage
   * @param {string} key - Storage key
   */
  removeItem(key) {
    try {
      if (isLocalStorageAvailable()) {
        localStorage.removeItem(key);
      } else {
        memoryStorage.removeItem(key);
      }
    } catch (error) {
      logger.warn('Error removing item from storage:', error.message);
    }
  },

  /**
   * Clear all storage
   */
  clear() {
    try {
      if (isLocalStorageAvailable()) {
        localStorage.clear();
      } else {
        memoryStorage.clear();
      }
    } catch (error) {
      logger.warn('Error clearing storage:', error.message);
    }
  },

  /**
   * Check if storage is available
   * @returns {boolean} True if any storage is available
   */
  isAvailable() {
    return isLocalStorageAvailable() || true; // Memory storage is always available
  },

  /**
   * Get storage type being used
   * @returns {string} 'localStorage' or 'memory'
   */
  getStorageType() {
    return isLocalStorageAvailable() ? 'localStorage' : 'memory';
  }
};

/**
 * Safe JSON storage utilities
 */
export const safeJSONStorage = {
  /**
   * Get and parse JSON from storage
   * @param {string} key - Storage key
   * @param {any} defaultValue - Default value if parsing fails
   * @returns {any} Parsed value or default
   */
  getItem(key, defaultValue = null) {
    try {
      const item = safeStorage.getItem(key);
      if (item === null) return defaultValue;
      return JSON.parse(item);
    } catch (error) {
      logger.warn(`Error parsing JSON from storage key "${key}":`, error.message);
      return defaultValue;
    }
  },

  /**
   * Stringify and set JSON in storage
   * @param {string} key - Storage key
   * @param {any} value - Value to store
   */
  setItem(key, value) {
    try {
      const jsonString = JSON.stringify(value);
      safeStorage.setItem(key, jsonString);
    } catch (error) {
      logger.warn(`Error stringifying JSON for storage key "${key}":`, error.message);
    }
  },

  /**
   * Remove item from storage
   * @param {string} key - Storage key
   */
  removeItem(key) {
    safeStorage.removeItem(key);
  }
};

export default safeStorage;