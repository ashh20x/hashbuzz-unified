import { HashConnect, HashConnectTypes, MessageTypes } from "hashconnect";
import { HashConnectConnectionState } from "hashconnect/dist/types";
import React, { useCallback } from "react";

export const fetchAccountIfoKey = async (accountId: string) => {
  const url = "https://testnet.mirrornode.hedera.com/api/v1/accounts/" + accountId;
  const response = await fetch(url);
  const data = await response.json();
  const key: string = data.key.key as string;
  return key;
};

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

export const HashconectServiceContext = React.createContext<
  Partial<
    HashconnectContextAPI & {
      network: "testnet" | "mainnet" | "previewnet";
      setState: React.Dispatch<React.SetStateAction<Partial<HashconnectContextAPI>>>;
      hashconnect: HashConnect | null;
    }
  >
>({});

export const HashconnectAPIProvider = ({ children, metaData, network, debug }: ProviderProps) => {
  const [state, setState] = React.useState<Partial<HashconnectContextAPI>>({});
  const hashconnectRef = React.useRef<HashConnect | null>(null); // Ref for hashconnect instance

  const initHashconnect = useCallback(async () => {
    if (!hashconnectRef.current) {
      hashconnectRef.current = new HashConnect(true); // Initialize hashconnect if not already initialized
    }
    const hashconnect = hashconnectRef.current;
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

  const onConnectionChange = useCallback(
    (data: HashConnectConnectionState) => {
      console.log("hashconnect state change event", state);
      setState((exState) => ({ ...exState, state: data }));
    },
    []
  );

  //register events
  React.useEffect(() => {
    initHashconnect();
    hashconnectRef?.current?.foundExtensionEvent.on(onFoundExtension);
    hashconnectRef?.current?.pairingEvent.on(onParingEvent);
    hashconnectRef?.current?.connectionStatusChangeEvent.on(onConnectionChange);
    return () => {
      hashconnectRef?.current?.foundExtensionEvent.off(onFoundExtension);
      hashconnectRef?.current?.pairingEvent.on(onParingEvent);
      hashconnectRef?.current?.connectionStatusChangeEvent.off(onConnectionChange);
    };
  }, []);

  const value = React.useMemo(
    () => ({
      ...state,
      setState,
      network,
      hashconnect: hashconnectRef.current,
    }),
    [network, state]
  );

  return <HashconectServiceContext.Provider value={value}>{children}</HashconectServiceContext.Provider>;
};