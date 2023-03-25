import { AuthCred, CurrentUser } from "./users";
import { Campaign } from "./campaign";
import React from "react";

export interface AppState {
  currentUser?: CurrentUser;
  campaigns?: Campaign[];
  auth?: AuthCred;
}

export interface EntityBalances {
  entitySymbol: string;
  entityBalance: string;
  entityIcon: React.ReactNode;
}
