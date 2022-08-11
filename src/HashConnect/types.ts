import { HashConnect, HashConnectTypes, MessageTypes  , } from "hashconnect";
//Type declarations
export interface SaveData {
  topic: string;
  pairingString: string;
  privateKey: string;
  pairedWalletData: HashConnectTypes.WalletMetadata | null;
  pairedAccounts: string[];
  netWork?: string;
  id?: string;
  accountIds?: string[];
}

export type Networks = "testnet" | "mainnet" | "previewnet";

export interface PropsType {
  children: React.ReactNode;
  netWork: Networks;
  metaData?: HashConnectTypes.AppMetadata;
  debug?: boolean;
}

export interface HashConnectProviderAPI {
  hashConnect: HashConnect | null;
  walletData: SaveData;
  netWork: Networks;
  debug?: boolean;
  installedExtensions?: null | HashConnectTypes.WalletMetadata;
  resetSaveData?: () => void;
  transactionResponse?: MessageTypes.TransactionResponse | null;
  handleTransaction?: (data: Uint8Array, accountId: string) => void;
  resetTransactionResponse?: () => void;
  connect?: () => void;
  disConnect?: () => void;
  acknowledge?: MessageTypes.Acknowledge | null;
  resetAcknowledge?: () => void;
  status?: string;
  loading?: boolean;
}

export interface InitialStateData {
  saveData: SaveData;
  installedExtensions: HashConnectTypes.WalletMetadata | null;
  transactionResponse: MessageTypes.TransactionResponse | null;
  acknowledge: MessageTypes.Acknowledge | null;
  loading: boolean;
  status: string;
}