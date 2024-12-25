import { useCallback, useContext, useState } from "react";
import { HashconectServiceContext } from "./hashconnectService";
import { useApiInstance } from "../APIConfig/api";
import { useCookies } from "react-cookie";
import { useAuth } from "../Store/useAuth";
import { toast } from "react-toastify";
import { useStore } from "../Store/StoreProvider";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
interface AuthenticationLog {
  type: "error" | "info" | "success";
  message: string;
}

export const useHandleAuthenticate = () => {
  console.log("useHandleAuthenticate is called")
  const { topic, pairingData, hashconnect } = useContext(HashconectServiceContext);
  const { Auth } = useApiInstance();
  const [_, setCookies, removeCookie] = useCookies(["aSToken", "refreshToken"]);
  const { authCheckPing } = useAuth();
  const [authStatusLog, setAuthStatusLog] = useState<AuthenticationLog[]>([{ type: "info", message: "Authentication Called" }]);
  const {dispatch}  = useStore()

  const handleAuthenticate = useCallback(async () => {
    try {
      const accountId = pairingData?.accountIds[0];
      if (!topic || !accountId) return;
  
      await delay(1000);
      const { payload, server } = await Auth.createChallenge({ url: window.location.origin });
  
      await delay(1500);
      const authResponse = await hashconnect?.authenticate(
        topic,
        accountId,
        server.account,
        Buffer.from(server.signature),
        payload
      );
      
      if (authResponse?.success && authResponse?.signedPayload && authResponse?.userSignature) {
        const { signedPayload, userSignature } = authResponse;
        const authGenResponse = await Auth.generateAuth({
          payload: signedPayload?.originalPayload,
          clientPayload: signedPayload,
          signatures: {
            server: server.signature,
            wallet: {
              accountId,
              value: Buffer.from(userSignature).toString("base64"),
            },
          },
        });
  
        if (authGenResponse?.deviceId && authGenResponse?.ast) {
          const { refreshToken, deviceId, ast, message } = authGenResponse;
  
          localStorage.setItem("device_id", deviceId);
          setCookies("aSToken", ast, {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            sameSite: false,
            maxAge: 24 * 60 * 60,
          });
          setCookies("refreshToken", refreshToken, { sameSite: false });
          setAuthStatusLog((logs) => [...logs, { type: "success", message: "Authentication Completed." }]);
          dispatch({ type: "SET_AUTH_CRED", payload: authGenResponse });
          
          await delay(1500);
          await authCheckPing();
          toast.info(message ?? "Login Successful");
  
          return { auth: true, ast };
        }
      }
  
      if (authResponse?.error) {
        setAuthStatusLog((logs) => [...logs, { type: "error", message: `Error while signing: ${authResponse.error}` }]);
      }
    } catch (err) {
      removeCookie("refreshToken");
      localStorage.clear();
      removeCookie("aSToken");
      //@ts-ignore
      setAuthStatusLog((logs) => [...logs, { type: "error", message: `Error while Authenticating: ${err.message}` }]);
    }
  }, [Auth, hashconnect, pairingData?.accountIds, topic, setCookies, removeCookie, authCheckPing]);
  

  return {handleAuthenticate,authStatusLog};
};
