/**
 * Token Management Module
 * Handles token expiry, refresh, and storage operations
 * @version 3.0.0
 */

import { apiBase } from '@/API/apiBase';
import { getCookieByName } from '@/comman/helpers';
import { useAppDispatch } from '@/Store/store';
import { resetAuth } from '@/Ver2Designs/Pages/AuthAndOnboard';
import { useCallback, useRef } from 'react';
import {
  isValidFutureTimestamp,
  logDebug,
  logError,
  logInfo,
} from '../../comman/utils';
import { AUTH_STORAGE_KEYS, SESSION_DEFAULTS } from './constants';

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

  const setTokenExpiry = useCallback(
    (expiryTimestamp?: number) => {
      if (
        expiryTimestamp &&
        !isValidFutureTimestamp(
          expiryTimestamp,
          SESSION_DEFAULTS.MAX_FUTURE_TIME_HOURS
        )
      ) {
        logError(
          { provided: expiryTimestamp, now: Date.now() },
          'Invalid expiry timestamp provided'
        );
        expiryTimestamp = undefined;
      }

      const expiry =
        expiryTimestamp || Date.now() + sessionExpireMinutes * 60 * 1000;
      localStorage.setItem(
        AUTH_STORAGE_KEYS.ACCESS_TOKEN_EXPIRY,
        String(expiry)
      );

      console.warn(`[TOKEN MANAGER] Token expiry set to:`, new Date(expiry));
      console.warn(
        `[TOKEN MANAGER] Will refresh in:`,
        Math.round((expiry - Date.now() - bufferSeconds * 1000) / 1000),
        'seconds'
      );

      return expiry;
    },
    [sessionExpireMinutes, bufferSeconds]
  );

  const getTokenExpiry = useCallback((): number | null => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN_EXPIRY);
    if (!stored) return null;

    const expiry = Number(stored);
    const maxPastTime =
      Date.now() - SESSION_DEFAULTS.MAX_FUTURE_TIME_HOURS * 60 * 60 * 1000;

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
  // TOKEN REFRESH SCHEDULING
  // ============================================================================

  const scheduleRefresh = useCallback(
    (expiryTs: number) => {
      clearRefreshTimer();

      if (!expiryTs || isNaN(expiryTs) || expiryTs <= Date.now()) {
        logError(
          { expiryTs, now: Date.now() },
          'Invalid expiry timestamp for scheduling'
        );
        return;
      }

      const msUntilRefresh = expiryTs - Date.now() - bufferSeconds * 1000;
      logDebug(
        'Scheduling token refresh',
        {
          secondsUntilRefresh: Math.max(0, Math.round(msUntilRefresh / 1000)),
          expiry: new Date(expiryTs),
        },
        '[TOKEN REFRESH]'
      );

      if (msUntilRefresh <= 0) {
        // Use setTimeout to avoid circular dependency
        setTimeout(async () => {
          // Direct async call to avoid circular dependency
          await refreshTokenHandler();
        }, 0);
        return;
      }

      const maxScheduleTime =
        SESSION_DEFAULTS.MAX_FUTURE_TIME_HOURS * 60 * 60 * 1000;
      if (msUntilRefresh > maxScheduleTime) {
        logError(
          { msUntilRefresh, maxScheduleTime },
          'Refresh scheduled too far in future'
        );
        return;
      }

      // Simple timer - no complex visibility handling here
      refreshTimerRef.current = window.setTimeout(async () => {
        if (document.visibilityState === 'visible') {
          await refreshTokenHandler();
        } else {
          // Wait for tab to become visible
          const onVisible = async () => {
            if (document.visibilityState === 'visible') {
              document.removeEventListener('visibilitychange', onVisible);
              await refreshTokenHandler();
            }
          };
          document.addEventListener('visibilitychange', onVisible);
        }
      }, msUntilRefresh);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [bufferSeconds, clearRefreshTimer, logError]
  );

  // ============================================================================
  // TOKEN REFRESH LOGIC
  // ============================================================================

  const refreshTokenHandler = useCallback(async (): Promise<boolean> => {
    logDebug('Attempting token refresh', undefined, '[TOKEN REFRESH]');

    if (isRefreshingRef.current || !acquireRefreshLock()) {
      logDebug(
        'Refresh already in progress or locked',
        undefined,
        '[TOKEN REFRESH]'
      );
      return false;
    }

    try {
      isRefreshingRef.current = true;

      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        SESSION_DEFAULTS.FETCH_TIMEOUT_MS
      );

      const deviceId = localStorage.getItem(AUTH_STORAGE_KEYS.DEVICE_ID);
      if (!deviceId) throw new Error('Device ID not found');

      const response = await fetch(
        `${(import.meta as unknown as { env: Record<string, string> }).env.VITE_API_BASE_URL}${refreshEndpoint}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Device-ID': deviceId,
          },
          credentials: 'include',
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (!data || typeof data !== 'object') {
          throw new Error('Invalid response format');
        }

        const newExpiry =
          data.expiresAt || Date.now() + sessionExpireMinutes * 60 * 1000;
        setTokenExpiry(newExpiry);
        localStorage.setItem(
          AUTH_STORAGE_KEYS.LAST_TOKEN_REFRESH,
          String(Date.now())
        );

        logInfo(
          'Token refreshed successfully',
          { nextExpiry: new Date(newExpiry) },
          '[TOKEN REFRESH]'
        );

        // 🚀 CRITICAL: Schedule the next refresh after successful token refresh
        scheduleRefresh(newExpiry);

        return true;
      } else {
        logError(
          { status: response.status, statusText: response.statusText },
          'Token refresh failed',
          '[TOKEN REFRESH]'
        );

        if (response.status === 401 || response.status === 403) {
          clearTokenExpiry();
          dispatch(apiBase.util.resetApiState()); // Clear cache on auth failure
          dispatch(resetAuth());
        }
        return false;
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        logError(err, 'Token refresh timeout', '[TOKEN REFRESH]');
      } else {
        logError(err, 'Token refresh error', '[TOKEN REFRESH]');
      }
      return false;
    } finally {
      isRefreshingRef.current = false;
      releaseRefreshLock();
    }
  }, [
    refreshEndpoint,
    sessionExpireMinutes,
    setTokenExpiry,
    clearTokenExpiry,
    dispatch,
    acquireRefreshLock,
    releaseRefreshLock,
    scheduleRefresh,
  ]);

  const startTokenRefreshTimer = useCallback(() => {
    const expiry = getTokenExpiry();
    const hasAccessToken = getCookieByName('access_token');

    // Clear any existing timer first
    clearRefreshTimer();

    if (expiry && hasAccessToken) {
      const timeUntilExpiry = expiry - Date.now();
      const bufferTime = bufferSeconds * 1000;

      if (timeUntilExpiry <= bufferTime) {
        logInfo(
          'Token expires soon, refreshing immediately',
          undefined,
          '[TOKEN REFRESH]'
        );
        refreshTokenHandler();
      } else {
        scheduleRefresh(expiry);
      }
    } else if (!hasAccessToken) {
      logDebug(
        'No access token, clearing expiry',
        undefined,
        '[TOKEN REFRESH]'
      );
      clearTokenExpiry();
    }
  }, [
    getTokenExpiry,
    scheduleRefresh,
    bufferSeconds,
    refreshTokenHandler,
    clearTokenExpiry,
    clearRefreshTimer,
  ]);

  const stopTokenRefreshTimer = useCallback(() => {
    clearRefreshTimer();
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

    // Debug/Test functions
    forceRefresh: useCallback(() => {
      logInfo('Manual/Force refresh triggered', undefined, '[TOKEN REFRESH]');
      refreshTokenHandler();
    }, [refreshTokenHandler]),

    // Cleanup
    cleanup: useCallback(() => {
      stopTokenRefreshTimer();
      isRefreshingRef.current = false;
      releaseRefreshLock();
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
        refreshTimerRef.current = null;
      }
    }, [stopTokenRefreshTimer, releaseRefreshLock]),
  };
};
