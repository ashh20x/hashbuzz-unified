import type { CurrentUser, TokenBalances } from '../types';
import { apiBase } from './apiBase';

/**
 * User API endpoints injected into the base RTK Query slice.
 */
export const userApi = apiBase.injectEndpoints({
  endpoints: builder => ({
    getCurrentUser: builder.query<CurrentUser, void>({
      query: () => '/api/users/current',
      providesTags: ['CurrentUser', 'UserData'],
    }),
    updateConsent: builder.mutation<CurrentUser, { consent: boolean }>({
      query: body => ({
        url: '/api/users/update-consent',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['CurrentUser', 'UserData'],
    }),
    updateWalletId: builder.mutation<CurrentUser, { walletId: string }>({
      query: body => ({
        url: '/api/users/update/wallet',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['CurrentUser', 'UserData'],
    }),
    getTokenBalances: builder.query<TokenBalances[], void>({
      query: () => '/api/users/token-balances',
      providesTags: ['TokenBalance', 'UserData'],
    }),
    getCardEngagement: builder.query<
      { engagement: number; status: string },
      number
    >({
      query: id => ({
        url: '/api/campaign/card-status',
        params: { id },
      }),
      providesTags: ['UserData'],
    }),
    getClaimRewards: builder.query<{ rewardDetails: unknown[] }, void>({
      query: () => '/api/campaign/reward-details',
      providesTags: ['UserData'],
    }),
    claimRewards: builder.mutation<
      { success: boolean; message?: string },
      { rewardId: string }
    >({
      query: body => ({
        url: '/api/campaign/claim-reward',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['UserData', 'TokenBalance'],
    }),
    syncTokenBalance: builder.query<{ balance: number }, string>({
      query: tokenId => `/api/users/sync-bal/${tokenId}`,
      providesTags: ['TokenBalance', 'UserData'],
    }),
  }),
  overrideExisting: false,
});

// Export hooks for User API operations
export const {
  useGetCurrentUserQuery,
  useLazyGetCurrentUserQuery,
  useUpdateConsentMutation,
  useUpdateWalletIdMutation,
  useGetTokenBalancesQuery,
  useLazyGetTokenBalancesQuery,
  useGetCardEngagementQuery,
  useGetClaimRewardsQuery,
  useClaimRewardsMutation,
  useSyncTokenBalanceQuery,
} = userApi;

export default userApi;
