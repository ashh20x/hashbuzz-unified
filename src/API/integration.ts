import { apiBase } from './apiBase'

/**
 * Integration endpoints for Twitter handles and OAuth callback handling
 */
/**
 * integrationApi provides endpoints for interacting with Twitter integration APIs.
 *
 * @remarks
 * This API slice is created using RTK Query's `injectEndpoints` method and exposes
 * endpoints to fetch Twitter personal and business handle URLs, handle OAuth callbacks,
 * and check authentication status.
 *
 * @example
 * // Usage in a React component with RTK Query hooks:
 * const { data, error, isLoading } = useGetTwitterPersonalHandleQuery();
 *
 * @property getTwitterPersonalHandle - Fetches the URL for the user's personal Twitter handle.
 * @property getTwitterBizHandle - Fetches the URL for the user's business Twitter handle.
 * @property handleTwitterCallback - Processes Twitter OAuth callback and updates user state.
 * @property checkXAccountStatus - Checks current X account connection status.
 *
 * @see {@link https://redux-toolkit.js.org/rtk-query/usage/customizing-queries}
 */
const integrationApi = apiBase.injectEndpoints({
  endpoints: build => ({
    getTwitterPersonalHandle: build.query<{ url: string }, void>({
      query: () => '/api/integrations/twitter/personalHandle',
    }),
    getTwitterBizHandle: build.query<{ url: string }, void>({
      query: () => '/api/integrations/twitter/bizHandle',
    }),
    handleTwitterCallback: build.mutation<
      { success: boolean; username?: string; message?: string },
      { oauth_token: string; oauth_verifier: string  , variant:"personal" | "business"}
    >({
      query: ({ oauth_token, oauth_verifier, variant }) => ({
        url: '/api/integrations/twitter/callback',
        method: 'POST',
        body: { oauth_token, oauth_verifier, variant },
      }),
    }),
    checkXAccountStatus: build.query<
      { isConnected: boolean; handle?: string },
      void
    >({
      query: () => '/api/integrations/twitter/status',
    }),
  }),
  overrideExisting: false,
})

// Auto-generated hooks
export const {
  useLazyGetTwitterPersonalHandleQuery,
  useLazyGetTwitterBizHandleQuery,
  useHandleTwitterCallbackMutation,
  useLazyCheckXAccountStatusQuery,
} = integrationApi;

export default integrationApi;
