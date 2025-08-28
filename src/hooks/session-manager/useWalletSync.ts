/**
 * Wallet Synchronization Module
 * Handles wallet connection state and synchronization with Redux
 * @version 3.0.0
 */

import { apiBase } from '@/API/apiBase';
import { logDebug, logInfo } from '@/comman/utils';
import { useAppDispatch } from '@/Store/store';
import { resetAuth, walletPaired } from '@/Ver2Designs/Pages/AuthAndOnboard';
import { useAccountId, useWallet } from '@buidlerlabs/hashgraph-react-wallets';
import { HWCConnector } from '@buidlerlabs/hashgraph-react-wallets/connectors';
import { useCallback, useEffect, useRef } from 'react';
import { SESSION_DEFAULTS } from '../session-manager/constants';
import type { WalletStatus } from './types';

export const useWalletSync = (
  clearTokenExpiry: () => void,
  hasInitialized: boolean,
  isInitializing: boolean,
  isPaired: boolean
) => {
  const dispatch = useAppDispatch();
  const { isConnected, extensionReady } = useWallet(HWCConnector);
  const { data: accountID } = useAccountId();

  const lastWalletStatus = useRef<WalletStatus | null>(null);
  const lastNavigationRef = useRef<number>(0);

  // ============================================================================
  // WALLET STATUS SYNCHRONIZATION
  // ============================================================================

  const syncWalletStatus = useCallback(() => {
    const currentStatus: WalletStatus = {
      isConnected,
      extensionReady,
      accountID,
    };
    const isInitialMount = !lastWalletStatus.current;
    const now = Date.now();

    // Throttle rapid changes (but not initial mount)
    if (
      !isInitialMount &&
      now - lastNavigationRef.current < SESSION_DEFAULTS.NAVIGATION_THROTTLE_MS
    ) {
      logDebug('Wallet status throttled', {
        currentStatus,
        lastStatus: lastWalletStatus.current,
      });
      return;
    }

    const hasStatusChanged =
      !lastWalletStatus.current ||
      lastWalletStatus.current.isConnected !== isConnected ||
      lastWalletStatus.current.extensionReady !== extensionReady ||
      lastWalletStatus.current.accountID !== accountID;

    if (hasStatusChanged || isInitialMount) {
      logInfo('Wallet status update', {
        prev: lastWalletStatus.current,
        next: currentStatus,
        isInitialMount,
        hasStatusChanged,
      });

      if (!isInitialMount) {
        lastNavigationRef.current = now;
      }

      // Wallet connected and ready
      if (extensionReady && isConnected && accountID) {
        logInfo('Wallet connected, pairing', { accountID }, '[WALLET SYNC]');
        dispatch(walletPaired(accountID));
      }
      // Wallet disconnected
      else if (lastWalletStatus.current?.isConnected && !isConnected) {
        logInfo(
          'Wallet disconnected, resetting auth',
          undefined,
          '[WALLET SYNC]'
        );
        dispatch(apiBase.util.resetApiState()); // Clear cache when wallet disconnects
        dispatch(resetAuth());
        clearTokenExpiry();
      }
      // Initial mount but wallet not ready
      else if (isInitialMount) {
        logDebug(
          'Initial mount - wallet not ready',
          { extensionReady, isConnected, accountID },
          '[WALLET SYNC]'
        );
      }

      lastWalletStatus.current = currentStatus;
    } else if (lastWalletStatus.current?.accountID !== accountID) {
      logDebug('accountID changed but no other wallet status changed', {
        prev: lastWalletStatus.current,
        next: currentStatus,
      });
    }
  }, [isConnected, extensionReady, accountID, dispatch, clearTokenExpiry]);

  // ============================================================================
  // POST-INITIALIZATION WALLET SYNC
  // ============================================================================

  const postInitWalletSync = useCallback(() => {
    if (hasInitialized && !isInitializing) {
      const timer = setTimeout(() => {
        if (extensionReady && isConnected && accountID && !isPaired) {
          logDebug(
            'Post-initialization wallet sync',
            { accountID },
            '[WALLET SYNC]'
          );
          dispatch(walletPaired(accountID));
        }
      }, 500);

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

  // ============================================================================
  // EFFECTS
  // ============================================================================

  // Main wallet status synchronization
  useEffect(() => {
    syncWalletStatus();
  }, [syncWalletStatus]);

  // Post-initialization sync for page reload cases
  useEffect(() => {
    return postInitWalletSync();
  }, [postInitWalletSync]);

  // ============================================================================
  // PUBLIC API
  // ============================================================================

  return {
    walletStatus: { isConnected, extensionReady, accountID },
    lastWalletStatus: lastWalletStatus.current,
  };
};
