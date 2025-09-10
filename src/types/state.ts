import { AuthCred, CurrentUser } from './users';
import { Campaign } from './campaign';
import React from 'react';

export type ContractInfo = {
  contract_id: string;
  contractAddress: string;
};

export interface AppState {
  ping: {
    status: boolean;
    hedera_wallet_id: string;
  };
  checkRefresh: boolean;
  currentUser?: CurrentUser;
  campaigns?: Campaign[];
  auth?: AuthCred;
  balances: EntityBalances[];
  contractInfo?: ContractInfo;
  toasts: { type: 'error' | 'info' | 'success'; message: string }[];
  balanceRefreshTimer?: number | null;
}

export interface EntityBalances {
  entitySymbol: string;
  entityBalance: string;
  entityIcon: React.ReactNode;
  entityId: string;
  entityType: string;
  decimals?: number;
}

export type BalOperation = 'topup' | 'reimburse';
