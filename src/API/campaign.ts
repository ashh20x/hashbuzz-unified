import { CurrentUser, PaginatedQueryResponse } from '../types';
import type { CampaignCards, MediaData } from '../types/campaign';
import { apiBase } from './apiBase';

export interface CreateCampaignRequest {
  name: string;
  tweet_text: string;
  comment_reward: string;
  retweet_reward: string;
  like_reward: string;
  quote_reward: string;
  follow_reward: string;
  campaign_budget: string;
  type: 'HBAR' | 'FUNGIBLE';
  fungible_token_id?: string;
  media?: File[];
}

export interface CreateCampaignResponse {
  success: boolean;
  data: CampaignCards;
  message?: string;
}

// V201 Campaign Types
export interface CreateCampaignDraftV201Request {
  name: string;
  tweet_text: string;
  expected_engaged_users: number;
  campaign_budget: number;
  type: 'HBAR' | 'FUNGIBLE';
  media: string[]; // Base64 encoded media files
  fungible_token_id?: string;
}

export interface CreateCampaignDraftV201Response {
  success: boolean;
  data: {
    campaignId: string;
    draftId: string;
  };
  message?: string;
}

export interface PublishCampaignV201Request {
  draftId: string;
  publishData: {
    publish_now: boolean;
    auto_approve: boolean;
  };
}

export interface PublishCampaignV201Response {
  success: boolean;
  data: {
    campaignId: string;
  };
  message?: string;
}

export interface UpdateCampaignStatusRequest {
  card_id: number;
  campaign_command: string;
}

export interface CampaignStatsRequest {
  card_id: number;
}

export interface CampaignBalanceRequest {
  campaignId: number;
}

export interface ChatGPTRequest {
  message: string;
}

export type UpdateCampaignResponse = {
  success: boolean;
  message?: string;
  user: CurrentUser;
};

export interface GetCardStatusResponse {
  id: number;
  retweet_count: number;
  reply_count: number;
  like_count: number;
  quote_count: number;
  last_update: string;
  twitter_card_id: number;
}

export interface RewardDetails {
  rewardDetails: CampaignCards[];
}

export interface CardStatesResponse {
  id: bigint;
  twitter_card_id: bigint;
  retweet_count: number | null;
  reply_count: number | null;
  like_count: number | null;
  quote_count: number | null;
  last_update: Date;
}

/**
 * Campaign API endpoints for campaign management operations.
 */
export const campaignApi = apiBase.injectEndpoints({
  endpoints: builder => ({
    // Get all campaigns for current user
    getCampaigns: builder.query<
      PaginatedQueryResponse<CampaignCards>,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: '/api/campaign/all',
        params: { page, limit },
      }),
      providesTags: ['Campaign', 'UserData'],
    }),

    // Create new campaign with file upload support
    createCampaign: builder.mutation<CreateCampaignResponse, FormData>({
      query: formData => ({
        url: '/api/campaign/add-new',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Campaign', 'UserData'],
    }),

    // Update campaign status (start, pause, etc.)
    updateCampaignStatus: builder.mutation<
      UpdateCampaignResponse,
      UpdateCampaignStatusRequest
    >({
      query: body => ({
        url: '/api/campaign/update-status',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Campaign', 'UserData'],
    }),

    // Get campaign statistics
    getCampaignStats: builder.mutation<
      CardStatesResponse,
      CampaignStatsRequest
    >({
      query: body => ({
        url: '/api/campaign/stats',
        method: 'POST',
        body,
      }),
    }),

    // Check campaign balance
    getCampaignBalance: builder.query<{ balance: number }, number>({
      query: campaignId => ({
        url: '/api/campaign/balance',
        params: { campaignId },
      }),
      providesTags: ['UserData'],
    }),

    // Get card engagement status
    getCardEngagement: builder.query<GetCardStatusResponse, number>({
      query: id => ({
        url: '/api/campaign/card-status',
        params: { id },
      }),
      providesTags: ['UserData'],
    }),

    // Get reward details
    getRewardDetails: builder.query<RewardDetails, void>({
      query: () => '/api/campaign/reward-details',
      providesTags: ['UserData'],
    }),

    // Upload media
    uploadMedia: builder.mutation<
      { message: string; data: MediaData },
      FormData
    >({
      query: formData => ({
        url: '/api/campaign/add-media',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Campaign'],
    }),

    // Get recent tweets
    getRecentTweets: builder.query<{ id: number; content: string }[], void>({
      query: () => '/api/campaign/recent-tweets',
      providesTags: ['UserData'],
    }),

    // V201 Campaign Management
    createCampaignDraftV201: builder.mutation<
      CreateCampaignDraftV201Response,
      CreateCampaignDraftV201Request
    >({
      query: draftData => ({
        url: '/api/V201/campaign/draft',
        method: 'POST',
        body: draftData,
      }),
      invalidatesTags: ['Campaign'],
    }),

    publishCampaignV201: builder.mutation<
      PublishCampaignV201Response,
      PublishCampaignV201Request
    >({
      query: ({ draftId, publishData }) => ({
        url: `/api/V201/campaign/publish/${draftId}`,
        method: 'POST',
        body: publishData,
      }),
      invalidatesTags: ['Campaign'],
    }),
  }),
  overrideExisting: false,
});

// Export hooks for usage in React components
export const {
  useGetCampaignsQuery,
  useLazyGetCampaignsQuery,
  useCreateCampaignMutation,
  useUpdateCampaignStatusMutation,
  useGetCampaignStatsMutation,
  useGetCampaignBalanceQuery,
  useLazyGetCampaignBalanceQuery,
  useGetCardEngagementQuery,
  useLazyGetCardEngagementQuery,
  useGetRewardDetailsQuery,
  useUploadMediaMutation,
  useGetRecentTweetsQuery,
  useCreateCampaignDraftV201Mutation,
  usePublishCampaignV201Mutation,
} = campaignApi;

export default campaignApi;
