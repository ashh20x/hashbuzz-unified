/**
 * Enhanced React Session Manager Hook - Modular Architecture
 *
 * This hook provides comprehensive session management for a React application with:
 * - Automatic token refresh with cross-tab synchronization
 * - Wallet connection state management with throttling
 * - Token association synchronization
 * - Enhanced error handling and security measures
 * - Tab visibility optimization for performance
 * - Page reload wallet state recovery
 *
 * Key improvements in v3.0.0:
 * - Modular architecture with separated concerns
 * - Improved maintainability and testability
 * - Better code organization and reusability
 * - Enhanced TypeScript support
 * - Reduced bundle size through tree-shaking
 * - Easier debugging and development
 *
 * @author HashBuzz Team
 * @version 3.0.0 - Modular Architecture Upgrade
 */

import { useAppDispatch, useAppSelector } from '@/Store/store';
import { useEffect, useRef } from 'react';
import { logDebug, logInfo } from '../comman/utils';
import { setAuthStatus } from '../Store/appStatusSlice';
import { SESSION_DEFAULTS } from './session-manager/constants';
import type {
  SessionManagerAPI,
  UseAppSessionManagerProps,
} from './session-manager/types';
import { useCrossTabSync } from './session-manager/useCrossTabSync';
import { useSessionValidator } from './session-manager/useSessionValidator';
import { useTokenAssociationSync } from './session-manager/useTokenAssociationSync';
import { useTokenManager } from './session-manager/useTokenManager';
import { useWalletSync } from './session-manager/useWalletSync';
export const useAppSessionManager = ({
  refreshEndpoint = SESSION_DEFAULTS.REFRESH_ENDPOINT,
  bufferSeconds = SESSION_DEFAULTS.BUFFER_SECONDS,
  sessionExpireMinutes = SESSION_DEFAULTS.SESSION_EXPIRE_MINUTES,
}: UseAppSessionManagerProps = {}): SessionManagerAPI => {
  const adjustedBufferSeconds =
    sessionExpireMinutes <= 2
      ? Math.min(bufferSeconds, sessionExpireMinutes * 30)
      : bufferSeconds;

  // Refs to prevent infinite loops
  const hasInitializedRef = useRef(false);
  const lastAuthStateRef = useRef<boolean>(false);

  const {
    wallet: { isPaired },
    auth: { isAuthenticated },
    xAccount: { isConnected: isXAccountConnected },
  } = useAppSelector(s => s.auth.userAuthAndOnBoardSteps);
  const dispatch = useAppDispatch();

  const isUserAuthenticated =
    isPaired && isAuthenticated && isXAccountConnected;

  const tokenManager = useTokenManager(
    sessionExpireMinutes,
    adjustedBufferSeconds,
    refreshEndpoint
  );

  const sessionValidator = useSessionValidator(
    tokenManager.setTokenExpiry,
    tokenManager.clearTokenExpiry,
    tokenManager.startTokenRefreshTimer
  );

  const tokenAssociationSync = useTokenAssociationSync();

  useWalletSync(
    tokenManager.clearTokenExpiry,
    sessionValidator.hasInitialized,
    sessionValidator.isInitializing,
    isPaired
  );

  useCrossTabSync(
    tokenManager.getTokenExpiry,
    () => {},
    tokenManager.scheduleRefresh,
    tokenManager.refreshToken,
    adjustedBufferSeconds
  );

  // Removed checkAndRefreshToken to prevent dependency issues

  // ✅ ALWAYS fire session validation on mount - regardless of wallet state
  useEffect(() => {
    if (!hasInitializedRef.current) {
      logInfo(
        'Component mounted - validating session',
        undefined,
        '[SESSION MANAGER]'
      );
      sessionValidator.validateSession();
      hasInitializedRef.current = true;
    }
  }, []); // Only run on mount - sessionValidator.validateSession is stable

  // ✅ Handle auth state changes - for token management only
  useEffect(() => {
    const authChanged = isUserAuthenticated !== lastAuthStateRef.current;
    lastAuthStateRef.current = isUserAuthenticated;

    if (authChanged) {
      logDebug(
        'Auth state changed',
        { isUserAuthenticated, authChanged },
        '[SESSION MANAGER]'
      );
    }

    if (isUserAuthenticated && authChanged) {
      // Inline token check and refresh logic to prevent dependency issues
      const expiry = tokenManager.getTokenExpiry();
      if (expiry) {
        const timeLeft = expiry - Date.now();
        if (timeLeft <= adjustedBufferSeconds * 1000) {
          logInfo(
            'Token needs refresh, executing...',
            { timeLeft: `${Math.round(timeLeft / 1000)}s` },
            '[SESSION MANAGER]'
          );
          tokenManager.refreshToken();
        } else {
          logDebug(
            'Token valid, starting timer...',
            { timeLeft: `${Math.round(timeLeft / 1000)}s` },
            '[SESSION MANAGER]'
          );
          tokenManager.startTokenRefreshTimer();
        }
      }
    } else if (!isUserAuthenticated) {
      tokenManager.clearTokenExpiry();
    }
  }, [
    isUserAuthenticated,
    adjustedBufferSeconds,
    tokenManager.refreshToken,
    tokenManager.startTokenRefreshTimer,
    tokenManager.getTokenExpiry,
    tokenManager.clearTokenExpiry,
  ]); // Use stable methods

  // ✅ Sync token associations when authenticated - with loop prevention
  useEffect(() => {
    if (isUserAuthenticated && sessionValidator.hasInitialized) {
      logDebug('Syncing token associations', undefined, '[SESSION MANAGER]');
      tokenAssociationSync.syncTokenAssociations();
    }
  }, [
    isUserAuthenticated,
    sessionValidator.hasInitialized,
    tokenAssociationSync.syncTokenAssociations,
  ]); // Use stable method

  // ✅ Handle tab visibility change - like backup implementation
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        logDebug(
          'Tab hidden, stopping refresh timer',
          undefined,
          '[SESSION MANAGER]'
        );
        tokenManager.stopTokenRefreshTimer();
      } else if (isUserAuthenticated && sessionValidator.hasInitialized) {
        logDebug(
          'Tab visible, checking token status',
          undefined,
          '[SESSION MANAGER]'
        );

        const expiry = tokenManager.getTokenExpiry();

        if (expiry) {
          const timeUntilExpiry = expiry - Date.now();
          const bufferTime = adjustedBufferSeconds * 1000;

          if (timeUntilExpiry <= bufferTime) {
            logInfo(
              'Token expires soon after visibility change, refreshing',
              undefined,
              '[SESSION MANAGER]'
            );
            tokenManager.refreshToken();
          } else if (timeUntilExpiry > 0) {
            logDebug(
              'Token valid, restarting refresh timer',
              undefined,
              '[SESSION MANAGER]'
            );
            tokenManager.startTokenRefreshTimer();
          }
        } else {
          logDebug(
            'No access token after visibility change, clearing state',
            undefined,
            '[SESSION MANAGER]'
          );
          tokenManager.clearTokenExpiry();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [
    isUserAuthenticated,
    sessionValidator.hasInitialized,
    adjustedBufferSeconds,
    tokenManager.refreshToken,
    tokenManager.startTokenRefreshTimer,
    tokenManager.getTokenExpiry,
    tokenManager.clearTokenExpiry,
    tokenManager.stopTokenRefreshTimer,
  ]); // Use stable methods instead of entire object

  // ✅ Cleanup timers on unmount - stable dependencies
  useEffect(() => {
    return () => {
      logDebug('Cleanup on unmount', undefined, '[SESSION MANAGER]');
      tokenManager.cleanup();
      sessionValidator.cleanup();
      hasInitializedRef.current = false;
      lastAuthStateRef.current = false;
    };
  }, [tokenManager.cleanup, sessionValidator.cleanup]); // Use stable cleanup methods

  const isLoading =
    sessionValidator.isInitializing || tokenManager.isRefreshing;
  const isAppReady =
    sessionValidator.hasInitialized && !sessionValidator.isInitializing;
  const shouldShowSplash =
    !sessionValidator.hasInitialized || sessionValidator.isInitializing;

  useEffect(() => {
    logDebug('[SessionManager] Dispatching updateAppStatus', {
      isLoading,
      isAppReady,
      shouldShowSplash,
    });
    dispatch(setAuthStatus({ isLoading, isAppReady, shouldShowSplash }));
  }, [isLoading, isAppReady, shouldShowSplash, dispatch]);

  return {
    refreshToken: tokenManager.refreshToken,
    setTokenExpiry: tokenManager.setTokenExpiry,
    clearTokenExpiry: tokenManager.clearTokenExpiry,
    getTokenExpiry: tokenManager.getTokenExpiry,
    isRefreshing: tokenManager.isRefreshing,
    hasInitialized: sessionValidator.hasInitialized,
    isInitializing: sessionValidator.isInitializing,
    isUserAuthenticated,
    isLoading,
    isAppReady,
    shouldShowSplash,
    forceRefresh: tokenManager.forceRefresh,
  } as const;
};

export default useAppSessionManager;
