import { apiBase } from './apiBase'
import type { CurrentUser, TokenBalances } from '../types'

/**
 * User API endpoints injected into the base RTK Query slice.
 */
export const userApi = apiBase.injectEndpoints({
  endpoints: builder => ({
    getCurrentUser: builder.query<CurrentUser, void>({
      query: () => '/api/users/current',
    }),
    updateConsent: builder.mutation<CurrentUser, { consent: boolean }>({
      query: body => ({
        url: '/api/users/update-consent',
        method: 'PATCH',
        body,
      }),
    }),
    updateWalletId: builder.mutation<CurrentUser, { walletId: string }>({
      query: body => ({
        url: '/api/users/update/wallet',
        method: 'PUT',
        body,
      }),
    }),
    getTokenBalances: builder.query<TokenBalances[], void>({
      query: () => '/api/users/token-balances',
    }),
    getCardEngagement: builder.query<any, number>({
      query: id => ({
        url: '/api/campaign/card-status',
        params: { id },
      }),
    }),
    getClaimRewards: builder.query<any, void>({
      query: () => '/api/campaign/reward-details',
    }),
    claimRewards: builder.mutation<any, any>({
      query: body => ({
        url: '/api/campaign/claim-reward',
        method: 'PUT',
        body,
      }),
    }),
    syncTokenBalance: builder.query<{ balance: number }, string>({
      query: tokenId => `/api/users/sync-bal/${tokenId}`,
    }),
  }),
  overrideExisting: false,
})

// Export hooks for User API operations
export const {
  useGetCurrentUserQuery,
  useLazyGetCurrentUserQuery,
  useUpdateConsentMutation,
  useUpdateWalletIdMutation,
  useGetTokenBalancesQuery,
  useGetCardEngagementQuery,
  useGetClaimRewardsQuery,
  useClaimRewardsMutation,
  useSyncTokenBalanceQuery,
} = userApi

export default userApi;