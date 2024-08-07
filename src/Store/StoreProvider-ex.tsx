import React from "react";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import { useApiInstance } from "../APIConfig/api";
import { getErrorMessage } from "../Utilities/helpers";
import { CurrentUser } from "../types";
import { AppState, EntityBalances } from "../types/state";

// Defines the type for the context including the AppState and an update function.
interface StoreContextType extends AppState {
  checkRefresh: boolean;
  updateState: React.Dispatch<React.SetStateAction<AppState>>;
  checkAndUpdateEntityBalances: () => Promise<void>;
  startBalanceQueryTimer: () => void;
}

export const INITIAL_HBAR_BALANCE_ENTITY: EntityBalances = {
  entityBalance: "00.00",
  entityIcon: "HBAR",
  entitySymbol: "ℏ",
  entityId: "",
  entityType: "HBAR",
};

// Create a context with a default value of null.
const StoreContext = React.createContext<StoreContextType | null>(null);

const INITIAL_STATE: AppState = {
  ping: {
    status: false,
    hedera_wallet_id: "",
  },
  checkRefresh: false,
  balances: [],
  toasts: [],
  currentUser: undefined,
  auth: undefined,
};

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [cookies] = useCookies(["aSToken"]);
  const [balanceQueryTimer, setBalanceQueryTimer] = React.useState<NodeJS.Timeout | null>(null);
  const [state, updateState] = React.useState<AppState>(INITIAL_STATE);
  const { Auth, User } = useApiInstance();

  const accountId = state.currentUser?.hedera_wallet_id;

  const checkAndUpdateLoggedInUser = React.useCallback(() => {
    const localData = localStorage.getItem("user");
    if (localData) {
      const currentUser = JSON.parse(localData) as CurrentUser;
      const { aSToken } = cookies;
      updateState((prevState) => ({
        ...prevState,
        currentUser,
        auth: {
          aSToken,
        },
      }));
    }
  }, [cookies]);

  const checkAndUpdateEntityBalances = React.useCallback(async (topup = false) => {
    try {
      const balancesData = await User.getTokenBalances();
      let available_budget = 0;
      if (!topup) {
        available_budget = Number(state.currentUser?.available_budget);
      } else {
        const currentUser = await User.getCurrentUser();
        available_budget = currentUser?.available_budget ?? 0;
      }

      updateState((prevState) => {
        const balances: EntityBalances[] = [
          {
            ...INITIAL_HBAR_BALANCE_ENTITY,
            entityBalance: (available_budget / 1e8).toFixed(4),
            entityId: prevState.currentUser?.hedera_wallet_id ?? "",
          },
        ];

        balancesData.forEach((d) => {
          balances.push({
            entityBalance: d.available_balance.toFixed(4),
            entityIcon: d.token_symbol,
            entitySymbol: "",
            entityId: d.token_id,
            entityType: d.token_type,
            decimals: d.decimals,
          });
        });

        return { ...prevState, balances };
      });

      toast.success("Balance is updated successfully.");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }, [User, state.currentUser?.available_budget, state.currentUser?.hedera_wallet_id]);

  const authCheckPing = React.useCallback(async () => {
    console.log("Auth" , Auth);
    try {
      const data = await Auth.authPing();
      if (data.hedera_wallet_id) {
        updateState((prevState) => ({
          ...prevState,
          checkRefresh: true,
          ping: { status: true, hedera_wallet_id: data.hedera_wallet_id },
        }));
      }
      return { ping: true };
    } catch (error) {
      updateState(INITIAL_STATE);
      return { ping: false };
    }
  }, [Auth]);

  const startBalanceQueryTimer = React.useCallback(() => {
    if (balanceQueryTimer) clearTimeout(balanceQueryTimer);
    setBalanceQueryTimer(
      setTimeout(() => checkAndUpdateEntityBalances(true), 35000)
    ); // 35 seconds
  }, [balanceQueryTimer, checkAndUpdateEntityBalances]);

  React.useEffect(() => {
    if (cookies.aSToken) {
      authCheckPing();
    }
  }, [authCheckPing, cookies.aSToken , Auth]);

  React.useEffect(() => {
    if (state.ping.status) {
      checkAndUpdateLoggedInUser();
    }
  }, [checkAndUpdateLoggedInUser, state.ping.status]);

  React.useEffect(() => {
    if (accountId) {
      checkAndUpdateEntityBalances();
    }
  }, [accountId, checkAndUpdateEntityBalances]);

  React.useEffect(() => {
    const params = new URL(document.location.href).searchParams;
    const token = params.get("aSToken");
    const userId = params.get("user_id");
    const brandConnection = params.get("brandConnection");
    const authStatus = params.get("authStatus");
    const message = params.get("message");

    if (authStatus === "fail" || brandConnection === "fail") {
      toast.error(message ?? "Error while integration.");
    } else if (brandConnection === "success") {
      toast.success(message ?? "Integration completed successfully.");
    } else if (token && userId) {
      toast.success("Integration completed.");
    }
  }, []);

  const contextValue = React.useMemo(
    () => ({
      ...state,
      updateState,
      authCheckPing,
      checkAndUpdateEntityBalances,
      startBalanceQueryTimer,
    }),
    [state, authCheckPing, checkAndUpdateEntityBalances, startBalanceQueryTimer]
  );

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};

// Hook function for accessing the context.
export const useStore = () => {
  const context = React.useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};
