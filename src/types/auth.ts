import { CurrentUser } from "./users";

export type Payload = {
  url: string;
  data: {
    token: string;
  };
};

export type Challenge = {
  payload: Payload;
  server: {
    signature: string;
    account: string;
  };
  isExistingUser: boolean;
  connectedXAccount: string;
};

export type GenerateAstPayload = {
  payload: Payload;
  signatures: {
    server: string;
    wallet: {
      accountId: string;
      signature: string;
    };
  };
};

export type GnerateReseponse = {
  ast: string;
  deviceId: string;
  refreshToken: string;
  message: string;
  auth: boolean;
};

export type GnerateReseponseV2 = {
  deviceId: string;
  message: string;
  auth: boolean;
  user: CurrentUser;
};

export type PingResponse = {
  wallet_id?: string;
  status: string;
  device_id?: string;
  isAuthenticated: boolean;
  connectedXAccount: string;
};

export enum AuthError {
  AUTH_TOKEN_NOT_PRESENT = 'AUTH_TOKEN_NOT_PRESENT',
  AUTH_TOKEN_INVALID = 'AUTH_TOKEN_INVALID',
  SIGNATURE_NOT_VERIFIED = 'SIGNATURE_NOT_VERIFIED',
  DEVICE_ID_REQUIRED = 'DEVICE_ID_REQUIRED',
  ACCESS_DENIED = 'ACCESS_DENIED',
  INVALID_SIGNATURE_TOKEN = 'INVALID_SIGNATURE_TOKEN',
  SIGNING_MESSAGE_EXPIRED = 'SIGNING_MESSAGE_EXPIRED',
  ERROR_WHILE_FINDING_DEVICE_ID = 'ERROR_WHILE_FINDING_DEVICE_ID',
}