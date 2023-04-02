import React, { useCallback } from "react";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import { useApiInstance } from "../APIConfig/api";
// import { Auth } from "../APIConfig/api";
import { CurrentUser } from "../types";
import { AppState } from "../types/state";
import { getErrorMessage } from "../Utilities/Constant";

interface StoreContextType extends AppState {
  updateState: React.Dispatch<React.SetStateAction<AppState>>;
  // apiInstance?: AxiosInstance;
}

const StoreContext = React.createContext<StoreContextType | null>(null);

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, updateState] = React.useState<AppState>({balances: [
    {
      entityBalance: "1234.1245",
      entityIcon: "ℏ",
      entitySymbol: "ℏ",
      entityId: "",
      entityType: "HBAR",
    },
  ]});
  const [cookies, setCookie] = useCookies(["token", "refreshToken", "adminToken"]);
  // const [axiosInstance, setAxiosInstance] = React.useState<AxiosInstance | undefined>();
  const { Auth , User } = useApiInstance();

  const intervalRef = React.useRef<NodeJS.Timer>();

  const checkAndUpdateLoggedInUser = React.useCallback(() => {
    let localData = localStorage.getItem("user");
    if (localData) {
      const currentUser = JSON.parse(localData) as CurrentUser;
      const { token, refreshToken } = cookies;
      updateState((pevState) => ({
        ...pevState,
        currentUser,
        auth: {
          token,
          refreshToken,
        },
      }));
    }
  }, [cookies]);

  const checkAndUpdateEntityBalances = React.useCallback(() => {
    try {
      (async () => {
        const balancesData = await User.getTokenBalances();
        const formateBalanceRecord = balancesData.map((d) => ({
          entityBalance: d.available_balance.toFixed(4),
          entityIcon: d.token_symbol,
          entitySymbol: "",
          entityId: d.token_id,
          entityType: d.token_type,
        }));
        updateState((_state) => {
          _state.balances = [
            {
              ..._state.balances[0],
              entityBalance: (state?.currentUser?.available_budget ?? 0 / 1e8).toFixed(4),
              entityId: state?.currentUser?.hedera_wallet_id ?? "",
            },
            ...formateBalanceRecord,
          ];
          return { ..._state };
        });
      })();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }, [User, state?.currentUser?.available_budget, state?.currentUser?.hedera_wallet_id]);

  React.useEffect(() => {
    checkAndUpdateLoggedInUser();
    checkAndUpdateEntityBalances();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // React.useEffect(() => {
  //   const instance = axios.create({
  //     baseURL: process.env.REACT_APP_DAPP_API,
  //     timeout: 15000,
  //     headers: {
  //       Authorization: `Token ${cookies.token}`,
  //       "Content-type": "application/json",
  //     },
  //   });
  //   instance.interceptors.response.use(
  //     (response) => response,
  //     (error) => {
  //       // whatever you want to do with the error
  //       // if (error.response.status === 401) forceLogout();
  //       // throw error;
  //       toast.error(error?.message ?? "Server error");
  //       console.log(error);
  //     }
  //   );
  //   setAxiosInstance(instance);
  // }, [cookies.token]);

  const getToken = useCallback(async () => {
    const data = await Auth.refreshToken(cookies.refreshToken);
    setCookie("token", data?.token);
    setCookie("refreshToken", data?.refreshToken);

    if (data.adminToken) setCookie("adminToken", data.adminToken);
    // clearInterval(intervalRef.current);
    updateState((_d) => ({ ..._d, auth: data }));
  }, [Auth, cookies.refreshToken, setCookie]);

  React.useEffect(() => {
    const interval = setInterval(() => getToken(), 20 * 60 * 1000);
    intervalRef.current = interval;
    return () => clearInterval(interval);
  }, [getToken]);

  const value = React.useMemo(
    () => ({
      state,
      updateState,
      // axiosInstance,
    }),
    [state]
  );

  return <StoreContext.Provider value={{ ...value.state, updateState: value.updateState }}>{children}</StoreContext.Provider>;
};

export const useStore = () => {
  const value = React.useContext(StoreContext);
  return value;
};
