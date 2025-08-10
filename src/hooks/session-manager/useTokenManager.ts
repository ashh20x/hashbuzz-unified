/**
 * Token Management Module
 * Handles token expiry, refresh, and storage operations
 * @version 3.0.0
 */

import { useCallback, useRef } from 'react';
import { useAppDispatch } from '@/Store/store';
import { resetAuth } from '@/Ver2Designs/Pages/AuthAndOnboard';
import { getCookieByName } from '@/Utilities/helpers';
import { AUTH_STORAGE_KEYS, SESSION_DEFAULTS } from './constants';
import { logError, isValidFutureTimestamp } from './utils';

export const useTokenManager = (
  sessionExpireMinutes: number,
  bufferSeconds: number,
  refreshEndpoint: string
) => {
  const dispatch = useAppDispatch();
  const isRefreshingRef = useRef(false);
  const refreshTimerRef = useRef<number | null>(null);

  // ============================================================================
  // LOCK MANAGEMENT
  // ============================================================================

  const acquireRefreshLock = useCallback((): boolean => {
    const lockTime = Date.now();
    const lockKey = `${AUTH_STORAGE_KEYS.REFRESH_LOCK}_${lockTime}`;
    localStorage.setItem(AUTH_STORAGE_KEYS.REFRESH_LOCK, lockKey);
    
    const stored = localStorage.getItem(AUTH_STORAGE_KEYS.REFRESH_LOCK);
    return stored === lockKey;
  }, []);

  const releaseRefreshLock = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEYS.REFRESH_LOCK);
  }, []);

  // ============================================================================
  // TIMER MANAGEMENT
  // ============================================================================

  const clearRefreshTimer = useCallback(() => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
  }, []);

  // ============================================================================
  // TOKEN EXPIRY MANAGEMENT
  // ============================================================================

  const setTokenExpiry = useCallback((expiryTimestamp?: number) => {
    if (expiryTimestamp && !isValidFutureTimestamp(expiryTimestamp, SESSION_DEFAULTS.MAX_FUTURE_TIME_HOURS)) {
      logError(
        { provided: expiryTimestamp, now: Date.now() }, 
        "Invalid expiry timestamp provided"
      );
      expiryTimestamp = undefined;
    }
    
    const expiry = expiryTimestamp || Date.now() + sessionExpireMinutes * 60 * 1000;
    localStorage.setItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN_EXPIRY, String(expiry));
    return expiry;
  }, [sessionExpireMinutes]);

  const getTokenExpiry = useCallback((): number | null => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN_EXPIRY);
    if (!stored) return null;
    
    const expiry = Number(stored);
    const maxPastTime = Date.now() - SESSION_DEFAULTS.MAX_FUTURE_TIME_HOURS * 60 * 60 * 1000;
    
    if (isNaN(expiry) || expiry < maxPastTime) {
      localStorage.removeItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN_EXPIRY);
      return null;
    }
    
    return expiry;
  }, []);

  const clearTokenExpiry = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN_EXPIRY);
    localStorage.removeItem(AUTH_STORAGE_KEYS.LAST_TOKEN_REFRESH);
    releaseRefreshLock();
  }, [releaseRefreshLock]);

  // ============================================================================
  // TOKEN REFRESH LOGIC
  // ============================================================================

  const refreshTokenHandler = useCallback(async (): Promise<boolean> => {
    if (isRefreshingRef.current || !acquireRefreshLock()) {
      console.log("Token refresh already in progress or locked");
      return false;
    }

    try {
      isRefreshingRef.current = true;
      console.log("Refreshing access token...");

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), SESSION_DEFAULTS.FETCH_TIMEOUT_MS);

      const deviceId = localStorage.getItem(AUTH_STORAGE_KEYS.DEVICE_ID);
      if (!deviceId) throw new Error("Device ID not found");

      const response = await fetch(`${(import.meta as any).env.VITE_API_BASE_URL}${refreshEndpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Device-ID": deviceId,
        },
        credentials: "include",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (!data || typeof data !== 'object') {
          throw new Error("Invalid response format");
        }
        
        const newExpiry = data.expiresAt || Date.now() + sessionExpireMinutes * 60 * 1000;
        setTokenExpiry(newExpiry);
        localStorage.setItem(AUTH_STORAGE_KEYS.LAST_TOKEN_REFRESH, String(Date.now()));
        
        console.log("Token refreshed successfully, next expiry:", new Date(newExpiry));
        return true;
      } else {
        logError({ status: response.status, statusText: response.statusText }, "Token refresh failed");
        
        if (response.status === 401 || response.status === 403) {
          clearTokenExpiry();
          dispatch(resetAuth());
        }
        return false;
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        logError(err, "Token refresh timeout");
      } else {
        logError(err, "Token refresh error");
      }
      return false;
    } finally {
      isRefreshingRef.current = false;
      releaseRefreshLock();
    }
  }, [refreshEndpoint, sessionExpireMinutes, setTokenExpiry, clearTokenExpiry, dispatch, acquireRefreshLock, releaseRefreshLock]);

  const scheduleRefresh = useCallback((expiryTs: number) => {
    clearRefreshTimer();
    
    if (!expiryTs || isNaN(expiryTs) || expiryTs <= Date.now()) {
      logError({ expiryTs, now: Date.now() }, "Invalid expiry timestamp for scheduling");
      return;
    }
    
    const msUntilRefresh = expiryTs - Date.now() - bufferSeconds * 1000;
    console.log(`Scheduling token refresh in ${Math.max(0, Math.round(msUntilRefresh / 1000))} seconds`);

    if (msUntilRefresh <= 0) {
      refreshTokenHandler();
      return;
    }

    const maxScheduleTime = SESSION_DEFAULTS.MAX_FUTURE_TIME_HOURS * 60 * 60 * 1000;
    if (msUntilRefresh > maxScheduleTime) {
      logError({ msUntilRefresh, maxScheduleTime }, "Refresh scheduled too far in future");
      return;
    }

    refreshTimerRef.current = window.setTimeout(() => {
      if (document.visibilityState === "visible") {
        refreshTokenHandler();
      } else {
        const onVisible = () => {
          if (document.visibilityState === "visible") {
            document.removeEventListener("visibilitychange", onVisible);
            refreshTokenHandler();
          }
        };
        document.addEventListener("visibilitychange", onVisible);
      }
    }, msUntilRefresh);
  }, [bufferSeconds, refreshTokenHandler, clearRefreshTimer]);

  const startTokenRefreshTimer = useCallback(() => {
    const expiry = getTokenExpiry();
    const hasAccessToken = getCookieByName("access_token");
    
    console.log("Starting token refresh timer:", { expiry, hasAccessToken });
    
    if (expiry && hasAccessToken) {
      const timeUntilExpiry = expiry - Date.now();
      const bufferTime = bufferSeconds * 1000;
      
      if (timeUntilExpiry <= bufferTime) {
        console.log("Token expires soon, refreshing immediately");
        refreshTokenHandler();
      } else {
        scheduleRefresh(expiry);
        console.log("Token refresh timer scheduled for expiry:", new Date(expiry));
      }
    } else if (!hasAccessToken) {
      console.log("No access token found, clearing expiry");
      clearTokenExpiry();
    }
  }, [getTokenExpiry, scheduleRefresh, bufferSeconds, refreshTokenHandler, clearTokenExpiry]);

  const stopTokenRefreshTimer = useCallback(() => {
    clearRefreshTimer();
    console.log("Token refresh timer stopped");
  }, [clearRefreshTimer]);

  // ============================================================================
  // PUBLIC API
  // ============================================================================

  return {
    // Token management functions
    refreshToken: refreshTokenHandler,
    setTokenExpiry,
    clearTokenExpiry,
    getTokenExpiry,
    scheduleRefresh,
    startTokenRefreshTimer,
    stopTokenRefreshTimer,
    
    // State
    isRefreshing: isRefreshingRef.current,
    
    // Cleanup
    cleanup: useCallback(() => {
      stopTokenRefreshTimer();
      isRefreshingRef.current = false;
      releaseRefreshLock();
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
        refreshTimerRef.current = null;
      }
    }, [stopTokenRefreshTimer, releaseRefreshLock])
  };
};
