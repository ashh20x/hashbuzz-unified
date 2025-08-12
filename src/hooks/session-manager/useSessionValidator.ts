/**
 * Session Validation Module
 * Handles session initialization and validation
 * @version 3.0.0
 */

import { useCallback, useRef, useState } from 'react';
import { useAppDispatch } from '@/Store/store';
import { authenticated, connectXAccount } from '@/Ver2Designs/Pages/AuthAndOnboard';
import { useAuthPingMutation } from '@/Ver2Designs/Pages/AuthAndOnboard/api/auth';
import { SESSION_DEFAULTS } from './constants';
import { logError, logInfo, logDebug, delay } from './utils';
import type { SessionValidationResult } from './types';

export const useSessionValidator = (
  setTokenExpiry: (expiryTimestamp?: number) => number,
  clearTokenExpiry: () => void,
  startTokenRefreshTimer: () => void
) => {
  const dispatch = useAppDispatch();
  const [sessionCheckPing] = useAuthPingMutation();
  
  const [hasInitialized, setHasInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const initializationTimeoutRef = useRef<number | null>(null);

  // ============================================================================
  // SESSION VALIDATION
  // ============================================================================

  const validateSession = useCallback(async () => {
    if (hasInitialized || isInitializing) return;

    setIsInitializing(true);

    if (initializationTimeoutRef.current) {
      clearTimeout(initializationTimeoutRef.current);
    }

    try {
      logInfo("Starting session validation", undefined, "[SESSION VALIDATOR]");
      
      await delay(500);

      const result = await sessionCheckPing().unwrap();
      
      if (!result || typeof result !== 'object') {
        throw new Error("Invalid session response format");
      }

      const { isAuthenticated, connectedXAccount }: SessionValidationResult = result;
      
      if (isAuthenticated) {
        const expiry = setTokenExpiry();
        logInfo("User authenticated", { tokenExpiry: new Date(expiry) }, "[SESSION VALIDATOR]");
        
        dispatch(authenticated());
        
        setTimeout(() => {
          startTokenRefreshTimer();
        }, 100);
      } else {
        logDebug("User not authenticated, clearing token expiry", undefined, "[SESSION VALIDATOR]");
        clearTokenExpiry();
      }

      if (connectedXAccount && typeof connectedXAccount === 'string') {
        dispatch(connectXAccount(connectedXAccount));
      }

    } catch (error: any) {
      if (error?.originalStatus === 429) {
        logDebug("Rate limited - will retry after delay", undefined, "[SESSION VALIDATOR]");
        initializationTimeoutRef.current = window.setTimeout(() => {
          setIsInitializing(false);
          setHasInitialized(false);
        }, SESSION_DEFAULTS.RETRY_DELAY_MS);
        return;
      } else if (error?.data?.error?.description === "AUTH_TOKEN_NOT_PRESENT") {
        logDebug("No token - new user flow", undefined, "[SESSION VALIDATOR]");
        clearTokenExpiry();
      } else {
        logError(error, "Session validation failed", "[SESSION VALIDATOR]");
        clearTokenExpiry();
      }
    } finally {
      setTimeout(() => {
        setIsInitializing(false);
        setHasInitialized(true);
      }, 200);
    }
  }, [
    sessionCheckPing, 
    dispatch, 
    setTokenExpiry, 
    startTokenRefreshTimer, 
    clearTokenExpiry
  ]);

  // ============================================================================
  // CLEANUP
  // ============================================================================

  const cleanup = useCallback(() => {
    if (initializationTimeoutRef.current) {
      clearTimeout(initializationTimeoutRef.current);
      initializationTimeoutRef.current = null;
    }
  }, []);

  // ============================================================================
  // PUBLIC API
  // ============================================================================

  return {
    validateSession,
    hasInitialized,
    isInitializing,
    setHasInitialized,
    setIsInitializing,
    cleanup
  };
};
