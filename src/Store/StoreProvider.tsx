import React from "react";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import { useApiInstance } from "../APIConfig/api";
import { getErrorMessage } from "../Utilities/helpers";
import { CurrentUser } from "../types";
import { AppState } from "../types/state";

// Defines the type for the context including the AppState and an update function.
interface StoreContextType extends AppState {
  updateState: React.Dispatch<React.SetStateAction<AppState>>;
  authCheckPing: () => Promise<{ ping: boolean }>,

}

const INITIAL_HBAR_BALANCE_ENTITY = {
  entityBalance: "00.00",
  entityIcon: "ℏ",
  entitySymbol: "ℏ",
  entityId: "",
  entityType: "HBAR",
};

// Create a context with a default value of null.
const StoreContext = React.createContext<StoreContextType | null>(null);

const INITIAL_STATE = {
  ping: {
    status: false,
    hedera_wallet_id: "",
  },
  balances: [],
  toasts: []
};

// Component that provides the state to its children.
// It manages the state of the application including user data and token information.
export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [cookies] = useCookies(["aSToken"]);
  const [state, updateState] = React.useState<AppState>(JSON.parse(JSON.stringify(INITIAL_STATE)));
  const { Auth, User } = useApiInstance();

  const accountId = state.currentUser?.hedera_wallet_id;

  const checkAndUpdateLoggedInUser = React.useCallback(() => {
    let localData = localStorage.getItem("user");
    if (localData) {
      const currentUser = JSON.parse(localData) as CurrentUser;
      const { aSToken } = cookies;
      updateState((pevState) => ({
        ...pevState,
        currentUser,
        auth: {
          aSToken,
        },
      }));
    }
  }, [cookies]);

  const checkAndUpdateEntityBalances = React.useCallback(async () => {
    try {
      const balancesData = await User.getTokenBalances();
      const available_budget = state.currentUser?.available_budget;

      updateState((_state) => {
        if (available_budget && available_budget > 0) {
          _state.balances.push({
            ...INITIAL_HBAR_BALANCE_ENTITY,
            entityBalance: (available_budget / 1e8).toFixed(4),
            entityId: state?.currentUser?.hedera_wallet_id ?? "",
          })
        }
        if (balancesData.length > 0) {
          for (let index = 0; index < balancesData.length; index++) {
            const d = balancesData[index];
            _state.balances.push({
              entityBalance: d.available_balance.toFixed(4),
              entityIcon: d.token_symbol,
              entitySymbol: "",
              entityId: d.token_id,
              entityType: d.token_type,
            })
          }
        }
        return { ..._state };
      });
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }, [User, state?.currentUser?.available_budget, state?.currentUser?.hedera_wallet_id]);

  const authCheckPing = React.useCallback(async () => {
    try {
      const data = await Auth.authPing();
      if (data.hedera_wallet_id) updateState((_state) => ({ ..._state, ping: { status: true, hedera_wallet_id: data.hedera_wallet_id } }));
      return { ping: true }
    } catch (error) {
      updateState(JSON.parse(JSON.stringify(INITIAL_STATE)));
      return { ping: false }
    }
  }, [Auth]);

  React.useEffect(() => {
    authCheckPing();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (state.ping.status) checkAndUpdateLoggedInUser();
  }, [checkAndUpdateLoggedInUser, state.ping.status]);

  React.useEffect(() => {
    if (accountId) checkAndUpdateEntityBalances();
  }, [accountId]);

  React.useEffect(() => {
    const params = new URL(document.location.href).searchParams;
    const token = params.get("aSToken");
    const userId = params.get("user_id");
    const brandConnection = params.get("brandConnection");
    const authStatus = params.get("authStatus");
    const message = params.get("message");

    if ((authStatus && authStatus === "fail") || (brandConnection && brandConnection === "fail")) {
      updateState((_d) => {
        _d.toasts.push({ type: "error", message: message ?? "Error while integration." })
        return { ..._d, toasts: [..._d.toasts] }
      })
    }

    if (brandConnection && brandConnection === "success") {
      updateState((_d) => {
        _d.toasts.push({ type: "success", message: message ?? "Integration completed successfully." })
        return { ..._d, toasts: [..._d.toasts] }
      })
    }

    if (token && userId) {
      updateState((_d) => {
        _d.toasts.push({ type: "success", message: "Integration completed." })
        return { ..._d, toasts: [..._d.toasts] }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const value = React.useMemo(
    () => ({
      state,
      updateState,
      authCheckPing
    }),
    [authCheckPing, state]
  );

  return <StoreContext.Provider value={{ ...value.state, updateState: value.updateState, authCheckPing }}>{children}</StoreContext.Provider>;
};

// Hook function for accessing the context.
export const useStore = () => {
  const value = React.useContext(StoreContext);
  return value;
};
