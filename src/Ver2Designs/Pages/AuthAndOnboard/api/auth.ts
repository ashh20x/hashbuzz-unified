import { apiBase } from "@/API/apiBase";
import { Challenge, GenerateAstPayload, GnerateReseponseV2, LogoutResponse, PingResponse } from "@/types";

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
    getChallenge: builder.mutation<Challenge, { walletId: string }>({
      query: ({ walletId }) => ({ url: "/auth/challenge", method: "GET", params: { host: window.location.host, walletId } }),
    }),
    generateAuth: builder.mutation<GnerateReseponseV2, GenerateAstPayload>({
      query: (payload) => ({ url: "/auth/generate-v2", method: "POST", body: payload }),
    }),
    refreshToken: builder.mutation<{ message: string; ast: string }, void>({
      query: () => ({ 
        url: "/api/auth/refresh-token", 
        method: "POST", 
        body: {} // Empty body since refresh token is in httpOnly cookie
      }),
    }),
    logout: builder.mutation<LogoutResponse, void>({
      query: () => ({ url: "/auth/logout", method: "POST" }),
    }),
    authPing: builder.mutation<PingResponse, void>({
      query: () => ({
        url: "/auth/ping",
        method: "GET",
      }),
    }),
  }),
  overrideExisting: false,
});

// Export hooks for usage in functional components
export const { useGetChallengeMutation, useGenerateAuthMutation, useRefreshTokenMutation, useLogoutMutation , useAuthPingMutation } = authApi;
