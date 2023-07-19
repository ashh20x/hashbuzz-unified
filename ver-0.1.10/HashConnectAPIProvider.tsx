import { HashConnect, HashConnectTypes, MessageTypes } from "hashconnect";
import { HashConnectConnectionState } from "hashconnect/dist/types";
import React, { useCallback, useEffect, useState } from "react";

//initialize hashconnect
const hashConnect = new HashConnect(true);

export interface SavedPairingData {
  metadata: HashConnectTypes.AppMetadata | HashConnectTypes.WalletMetadata;
  pairingData: MessageTypes.ApprovePairing;
  privKey?: string;
}

export interface PropsType {
  children: React.ReactNode;
  network: "testnet" | "mainnet" | "previewnet";
  metaData?: HashConnectTypes.AppMetadata;
  debug?: boolean;
}

//Intial App config
let APP_CONFIG: HashConnectTypes.AppMetadata = {
  name: "dApp Example",
  description: "An example hedera dApp",
  icon: "https://absolute.url/to/icon.png",
};

export interface HashconnectContextAPI {
  availableExtension: HashConnectTypes.WalletMetadata;
  status: HashConnectConnectionState;
  initData: HashConnectTypes.InitilizationData;
  pairingData: MessageTypes.ApprovePairing;
}

export const HashConnectAPIContext = React.createContext<
  Partial<
    HashconnectContextAPI & {
      setState: React.Dispatch<React.SetStateAction<Partial<HashconnectContextAPI>>>;
      network: "testnet" | "mainnet" | "previewnet";
    }
  >
>({ status: HashConnectConnectionState.Disconnected });

export const HashConnectAPIProvider = ({ children, metaData, network, debug }: PropsType) => {
  const [stateData, setState] = useState<Partial<HashconnectContextAPI>>({});

  //initialise the thing
  const initializeHashConnect = useCallback(async () => {
    const initData = await hashConnect.init(metaData ?? APP_CONFIG, network);
    setState((_d) => ({ ..._d, initData }));
  }, [metaData, network]);

  const foundExtensionEventHandler = useCallback(
    (data: HashConnectTypes.WalletMetadata) => {
      if (debug) console.log("====foundExtensionEvent====", data);
      setState((exState) => ({ ...exState, availableExtension: data }));
    },
    [debug]
  );

  // const saveDataInLocalStorage = useCallback(
  //   (data: MessageTypes.ApprovePairing) => {
  //     if (debug) console.info("===============Saving to localstorage::=============");
  //     console.log(data);
  //   },
  //   [debug]
  // );

  const pairingEventHandler = useCallback(
    (data: MessageTypes.ApprovePairing) => {
      if (debug) console.log("===Wallet connected=====", data);
      setState((exState) => ({ ...exState, pairingData: data }));
      // saveDataInLocalStorage(data);
    },
    [debug]
  );

  const acknowledgeEventHandler = useCallback(
    (data: MessageTypes.Acknowledge) => {
      if (debug) console.log("====::acknowledgeData::====", data);
      setState((iniData) => ({ ...iniData, acknowledgeData: data }));
    },
    [debug]
  );

  const onStatusChange = (state: HashConnectConnectionState) => {
    console.log("hashconnect state change event", state);
    setState((exState) => ({ ...exState, state }));
  };

  //Registering the events
  useEffect(() => {
    hashConnect.foundExtensionEvent.on(foundExtensionEventHandler);
    hashConnect.pairingEvent.on(pairingEventHandler);
    hashConnect.acknowledgeMessageEvent.on(acknowledgeEventHandler);
    hashConnect.connectionStatusChangeEvent.on(onStatusChange);
    return () => {
      hashConnect.foundExtensionEvent.off(foundExtensionEventHandler);
      hashConnect.pairingEvent.off(pairingEventHandler);
      hashConnect.acknowledgeMessageEvent.off(acknowledgeEventHandler);
      hashConnect.connectionStatusChangeEvent.off(onStatusChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    initializeHashConnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <HashConnectAPIContext.Provider value={{ ...stateData, setState, network }}>{children}</HashConnectAPIContext.Provider>;
};

const defaultProps: Partial<PropsType> = {
  metaData: {
    name: "dApp Example",
    description: "An example hedera dApp",
    icon: "https://absolute.url/to/icon.png",
  },
  network: "testnet",
  debug: false,
};

HashConnectAPIProvider.defaultProps = defaultProps;

// export const HashConnectProvider = React.memo(HashConnectProviderWarped);

export const useHashConnect = () => {
  const value = React.useContext(HashConnectAPIContext);
  const { initData } = value;

  const connectToExtension = async () => {
    //this will automatically pop up a pairing request in the HashPack extension
    hashConnect.connectToLocalWallet();
  };

  const sendTransaction = async (trans: Uint8Array, acctToSign: string, return_trans: boolean = false, hideNfts: boolean = false) => {
    const transaction: MessageTypes.Transaction = {
      topic: initData?.topic!,
      byteArray: trans,

      metadata: {
        accountToSign: acctToSign,
        returnTransaction: return_trans,
      },
    };

    return await hashConnect.sendTransaction(initData?.topic!, transaction);
  };


  const disconnect = () => {
    if (initData?.topic) hashConnect.disconnect(initData?.topic);
  };

  return { ...value, connectToExtension, sendTransaction, disconnect };
};

// export default HashConnectProvider;
