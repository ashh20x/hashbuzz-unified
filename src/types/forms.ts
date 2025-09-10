import { CampaignCommands } from './campaign';
import { CurrentUser, TokenBalances } from './users';

export interface FormFelid<T> {
  value: T;
  error: boolean;
  helperText: string;
  showPassword?: boolean;
}

export type AdminPasswordFormState = {
  password: FormFelid<string>;
};

export type AdminUpdatePassword = {
  password: string;
};

export type UpdatePasswordResponse = {
  message: string;
  user?: CurrentUser;
};

export type AdminLoginResponse = {
  message: string;
  user: CurrentUser;
  adminToken: string;
};

type TopupAmounts = {
  value: number;
  fee: number;
  total: number;
};

export type CreateTransactionEntity = {
  entityType: string;
  entityId?: string;
  senderId: string;
  amount: TopupAmounts;
  decimals?: number;
};

export type CreateTransactionByteBody = {
  entity: CreateTransactionEntity;
  connectedAccountId: string;
};

export type SetTransactionBody = {
  entity: CreateTransactionEntity;
  transactionId?: string;
  response?: string;
};

export type TopUpResponse = {
  error?: boolean;
  message?: string;
  success?: boolean;
  available_budget?: number;
  balance?: TokenBalances;
};

export type reimburseAmountBody = {
  amount?: any;
  type?: any;
  token_id?: any;
};

export type addCampaignBody = {
  name: string;
  tweet_text: string;
  comment_reward: number;
  retweet_reward: number;
  fungible_token_id?: String;
  like_reward: number;
  type: String;
  quote_reward: number;
  // follow_reward: follow,
  campaign_budget: number;
  media?: [];
};

export type updateCampaignStatusBody = {
  card_id: number;
  campaign_command: CampaignCommands;
};
