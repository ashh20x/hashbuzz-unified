/**
 * Session Manager Utilities
 * @version 3.0.0
 */

/**
 * Logs errors safely - only in development mode for security
 */
export const logError = (error: any, message: string = "Operation failed", prefix?: string) => {
  const logMessage = prefix ? `${prefix} ${message}` : message;
  
  if (process.env.NODE_ENV === 'development') {
    console.error(logMessage, error);
  } else {
    console.error(logMessage);
  }
};

/**
 * Logs debug information - only in development mode
 */
export const logDebug = (message: string, data?: any, prefix?: string) => {
  if (process.env.NODE_ENV === 'development') {
    const logMessage = prefix ? `${prefix} ${message}` : message;
    if (data) {
      console.debug(logMessage, data);
    } else {
      console.debug(logMessage);
    }
  }
};

/**
 * Logs info messages - only in development mode
 */
export const logInfo = (message: string, data?: any, prefix?: string) => {
  if (process.env.NODE_ENV === 'development') {
    const logMessage = prefix ? `${prefix} ${message}` : message;
    if (data) {
      console.info(logMessage, data);
    } else {
      console.info(logMessage);
    }
  }
};

/**
 * Creates a delay promise for async operations
 */
export const delay = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

/**
 * Validates if a timestamp is in valid future range
 */
export const isValidFutureTimestamp = (timestamp: number, maxHours: number = 24): boolean => {
  const now = Date.now();
  const maxFutureTime = now + maxHours * 60 * 60 * 1000;
  return timestamp > now && timestamp <= maxFutureTime;
};

/**
 * Safe JSON parse with fallback
 */
export const safeJSONParse = <T>(json: string, fallback: T): T => {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
};
