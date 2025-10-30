/**
 * Session Initialization Singleton
 *
 * This module provides a global singleton to prevent multiple session initializations
 * even when React.StrictMode causes component remounts in development.
 *
 * The singleton persists across component unmount/remount cycles.
 */

// Global singleton state outside React lifecycle
let isInitializing = false;
let hasInitialized = false;
let initializationPromise: Promise<void> | null = null;

export const SessionInitSingleton = {
  /**
   * Check if initialization is currently in progress
   */
  isInitializing(): boolean {
    return isInitializing;
  },

  /**
   * Check if initialization has already completed
   */
  hasInitialized(): boolean {
    return hasInitialized;
  },

  /**
   * Mark initialization as started
   * Returns false if already initializing/initialized, true if successfully marked
   */
  startInitialization(): boolean {
    if (isInitializing || hasInitialized) {
      console.warn(
        '[SessionInitSingleton] Initialization already in progress or completed'
      );
      return false;
    }

    console.warn('[SessionInitSingleton] Starting initialization');
    isInitializing = true;
    return true;
  },

  /**
   * Mark initialization as completed
   */
  completeInitialization(): void {
    console.warn('[SessionInitSingleton] Initialization completed');
    isInitializing = false;
    hasInitialized = true;
  },

  /**
   * Reset the singleton (for testing or logout)
   */
  reset(): void {
    console.warn('[SessionInitSingleton] Resetting singleton');
    isInitializing = false;
    hasInitialized = false;
    initializationPromise = null;
  },

  /**
   * Get or create initialization promise to prevent duplicate calls
   */
  getOrCreatePromise(initFn: () => Promise<void>): Promise<void> {
    if (initializationPromise) {
      console.warn(
        '[SessionInitSingleton] Returning existing initialization promise'
      );
      return initializationPromise;
    }

    if (!this.startInitialization()) {
      // Already initialized, return resolved promise
      return Promise.resolve();
    }

    initializationPromise = initFn()
      .then(() => {
        this.completeInitialization();
      })
      .catch(error => {
        console.error('[SessionInitSingleton] Initialization failed:', error);
        // Reset on failure to allow retry
        isInitializing = false;
        initializationPromise = null;
        throw error;
      });

    return initializationPromise;
  },
};

// Expose to window for debugging in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (
    window as typeof window & {
      SessionInitSingleton: typeof SessionInitSingleton;
    }
  ).SessionInitSingleton = SessionInitSingleton;
}
