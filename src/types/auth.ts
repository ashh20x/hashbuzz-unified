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
  auth: true;
};
