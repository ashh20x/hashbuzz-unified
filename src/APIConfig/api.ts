import axios, { AxiosResponse } from "axios";

import { addCampaignBody, AdminLoginResponse, AdminUpdatePassword, AllTokensQuery, AuthCred, BalanceResponse, CampaignCards, Challenge, ContractInfo, CreateTransactionByteBody, CurrentUser, GenerateAstPayload, GnerateReseponse, LogoutResponse, reimburseAmountBody, SetTransactionBody, TokenBalances, TokenDataObj, TokenInfo, TopUpResponse, updateCampaignStatusBody, UpdatePasswordResponse } from "../types";
import { useAxios } from "./AxiosProvider";

export const getCookie = (cname: string) => {
  let name = cname + "=";
  let ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
};

export const useApiInstance = () => {
  const axiosInstance = useAxios();

  const responseBody = (response: AxiosResponse) => response?.data;

  const requests = {
    get: (url: string, params?: {}) => axiosInstance.get(url, { params: params ?? {} }).then(responseBody),
    post: (url: string, body: {}) => axiosInstance.post(url, body).then(responseBody),
    put: (url: string, body: {}) => axiosInstance.put(url, body).then(responseBody),
    delete: (url: string) => axiosInstance.delete(url).then(responseBody),
    patch: (url: string, body: {}) => axiosInstance.patch(url, body).then(responseBody),
  };
  const User = {
    getCurrentUser: (): Promise<CurrentUser> => requests.get("/api/users/current"),
    updateConsent: (userData: { consent: boolean }): Promise<CurrentUser> => requests.patch(`/api/users/update-concent`, { ...userData }),
    updateWalletId: (userData: { walletId: string }): Promise<CurrentUser> => requests.put(`/api/users/update/wallet`, { ...userData }),
    getTokenBalances: (): Promise<TokenBalances[]> => requests.get("/api/users/token-balances"),
    getCardEngagement: (data: { id: number }): Promise<any> => requests.get("/api/campaign/card-status", { ...data }),
    getClaimRewards: (): Promise<any> => requests.get("/api/campaign/reward-details"),
    buttonClaimRewards: (data: any): Promise<any> => requests.put("api/campaign/claim-reward", data),
    syncTokenBal: (tokenId: string): Promise<{ balance: number }> => requests.get("/api/users/sync-bal/" + tokenId),
  };

  const Auth = {
    refreshToken: (refreshToken: string): Promise<AuthCred> => requests.post("/auth/refreshToken", { refreshToken }),
    doLogout: (): Promise<LogoutResponse> => requests.post("/auth/logout", {}),
    adminLogin: (data: { password: string }): Promise<AdminLoginResponse> => requests.post("/auth/admin-login", { ...data }),
    authPing: (): Promise<{ wallet_id: string; status: string; device_id: string }> => requests.get("/auth/ping"),
    createChallenge: (data: { url: string }): Promise<Challenge> => requests.get("/auth/challenge", { ...data }),
    generateAuth: (data: GenerateAstPayload): Promise<GnerateReseponse> => requests.post("/auth/generate", { ...data }),
  };

  const Admin = {
    updatePassword: (data: AdminUpdatePassword): Promise<UpdatePasswordResponse> => requests.put("/api/admin/update-password", { ...data }),
    getTokenInfo: (tokenId: string): Promise<TokenInfo> => requests.post("/api/admin/token-info", { tokenId }),
    getPendingCards: () => requests.get("/api/admin/twitter-pending-cards"),
    addNewToken: ({ token_id, tokendata, token_type, token_symbol, decimals }: { token_id: string; tokendata: any; token_type: string; token_symbol: String; decimals: Number }): Promise<{ message: string; data: TokenDataObj }> => requests.post("/api/admin/list-token", { token_id, token_symbol, tokendata, decimals, token_type }),
    getListedTokens: (tokenId?: string): Promise<AllTokensQuery> => requests.get(`/api/admin/listed-tokens${tokenId ? `?tokenId=${tokenId}` : ""}`),
    getActiveContractInfo: (): Promise<ContractInfo> => requests.get("/api/admin/active-contract"),
    updateStatus: (data: any) => requests.put("/api/admin/update-status", data),
    getAllUsers: (data?: { limit: number; offset: number }): Promise<{ users: CurrentUser[]; count: number }> => requests.post("/api/admin/user/all", data ?? {}),
    allowUserAsCampaigner: (id: number): Promise<{ user: CurrentUser; success: true }> => requests.patch("/api/admin/user/allowCampaigner", { id }),
  };

  const MirrorNodeRestAPI = {
    getTokenInfo: (tokenId: string) => axios.get<TokenInfo>(`${process.env.REACT_APP_MIRROR_NODE_LINK}/api/v1/tokens/${tokenId}`),
    getBalancesForAccountId: (accountId: string) => axios.get<BalanceResponse>(`${process.env.REACT_APP_MIRROR_NODE_LINK}/api/v1/balances?account.id=${accountId}`),
  };

  const Transaction = {
    createTransactionBytes: (data: CreateTransactionByteBody): Promise<Uint8Array> => requests.post("/api/transaction/create-topup-transaction", { ...data }),
    setTransactionAmount: (data: SetTransactionBody): Promise<TopUpResponse> => requests.post("/api/transaction/top-up", { ...data }),
    reimburseAmount: (data: reimburseAmountBody): Promise<any> => requests.post("/api/transaction/reimbursement", { ...data }),
  };

  const Integrations = {
    twitterPersonalHandle: (): Promise<{ url: string }> => requests.get("/api/integrations/twitter/personalHandle"),
    twitterBizHandle: (): Promise<{ url: string }> => requests.get("/api/integrations/twitter/bizHandle"),
  };

  const Campaign = {
    addCampaign: (data: addCampaignBody): Promise<any> => requests.post("/api/campaign/add-new", { ...data }),
    getCampaigns: (): Promise<CampaignCards[]> => requests.get("/api/campaign/all"),
    updateCampaignStatus: (data: updateCampaignStatusBody): Promise<any> => requests.post("/api/campaign/update-status", { ...data }),
    chatResponse: (data: any): Promise<any> => requests.post("/api/campaign/chatgpt", data),
  };

  return { User, Auth, Admin, MirrorNodeRestAPI, Transaction, Integrations, Campaign };
};
