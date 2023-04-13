import { AuthCred, CurrentUser } from "./users";
import { Campaign } from "./campaign";
import React from "react";

export type ContractInfo = {
  contract_id: string;
  contractAddress: string;
}

export interface AppState {
  currentUser?: CurrentUser;
  campaigns?: Campaign[];
  auth?: AuthCred;
  balances: EntityBalances[];
  contractInfo?: ContractInfo;
}

export interface EntityBalances {
  entitySymbol: string;
  entityBalance: string;
  entityIcon: React.ReactNode;
  entityId: string;
  entityType: string;
}

export type BalOperation = "topup" | "reimburse";
