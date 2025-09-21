/**
 * Session Validation Module
 * Handles session initialization and validation
 * @version 3.0.0
 */

import { getCookieByName } from '@/comman/helpers';
import { useAppDispatch } from '@/Store/store';
import {
  authenticated,
  connectXAccount,
} from '@/Ver2Designs/Pages/AuthAndOnboard';
import { useAuthPingMutation } from '@/Ver2Designs/Pages/AuthAndOnboard/api/auth';
import { useCallback, useRef, useState } from 'react';
import { delay, logDebug, logError, logInfo } from '../../comman/utils';
import type { SessionValidationResult } from './types';

export const useSessionValidator = (
  setTokenExpiry: (expiryTimestamp?: number) => number,
  clearTokenExpiry: () => void,
  startTokenRefreshTimer: () => void
) => {
  console.warn('[SESSION VALIDATOR] Hook called - Initializing...');

  const dispatch = useAppDispatch();
  const [sessionCheckPing] = useAuthPingMutation();

  console.warn('[SESSION VALIDATOR] useAuthPingMutation hook created');

  const [hasInitialized, setHasInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const initializationTimeoutRef = useRef<number | null>(null);

  // ============================================================================
  // SESSION VALIDATION
  // ============================================================================

  const validateSession = useCallback(async () => {
    console.log('[SESSION VALIDATOR] validateSession called!', {
      hasInitialized,
      isInitializing,
    });

    if (hasInitialized || isInitializing) {
      console.log(
        '[SESSION VALIDATOR] Skipping validation - already initialized or initializing'
      );
      return;
    }

    setIsInitializing(true);
    console.log('[SESSION VALIDATOR] Starting initialization...');

    if (initializationTimeoutRef.current) {
      clearTimeout(initializationTimeoutRef.current);
    }

    try {
      logInfo('Starting session validation', undefined, '[SESSION VALIDATOR]');

      // Check if we have cookies before making API call (for logging purposes)
      const hasAccessToken = getCookieByName('access_token');
      const hasRefreshToken = getCookieByName('refresh_token');

      logInfo(
        'Cookie check',
        {
          hasAccessToken: !!hasAccessToken,
          hasRefreshToken: !!hasRefreshToken,
        },
        '[SESSION VALIDATOR]'
      );

      await delay(500);

      // Always call ping endpoint to check authentication status
      // The server will validate cookies and return the authentication state
      logInfo(
        'Calling /auth/ping to validate session',
        undefined,
        '[SESSION VALIDATOR]'
      );
      const result = await sessionCheckPing().unwrap();

      if (!result || typeof result !== 'object') {
        throw new Error('Invalid session response format');
      }

      const { isAuthenticated, connectedXAccount }: SessionValidationResult =
        result;

      if (isAuthenticated) {
        const expiry = setTokenExpiry();
        logInfo(
          'User authenticated',
          { tokenExpiry: new Date(expiry) },
          '[SESSION VALIDATOR]'
        );

        dispatch(authenticated());

        setTimeout(() => {
          startTokenRefreshTimer();
        }, 100);
      } else {
        logDebug(
          'User not authenticated, clearing token expiry',
          undefined,
          '[SESSION VALIDATOR]'
        );
        clearTokenExpiry();
      }

      if (connectedXAccount && typeof connectedXAccount === 'string') {
        dispatch(connectXAccount(connectedXAccount));
      }
    } catch (error: unknown) {
      logError(error, 'Session validation failed', '[SESSION VALIDATOR]');
      // Clear tokens on validation failure
      clearTokenExpiry();
    } finally {
      setIsInitializing(false);
      setHasInitialized(true);
    }
  }, [
    sessionCheckPing,
    dispatch,
    setTokenExpiry,
    startTokenRefreshTimer,
    clearTokenExpiry,
    hasInitialized,
    isInitializing,
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
    cleanup,
  };
};
