import React, { useCallback } from "react";
import { useCookies } from "react-cookie";
import { useDappAPICall } from "../APIConfig/dAppApiServices";
import { delay } from "../Utilities/Constant";

const StoreContext = React.createContext({
  state: {},
  setStore: Function,
  updateUserData: Function,
});

export const StoreProvider = ({ children }) => {
  const [state, setState] = React.useState({
    available_budget: 0,
    username: "",
    brandAccount: "",
    token: "",
    user: {},
  });
  const { dAppAPICall, dAppAuthAPICall } = useDappAPICall();
  const [cookies, setCookie] = useCookies(["token", "refreshToken"]);
  const intervalRef = React.useRef();

  const getBalances = React.useCallback(async () => {
    let localData = localStorage.getItem("user");
    if (localData) {
      localData = JSON.parse(localData);
      setState((_d) => ({ ..._d, user: localData, token: cookies.token }));
    }
    try {
      // const data = await dAppAPICall({
      //   url: "users/get-balances",
      //   method: "POST",
      //   data: {
      //     accountId: localData?.hedera_wallet_id,
      //     contractBal: false,
      //   },
      // });
      // if (data.available_budget) setState((p) => ({ ...p, available_budget: data.available_budget }));
    } catch (error) {
      console.log(error);
    }
  }, [cookies.token]);

  React.useEffect(() => {
    (async () => {
      await delay(1500);
      await getBalances();
    })();
  }, []);

  const getToken = useCallback(async () => {
    const data = await dAppAuthAPICall({
      url: "refreshToken",
      method: "POST",
      data: { refreshToken: cookies.refreshToken },
    });
    if (data) {
      setCookie("token", data.token);
      setCookie("refreshToken", data.refreshToken);
      // clearInterval(intervalRef.current);
    }
  }, [cookies.refreshToken, dAppAuthAPICall, setCookie]);

  React.useEffect(() => {
    const interval = setInterval(() => getToken(), 20*60*1000);
    intervalRef.current = interval;
    return () => clearInterval(interval);
  }, [getToken]);

  const updateUserData = useCallback(
    (d) => {
      if (state.user) setState((_d) => ({ ..._d, user: { ..._d.user, ...d } }));
      else setState((_d) => ({ ..._d, user: { ...d } }));
    },
    [state.user]
  );

  const value = React.useMemo(
    () => ({
      state,
      setState,
      updateUserData,
    }),
    [state, updateUserData, setState]
  );

  return (
    <StoreContext.Provider value={{ state: value.state, setStore: value.setState, updateUserData: value.updateUserData }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const value = React.useContext(StoreContext);
  return value;
};
