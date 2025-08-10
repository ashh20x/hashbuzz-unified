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



import { useEffect, useCallback, useRef } from 'react';
import { useAppSelector } from '@/Store/store';
import { SESSION_DEFAULTS } from './session-manager/constants';
import { useTokenManager } from './session-manager/useTokenManager';
import { useWalletSync } from './session-manager/useWalletSync';
import { useSessionValidator } from './session-manager/useSessionValidator';
import { useTokenAssociationSync } from './session-manager/useTokenAssociationSync';
import { useCrossTabSync } from './session-manager/useCrossTabSync';
import { getCookieByName } from '@/Utilities/helpers';
import type { UseAppSessionManagerProps, SessionManagerAPI } from './session-manager/types';

export const useAppSessionManager = ({
  refreshEndpoint = SESSION_DEFAULTS.REFRESH_ENDPOINT,
  bufferSeconds = SESSION_DEFAULTS.BUFFER_SECONDS,
  sessionExpireMinutes = SESSION_DEFAULTS.SESSION_EXPIRE_MINUTES,
}: UseAppSessionManagerProps = {}): SessionManagerAPI => {

  const adjustedBufferSeconds = sessionExpireMinutes <= 2 
    ? Math.min(bufferSeconds, sessionExpireMinutes * 30)
    : bufferSeconds;

  // Refs to prevent infinite loops
  const hasInitializedRef = useRef(false);
  const lastAuthStateRef = useRef<boolean>(false);

  const {
    wallet: { isPaired },
    auth: { isAuthenticated },
    xAccount: { isConnected: isXAccountConnected }
  } = useAppSelector((s) => s.auth.userAuthAndOnBoardSteps);

  const isUserAuthenticated = isPaired && isAuthenticated && isXAccountConnected;

  const tokenManager = useTokenManager(sessionExpireMinutes, adjustedBufferSeconds, refreshEndpoint);

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

  // ✅ Function to check expiry and refresh if needed - stable callback
  const checkAndRefreshToken = useCallback(() => {
    if (!isUserAuthenticated) return;
    const expiry = tokenManager.getTokenExpiry();
    if (!expiry) return;

    const now = Date.now();
    const timeLeft = expiry - now;

    console.log(`🔍 [SESSION MANAGER] Token check:`, {
      timeLeft: Math.round(timeLeft / 1000) + 's',
      bufferSeconds: adjustedBufferSeconds,
      shouldRefresh: timeLeft <= adjustedBufferSeconds * 1000
    });

    if (timeLeft <= adjustedBufferSeconds * 1000) {
      console.log(`🚀 [SESSION MANAGER] Token needs refresh, executing...`);
      tokenManager.refreshToken();
    } else {
      console.log(`⏰ [SESSION MANAGER] Token valid, starting timer...`);
      tokenManager.startTokenRefreshTimer();
    }
  }, [isUserAuthenticated, adjustedBufferSeconds, tokenManager.getTokenExpiry, tokenManager.refreshToken, tokenManager.startTokenRefreshTimer]);

  // ✅ ALWAYS fire session validation on mount - regardless of wallet state
  useEffect(() => {
    console.log(`🌟 [SESSION MANAGER] Component mounted - always validate session`);
    sessionValidator.validateSession();
  }, []); // Empty dependency array - only runs once on mount

  // ✅ Handle auth state changes - for token management only
  useEffect(() => {
    const authChanged = isUserAuthenticated !== lastAuthStateRef.current;
    lastAuthStateRef.current = isUserAuthenticated;

    console.log(`🔄 [SESSION MANAGER] Auth state change:`, {
      isUserAuthenticated,
      authChanged,
      hasInitialized: sessionValidator.hasInitialized
    });
    
    if (isUserAuthenticated && authChanged) {
      console.log(`🔍 [SESSION MANAGER] User authenticated, checking token...`);
      checkAndRefreshToken();
    } else if (!isUserAuthenticated) {
      console.log(`🔒 [SESSION MANAGER] User not authenticated, clearing token...`);
      tokenManager.clearTokenExpiry();
    }
  }, [isUserAuthenticated, checkAndRefreshToken, tokenManager.clearTokenExpiry]);

  // ✅ Sync token associations when authenticated - with loop prevention
  useEffect(() => {
    if (isUserAuthenticated && sessionValidator.hasInitialized) {
      console.log(`🔄 [SESSION MANAGER] Syncing token associations...`);
      tokenAssociationSync.syncTokenAssociations();
    }
  }, [isUserAuthenticated, sessionValidator.hasInitialized, tokenAssociationSync.syncTokenAssociations]);

  // ✅ Handle tab visibility change - like backup implementation
  useEffect(() => {
    const handleVisibilityChange = () => {
      console.log(`👁️ [SESSION MANAGER] Visibility changed:`, document.visibilityState);
      
      if (document.hidden) {
        console.log(`👁️ [SESSION MANAGER] Tab hidden, stopping refresh timer`);
        tokenManager.stopTokenRefreshTimer();
      } else if (isUserAuthenticated && sessionValidator.hasInitialized) {
        console.log(`👁️ [SESSION MANAGER] Tab visible and user authenticated, checking token status`);
        
        // Check if token needs immediate refresh when tab becomes visible
        const expiry = tokenManager.getTokenExpiry();
        const hasAccessToken = getCookieByName("access_token");
        
        if (expiry && hasAccessToken) {
          const timeUntilExpiry = expiry - Date.now();
          const bufferTime = adjustedBufferSeconds * 1000;
          
          if (timeUntilExpiry <= bufferTime) {
            console.log(`🚀 [SESSION MANAGER] Token expires soon after visibility change, refreshing immediately`);
            tokenManager.refreshToken();
          } else if (timeUntilExpiry > 0) {
            console.log(`⏰ [SESSION MANAGER] Token still valid, restarting refresh timer`);
            tokenManager.startTokenRefreshTimer();
          }
        } else if (!hasAccessToken) {
          console.log(`📭 [SESSION MANAGER] No access token after visibility change, clearing state`);
          tokenManager.clearTokenExpiry();
        }
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [
    tokenManager.stopTokenRefreshTimer, 
    tokenManager.startTokenRefreshTimer, 
    tokenManager.refreshToken,
    tokenManager.getTokenExpiry,
    tokenManager.clearTokenExpiry,
    isUserAuthenticated, 
    sessionValidator.hasInitialized,
    adjustedBufferSeconds
  ]);

  // ✅ Cleanup timers on unmount - stable dependencies
  useEffect(() => {
    return () => {
      console.log(`🧹 [SESSION MANAGER] Cleanup on unmount`);
      tokenManager.cleanup();
      sessionValidator.cleanup();
      hasInitializedRef.current = false;
      lastAuthStateRef.current = false;
    };
  }, [tokenManager.cleanup, sessionValidator.cleanup]);

  const isLoading = sessionValidator.isInitializing || tokenManager.isRefreshing;
  const isAppReady = sessionValidator.hasInitialized && !sessionValidator.isInitializing;
  const shouldShowSplash = !sessionValidator.hasInitialized || sessionValidator.isInitializing;

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
