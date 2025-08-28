/**
 * Enhanced React Session Manager Hook
 *
 * This hook provides comprehensive session management for a React application with:
 * - Automatic token refresh with cross-tab synchronization
 * - Wallet connection state management with throttling
 * - Token association synchronization
 * - Enhanced error handling and security measures
 * - Tab visibility optimization for performance
 * - Page reload wallet state recovery
 *
 * Key optimizations:
 * - Modular organization with clear sections
 * - Constants extracted for maintainability
 * - Enhanced TypeScript typing
 * - Improved error handling with security considerations
 * - Better performance with throttling and debouncing
 * - Cross-tab synchronization for consistent state
 * - Memory leak prevention with proper cleanup
 * - Page reload resilience for wallet connections
 *
 * @author HashBuzz Team
 * @version 2.1.0 - Fixed page reload wallet sync issue
 */

import { useLazyGetAccountTokensQuery } from '@/API/mirrorNodeAPI';
import { useLazyGetCurrentUserQuery } from '@/API/user';
import { getCookieByName } from '@/comman/helpers';
import { useAppDispatch, useAppSelector } from '@/Store/store';
import {
  authenticated,
  connectXAccount,
  markAllTokensAssociated,
  resetAuth,
  setTokens,
  walletPaired,
} from '@/Ver2Designs/Pages/AuthAndOnboard';
import { useAuthPingMutation } from '@/Ver2Designs/Pages/AuthAndOnboard/api/auth';
import { useAccountId, useWallet } from '@buidlerlabs/hashgraph-react-wallets';
import { HWCConnector } from '@buidlerlabs/hashgraph-react-wallets/connectors';
import { useCallback, useEffect, useRef, useState } from 'react';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface UseAppSessionManagerProps {
  /** API endpoint for token refresh (default: "/auth/refresh-token") */
  refreshEndpoint?: string;
  /** Seconds before expiry to trigger refresh (default: 60) */
  bufferSeconds?: number;
  /** Session duration in minutes (default: 15) */
  sessionExpireMinutes?: number;
}

interface WalletStatus {
  isConnected: boolean;
  extensionReady: boolean;
  accountID?: string;
}

interface SessionValidationResult {
  isAuthenticated: boolean;
  connectedXAccount?: string;
}

// ============================================================================
// CONSTANTS & CONFIGURATION
// ============================================================================

const DEFAULTS = {
  REFRESH_ENDPOINT: '/auth/refresh-token',
  BUFFER_SECONDS: 60,
  SESSION_EXPIRE_MINUTES: 15,
  NAVIGATION_THROTTLE_MS: 1000,
  FETCH_TIMEOUT_MS: 10000,
  INITIALIZATION_DELAY_MS: 1000,
  RETRY_DELAY_MS: 2000,
  MAX_FUTURE_TIME_HOURS: 24,
} as const;

export const AUTH_STORAGE_KEYS = {
  ACCESS_TOKEN_EXPIRY: 'access_token_expiry',
  LAST_TOKEN_REFRESH: 'last_token_refresh',
  REFRESH_LOCK: 'token_refresh_lock',
  DEVICE_ID: 'device_id',
  APP_CONFIG: 'app_config',
} as const;

// ============================================================================
// MAIN HOOK
// ============================================================================

export const useAppSessionManager = ({
  refreshEndpoint = DEFAULTS.REFRESH_ENDPOINT,
  bufferSeconds = DEFAULTS.BUFFER_SECONDS,
  sessionExpireMinutes = DEFAULTS.SESSION_EXPIRE_MINUTES,
}: UseAppSessionManagerProps = {}) => {
  // ============================================================================
  // HOOKS & STATE
  // ============================================================================

  const dispatch = useAppDispatch();
  const [sessionCheckPing] = useAuthPingMutation();
  const [getCurrentUser] = useLazyGetCurrentUserQuery();
  const [getAccountTokens] = useLazyGetAccountTokensQuery();

  // Redux state selectors
  const {
    wallet: { isPaired },
    auth: { isAuthenticated },
  } = useAppSelector(s => s.auth.userAuthAndOnBoardSteps);
  const isUserAuthenticated = isPaired && isAuthenticated;

  // Wallet connection state
  const { isConnected, extensionReady } = useWallet(HWCConnector);
  const { data: accountID } = useAccountId();

  // Component state
  const [hasInitialized, setHasInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);

  // Refs for persistent state
  const lastWalletStatus = useRef<WalletStatus | null>(null);
  const isRefreshingRef = useRef(false);
  const refreshTimerRef = useRef<number | null>(null);
  const initializationTimeoutRef = useRef<number | null>(null);
  const lastNavigationRef = useRef<number>(0);

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================
  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  /**
   * Logs errors safely - only in development mode for security
   */
  const logError = useCallback(
    (error: any, message: string = 'Operation failed') => {
      if (process.env.NODE_ENV === 'development') {
        console.error(message, error);
      } else {
        console.error(message);
      }
    },
    []
  );

  /**
   * Acquires a cross-tab refresh lock to prevent concurrent token refreshes
   */
  const acquireRefreshLock = useCallback((): boolean => {
    const lockTime = Date.now();
    const lockKey = `${AUTH_STORAGE_KEYS.REFRESH_LOCK}_${lockTime}`;
    localStorage.setItem(AUTH_STORAGE_KEYS.REFRESH_LOCK, lockKey);

    // Brief delay to handle race conditions
    const stored = localStorage.getItem(AUTH_STORAGE_KEYS.REFRESH_LOCK);
    return stored === lockKey;
  }, []);

  /**
   * Releases the cross-tab refresh lock
   */
  const releaseRefreshLock = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEYS.REFRESH_LOCK);
  }, []);

  /**
   * Clears the refresh timer if it exists
   */
  const clearRefreshTimer = useCallback(() => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
  }, []);

  // ============================================================================
  // TOKEN EXPIRY MANAGEMENT
  // ============================================================================

  /**
   * Sets token expiry timestamp with validation
   */
  const setTokenExpiry = useCallback(
    (expiryTimestamp?: number) => {
      // Validate timestamp - must be in future but not more than 24 hours
      if (expiryTimestamp) {
        const now = Date.now();
        const maxFutureTime =
          now + DEFAULTS.MAX_FUTURE_TIME_HOURS * 60 * 60 * 1000;

        if (expiryTimestamp < now || expiryTimestamp > maxFutureTime) {
          logError(
            { provided: expiryTimestamp, now, max: maxFutureTime },
            'Invalid expiry timestamp provided'
          );
          expiryTimestamp = undefined;
        }
      }

      const expiry =
        expiryTimestamp || Date.now() + sessionExpireMinutes * 60 * 1000;
      localStorage.setItem(
        AUTH_STORAGE_KEYS.ACCESS_TOKEN_EXPIRY,
        String(expiry)
      );
      return expiry;
    },
    [sessionExpireMinutes, logError]
  );

  /**
   * Gets token expiry timestamp with validation
   */
  const getTokenExpiry = useCallback((): number | null => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN_EXPIRY);
    if (!stored) return null;

    const expiry = Number(stored);
    // Validate stored value is a valid number and not too old
    if (
      isNaN(expiry) ||
      expiry < Date.now() - DEFAULTS.MAX_FUTURE_TIME_HOURS * 60 * 60 * 1000
    ) {
      localStorage.removeItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN_EXPIRY);
      return null;
    }

    return expiry;
  }, []);

  /**
   * Clears all token-related storage
   */
  const clearTokenExpiry = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN_EXPIRY);
    localStorage.removeItem(AUTH_STORAGE_KEYS.LAST_TOKEN_REFRESH);
    releaseRefreshLock();
  }, [releaseRefreshLock]);

  // ============================================================================
  // TOKEN REFRESH LOGIC
  // ============================================================================
  // ============================================================================
  // TOKEN REFRESH LOGIC
  // ============================================================================

  /**
   * Handles token refresh with enhanced security and error handling
   */
  const refreshTokenHandler = useCallback(async (): Promise<boolean> => {
    if (isRefreshingRef.current) return false;

    // Acquire lock for cross-tab synchronization
    if (!acquireRefreshLock()) {
      console.log('Another tab is already refreshing token');
      return false;
    }

    try {
      isRefreshingRef.current = true;
      console.log('Refreshing access token...');

      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        DEFAULTS.FETCH_TIMEOUT_MS
      );

      const deviceId = localStorage.getItem(AUTH_STORAGE_KEYS.DEVICE_ID);
      if (!deviceId) {
        throw new Error('Device ID not found');
      }

      const response = await fetch(
        `${(import.meta as any).env.VITE_API_BASE_URL}${refreshEndpoint}`,
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

        // Validate response data
        if (!data || typeof data !== 'object') {
          throw new Error('Invalid response format');
        }

        const newExpiry =
          data.expiresAt || Date.now() + sessionExpireMinutes * 60 * 1000;

        // Update localStorage with new expiry
        setTokenExpiry(newExpiry);
        localStorage.setItem(
          AUTH_STORAGE_KEYS.LAST_TOKEN_REFRESH,
          String(Date.now())
        );

        // Schedule next refresh
        scheduleRefresh(newExpiry);

        console.log(
          'Token refreshed successfully, next expiry:',
          new Date(newExpiry)
        );
        return true;
      } else {
        logError(
          { status: response.status, statusText: response.statusText },
          'Token refresh failed'
        );

        if (response.status === 401 || response.status === 403) {
          // Clear session data on auth failure
          clearTokenExpiry();
          dispatch(resetAuth());
        }
        return false;
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        logError(err, 'Token refresh timeout');
      } else {
        logError(err, 'Token refresh error');
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
    logError,
  ]);

  /**
   * Schedules the next token refresh based on expiry time
   */
  const scheduleRefresh = useCallback(
    (expiryTs: number) => {
      clearRefreshTimer();

      // Validate expiry timestamp
      if (!expiryTs || isNaN(expiryTs) || expiryTs <= Date.now()) {
        logError(
          { expiryTs, now: Date.now() },
          'Invalid expiry timestamp for scheduling'
        );
        return;
      }

      const now = Date.now();
      const msUntilRefresh = expiryTs - now - bufferSeconds * 1000;

      console.log(
        `Scheduling token refresh in ${Math.max(0, Math.round(msUntilRefresh / 1000))} seconds`
      );

      if (msUntilRefresh <= 0) {
        // Token expired or expires very soon, refresh immediately
        refreshTokenHandler();
        return;
      }

      // Prevent scheduling too far in the future (max 24 hours)
      const maxScheduleTime = DEFAULTS.MAX_FUTURE_TIME_HOURS * 60 * 60 * 1000;
      if (msUntilRefresh > maxScheduleTime) {
        logError(
          { msUntilRefresh, maxScheduleTime },
          'Refresh scheduled too far in future'
        );
        return;
      }

      refreshTimerRef.current = window.setTimeout(() => {
        if (document.visibilityState === 'visible') {
          refreshTokenHandler();
        } else {
          // Wait until tab becomes active to refresh
          const onVisible = () => {
            if (document.visibilityState === 'visible') {
              document.removeEventListener('visibilitychange', onVisible);
              refreshTokenHandler();
            }
          };
          document.addEventListener('visibilitychange', onVisible);
        }
      }, msUntilRefresh);
    },
    [bufferSeconds, refreshTokenHandler, clearRefreshTimer, logError]
  );

  /**
   * Starts the token refresh timer based on current expiry
   */
  const startTokenRefreshTimer = useCallback(() => {
    const expiry = getTokenExpiry();
    const hasAccessToken = getCookieByName('access_token');

    console.log('Starting token refresh timer:', { expiry, hasAccessToken });

    if (expiry && hasAccessToken) {
      // Check if token is already expired or close to expiry
      const timeUntilExpiry = expiry - Date.now();
      const bufferTime = bufferSeconds * 1000;

      if (timeUntilExpiry <= bufferTime) {
        console.log('Token expires soon, refreshing immediately');
        refreshTokenHandler();
      } else {
        scheduleRefresh(expiry);
        console.log(
          'Token refresh timer scheduled for expiry:',
          new Date(expiry)
        );
      }
    } else if (!hasAccessToken) {
      console.log('No access token found, clearing expiry');
      clearTokenExpiry();
    }
  }, [
    getTokenExpiry,
    scheduleRefresh,
    bufferSeconds,
    refreshTokenHandler,
    clearTokenExpiry,
  ]);

  /**
   * Stops the token refresh timer
   */
  const stopTokenRefreshTimer = useCallback(() => {
    clearRefreshTimer();
    console.log('Token refresh timer stopped');
  }, [clearRefreshTimer]);

  // ============================================================================
  // WALLET SYNC & TOKEN ASSOCIATIONS
  // ============================================================================
  // ============================================================================
  // WALLET SYNC & TOKEN ASSOCIATIONS
  // ============================================================================

  /**
   * Syncs token associations between contract and user wallet
   */
  const syncTokenAssociations = useCallback(async () => {
    try {
      const user = await getCurrentUser().unwrap();

      // Validate user data
      if (!user || !user.config || !user.hedera_wallet_id) {
        throw new Error('Invalid user data received');
      }

      const { contractAddress } = user.config;
      const userWalletId = user.hedera_wallet_id;

      // Validate addresses
      if (!contractAddress || !userWalletId) {
        throw new Error('Missing contract or wallet address');
      }

      localStorage.setItem(
        AUTH_STORAGE_KEYS.APP_CONFIG,
        JSON.stringify(user.config)
      );

      const [contractTokensRes, userTokensRes] = await Promise.all([
        getAccountTokens(contractAddress).unwrap(),
        getAccountTokens(userWalletId).unwrap(),
      ]);

      const contractTokens = contractTokensRes?.tokens || [];
      const userTokens = userTokensRes?.tokens || [];

      // Validate token arrays
      if (!Array.isArray(contractTokens) || !Array.isArray(userTokens)) {
        throw new Error('Invalid token data format');
      }

      const isAllAssociated =
        contractTokens.length > 0 &&
        contractTokens.every(
          ct =>
            ct &&
            ct.token_id &&
            userTokens.some(
              ut =>
                ut && ut.token_id && String(ut.token_id) === String(ct.token_id)
            )
        );

      console.log('Token association sync:', {
        isAllAssociated,
        contractTokens: contractTokens.length,
        userTokens: userTokens.length,
      });

      dispatch(setTokens(contractTokens));
      if (isAllAssociated) dispatch(markAllTokensAssociated());
    } catch (error) {
      logError(error, 'Token association sync failed');
    }
  }, [getCurrentUser, getAccountTokens, dispatch, logError]);

  // ============================================================================
  // SESSION VALIDATION
  // ============================================================================

  /**
   * Validates current session and initializes auth state
   */
  const validateSession = useCallback(async () => {
    if (hasInitialized || isInitializing) return;

    // Prevent multiple simultaneous initialization attempts
    setIsInitializing(true);

    // Clear any existing initialization timeout
    if (initializationTimeoutRef.current) {
      clearTimeout(initializationTimeoutRef.current);
    }

    try {
      console.log('Starting session validation...');

      // Add a small delay to ensure wallet state is settled
      await new Promise(resolve => setTimeout(resolve, 500));

      const result = await sessionCheckPing().unwrap();

      // Validate response structure
      if (!result || typeof result !== 'object') {
        throw new Error('Invalid session response format');
      }

      const { isAuthenticated, connectedXAccount }: SessionValidationResult =
        result;

      console.log('Session validation result:', {
        isAuthenticated,
        connectedXAccount,
      });

      if (isAuthenticated) {
        // Set expiry BEFORE dispatching authenticated to ensure token management is ready
        const expiry = setTokenExpiry();
        console.log('Token expiry set to:', new Date(expiry));

        dispatch(authenticated());

        // Start refresh timer after a brief delay to ensure state is updated
        setTimeout(() => {
          startTokenRefreshTimer();
        }, 100);
      } else {
        // Clear any existing token data for unauthenticated users
        clearTokenExpiry();
      }

      if (connectedXAccount && typeof connectedXAccount === 'string') {
        dispatch(connectXAccount(connectedXAccount));
      }
    } catch (error: any) {
      console.log('Session validation error:', error);

      if (error?.originalStatus === 429) {
        console.log('Rate limited - will retry after delay');
        // Retry after rate limit with exponential backoff
        initializationTimeoutRef.current = window.setTimeout(() => {
          setIsInitializing(false);
          setHasInitialized(false);
        }, DEFAULTS.RETRY_DELAY_MS);
        return; // Don't set hasInitialized yet
      } else if (error?.data?.error?.description === 'AUTH_TOKEN_NOT_PRESENT') {
        console.log('No token - new user flow');
        clearTokenExpiry();
      } else {
        logError(error, 'Session validation failed');
        clearTokenExpiry();
      }
    } finally {
      // Set initialization complete after a delay to prevent rapid re-triggering
      setTimeout(() => {
        setIsInitializing(false);
        setHasInitialized(true);
      }, 200);
    }
  }, [
    hasInitialized,
    isInitializing,
    sessionCheckPing,
    dispatch,
    setTokenExpiry,
    startTokenRefreshTimer,
    clearTokenExpiry,
    logError,
    setIsInitializing,
  ]);

  // ============================================================================
  // EFFECT HOOKS
  // ============================================================================
  // ============================================================================
  // EFFECT HOOKS
  // ============================================================================

  /**
   * Wallet status synchronization with throttling and reload handling
   */
  useEffect(() => {
    const currentStatus: WalletStatus = {
      isConnected,
      extensionReady,
      accountID,
    };

    // Check if this is initial mount (no previous status recorded)
    const isInitialMount = !lastWalletStatus.current;

    // Throttle rapid wallet status changes (but not initial mount)
    const now = Date.now();
    if (
      !isInitialMount &&
      now - lastNavigationRef.current < DEFAULTS.NAVIGATION_THROTTLE_MS
    ) {
      if (process.env.NODE_ENV === 'development') {
        console.debug('[useAppSessionManager] Wallet status throttled', {
          currentStatus,
          lastStatus: lastWalletStatus.current,
        });
      }
      return;
    }

    const hasStatusChanged =
      !lastWalletStatus.current ||
      lastWalletStatus.current.isConnected !== isConnected ||
      lastWalletStatus.current.extensionReady !== extensionReady ||
      lastWalletStatus.current.accountID !== accountID;

    // On initial mount or status change, check wallet connection
    if (hasStatusChanged || isInitialMount) {
      if (process.env.NODE_ENV === 'development') {
        console.info('[useAppSessionManager] Wallet status update', {
          prev: lastWalletStatus.current,
          next: currentStatus,
          isInitialMount,
          hasStatusChanged,
        });
      }

      if (!isInitialMount) {
        lastNavigationRef.current = now;
      }

      // If wallet is connected and ready, dispatch walletPaired
      if (extensionReady && isConnected && accountID) {
        if (process.env.NODE_ENV === 'development') {
          console.info('[useAppSessionManager] Dispatching walletPaired', {
            accountID,
            isInitialMount,
            reason: isInitialMount ? 'initial_mount' : 'status_change',
          });
        }
        dispatch(walletPaired(accountID));
      }
      // If we were previously connected and now disconnected, reset auth
      else if (lastWalletStatus.current?.isConnected && !isConnected) {
        if (process.env.NODE_ENV === 'development') {
          console.info(
            '[useAppSessionManager] Wallet disconnected, resetting auth'
          );
        }
        dispatch(resetAuth());
        clearTokenExpiry();
      }
      // If this is initial mount and wallet is not ready, log the state
      else if (isInitialMount && process.env.NODE_ENV === 'development') {
        console.info(
          '[useAppSessionManager] Initial mount - wallet not ready',
          {
            extensionReady,
            isConnected,
            accountID: accountID || 'undefined',
          }
        );
      }

      lastWalletStatus.current = currentStatus;
    } else {
      if (
        process.env.NODE_ENV === 'development' &&
        lastWalletStatus.current?.accountID !== accountID
      ) {
        console.debug(
          '[useAppSessionManager] accountID changed but no other wallet status changed',
          {
            prev: lastWalletStatus.current,
            next: currentStatus,
          }
        );
      }
    }
  }, [isConnected, extensionReady, accountID, dispatch, clearTokenExpiry]);

  /**
   * Cross-tab storage synchronization
   */
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
          // Close to expiry, attempt refresh
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

  /**
   * Session initialization effect
   */
  useEffect(() => {
    // Only validate session once on mount, with a delay to ensure wallet state is ready
    if (!hasInitialized && !isInitializing) {
      const timer = setTimeout(() => {
        validateSession();
      }, DEFAULTS.INITIALIZATION_DELAY_MS);

      return () => clearTimeout(timer);
    }
  }, [hasInitialized, isInitializing, validateSession]);

  /**
   * Token association synchronization effect
   */
  useEffect(() => {
    // Only sync tokens after both authentication and wallet are ready
    if (isUserAuthenticated && hasInitialized) {
      console.log('Syncing token associations...');
      syncTokenAssociations();
    }
  }, [isUserAuthenticated, hasInitialized, syncTokenAssociations]);

  /**
   * Wallet state re-sync after initialization (handles page reload cases)
   */
  useEffect(() => {
    // After component is fully initialized, ensure wallet state is properly synced
    if (hasInitialized && !isInitializing) {
      // Small delay to ensure all other effects have run
      const timer = setTimeout(() => {
        if (extensionReady && isConnected && accountID && !isPaired) {
          if (process.env.NODE_ENV === 'development') {
            console.info(
              '[useAppSessionManager] Post-initialization wallet sync',
              {
                extensionReady,
                isConnected,
                accountID,
                isPaired,
                reason: 'post_init_sync',
              }
            );
          }
          dispatch(walletPaired(accountID));
        }
      }, 500); // Small delay to let other state updates settle

      return () => clearTimeout(timer);
    }
  }, [
    hasInitialized,
    isInitializing,
    extensionReady,
    isConnected,
    accountID,
    isPaired,
    dispatch,
  ]);

  /**
   * Tab visibility change handling
   */
  useEffect(() => {
    const handleVisibilityChange = () => {
      console.log('Visibility changed:', document.visibilityState);

      if (document.hidden) {
        console.log('Tab hidden, stopping refresh timer');
        stopTokenRefreshTimer();
      } else if (isUserAuthenticated && hasInitialized) {
        console.log(
          'Tab visible and user authenticated, checking token status'
        );

        // Check if token needs immediate refresh when tab becomes visible
        const expiry = getTokenExpiry();
        const hasAccessToken = getCookieByName('access_token');

        if (expiry && hasAccessToken) {
          const timeUntilExpiry = expiry - Date.now();
          const bufferTime = bufferSeconds * 1000;

          if (timeUntilExpiry <= bufferTime) {
            console.log(
              'Token expires soon after visibility change, refreshing immediately'
            );
            refreshTokenHandler();
          } else if (timeUntilExpiry > 0) {
            console.log('Token still valid, restarting refresh timer');
            startTokenRefreshTimer();
          }
        } else if (!hasAccessToken) {
          console.log(
            'No access token after visibility change, clearing state'
          );
          clearTokenExpiry();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
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
    clearTokenExpiry,
  ]);

  /**
   * Cleanup effect on unmount
   */
  useEffect(() => {
    return () => {
      console.log('Session manager cleanup');
      stopTokenRefreshTimer();
      isRefreshingRef.current = false;
      releaseRefreshLock();

      // Clear initialization timeout
      if (initializationTimeoutRef.current) {
        clearTimeout(initializationTimeoutRef.current);
        initializationTimeoutRef.current = null;
      }

      // Clear any pending timers
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
        refreshTimerRef.current = null;
      }
    };
  }, [stopTokenRefreshTimer, releaseRefreshLock]);

  // ============================================================================
  // PUBLIC API
  // ============================================================================

  return {
    // Token management
    refreshToken: refreshTokenHandler,
    setTokenExpiry,
    clearTokenExpiry,
    getTokenExpiry,

    // State information
    isRefreshing: isRefreshingRef.current,
    hasInitialized,
    isInitializing,
    isUserAuthenticated,
  } as const;
};

export default useAppSessionManager;
