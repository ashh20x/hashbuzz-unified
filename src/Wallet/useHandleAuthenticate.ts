import { useCallback, useContext, useState } from "react";
import { HashconectServiceContext } from "./hashconnectService";
import { useApiInstance } from "../APIConfig/api";
import { useCookies } from "react-cookie";
import { useAuth } from "../Store/useAuth";
import { toast } from "react-toastify";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
interface AuthenticationLog {
  type: "error" | "info" | "success";
  message: string;
}

export const useHandleAuthenticate = () => {
  console.log("useHandleAuthenticate is called")
  const { topic, pairingData, hashconnect, setState } = useContext(HashconectServiceContext);
  const { Auth } = useApiInstance();
  const [_, setCookies, removeCookie] = useCookies(["aSToken", "refreshToken"]);
  const { authCheckPing } = useAuth();
  const [authStatusLog, setAuthStatusLog] = useState<AuthenticationLog[]>([{ type: "info", message: "Authentication Called" }]);

  const handleAuthenticate = useCallback(async () => {
    const accountId = pairingData?.accountIds[0];
    console.log("Authentication Initialized::");

    await delay(1000);
    const { payload, server } = await Auth.createChallenge({ url: window.location.origin });
    if (topic && accountId) {
      await delay(1500);
      hashconnect
        ?.authenticate(topic, accountId, server.account, Buffer.from(server.signature), payload)
        .then(async (authResponse) => {
          if (authResponse.success && authResponse.signedPayload && authResponse.userSignature) {
            const { signedPayload, userSignature } = authResponse;
            const authGenResponse = await Auth.generateAuth({
              payload: signedPayload.originalPayload,
              clientPayload: signedPayload,
              signatures: {
                server: server.signature,
                wallet: {
                  accountId,
                  value: Buffer.from(userSignature).toString("base64"),
                },
              },
            });

            if (authGenResponse && authGenResponse.deviceId && authGenResponse.ast) {
              const {refreshToken , deviceId , ast} = authGenResponse
        
              localStorage.setItem("device_id", deviceId);
              setCookies("aSToken", ast, {
                expires: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
                sameSite: true,
                maxAge: 24 * 60 * 60,
              });
              setCookies("refreshToken" ,refreshToken ,{sameSite:true} )
              setAuthStatusLog((_d) => [..._d, { type: "success", message: "Authentication Completed." }]);
              await delay(1500);
              await authCheckPing();
              toast.info("Login Successful");
              return { auth: true, ast };
            }
          }
          if (authResponse.error) {
            setAuthStatusLog((_d) => [..._d, { type: "error", message: "Error while signing::-" + authResponse.error }]);
          }
        })
        .catch((err) => {
          removeCookie("refreshToken");
          localStorage.clear();
          removeCookie("aSToken");
          setAuthStatusLog((_d) => [..._d, { type: "error", message: "Error while Authenticating::-" + err.message }]);
        });
    }
  }, [Auth, hashconnect, pairingData?.accountIds, topic, setCookies, removeCookie, authCheckPing]);

  return {handleAuthenticate,authStatusLog};
};
