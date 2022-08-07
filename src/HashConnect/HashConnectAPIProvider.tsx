import { HashConnect, HashConnectTypes, MessageTypes } from "hashconnect";
import React, { useCallback, useEffect, useState } from "react";
import {SaveData , HashConnectProviderAPI , InitialStateData , PropsType} from './types'
import {INITIAL_STATE_DATA , HashConnectAPIContext} from './hashconnectAPIContext'


//initialize hashconnect
const hashConnect = new HashConnect(true);


//Intial App config
let APP_CONFIG: HashConnectTypes.AppMetadata = {
  name: "dApp Example",
  description: "An example hedera dApp",
  icon: "https://absolute.url/to/icon.png",
};


//saving into localdata
export const loadLocalData = (): null | SaveData => {
  let foundData = localStorage.getItem("hashconnectData");
  if (foundData) {
    const saveData: SaveData = JSON.parse(foundData);
    return saveData;
  } else {
    return null;
  }
};



export const HashConnectAPIProvider = ({ children, metaData, netWork, debug }: PropsType) => {
  const localData = loadLocalData();

  const [stateData, setStateData] = useState<InitialStateData>(INITIAL_STATE_DATA);

  const resetSaveData = useCallback(() => {
    setStateData((iniData) => ({ ...iniData, saveData: { topic: "", pairingString: "", privateKey: "", pairedAccounts: [], pairedWalletData: null } }));
  }, []);

  const resetTransactionResponse = useCallback(() => {
    setStateData((iniData) => ({ ...iniData, transactionResponse: null }));
  }, []);

  //initialise the thing
  const initializeHashConnect = useCallback(async () => {
    const saveData = INITIAL_STATE_DATA.saveData;
    try {
      if (!localData) {
        if (debug) console.log("===Local data not found.=====");

        //first init and store the private for later
        let initData = await hashConnect.init(metaData ?? APP_CONFIG);
        saveData.privateKey = initData.privKey;

        //then connect, storing the new topic for later
        const state = await hashConnect.connect();
        saveData.topic = state.topic;

        //generate a pairing string, which you can display and generate a QR code from
        saveData.pairingString = hashConnect.generatePairingString(state, netWork, debug ?? false);

        //find any supported local wallets
        hashConnect.findLocalWallets();
      } else {
        if (debug) console.log("====Local data found====", localData);
        //use loaded data for initialization + connection
        await hashConnect.init(metaData ?? APP_CONFIG, localData?.privateKey);
        await hashConnect.connect(localData?.topic, localData?.pairedWalletData ?? metaData);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setStateData((iniData) => ({ ...iniData, saveData: { ...iniData.saveData, ...(localData ?? saveData) } }));
    }
  }, [debug, localData, metaData, netWork]);

  const foundExtensionEventHandler = useCallback(
    (data: HashConnectTypes.WalletMetadata) => {
      if (debug) console.log("====foundExtensionEvent====", data);
      setStateData((iniData) => ({ ...iniData, installedExtensions: data }));
    },
    [debug]
  );

  const saveDataInLocalStorage =  useCallback((data: MessageTypes.ApprovePairing) => {
    if (debug) console.info("===============Saving to localstorage::=============");
    let dataToSave = JSON.stringify({ ...stateData.saveData, ...data, update: "yes" });
    localStorage.setItem("hashconnectData", dataToSave);
  },[debug, stateData.saveData]);

  const pairingEventHandler = useCallback((data: MessageTypes.ApprovePairing) => {
    if (debug) console.log("===Wallet connected=====", data);
    setStateData((iniData) => ({ ...iniData, saveData: { ...iniData.saveData, ...data } }));
    saveDataInLocalStorage(data);
  }, [debug, saveDataInLocalStorage]);

  const transactionResponseHandler = useCallback(
    (data: MessageTypes.TransactionResponse) => {
      if (debug) console.log("::Transaction Response::", data);
      setStateData((iniData) => ({ ...iniData, transactionResponse: data }));
    },
    [debug]
  );

  //? transaction Handler
  const handleTransaction = useCallback(
    async (transactionBytes: Uint8Array, accountId: string) => {
      try {
        const saveData = stateData.saveData;
        const transaction: MessageTypes.Transaction = {
          topic: saveData.topic,
          byteArray: transactionBytes,

          metadata: {
            accountToSign: accountId,
            returnTransaction: false,
          },
        };

        console.log("transactionData", transaction);
        await hashConnect.sendTransaction(saveData.topic, transaction);
      } catch (error) {
        console.log(error);
      }
    },
    [stateData.saveData]
  );

  const connect = useCallback(() => {
    try {
      const { saveData } = stateData;
      if (stateData.installedExtensions) {
        if (debug) console.log("Pairing String::", saveData.pairingString);
        hashConnect.connectToLocalWallet(saveData?.pairingString);
      } else {
        if (debug) console.log("====No Extension is not in browser====");
        return "wallet not installed";
      }
    } catch (error) {
      if (debug) console.log("====Error while connect execution", error);
    }
  }, [debug, stateData]);

  const disConnect = useCallback(() => {
    localStorage.removeItem("hashconnectData");
    if (resetSaveData) resetSaveData();
  }, [resetSaveData]);

  const resetAcknowledge = useCallback(() => {
    setStateData((iniData) => ({ ...iniData, acknowledge: null }));
  }, []);

  const acknowledgeEventHandler = useCallback(
    (data: MessageTypes.Acknowledge) => {
      if (debug) console.log("====::acknowledgeData::====", data);
      setStateData((iniData) => ({ ...iniData, acknowledge: data }));
    },
    [debug]
  );

  console.log("Rerender::localData::");

  useEffect(() => {
    initializeHashConnect();
    hashConnect.foundExtensionEvent.on(foundExtensionEventHandler);
    hashConnect.pairingEvent.on(pairingEventHandler);
    // hashConnect.transactionResponseEvent.on(transactionResponseHandler);
    hashConnect.acknowledgeMessageEvent.on(acknowledgeEventHandler);
    return () => {
      hashConnect.foundExtensionEvent.off(foundExtensionEventHandler);
      hashConnect.pairingEvent.off(pairingEventHandler);
      // hashConnect.transactionResponseEvent.off(transactionResponseHandler);
      hashConnect.acknowledgeMessageEvent.off(acknowledgeEventHandler);
    };
  }, []);

  //Setting up values
  const { saveData, ...restData } = stateData;
  const value = React.useMemo(() => ({ hashConnect, debug, netWork, walletData: saveData, resetSaveData, handleTransaction, resetTransactionResponse, connect, disConnect, resetAcknowledge, ...restData }), [hashConnect, stateData]);

  return <HashConnectAPIContext.Provider value={value}>{children}</HashConnectAPIContext.Provider>;
}

const defaultProps: Partial<PropsType> = {
  metaData: {
    name: "dApp Example",
    description: "An example hedera dApp",
    icon: "https://absolute.url/to/icon.png",
  },
  netWork: "testnet",
  debug: false,
};

HashConnectAPIProvider.defaultProps = defaultProps;

// export const HashConnectProvider = React.memo(HashConnectProviderWarped);

export function useHashConnect() {
  const value = React.useContext(HashConnectAPIContext);
  return value;
}

// export default HashConnectProvider;
