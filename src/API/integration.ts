import { apiBase } from './apiBase'

/**
 * Integration endpoints for Twitter handles
 */
/**
 * integrationApi provides endpoints for interacting with Twitter integration APIs.
 *
 * @remarks
 * This API slice is created using RTK Query's `injectEndpoints` method and exposes
 * endpoints to fetch Twitter personal and business handle URLs.
 *
 * @example
 * // Usage in a React component with RTK Query hooks:
 * const { data, error, isLoading } = useGetTwitterPersonalHandleQuery();
 *
 * @property getTwitterPersonalHandle - Fetches the URL for the user's personal Twitter handle.
 * @property getTwitterBizHandle - Fetches the URL for the user's business Twitter handle.
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
  }),
  overrideExisting: false,
})

// Auto-generated hooks
export const {
  useLazyGetTwitterPersonalHandleQuery,
  useLazyGetTwitterBizHandleQuery,
} = integrationApi;

export default integrationApi;
