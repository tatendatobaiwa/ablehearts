/**
 * Centralized logging utility for the application
 * Provides consistent logging with environment-based controls
 */

const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

const CURRENT_LOG_LEVEL = import.meta.env.DEV ? LOG_LEVELS.DEBUG : LOG_LEVELS.ERROR;

/**
 * Logger class for consistent application logging
 */
class Logger {
  constructor(context = 'App') {
    this.context = context;
  }

  /**
   * Log error messages
   * @param {string} message - Error message
   * @param {any} data - Additional data to log
   */
  error(message, data = null) {
    if (CURRENT_LOG_LEVEL >= LOG_LEVELS.ERROR) {
      console.error(`[${this.context}] ERROR:`, message, data || '');
    }
  }

  /**
   * Log warning messages
   * @param {string} message - Warning message
   * @param {any} data - Additional data to log
   */
  warn(message, data = null) {
    if (CURRENT_LOG_LEVEL >= LOG_LEVELS.WARN) {
      console.warn(`[${this.context}] WARN:`, message, data || '');
    }
  }

  /**
   * Log info messages
   * @param {string} message - Info message
   * @param {any} data - Additional data to log
   */
  info(message, data = null) {
    if (CURRENT_LOG_LEVEL >= LOG_LEVELS.INFO) {
      console.info(`[${this.context}] INFO:`, message, data || '');
    }
  }

  /**
   * Log debug messages
   * @param {string} message - Debug message
   * @param {any} data - Additional data to log
   */
  debug(message, data = null) {
    if (CURRENT_LOG_LEVEL >= LOG_LEVELS.DEBUG) {
      console.log(`[${this.context}] DEBUG:`, message, data || '');
    }
  }
}

/**
 * Create a logger instance for a specific context
 * @param {string} context - Context name for the logger
 * @returns {Logger} Logger instance
 */
export const createLogger = (context) => new Logger(context);

// Default logger instance
export const logger = new Logger('AbleHearts');

export default logger;