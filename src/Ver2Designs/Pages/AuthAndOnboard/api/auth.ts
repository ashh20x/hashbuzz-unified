import { apiBase } from '@/API/apiBase'
import { Challenge, GenerateAstPayload, GnerateReseponse, AuthCred, LogoutResponse } from '@/types'

/**
 * Auth API slice: handles authentication requests via RTK Query.
 * Endpoints:
 *  - getChallenge: GET /auth/challenge
 *  - generateAuth: POST /auth/generate
 *  - refreshToken: POST /auth/refreshToken
 *  - logout: POST /auth/logout
 */
export const authApi = apiBase.injectEndpoints({
    endpoints: (builder) => ({
        getChallenge: builder.query<Challenge, void>({
            query: () => ({ url: '/auth/challenge', method: 'GET', params: { host: window.location.host } }),
            keepUnusedDataFor: 0, // disables caching
        }),
        generateAuth: builder.mutation<GnerateReseponse, GenerateAstPayload>({
            query: (payload) => ({ url: '/auth/generate-v2', method: 'POST', body: payload }),
        }),
        refreshToken: builder.mutation<AuthCred, string>({
            query: (token) => ({ url: '/auth/refreshToken', method: 'POST', body: { refreshToken: token } }),
        }),
        logout: builder.mutation<LogoutResponse, void>({
            query: () => ({ url: '/auth/logout', method: 'POST' }),
        }),
    }),
    overrideExisting: false,
});

// Export hooks for usage in functional components
export const {
  useGetChallengeQuery,
  useGenerateAuthMutation,
  useRefreshTokenMutation,
  useLogoutMutation,
} = authApi
