/**
 * Consolidated React Session Manager Hook
 *
 * Integrates with existing HashBuzz infrastructure:
 * - RTK Query API client (apiBase)
 * - useAuthPingMutation for session validation
 * - Redux auth store for state management
 * - Cookie-based authentication with refresh tokens
 * - Cross-tab synchronization and token refresh
 *
 * @version 4.0.0 - Consolidated & Clean Architecture
 * @author HashBuzz Team
 */

import { setAuthStatus } from '@/Store/appStatusSlice';
import { useAppDispatch, useAppSelector } from '@/Store/store';
import {
  authenticated,
  connectXAccount,
  markAllTokensAssociated,
  resetAuth,
  walletPaired,
} from '@/Ver2Designs/Pages/AuthAndOnboard';
import {
  useAuthPingMutation,
  useRefreshTokenMutation,
} from '@/Ver2Designs/Pages/AuthAndOnboard/api/auth';
import { getCookieByName } from '@/comman/helpers';
import { SessionInitSingleton } from '@/utils/SessionInitSingleton';
import { useAccountId, useWallet } from '@buidlerlabs/hashgraph-react-wallets';
import { HWCConnector } from '@buidlerlabs/hashgraph-react-wallets/connectors';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// ============================================================================
// TYPES & CONSTANTS
// ============================================================================

interface UseAppSessionManagerProps {
  /** Seconds before expiry to trigger refresh (default: 60) */
  bufferSeconds?: number;
  /** Session duration in minutes (default: 15) */
  sessionExpireMinutes?: number;
}

interface SessionState {
  isAuthenticated: boolean;
  isLoading: boolean;
  isRefreshing: boolean;
  hasInitialized: boolean;
  error: string | null;
}

const CONFIG = {
  REFRESH_BUFFER_SECONDS: 60, // 1 minute before expiry
  SESSION_EXPIRE_MINUTES: 15, // 15 minutes default session
  CROSS_TAB_SYNC_KEY: 'hashbuzz_session_sync',
  PING_RETRY_DELAY: 2000, // 2 seconds
  MAX_PING_RETRIES: 1,
  WALLET_THROTTLE_MS: 1000, // 1 second wallet update throttle
} as const;

const STORAGE_KEYS = {
  ACCESS_TOKEN_EXPIRY: 'access_token_expiry',
  DEVICE_ID: 'device_id',
  LAST_TOKEN_REFRESH: 'last_token_refresh',
} as const;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const getOrCreateDeviceId = (): string => {
  let deviceId = localStorage.getItem(STORAGE_KEYS.DEVICE_ID);
  if (!deviceId) {
    deviceId = crypto.randomUUID();
    localStorage.setItem(STORAGE_KEYS.DEVICE_ID, deviceId);
  }
  return deviceId;
};

const getTokenExpiry = (): number | null => {
  const expiry = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN_EXPIRY);
  return expiry ? parseInt(expiry, 10) : null;
};

const setTokenExpiry = (sessionExpireMinutes: number): number => {
  const expiryTime = Date.now() + sessionExpireMinutes * 60 * 1000;
  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN_EXPIRY, expiryTime.toString());
  localStorage.setItem(STORAGE_KEYS.LAST_TOKEN_REFRESH, Date.now().toString());
  return expiryTime;
};

const clearTokenExpiry = (): void => {
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN_EXPIRY);
  localStorage.removeItem(STORAGE_KEYS.LAST_TOKEN_REFRESH);
};

const isTokenExpiringSoon = (bufferSeconds: number): boolean => {
  const expiry = getTokenExpiry();
  if (!expiry) return true;

  return Date.now() + bufferSeconds * 1000 >= expiry;
};

// ============================================================================
// MAIN HOOK
// ============================================================================

export const useAppSessionManager = ({
  bufferSeconds = CONFIG.REFRESH_BUFFER_SECONDS,
  sessionExpireMinutes = CONFIG.SESSION_EXPIRE_MINUTES,
}: UseAppSessionManagerProps = {}) => {
  // Track initialization to reduce console noise
  const initLogRef = useRef(false);

  if (process.env.NODE_ENV === 'development' && !initLogRef.current) {
    console.warn('[SESSION MANAGER] Hook initialized');
    initLogRef.current = true;
  }

  // ============================================================================
  // HOOKS & STATE
  // ============================================================================

  const dispatch = useAppDispatch();

  // RTK Query hooks for API calls
  const [sessionCheckPing] = useAuthPingMutation();
  const [refreshTokenMutation] = useRefreshTokenMutation();

  // Redux state
  const {
    wallet: { isPaired },
    auth: { isAuthenticated: _isAuthenticated },
  } = useAppSelector(s => s.auth.userAuthAndOnBoardSteps);

  // Wallet hooks
  const wallet = useWallet();
  const accountId = useAccountId();

  // Extract string value from accountId to avoid passing Proxy object to React deps
  const accountIdString = useMemo(() => {
    // Handle case when wallet extension is not available
    if (!accountId) return '';

    // If it's already a string, return it
    if (typeof accountId === 'string') return accountId;

    // Try to extract from common patterns
    if (accountId?.data && typeof accountId.data === 'string') {
      return accountId.data;
    }

    // Check if it has a valueOf method that returns a string
    if (typeof accountId.valueOf === 'function') {
      const value = accountId.valueOf();
      if (typeof value === 'string') return value;
    }

    // Check if toString returns something meaningful (not [object Object])
    const stringValue = String(accountId);
    if (stringValue !== '[object Object]' && stringValue !== 'undefined') {
      return stringValue;
    }

    // If all else fails, return empty string (no wallet extension case)
    return '';
  }, [accountId]);

  // Local component state
  const [sessionState, setSessionState] = useState<SessionState>({
    isAuthenticated: false,
    isLoading: true,
    isRefreshing: false,
    hasInitialized: false,
    error: null,
  });

  // Refs for managing timers and preventing race conditions
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);
  const refreshInProgressRef = useRef<boolean>(false);
  const retryCountRef = useRef<number>(0);
  const walletThrottleRef = useRef<NodeJS.Timeout | null>(null);
  const lastWalletStatusRef = useRef<string>('');

  // ============================================================================
  // INTERNAL TOKEN REFRESH FUNCTION
  // ============================================================================

  const performTokenRefresh = useCallback(async (): Promise<boolean> => {
    if (refreshInProgressRef.current) {
      console.warn('[SESSION MANAGER] Refresh already in progress');
      return false;
    }

    try {
      console.warn('[SESSION MANAGER] Starting token refresh...');
      refreshInProgressRef.current = true;

      setSessionState(prev => ({ ...prev, isRefreshing: true, error: null }));

      // Broadcast refresh start to other tabs
      localStorage.setItem(
        CONFIG.CROSS_TAB_SYNC_KEY,
        JSON.stringify({
          type: 'REFRESH_START',
          timestamp: Date.now(),
        })
      );

      // Use RTK Query refresh mutation (refresh token handled in httpOnly cookie)
      const result = await refreshTokenMutation().unwrap();
      console.warn('[SESSION MANAGER] Token refresh successful:', result);

      // Update token expiry and schedule next refresh
      const newExpiry = setTokenExpiry(sessionExpireMinutes);

      // Clear existing timer and set new one
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }

      const nextRefreshTime = newExpiry - bufferSeconds * 1000 - Date.now();
      if (nextRefreshTime > 0) {
        console.warn(
          `[SESSION MANAGER] Scheduling next refresh in ${Math.round(nextRefreshTime / 1000)}s`
        );
        refreshTimerRef.current = setTimeout(() => {
          performTokenRefresh();
        }, nextRefreshTime);
      }

      // Broadcast success to other tabs
      localStorage.setItem(
        CONFIG.CROSS_TAB_SYNC_KEY,
        JSON.stringify({
          type: 'REFRESH_SUCCESS',
          timestamp: Date.now(),
          expiresAt: newExpiry,
        })
      );

      retryCountRef.current = 0;
      return true;
    } catch (error) {
      console.error('[SESSION MANAGER] Token refresh failed:', error);

      // On refresh failure, logout user
      console.error('[SESSION MANAGER] Refresh failed, logging out user');

      // Clear refresh timer
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
        refreshTimerRef.current = null;
      }

      // Clear local storage
      clearTokenExpiry();

      // Reset Redux state
      dispatch(resetAuth());

      // Broadcast logout to other tabs
      localStorage.setItem(
        CONFIG.CROSS_TAB_SYNC_KEY,
        JSON.stringify({
          type: 'LOGOUT',
          timestamp: Date.now(),
        })
      );

      setSessionState({
        isAuthenticated: false,
        isLoading: false,
        isRefreshing: false,
        hasInitialized: true,
        error: 'Token refresh failed',
      });

      return false;
    } finally {
      refreshInProgressRef.current = false;
      setSessionState(prev => ({ ...prev, isRefreshing: false }));
    }
  }, [refreshTokenMutation, sessionExpireMinutes, bufferSeconds, dispatch]);

  // ============================================================================
  // CORE SESSION FUNCTIONS
  // ============================================================================

  /**
   * Ping session to validate current authentication
   */
  const pingSession = useCallback(async (): Promise<boolean> => {
    try {
      console.warn('[SESSION MANAGER] Pinging session...');

      const result = await sessionCheckPing().unwrap();
      console.warn('[SESSION MANAGER] Ping result:', result);

      if (!result || typeof result !== 'object') {
        console.error(
          '[SESSION MANAGER] Invalid ping response format:',
          result
        );
        return false;
      }

      const {
        isAuthenticated: serverAuthStatus,
        connectedXAccount,
        status,
        wallet_id,
      } = result;

      console.warn('[SESSION MANAGER] Server auth status:', {
        serverAuthStatus,
        status,
        wallet_id,
        connectedXAccount,
      });

      if (serverAuthStatus && status === 'active') {
        // Update token expiry on successful ping
        setTokenExpiry(sessionExpireMinutes);

        // Update Redux state for returning user
        console.warn('[SESSION MANAGER] Restoring user session state:', {
          wallet_id,
          connectedXAccount,
        });

        // For returning users, we need to restore their full onboarding state
        if (wallet_id) {
          dispatch(walletPaired(wallet_id));
        }

        dispatch(authenticated());

        if (connectedXAccount) {
          dispatch(connectXAccount(connectedXAccount));
        }

        // For now, assume returning users have tokens associated
        // TODO: Get token association status from ping response
        dispatch(markAllTokensAssociated());

        console.warn('[SESSION MANAGER] Session validated successfully');
        return true;
      }

      console.warn(
        '[SESSION MANAGER] Server reports user not authenticated or inactive session:',
        {
          serverAuthStatus,
          status,
        }
      );
      return false;
    } catch (error: unknown) {
      const apiError = error as {
        message?: string;
        status?: number;
        data?: unknown;
      };
      console.error('[SESSION MANAGER] Ping failed with error:', {
        error: apiError?.message,
        status: apiError?.status,
        data: apiError?.data,
      });

      // Check if it's a 401/403 error which indicates authentication failure
      if (apiError?.status === 401 || apiError?.status === 403) {
        console.warn(
          '[SESSION MANAGER] Authentication error - clearing session'
        );
        return false;
      }

      // For network or other errors, retry logic is handled by the caller
      retryCountRef.current++;
      if (retryCountRef.current < CONFIG.MAX_PING_RETRIES) {
        console.warn(
          `[SESSION MANAGER] Retrying ping (${retryCountRef.current}/${CONFIG.MAX_PING_RETRIES})`
        );
        await new Promise(resolve =>
          setTimeout(resolve, CONFIG.PING_RETRY_DELAY)
        );
        return pingSession();
      }

      console.error('[SESSION MANAGER] Ping failed after max retries');
      return false;
    }
  }, [sessionCheckPing, dispatch, sessionExpireMinutes]);

  /**
   * Initialize session on app startup
   */
  const initializeSession = useCallback(async () => {
    // CRITICAL: Check singleton first to prevent duplicate initialization across StrictMode remounts
    if (
      SessionInitSingleton.isInitializing() ||
      SessionInitSingleton.hasInitialized()
    ) {
      console.warn(
        '[SESSION MANAGER] Already initialized or initializing (singleton check) - skipping'
      );
      return;
    }

    // Mark as started in singleton
    if (!SessionInitSingleton.startInitialization()) {
      console.warn(
        '[SESSION MANAGER] Failed to start initialization (race condition) - skipping'
      );
      return;
    }

    try {
      console.warn('[SESSION MANAGER] Initializing session...');
      setSessionState(prev => ({ ...prev, isLoading: true, error: null }));

      // Ensure device ID exists
      getOrCreateDeviceId();

      // Check if we have authentication cookies (for debugging only)
      // Note: httpOnly cookies won't be visible here but will be sent automatically with API calls
      const hasToken = !!getCookieByName('access_token');
      const hasRefreshToken = !!getCookieByName('refresh_token');

      console.warn(
        '[SESSION MANAGER] Cookie check (client-side visible only):',
        {
          hasToken,
          hasRefreshToken,
          note: 'httpOnly cookies not visible here but may still exist',
        }
      );

      // Always attempt ping first since httpOnly session cookies may exist
      // even if not visible to client-side JavaScript
      console.warn(
        '[SESSION MANAGER] Attempting session validation with server (checking for httpOnly cookies)...'
      );

      // Try ping first - this will work if httpOnly session cookies exist
      const pingSuccessful = await pingSession();

      if (pingSuccessful) {
        console.warn(
          '[SESSION MANAGER] Ping successful - session restored from httpOnly cookies'
        );

        // Schedule refresh timer if needed
        const expiry = getTokenExpiry();
        if (expiry) {
          const nextRefreshTime = expiry - bufferSeconds * 1000 - Date.now();
          if (nextRefreshTime > 0) {
            console.warn(
              `[SESSION MANAGER] Scheduling refresh in ${Math.round(nextRefreshTime / 1000)}s`
            );
            refreshTimerRef.current = setTimeout(() => {
              performTokenRefresh();
            }, nextRefreshTime);
          }
        }

        setSessionState({
          isAuthenticated: true,
          isLoading: false,
          isRefreshing: false,
          hasInitialized: true,
          error: null,
        });

        // Mark as completed in singleton
        SessionInitSingleton.completeInitialization();
        return;
      }

      // Ping failed, check if we have visible cookies for refresh attempt
      if (hasToken || hasRefreshToken) {
        console.warn(
          '[SESSION MANAGER] Ping failed but found client-side cookies, checking if token refresh needed...'
        );

        // Check if token is expiring and try refresh
        const shouldRefresh = isTokenExpiringSoon(bufferSeconds);

        if (shouldRefresh) {
          console.warn(
            '[SESSION MANAGER] Token expiring soon - attempting refresh...'
          );
          const refreshSuccessful = await performTokenRefresh();

          if (refreshSuccessful) {
            console.warn(
              '[SESSION MANAGER] Token refresh successful, retrying ping...'
            );
            const retryPingSuccessful = await pingSession();

            setSessionState({
              isAuthenticated: retryPingSuccessful,
              isLoading: false,
              isRefreshing: false,
              hasInitialized: true,
              error: retryPingSuccessful
                ? null
                : 'Session validation failed after refresh',
            });

            // Mark as completed in singleton
            SessionInitSingleton.completeInitialization();
            return;
          } else {
            console.warn('[SESSION MANAGER] Token refresh failed');
          }
        }
      }

      // No valid session found
      console.warn(
        '[SESSION MANAGER] No valid session found - user needs to authenticate'
      );
      setSessionState({
        isAuthenticated: false,
        isLoading: false,
        isRefreshing: false,
        hasInitialized: true,
        error: null,
      });

      // Mark as completed in singleton
      SessionInitSingleton.completeInitialization();
    } catch (error) {
      console.error('[SESSION MANAGER] Session initialization failed:', error);
      setSessionState({
        isAuthenticated: false,
        isLoading: false,
        isRefreshing: false,
        hasInitialized: true,
        error: error instanceof Error ? error.message : 'Initialization failed',
      });

      // Mark as completed even on error to allow retry
      SessionInitSingleton.completeInitialization();
    }
  }, [pingSession, performTokenRefresh, bufferSeconds]);

  /**
   * Logout user and cleanup session
   */
  const logout = useCallback(async () => {
    try {
      console.warn('[SESSION MANAGER] Logging out...');

      // Clear refresh timer
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
        refreshTimerRef.current = null;
      }

      // Clear wallet throttle timer
      if (walletThrottleRef.current) {
        clearTimeout(walletThrottleRef.current);
        walletThrottleRef.current = null;
      }

      // Clear local storage
      clearTokenExpiry();

      // Reset Redux state
      dispatch(resetAuth());

      // Broadcast logout to other tabs
      localStorage.setItem(
        CONFIG.CROSS_TAB_SYNC_KEY,
        JSON.stringify({
          type: 'LOGOUT',
          timestamp: Date.now(),
        })
      );

      setSessionState({
        isAuthenticated: false,
        isLoading: false,
        isRefreshing: false,
        hasInitialized: true,
        error: null,
      });

      // Reset singleton to allow re-initialization after logout
      SessionInitSingleton.reset();
    } catch (error) {
      console.error('[SESSION MANAGER] Logout error:', error);
    }
  }, [dispatch]);

  // ============================================================================
  // WALLET INTEGRATION
  // ============================================================================

  /**
   * Handle wallet status changes with throttling
   */
  const handleWalletUpdate = useCallback(() => {
    if (walletThrottleRef.current) {
      clearTimeout(walletThrottleRef.current);
    }

    walletThrottleRef.current = setTimeout(() => {
      const isWalletConnected = wallet?.isConnected ?? false;
      const currentAccountId = accountIdString;
      const walletReady = wallet?.connector instanceof HWCConnector;

      const currentStatus = `${isWalletConnected}-${currentAccountId}-${walletReady}`;

      if (currentStatus === lastWalletStatusRef.current) {
        return; // No change in wallet status
      }

      lastWalletStatusRef.current = currentStatus;

      // Enhanced logging for debugging wallet extension availability (dev only)
      if (!accountIdString && process.env.NODE_ENV === 'development') {
        console.warn(
          '[SESSION MANAGER] No account ID available - wallet extension may not be installed'
        );
      }

      if (process.env.NODE_ENV === 'development') {
        console.warn('[SESSION MANAGER] Wallet status changed:', {
          isConnected: isWalletConnected,
          accountId: currentAccountId,
          walletReady,
        });
      }

      if (isWalletConnected && currentAccountId && walletReady) {
        console.warn(
          '[SESSION MANAGER] Wallet connected, dispatching walletPaired'
        );
        dispatch(walletPaired(currentAccountId));
      } else if (isPaired && !isWalletConnected) {
        console.warn('[SESSION MANAGER] Wallet disconnected, resetting auth');
        dispatch(resetAuth());
      }
    }, CONFIG.WALLET_THROTTLE_MS);
  }, [wallet, accountIdString, dispatch, isPaired]);
  // Note: accountId is handled via accountIdString useMemo dependency

  // ============================================================================
  // CROSS-TAB SYNCHRONIZATION
  // ============================================================================

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key !== CONFIG.CROSS_TAB_SYNC_KEY || !event.newValue) {
        return;
      }

      try {
        const syncData = JSON.parse(event.newValue);
        console.warn('[SESSION MANAGER] Cross-tab sync event:', syncData);

        switch (syncData.type) {
          case 'REFRESH_SUCCESS':
            if (!refreshInProgressRef.current && syncData.expiresAt) {
              // Schedule next refresh based on the updated expiry time
              const nextRefreshTime =
                syncData.expiresAt - bufferSeconds * 1000 - Date.now();
              if (nextRefreshTime > 0) {
                if (refreshTimerRef.current) {
                  clearTimeout(refreshTimerRef.current);
                }
                refreshTimerRef.current = setTimeout(() => {
                  performTokenRefresh();
                }, nextRefreshTime);
              }
              setSessionState(prev => ({ ...prev, isAuthenticated: true }));
            }
            break;

          case 'LOGOUT':
            if (refreshTimerRef.current) {
              clearTimeout(refreshTimerRef.current);
              refreshTimerRef.current = null;
            }
            setSessionState({
              isAuthenticated: false,
              isLoading: false,
              isRefreshing: false,
              hasInitialized: true,
              error: null,
            });
            dispatch(resetAuth());
            break;
        }
      } catch (error) {
        console.error('[SESSION MANAGER] Cross-tab sync error:', error);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [bufferSeconds, performTokenRefresh, dispatch]);

  // ============================================================================
  // TAB VISIBILITY OPTIMIZATION
  // ============================================================================

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (
        document.visibilityState === 'visible' &&
        sessionState.isAuthenticated
      ) {
        console.warn(
          '[SESSION MANAGER] Tab became visible, checking session...'
        );

        if (isTokenExpiringSoon(bufferSeconds)) {
          performTokenRefresh();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () =>
      document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [sessionState.isAuthenticated, performTokenRefresh, bufferSeconds]);

  // ============================================================================
  // LIFECYCLE EFFECTS
  // ============================================================================

  /**
   * Initialize session on app startup (regardless of wallet status)
   */
  useEffect(() => {
    if (!sessionState.hasInitialized) {
      initializeSession();
    }
  }, [sessionState.hasInitialized, initializeSession]);

  /**
   * Handle wallet status changes
   */
  useEffect(() => {
    handleWalletUpdate();
  }, [handleWalletUpdate]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
      if (walletThrottleRef.current) {
        clearTimeout(walletThrottleRef.current);
      }
    };
  }, []);

  // ============================================================================
  // REDUX INTEGRATION
  // ============================================================================

  useEffect(() => {
    dispatch(
      setAuthStatus({
        isLoading: sessionState.isLoading,
        isAppReady: sessionState.hasInitialized && !sessionState.isLoading,
        shouldShowSplash:
          !sessionState.hasInitialized || sessionState.isLoading,
      })
    );
  }, [dispatch, sessionState.isLoading, sessionState.hasInitialized]);

  // ============================================================================
  // PUBLIC API
  // ============================================================================

  const isUserAuthenticated = sessionState.isAuthenticated && isPaired;

  // Memoize the return object to prevent unnecessary re-renders
  return useMemo(
    () => ({
      // Authentication state
      isAuthenticated: sessionState.isAuthenticated,
      isLoading: sessionState.isLoading,
      isRefreshing: sessionState.isRefreshing,
      hasInitialized: sessionState.hasInitialized,
      error: sessionState.error,
      isUserAuthenticated,

      // Computed states for UI
      isAppReady: sessionState.hasInitialized && !sessionState.isLoading,
      shouldShowSplash: !sessionState.hasInitialized || sessionState.isLoading,

      // Actions
      refreshToken: performTokenRefresh,
      logout,
      pingSession,
      retryInitialization: initializeSession,

      // Legacy compatibility for existing components
      forceRefresh: performTokenRefresh,
      setTokenExpiry: () => setTokenExpiry(sessionExpireMinutes),
      clearTokenExpiry,
      getTokenExpiry,
    }),
    [
      sessionState.isAuthenticated,
      sessionState.isLoading,
      sessionState.isRefreshing,
      sessionState.hasInitialized,
      sessionState.error,
      isUserAuthenticated,
      performTokenRefresh,
      logout,
      pingSession,
      initializeSession,
      sessionExpireMinutes,
    ]
  );
};

export default useAppSessionManager;
