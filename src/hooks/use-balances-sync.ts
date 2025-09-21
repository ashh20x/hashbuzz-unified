import {
  useLazyGetCurrentUserQuery,
  useLazyGetTokenBalancesQuery,
} from '@/API/user';
import { getErrorMessage } from '@/comman/helpers';
import {
  setBalances,
  setBalanceQueryTimer as setReduxBalanceTimer,
  updateCurrentUser,
} from '@/Store/miscellaneousStoreSlice';
import { useAppDispatch, useAppSelector } from '@/Store/store';
import { EntityBalances } from '@/types';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

const INITIAL_HBAR_BALANCE_ENTITY: EntityBalances = {
  entityBalance: '0.00',
  entityIcon: 'HBAR',
  entitySymbol: 'ℏ',
  entityId: '',
  entityType: 'HBAR',
};

export const useBalancesSync = () => {
  const { currentUser, balanceRefreshTimer } = useAppSelector(s => s.app);
  const [getTokenBalances] = useLazyGetTokenBalancesQuery();
  const [getCurrentUser] = useLazyGetCurrentUserQuery();
  const [balanceQueryTimer, setBalanceQueryTimer] =
    useState<NodeJS.Timeout | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isInitializedRef = useRef(false);
  const dispatch = useAppDispatch();

  /**
   * Core function to check and update entity balances
   * @param topup - Whether to refresh user data along with balances
   * @param suppressToast - Whether to suppress success toast notification
   */
  const checkAndUpdateEntityBalances = useCallback(
    async (topup?: boolean, suppressToast?: boolean) => {
      if (isRefreshing) {
        console.log('Balance refresh already in progress, skipping...');
        return;
      }

      setIsRefreshing(true);

      try {
        const balancesData = await getTokenBalances().unwrap();
        let availableBudget = 0;

        if (topup) {
          const currentUserUpdated = await getCurrentUser().unwrap();
          // available_budget is in tinybars, convert to HBAR
          availableBudget = currentUserUpdated.available_budget / 100_000_000;
          dispatch(updateCurrentUser(currentUserUpdated));
        } else {
          // available_budget is in tinybars, convert to HBAR
          availableBudget =
            Number(currentUser?.available_budget || 0) / 100_000_000;
        }

        const balances: EntityBalances[] = [
          {
            ...JSON.parse(JSON.stringify(INITIAL_HBAR_BALANCE_ENTITY)),
            entityBalance: availableBudget,
            entityId: currentUser?.hedera_wallet_id ?? '',
          },
          ...balancesData.map(d => ({
            entityBalance: d.available_balance.toFixed(4),
            entityIcon: d.token_symbol,
            entitySymbol: '',
            entityId: d.token_id,
            entityType: d.token_type,
            decimals: d.decimals,
          })),
        ];

        dispatch(setBalances(balances));

        if (!suppressToast) {
          toast.success('Balance updated successfully.');
        }

        console.log('✅ Balance sync completed successfully');
      } catch (err) {
        console.error('❌ Balance sync failed:', err);
        toast.error(getErrorMessage(err));
      } finally {
        setIsRefreshing(false);
      }
    },
    [
      dispatch,
      currentUser?.available_budget,
      currentUser?.hedera_wallet_id,
      isRefreshing,
      getTokenBalances,
      getCurrentUser,
    ]
  );

  /**
   * Clear the current refresh timer and optionally clear Redux timer
   * @param clearReduxTimer - Whether to clear the Redux timer as well
   */
  const clearRefreshTimer = useCallback(
    (clearReduxTimer = false) => {
      if (balanceQueryTimer) {
        clearTimeout(balanceQueryTimer);
        setBalanceQueryTimer(null);
        console.log('🕰️ Local balance timer cleared');
      }

      if (clearReduxTimer) {
        dispatch(setReduxBalanceTimer(null));
        console.log('🗄️ Redux balance timer cleared');
      }
    },
    [balanceQueryTimer, dispatch]
  );

  /**
   * Set a new refresh timer with the specified delay
   * @param delayMs - Delay in milliseconds (default: 1 for instant refresh)
   * @param topup - Whether the refresh should include user data update
   * @param clearPrevious - Whether to clear previous timers
   */
  const setRefreshTimer = useCallback(
    (
      delayMs: number = 1,
      topup: boolean = true,
      clearPrevious: boolean = true
    ) => {
      if (clearPrevious) {
        clearRefreshTimer(true);
      }

      // Set Redux timer for cross-component coordination
      dispatch(setReduxBalanceTimer(delayMs));

      // Set local timer
      const timer = setTimeout(() => {
        console.log(`⏰ Timer triggered after ${delayMs}ms`);
        checkAndUpdateEntityBalances(topup, delayMs === 1); // Suppress toast for instant refresh

        // Clear Redux timer after execution
        dispatch(setReduxBalanceTimer(null));
      }, delayMs);

      setBalanceQueryTimer(timer);
      console.log(`🎯 Balance refresh timer set for ${delayMs}ms`);

      return timer;
    },
    [clearRefreshTimer, dispatch, checkAndUpdateEntityBalances]
  );

  /**
   * Trigger instant balance refresh
   * @param includeUserData - Whether to refresh user data as well
   */
  const refreshNow = useCallback(
    (includeUserData: boolean = true) => {
      console.log('🚀 Triggering instant balance refresh...');
      clearRefreshTimer(true);
      return checkAndUpdateEntityBalances(includeUserData, true);
    },
    [clearRefreshTimer, checkAndUpdateEntityBalances]
  );

  /**
   * Start periodic balance refresh with specified interval
   * @param intervalMs - Interval in milliseconds
   */
  const startPeriodicRefresh = useCallback(
    (intervalMs: number = 30000) => {
      console.log(`🔄 Starting periodic balance refresh every ${intervalMs}ms`);
      clearRefreshTimer(true);

      // Initial refresh
      checkAndUpdateEntityBalances(true, true);

      // Set up recurring timer
      const periodicTimer = setInterval(() => {
        console.log('🔄 Periodic balance refresh triggered');
        checkAndUpdateEntityBalances(true, true);
      }, intervalMs);

      // Store the interval ID for cleanup
      setBalanceQueryTimer(periodicTimer as any);
      dispatch(setReduxBalanceTimer(intervalMs));

      return periodicTimer;
    },
    [clearRefreshTimer, checkAndUpdateEntityBalances, dispatch]
  );

  // Initial load effect - runs once when user wallet becomes available
  useEffect(() => {
    if (currentUser?.hedera_wallet_id && !isInitializedRef.current) {
      console.log('👤 User wallet detected, initializing balance sync...');
      checkAndUpdateEntityBalances(false, true); // Initial load without toast
      isInitializedRef.current = true;
    }
  }, [currentUser?.hedera_wallet_id, checkAndUpdateEntityBalances]);

  // Auto-refresh effect based on Redux timer
  useEffect(() => {
    if (
      balanceRefreshTimer &&
      typeof balanceRefreshTimer === 'number' &&
      balanceRefreshTimer > 0
    ) {
      console.log(`⚙️ Redux timer detected: ${balanceRefreshTimer}ms`);

      // Clear any existing timer
      clearRefreshTimer(false); // Don't clear Redux timer here

      // Set new timer
      const timer = setTimeout(() => {
        console.log('⏰ Redux-triggered refresh executing...');
        checkAndUpdateEntityBalances(true);

        // Clear Redux timer after execution
        dispatch(setReduxBalanceTimer(null));
      }, balanceRefreshTimer);

      setBalanceQueryTimer(timer);
    }

    // Cleanup on unmount or when balanceRefreshTimer changes
    return () => {
      if (balanceQueryTimer) {
        clearTimeout(balanceQueryTimer);
      }
    };
  }, [
    balanceRefreshTimer,
    checkAndUpdateEntityBalances,
    clearRefreshTimer,
    dispatch,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearRefreshTimer(true);
      console.log('🧹 useBalancesSync cleanup completed');
    };
  }, [clearRefreshTimer]);

  return {
    // Core functions
    checkAndUpdateEntityBalances,
    refreshNow,

    // Timer management
    setRefreshTimer,
    clearRefreshTimer,
    startPeriodicRefresh,

    // State
    isRefreshing,

    // Legacy support (for backward compatibility)
    startBalanceQueryTimer: () => setRefreshTimer(35000, true, true),
  };
};

export default useBalancesSync;
