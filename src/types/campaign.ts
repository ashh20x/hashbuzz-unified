import { CampaignStatus } from '../comman/helpers';

export interface Campaign {
  id: string;
  tweet_id?: string;
  tweet_text?: string;
  retweet_reward?: number;
  like_reward?: number;
  comment_reward?: number;
  media?: string[];
  amount_claimed?: number;
  amount_spent?: number;
  name?: string;
  owner_id?: string;
  quote_reward?: number;
  card_status: string;
  campaign_budget: number;
  campaign_expiry?: string;
  campaign_stats?: string;
}

export enum CampaignCommands {
  StartCampaign = 'Campaign::start',
  ClaimReward = 'Campaign::reward-claim',
  AdminApprovedCampaign = 'Campaign::admin-approved',
  AdminRejectedCampaign = 'Campaign::admin-rejected',
  UserNotAvalidCommand = 'Campaign::not-valid-command',
}

export type CampaignCards = {
  id: number;
  tweet_id: string | null;
  tweet_text: string;
  retweet_reward: number;
  like_reward: number;
  quote_reward: number;
  comment_reward: number;
  media: MediaData[];
  amount_claimed: number;
  amount_spent: number;
  name: string;
  owner_id: number;
  campaign_budget: number;
  campaign_expiry: string | null;
  last_reply_checkedAt: string;
  contract_id: string;
  last_thread_tweet_id: string | null;
  type: string;
  fungible_token_id: string | null;
  approve: boolean;
  isRejected: boolean;
  decimals: number | null;
  campaign_start_time: string | null;
  campaign_close_time: string | null;
  is_added_to_queue: boolean;
  card_status: CampaignStatus;
};

export type MediaData = {
  media_type: string;
  aws_location: string;
  twitter_media_id: string;
  owner_id: bigint;
  campaign_id: null;
};
