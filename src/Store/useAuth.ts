import { useCallback, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useApiInstance } from "../APIConfig/api";
import { useStore } from "./StoreProvider";
import debounce from "lodash/debounce";

export const useAuth = () => {
  const [cookies] = useCookies(["aSToken"])
  const { dispatch } = useStore();
  const { Auth } = useApiInstance();

  const authCheckPing = useCallback(async () => {
    try {
      const data = await Auth.authPing();
      if (data.wallet_id) {
        dispatch({ type: "SET_PING", payload: { status: true, hedera_wallet_id: data.wallet_id } });
      }
      return { ping: true };
    } catch (err) {
      dispatch({ type: "RESET_STATE" });
      return { ping: false };
    }
  }, [Auth, dispatch]);

  const debouncedAuthCheckPing = useCallback(debounce(authCheckPing, 2000), [authCheckPing]);

  useEffect(() => {
    if(cookies.aSToken) debouncedAuthCheckPing();

    // Clean up the debounce effect on unmount
    return () => {
      debouncedAuthCheckPing.cancel();
    };
  }, [cookies.aSToken]);

  return {
    authCheckPing: debouncedAuthCheckPing,
  };
};
