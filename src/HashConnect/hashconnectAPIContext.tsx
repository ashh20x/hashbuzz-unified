import React from 'react'
import {InitialStateData , HashConnectProviderAPI} from './types'


export const INITIAL_STATE_DATA: InitialStateData = {
  saveData: { topic: "", pairingString: "", privateKey:"", pairedAccounts: [], pairedWalletData: null },
  installedExtensions: null,
  acknowledge: null,
  transactionResponse: null,
  loading: false,
  status: "Initial",
};

export const HashConnectAPIContext = React.createContext<HashConnectProviderAPI>({
  hashConnect: null,
  debug: false,
  netWork: "testnet",
  walletData: INITIAL_STATE_DATA.saveData,
});