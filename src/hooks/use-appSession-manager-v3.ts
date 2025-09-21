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
import { useEffect } from 'react';
import { setAuthStatus } from '../Store/appStatusSlice';
import { SESSION_DEFAULTS } from './session-manager/constants';
import type {
  SessionManagerAPI,
  UseAppSessionManagerProps,
} from './session-manager/types';
import { useCrossTabSync } from './session-manager/useCrossTabSync';
import { useSessionValidator } from './session-manager/useSessionValidator';
import { useTabVisibilityManager } from './session-manager/useTabVisibilityManager';
import { useTokenAssociationSync } from './session-manager/useTokenAssociationSync';
import { useTokenManager } from './session-manager/useTokenManager';
import { useWalletSync } from './session-manager/useWalletSync';

// ============================================================================
// MAIN HOOK - ORCHESTRATES ALL SESSION MANAGEMENT MODULES
// ============================================================================

export const useAppSessionManager = ({
  refreshEndpoint = SESSION_DEFAULTS.REFRESH_ENDPOINT,
  bufferSeconds = SESSION_DEFAULTS.BUFFER_SECONDS,
  sessionExpireMinutes = SESSION_DEFAULTS.SESSION_EXPIRE_MINUTES,
}: UseAppSessionManagerProps = {}): SessionManagerAPI => {
  console.warn('[SESSION MANAGER V3] Hook called - Starting initialization...');
  // ============================================================================
  // REDUX STATE
  // ============================================================================
  const dispatch = useAppDispatch();

  const {
    wallet: { isPaired },
    auth: { isAuthenticated },
  } = useAppSelector(s => s.auth.userAuthAndOnBoardSteps);
  const isUserAuthenticated = isPaired && isAuthenticated;

  // ============================================================================
  // MODULE INITIALIZATION
  // ============================================================================

  // Token management module
  const tokenManager = useTokenManager(
    sessionExpireMinutes,
    bufferSeconds,
    refreshEndpoint
  );

  // Session validation module
  const sessionValidator = useSessionValidator(
    tokenManager.setTokenExpiry,
    tokenManager.clearTokenExpiry,
    tokenManager.startTokenRefreshTimer
  );

  // Token association sync module
  const tokenAssociationSync = useTokenAssociationSync();

  // Wallet synchronization module (handles wallet state automatically)
  useWalletSync(
    tokenManager.clearTokenExpiry,
    sessionValidator.hasInitialized,
    sessionValidator.isInitializing,
    isPaired
  );

  // ============================================================================
  // CROSS-CUTTING CONCERNS
  // ============================================================================

  // Cross-tab synchronization
  useCrossTabSync(
    tokenManager.getTokenExpiry,
    () => {}, // clearRefreshTimer is handled internally in tokenManager
    tokenManager.scheduleRefresh,
    tokenManager.refreshToken,
    bufferSeconds
  );

  // Tab visibility management
  useTabVisibilityManager(
    tokenManager.stopTokenRefreshTimer,
    tokenManager.startTokenRefreshTimer,
    tokenManager.getTokenExpiry,
    tokenManager.refreshToken,
    tokenManager.clearTokenExpiry,
    isUserAuthenticated,
    sessionValidator.hasInitialized,
    bufferSeconds
  );

  // ============================================================================
  // LIFECYCLE EFFECTS
  // ============================================================================

  /**
   * Session initialization effect
   */
  useEffect(() => {
    console.log('[SESSION MANAGER V3] Initialization effect triggered', {
      hasInitialized: sessionValidator.hasInitialized,
      isInitializing: sessionValidator.isInitializing,
      delay: SESSION_DEFAULTS.INITIALIZATION_DELAY_MS,
    });

    if (!sessionValidator.hasInitialized && !sessionValidator.isInitializing) {
      console.log(
        '[SESSION MANAGER V3] Starting session validation with timer...'
      );
      const timer = setTimeout(() => {
        console.log(
          '[SESSION MANAGER V3] Timer fired, calling validateSession...'
        );
        sessionValidator.validateSession();
      }, SESSION_DEFAULTS.INITIALIZATION_DELAY_MS);

      return () => {
        console.log('[SESSION MANAGER V3] Cleaning up timer');
        clearTimeout(timer);
      };
    }
  }, []);
  // Run only once on mount to avoid dependency issues

  /**
   * Token association synchronization effect
   */
  useEffect(() => {
    if (isUserAuthenticated && sessionValidator.hasInitialized) {
      console.log('Syncing token associations...');
      tokenAssociationSync.syncTokenAssociations();
    }
  }, [
    isUserAuthenticated,
    sessionValidator.hasInitialized,
    tokenAssociationSync.syncTokenAssociations,
  ]);

  /**
   * Cleanup effect on unmount
   */
  useEffect(() => {
    return () => {
      console.log('Session manager cleanup');
      tokenManager.cleanup();
      sessionValidator.cleanup();
    };
  }, [tokenManager.cleanup, sessionValidator.cleanup]);

  // ============================================================================
  // PUBLIC API
  // ============================================================================

  // Computed loading states for UI management
  const isLoading =
    sessionValidator.isInitializing || tokenManager.isRefreshing;
  const isAppReady =
    sessionValidator.hasInitialized && !sessionValidator.isInitializing;
  const shouldShowSplash =
    !sessionValidator.hasInitialized || sessionValidator.isInitializing;

  // Dispatch app status to Redux for compatibility with existing components
  useEffect(() => {
    dispatch(
      setAuthStatus({
        isLoading,
        isAppReady,
        shouldShowSplash,
      })
    );
  }, [dispatch, isLoading, isAppReady, shouldShowSplash]);

  return {
    // Token management
    refreshToken: tokenManager.refreshToken,
    setTokenExpiry: tokenManager.setTokenExpiry,
    clearTokenExpiry: tokenManager.clearTokenExpiry,
    getTokenExpiry: tokenManager.getTokenExpiry,

    // State information
    isRefreshing: tokenManager.isRefreshing,
    hasInitialized: sessionValidator.hasInitialized,
    isInitializing: sessionValidator.isInitializing,
    isUserAuthenticated,

    // Computed states for UI
    isLoading,
    isAppReady,
    shouldShowSplash,

    // Debug/Test functions (development only)
    forceRefresh: tokenManager.forceRefresh,
  } as const;
};

export default useAppSessionManager;
