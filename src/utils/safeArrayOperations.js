/**
 * Safe array operations to prevent runtime errors
 */

import { createLogger } from './logger';

const logger = createLogger('SafeArrayOperations');

/**
 * Safe map operation with null/undefined checks
 * @param {Array|null|undefined} array - Array to map over
 * @param {Function} callback - Map callback function
 * @param {Array} fallback - Fallback array if original is invalid
 * @returns {Array} Mapped array or fallback
 */
export const safeMap = (array, callback, fallback = []) => {
  if (!Array.isArray(array)) {
    logger.warn('safeMap: Invalid array provided, using fallback', { array, fallback });
    return fallback;
  }
  
  try {
    return array.map(callback);
  } catch (error) {
    logger.error('safeMap: Error during mapping operation', error);
    return fallback;
  }
};

/**
 * Safe filter operation with null/undefined checks
 * @param {Array|null|undefined} array - Array to filter
 * @param {Function} callback - Filter callback function
 * @param {Array} fallback - Fallback array if original is invalid
 * @returns {Array} Filtered array or fallback
 */
export const safeFilter = (array, callback, fallback = []) => {
  if (!Array.isArray(array)) {
    logger.warn('safeFilter: Invalid array provided, using fallback', { array, fallback });
    return fallback;
  }
  
  try {
    return array.filter(callback);
  } catch (error) {
    logger.error('safeFilter: Error during filtering operation', error);
    return fallback;
  }
};

/**
 * Safe find operation with null/undefined checks
 * @param {Array|null|undefined} array - Array to search
 * @param {Function} callback - Find callback function
 * @param {any} fallback - Fallback value if not found
 * @returns {any} Found item or fallback
 */
export const safeFind = (array, callback, fallback = null) => {
  if (!Array.isArray(array)) {
    logger.warn('safeFind: Invalid array provided, using fallback', { array, fallback });
    return fallback;
  }
  
  try {
    const result = array.find(callback);
    return result !== undefined ? result : fallback;
  } catch (error) {
    logger.error('safeFind: Error during find operation', error);
    return fallback;
  }
};

/**
 * Safe array length check
 * @param {Array|null|undefined} array - Array to check
 * @returns {number} Array length or 0
 */
export const safeLength = (array) => {
  return Array.isArray(array) ? array.length : 0;
};

/**
 * Check if array is valid and not empty
 * @param {Array|null|undefined} array - Array to check
 * @returns {boolean} True if array is valid and has items
 */
export const isValidArray = (array) => {
  return Array.isArray(array) && array.length > 0;
};

/**
 * Safe array access with index bounds checking
 * @param {Array|null|undefined} array - Array to access
 * @param {number} index - Index to access
 * @param {any} fallback - Fallback value if access fails
 * @returns {any} Array item or fallback
 */
export const safeArrayAccess = (array, index, fallback = null) => {
  if (!Array.isArray(array) || index < 0 || index >= array.length) {
    return fallback;
  }
  return array[index];
};

/**
 * Safe object property access with fallback
 * @param {Object|null|undefined} obj - Object to access
 * @param {string} path - Property path (e.g., 'user.profile.name')
 * @param {any} fallback - Fallback value
 * @returns {any} Property value or fallback
 */
export const safeGet = (obj, path, fallback = null) => {
  if (!obj || typeof obj !== 'object') {
    return fallback;
  }
  
  try {
    const keys = path.split('.');
    let result = obj;
    
    for (const key of keys) {
      if (result === null || result === undefined || !(key in result)) {
        return fallback;
      }
      result = result[key];
    }
    
    return result;
  } catch (error) {
    logger.warn('safeGet: Error accessing object property', { path, error: error.message });
    return fallback;
  }
};

export default {
  safeMap,
  safeFilter,
  safeFind,
  safeLength,
  isValidArray,
  safeArrayAccess,
  safeGet
};