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
  campaign_stats?:string
}
