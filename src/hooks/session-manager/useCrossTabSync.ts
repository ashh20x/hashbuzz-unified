/**
 * Cross-Tab Synchronization Module
 * Handles localStorage events for cross-tab session synchronization
 * @version 3.0.0
 */

import { useEffect } from 'react';
import { AUTH_STORAGE_KEYS } from './constants';

export const useCrossTabSync = (
  getTokenExpiry: () => number | null,
  clearRefreshTimer: () => void,
  scheduleRefresh: (expiryTs: number) => void,
  refreshTokenHandler: () => Promise<boolean>,
  bufferSeconds: number
) => {
  // ============================================================================
  // CROSS-TAB SYNCHRONIZATION
  // ============================================================================

  useEffect(() => {
    const onStorageEvent = (event: StorageEvent) => {
      if (event.key === AUTH_STORAGE_KEYS.LAST_TOKEN_REFRESH) {
        // Another tab refreshed; reschedule timer
        const newExpiry = getTokenExpiry();
        if (newExpiry && newExpiry > Date.now()) {
          clearRefreshTimer();
          scheduleRefresh(newExpiry);
          console.log('Cross-tab refresh detected, rescheduling timer');
        }
      } else if (event.key === AUTH_STORAGE_KEYS.ACCESS_TOKEN_EXPIRY) {
        // Token expiry updated in another tab
        const newExpiry = getTokenExpiry();
        if (newExpiry && newExpiry > Date.now()) {
          clearRefreshTimer();
          scheduleRefresh(newExpiry);
          console.log('Token expiry updated in another tab');
        }
      } else if (
        event.key === AUTH_STORAGE_KEYS.REFRESH_LOCK &&
        !event.newValue
      ) {
        // Lock released, check if we need to refresh
        const expiry = getTokenExpiry();
        if (expiry && expiry - Date.now() <= bufferSeconds * 1000) {
          refreshTokenHandler();
        }
      }
    };

    window.addEventListener('storage', onStorageEvent);
    return () => window.removeEventListener('storage', onStorageEvent);
  }, [
    getTokenExpiry,
    clearRefreshTimer,
    scheduleRefresh,
    bufferSeconds,
    refreshTokenHandler,
  ]);
};
