import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useApiInstance } from "../APIConfig/api";
import { EntityBalances } from "../types";
import { getErrorMessage } from "../Utilities/helpers";
import { useStore } from "./StoreProvider";

const INITIAL_HBAR_BALANCE_ENTITY = {
  entityBalance: 0.00,
  entityIcon: "HBAR",
  entitySymbol: "ℏ",
  entityId: "",
  entityType: "HBAR",
};

export const useBalances = () => {
  const { dispatch, currentUser } = useStore();
  const { User } = useApiInstance();
  const [balanceQueryTimer, setBalanceQueryTimer] = useState<NodeJS.Timeout | null>(null);

  const checkAndUpdateEntityBalances = useCallback(async (topup?: boolean) => {
    try {
      const balancesData = await User.getTokenBalances();
      let availableBudget = 0;
      if (topup) {
        const currentUserUpdated = await User.getCurrentUser();
        availableBudget = currentUserUpdated.available_budget
        dispatch({ type: "UPDATE_CURRENT_USER", payload: currentUserUpdated })
      } else {
        availableBudget = Number(currentUser?.available_budget)
      }

      const balances: EntityBalances[] = [
        {
          ...JSON.parse(JSON.stringify(INITIAL_HBAR_BALANCE_ENTITY)),
          entityBalance: availableBudget,
          entityId: currentUser?.hedera_wallet_id ?? "",
        },
        ...balancesData.map((d) => ({
          entityBalance: d.available_balance.toFixed(4),
          entityIcon: d.token_symbol,
          entitySymbol: "",
          entityId: d.token_id,
          entityType: d.token_type,
          decimals: d.decimals,
        })),
      ];

      dispatch({ type: "SET_BALANCES", payload: balances });
      toast.success("Balance updated successfully.");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }, [User, currentUser, dispatch]);

  const startBalanceQueryTimer = useCallback(() => {
    if (balanceQueryTimer) clearTimeout(balanceQueryTimer);
    setBalanceQueryTimer(setTimeout(() => checkAndUpdateEntityBalances(true), 35000));
  }, [balanceQueryTimer, checkAndUpdateEntityBalances]);

  useEffect(() => {
    if (currentUser?.hedera_wallet_id) {
      checkAndUpdateEntityBalances();
    }
  }, [currentUser?.hedera_wallet_id]);

  return {
    checkAndUpdateEntityBalances,
    startBalanceQueryTimer,
  };
};