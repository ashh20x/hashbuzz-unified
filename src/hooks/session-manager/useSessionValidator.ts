/**
 * Session Validation Module
 * Handles session initialization and validation
 * @version 3.0.0
 */

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
      logInfo('Starting session validation', undefined, '[SESSION VALIDATOR]');

      await delay(500);

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
