export interface AuthCred {
  token: string;
  refreshToken: string;
  user?: CurrentUser;
  adminToken?:string
}
export type user_roles = "SUPER_ADMIN" | "ADMIN" | "ANALYTICS" | "MARKETING" | "MANAGEMENT" | "USER" | "GUEST_USER";

export interface CurrentUser {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  is_active: boolean;
  personal_twitter_handle?: string;
  business_twitter_handle?: string;
  hedera_wallet_id?: string;
  consent: boolean;
  available_budget: number;
  personal_twitter_id: number;
  total_rewarded: number;
  emailActive: boolean;
  profile_image_url?:string,
  role: user_roles;
}

export type LogoutResponse = {
  success: boolean;
  message: string;
};
