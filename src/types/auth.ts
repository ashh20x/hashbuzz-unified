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
  user?: CurrentUser;
};
