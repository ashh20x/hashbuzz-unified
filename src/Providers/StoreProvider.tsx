import React, { useCallback } from "react";
import { useCookies } from "react-cookie";
import { Auth } from "../APIConfig/api";
import { CurrentUser } from "../types";
import { AppState } from "../types/state";

interface StoreContextType extends AppState {
  updateState: React.Dispatch<React.SetStateAction<AppState>>;
}

const StoreContext = React.createContext<StoreContextType | null>(null);

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, updateState] = React.useState<AppState>({});
  const [cookies, setCookie] = useCookies(["token", "refreshToken"]);

  const intervalRef = React.useRef<NodeJS.Timer>();

  const getBalances = React.useCallback(() => {
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
      // setState((_d) => ({ ..._d, user: localData, token: cookies.token }));
    }
  }, [cookies]);

  React.useEffect(() => {
    getBalances();
  }, []);

  const getToken = useCallback(async () => {
    const data = await Auth.refreshToken(cookies.refreshToken);
    if (data) {
      setCookie("token", data.token);
      setCookie("refreshToken", data.refreshToken);
      // clearInterval(intervalRef.current);
      updateState((_d) => ({ ..._d, auth: data }));
    }
  }, [cookies.refreshToken, setCookie]);

  React.useEffect(() => {
    const interval = setInterval(() => getToken(), 20 * 60 * 1000);
    intervalRef.current = interval;
    return () => clearInterval(interval);
  }, [getToken]);

  const value = React.useMemo(
    () => ({
      state,
      updateState,
    }),
    [state]
  );

  return <StoreContext.Provider value={{ ...value.state, updateState: value.updateState }}>{children}</StoreContext.Provider>;
};

export const useStore = () => {
  const value = React.useContext(StoreContext);
  return value;
};
