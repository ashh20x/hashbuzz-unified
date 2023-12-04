import { HashConnect, HashConnectTypes, MessageTypes } from "hashconnect";
import { HashConnectConnectionState } from "hashconnect/dist/types";
import React, { useCallback } from "react";
import { useCookies } from "react-cookie";
import { useApiInstance } from "../APIConfig/api";
import { useStore } from "../Store/StoreProvider";
import { toast } from "react-toastify";
import { AccountAllowanceApproveTransaction, AccountId, ContractExecuteTransaction, ContractFunctionParameters, ContractId } from "@hashgraph/sdk";
import BigNumber from "bignumber.js";

export const fetchAccountIfoKey = async (accountId: string) => {
  const url = "https://testnet.mirrornode.hedera.com/api/v1/accounts/" + accountId;
  const response = await fetch(url);
  const data = await response.json();
  const key: string = data.key.key as string;
  return key;
};

//create the hashconnect instance
const hashconnect = new HashConnect(true);

export interface ProviderProps {
  children: React.ReactNode;
  network: "testnet" | "mainnet" | "previewnet";
  metaData?: HashConnectTypes.AppMetadata;
  debug?: boolean;
}

const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export interface HashconnectContextAPI {
  availableExtension: HashConnectTypes.WalletMetadata;
  state: HashConnectConnectionState;
  topic: string;
  pairingString: string;
  pairingData: HashConnectTypes.SavedPairingData | null;
}

const appMetadata: HashConnectTypes.AppMetadata = {
  name: "dApp Example",
  description: "An example hedera dApp",
  icon: "https://www.hashpack.app/img/logo.svg",
};

const HashconectServiceContext = React.createContext<
  Partial<
    HashconnectContextAPI & {
      network: "testnet" | "mainnet" | "previewnet";
      setState: React.Dispatch<React.SetStateAction<Partial<HashconnectContextAPI>>>;
    }
  >
>({});

export const HashconnectAPIProvider = ({ children, metaData, network, debug }: ProviderProps) => {
  const [state, setState] = React.useState<Partial<HashconnectContextAPI>>({});

  const initHashconnect = useCallback(async () => {
    //initialize and use returned data
    let initData = await hashconnect.init(metaData ?? appMetadata, network, false);
    const topic = initData.topic;
    const pairingString = initData.pairingString;
    //Saved pairings will return here, generally you will only have one unless you are doing something advanced
    const pairingData = initData.savedPairings[0];

    setState((exState) => ({ ...exState, topic, pairingData, pairingString }));
  }, [metaData, network]);

  const onFoundExtension = (data: HashConnectTypes.WalletMetadata) => {
    console.log("Found extension", data);
    setState((exState) => ({ ...exState, availableExtension: data }));
  };

  const onParingEvent = async (data: MessageTypes.ApprovePairing) => {
    console.log("Paired with wallet", data);
    setState((exState) => ({ ...exState, pairingData: data.pairingData }));
  };

  const onConnectionChange = (data: HashConnectConnectionState) => {
    console.log("hashconnect state change event", state);
    setState((exState) => ({ ...exState, state: data }));
  };

  //register events
  React.useEffect(() => {
    hashconnect.foundExtensionEvent.on(onFoundExtension);
    hashconnect.pairingEvent.on(onParingEvent);
    hashconnect.connectionStatusChangeEvent.on(onConnectionChange);
    return () => {
      hashconnect.foundExtensionEvent.off(onFoundExtension);
      hashconnect.pairingEvent.on(onParingEvent);
      hashconnect.connectionStatusChangeEvent.off(onConnectionChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //Call Initialization
  React.useEffect(() => {
    initHashconnect();
  }, [initHashconnect]);

  const value = React.useMemo(
    () => ({
      ...state,
      setState,
      network,
    }),
    [network, state]
  );

  return <HashconectServiceContext.Provider value={value}>{children}</HashconectServiceContext.Provider>;
};

interface AuthenticationLog {
  type: "error" | "info" | "success";
  message: string;
}

export const useHashconnectService = () => {
  const value = React.useContext(HashconectServiceContext);
  const { topic, pairingData, network, setState } = value;
  const { Auth } = useApiInstance();
  const [cookies, setCookie, removeCookie] = useCookies(["token", "refreshToken"]);
  
  const store = useStore();
  const [_, setCookies, removeCookies] = useCookies(["aSToken"]);
  const [authStatusLog, setAuthStatusLog] = React.useState<AuthenticationLog[]>([{ type: "info", message: "Authentication Called" }]);

  const connectToExtension = async () => {
    //this will automatically pop up a pairing request in the HashPack extension
    hashconnect.connectToLocalWallet();
  };

  const sendTransaction = async (trans: Uint8Array, acctToSign: string, return_trans: boolean = false, hideNfts: boolean = false) => {
    const transaction: MessageTypes.Transaction = {
      topic: topic!,
      byteArray: trans,

      metadata: {
        accountToSign: acctToSign,
        returnTransaction: return_trans,
        hideNft: hideNfts,
      },
    };
    console.log(transaction, "transaction");

    const transactionResponse = await hashconnect.sendTransaction(topic!, transaction);
    return transactionResponse;
  };

  const approveToken = async(accountId:any,data:any)=>{
    let contract_address:any = process.env.REACT_APP_CONTRACT_ADDRESS;
    const provider = hashconnect.getProvider("testnet", topic!, accountId);
    const signer = hashconnect.getSigner(provider);
const approvedToken =
    new AccountAllowanceApproveTransaction().approveTokenAllowance(
      data?.entityId,
      accountId,
      contract_address,
      data.amount.value * Math.pow(10,data.decimals)
    );

  const approveTokenSign = await approvedToken
    .freezeWithSigner(signer)
   
    const signApprove = await approveTokenSign.signWithSigner(signer);
    const responseApprove = await signApprove.executeWithSigner(signer);
    return responseApprove
  }

  const transferTokenToContract = async (accountId: any,data:any) => {
try{
let amount =  data.amount.value * Math.pow(10,data.decimals)
  const provider = hashconnect.getProvider("testnet", topic!, accountId);
  const signer = hashconnect.getSigner(provider);
  let contract_address:any = process.env.REACT_APP_CONTRACT_ADDRESS
  console.log(accountId,data,"TESTING")
  
  const tx = await new ContractExecuteTransaction()
  .setContractId(ContractId.fromString(contract_address))
  .setGas(3000000)
  .setFunction('transferTokenToContract', new ContractFunctionParameters().addAddress(AccountId.fromString(data?.entityId).toSolidityAddress()).addAddress(AccountId.fromString(accountId).toSolidityAddress()).addInt64((new BigNumber(data?.amount?.value* Math.pow(10,data.decimals)))))
  .setTransactionMemo("transfer Token").freezeWithSigner(signer);
  const sign = await tx.signWithSigner(signer);
  const response = await sign.executeWithSigner(signer);
  
  return response;
}catch(err){
  console.log(err);
  return err
}
  }

  const disconnect = React.useCallback(async () => {
    await hashconnect.disconnect(pairingData?.topic!);
    setState!((exState) => ({ ...exState, pairingData: null }))!;
    const logoutResponse = await Auth.doLogout();
    if (logoutResponse.success) {
      removeCookies("aSToken");
      store?.updateState(
        JSON.parse(
          JSON.stringify({
            ping: {
              status: false,
              hedera_wallet_id: "",
            },
            balances: [],
            toasts: [],
          })
        )
      );
    }
    return logoutResponse;
  }, [Auth, pairingData?.topic, removeCookies, setState]);

  const requestAccountInfo = React.useCallback(async () => {
    const request: MessageTypes.AdditionalAccountRequest = {
      topic: topic!,
      network: network!,
      multiAccount: true,
    };

    await hashconnect.requestAdditionalAccounts(topic!, request);
  }, [network, topic]);

  const clearPairings = () => {
    hashconnect.clearConnectionsAndData();
    setState!((exState) => ({ ...exState, pairingData: null }));
  };

  /**
   * @description Authentication of wallet and signatures.
   */
  const handleAuthenticate = React.useCallback(async () => {
    const accountId = pairingData?.accountIds[0];
    //? Authentication process initialized;
    console.log("Authentication Initialized::");
    setAuthStatusLog((_d) => [..._d, { type: "info", message: "Authentication Initialized with account Id " + accountId }]);
    try {
      //? Wait for a second
      await delay(1000);
      //? Getting Challenge Signing
      setAuthStatusLog((_d) => [..._d, { type: "info", message: "Requesting challenge" }]);

      console.log(window.location.origin, 'location');
      const { payload, server } = await Auth.createChallenge({ url: window.location.origin });
      setAuthStatusLog((_d) => [..._d, { type: "info", message: "Challenge received" }]);

      if (topic && accountId) {
        //? Request wallet to sign the challenge.
        setAuthStatusLog((_d) => [..._d, { type: "info", message: "Check wallet. Signing Request is initialized" }]);
        await delay(1500);

        hashconnect
          .authenticate(topic, accountId, server.account, Buffer.from(server.signature), payload)
          .then(async (authResponse) => {
            if (authResponse.success && authResponse.signedPayload && authResponse.userSignature) {
              //? Challenge signed successfully.
              setAuthStatusLog((_d) => [..._d, { type: "success", message: "Wallet signature received" }]);

              const { signedPayload, userSignature } = authResponse;

              //? Requesting for verifications of the signatures
              setAuthStatusLog((_d) => [..._d, { type: "info", message: "Signature verification initialized" }]);

              const { ast } = await Auth.generateAuth({
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
              console.log(ast, "checking");

              if (ast) {
                //? Signatures verifies successfully and token received.
                setAuthStatusLog((_d) => [..._d, { type: "success", message: "Verifies successfully." }]);

                setCookies("aSToken", ast, {
                  expires: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
                  sameSite: true,
                  maxAge: 24 * 60 * 60,
                });
                store?.updateState((_prevState) => ({ ..._prevState, auth: { ..._prevState.auth, aSToken: ast } }));

                setAuthStatusLog((_d) => [..._d, { type: "success", message: "Authentication Completed." }]);
                await delay(1500);
                await store?.authCheckPing();
                toast.info("Login Successful");
                return { auth: true, ast };
              }
            }

            if (authResponse.error) {
              //! Error while signing the challenge by wallet
              console.log(authResponse.error);

              setAuthStatusLog((_d) => [..._d, { type: "error", message: "Error while signing::-" + authResponse.error }]);
            }
          })
          .catch((err) => {
            //! Error while authentication.
            console.log("Error from authenticate", err);
            removeCookie("refreshToken");
            localStorage.clear();
            removeCookie("token");
            setAuthStatusLog((_d) => [..._d, { type: "error", message: "Error while Authenticating::-" + err.message }]);
          });
      }
    } catch (err) {
      console.log(err);

      //@ts-ignore

      setAuthStatusLog((_d) => [..._d, { type: "error", message: "Error from validation::-" + err.message }]);
    }
  }, [Auth, pairingData?.accountIds, setCookies, store, topic]);

  return {
    ...value,
    connectToExtension,
    sendTransaction,
    disconnect,
    requestAccountInfo,
    transferTokenToContract,
    clearPairings,
    hashconnect,
    approveToken,
    handleAuthenticate,
    authStatusLog,
  };
};
