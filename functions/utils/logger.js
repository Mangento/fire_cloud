// Check if Firebase Functions is available
const isFirebaseEnvironment = process.env.FUNCTION_NAME !== undefined;
let functions;

if (isFirebaseEnvironment) {
  functions = require("firebase-functions");
}

/**
 * Custom logger with structured logging
 */
class Logger {
  /**
   * Format log message with metadata
   * @param {string} level - Log level
   * @param {string} message - Log message
   * @param {Object} metadata - Additional metadata
   * @return {Object} Formatted log entry
   */
  format(level, message, metadata = {}) {
    return {
      timestamp: new Date().toISOString(),
      level: level,
      message: message,
      ...metadata,
    };
  }

  /**
   * Log info message
   * @param {string} message - Log message
   * @param {Object} metadata - Additional metadata
   */
  info(message, metadata = {}) {
    const logEntry = this.format("INFO", message, metadata);
    if (isFirebaseEnvironment) {
      functions.logger.info(logEntry);
    }
    console.log(JSON.stringify(logEntry));
  }

  /**
   * Log warning message
   * @param {string} message - Log message
   * @param {Object} metadata - Additional metadata
   */
  warn(message, metadata = {}) {
    const logEntry = this.format("WARN", message, metadata);
    if (isFirebaseEnvironment) {
      functions.logger.warn(logEntry);
    }
    console.warn(JSON.stringify(logEntry));
  }

  /**
   * Log error message
   * @param {string} message - Log message
   * @param {Object} metadata - Additional metadata
   */
  error(message, metadata = {}) {
    const logEntry = this.format("ERROR", message, metadata);
    if (isFirebaseEnvironment) {
      functions.logger.error(logEntry);
    }
    console.error(JSON.stringify(logEntry));
  }

  /**
   * Log debug message
   * @param {string} message - Log message
   * @param {Object} metadata - Additional metadata
   */
  debug(message, metadata = {}) {
    const logEntry = this.format("DEBUG", message, metadata);
    if (isFirebaseEnvironment) {
      functions.logger.debug(logEntry);
    }
    console.debug(JSON.stringify(logEntry));
  }
}

const logger = new Logger();

module.exports = {
  logger,
  Logger,
};
