import { useCallback, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import { useApiInstance } from "../APIConfig/api";
import { getErrorMessage } from "../Utilities/helpers";
import { useStore } from "./StoreProvider";
import { EntityBalances } from "../types";

const INITIAL_HBAR_BALANCE_ENTITY = {
    entityBalance: "00.00",
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
        const availableBudget = topup
          ? (await User.getCurrentUser())?.available_budget
          : Number(currentUser?.available_budget);
  
        const balances: EntityBalances[] = [
          {
            ...INITIAL_HBAR_BALANCE_ENTITY,
            entityBalance: (availableBudget / 1e8).toFixed(4),
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
    }, [User, currentUser , dispatch]);
  
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