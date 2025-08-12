/**
 * Tab Visibility Manager Module
 * Handles tab visibility changes and optimizes token refresh behavior
 * @version 3.0.0
 */

import { useEffect } from 'react';
import { getCookieByName } from '@/Utilities/helpers';

export const useTabVisibilityManager = (
  stopTokenRefreshTimer: () => void,
  startTokenRefreshTimer: () => void,
  getTokenExpiry: () => number | null,
  refreshTokenHandler: () => Promise<boolean>,
  clearTokenExpiry: () => void,
  isUserAuthenticated: boolean,
  hasInitialized: boolean,
  bufferSeconds: number
) => {

  // ============================================================================
  // TAB VISIBILITY HANDLING
  // ============================================================================

  useEffect(() => {
    const handleVisibilityChange = () => {
      console.log("Visibility changed:", document.visibilityState);
      
      if (document.hidden) {
        console.log("Tab hidden, stopping refresh timer");
        stopTokenRefreshTimer();
      } else if (isUserAuthenticated && hasInitialized) {
        console.log("Tab visible and user authenticated, checking token status");
        
        const expiry = getTokenExpiry();
        const hasAccessToken = getCookieByName("access_token");
        
        if (expiry && hasAccessToken) {
          const timeUntilExpiry = expiry - Date.now();
          const bufferTime = bufferSeconds * 1000;
          
          if (timeUntilExpiry <= bufferTime) {
            console.log("Token expires soon after visibility change, refreshing immediately");
            refreshTokenHandler();
          } else if (timeUntilExpiry > 0) {
            console.log("Token still valid, restarting refresh timer");
            startTokenRefreshTimer();
          }
        } else if (!hasAccessToken) {
          console.log("No access token after visibility change, clearing state");
          clearTokenExpiry();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      stopTokenRefreshTimer();
    };
  }, [
    stopTokenRefreshTimer, 
    startTokenRefreshTimer, 
    isUserAuthenticated, 
    hasInitialized,
    getTokenExpiry, 
    bufferSeconds, 
    refreshTokenHandler,
    clearTokenExpiry
  ]);
};
