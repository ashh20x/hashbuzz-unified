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
import { logError, delay } from './utils';
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

    // Clear any existing initialization timeout
    if (initializationTimeoutRef.current) {
      clearTimeout(initializationTimeoutRef.current);
    }

    try {
      console.log("Starting session validation...");
      
      // Small delay to ensure wallet state is settled
      await delay(500);

      const result = await sessionCheckPing().unwrap();
      
      if (!result || typeof result !== 'object') {
        throw new Error("Invalid session response format");
      }

      const { isAuthenticated, connectedXAccount }: SessionValidationResult = result;
      console.log("Session validation result:", { isAuthenticated, connectedXAccount });

      if (isAuthenticated) {
        const expiry = setTokenExpiry();
        console.log("Token expiry set to:", new Date(expiry));
        
        dispatch(authenticated());
        
        // Start refresh timer after brief delay
        setTimeout(() => {
          startTokenRefreshTimer();
        }, 100);
      } else {
        clearTokenExpiry();
      }

      if (connectedXAccount && typeof connectedXAccount === 'string') {
        dispatch(connectXAccount(connectedXAccount));
      }

    } catch (error: any) {
      console.log("Session validation error:", error);
      
      if (error?.originalStatus === 429) {
        console.log("Rate limited - will retry after delay");
        initializationTimeoutRef.current = window.setTimeout(() => {
          setIsInitializing(false);
          setHasInitialized(false);
        }, SESSION_DEFAULTS.RETRY_DELAY_MS);
        return;
      } else if (error?.data?.error?.description === "AUTH_TOKEN_NOT_PRESENT") {
        console.log("No token - new user flow");
        clearTokenExpiry();
      } else {
        logError(error, "Session validation failed");
        clearTokenExpiry();
      }
    } finally {
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
