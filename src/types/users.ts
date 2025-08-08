export interface AuthCred {
  ast: string;
  auth: boolean;
  deviceId: string;
  message: string;
  refreshToken?: string;
}

export type user_roles = "SUPER_ADMIN" | "ADMIN" | "ANALYTICS" | "MARKETING" | "MANAGEMENT" | "USER" | "GUEST_USER";

export type UserConfig = {

  contractAddress: string;
  collecterAddress: string;
  campaignDuration: number;
  campaignRewardDuration: number;

}
export interface CurrentUser {
  id: number;
  username: string;
  name: string;
  is_active: boolean;
  personal_twitter_handle?: string;
  business_twitter_handle?: string;
  hedera_wallet_id: string;
  consent: boolean;
  available_budget: number;
  personal_twitter_id: number;
  total_rewarded: number;
  adminActive: boolean;
  profile_image_url?: string;
  role: user_roles;
  config: UserConfig;
}

export type LogoutResponse = {
  success: boolean;
  message: string;
};

export type TokenBalances = {
  id: number;
  token_id: string;
  token_type: string;
  token_symbol: string;
  name: string;
  available_balance: number;
  entity_decimal: number;
  decimals?: number;
};

export type TrailSetters = {
  createdAt: string;
  id: number,
  walletId: string;

}

export type UserPing = {
  status: boolean;
  walletId: string;
}