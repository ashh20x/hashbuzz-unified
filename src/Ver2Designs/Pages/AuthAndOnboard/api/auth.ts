import { apiBase } from "@/API/apiBase";
import { Challenge, GenerateAstPayload, GnerateReseponseV2, LogoutResponse, PingResponse } from "@/types";

export const authApi = apiBase.injectEndpoints({
  endpoints: (builder) => ({
    getChallenge: builder.query<Challenge, { walletId: string }>({
      async queryFn(arg, _queryApi, _extraOptions, fetchWithBQ) {
        const result = await fetchWithBQ({
          url: "/auth/challenge",
          method: "GET",
          params: { host: window.location.host, walletId: arg.walletId },
          signal: _queryApi.signal, // <-- abort signal provided by RTK Query
        });
        if (result.error) {
          return { error: result.error };
        }
        return { data: result.data as Challenge };
      },
      keepUnusedDataFor: 30,
    }),
    generateAuth: builder.mutation<GnerateReseponseV2, GenerateAstPayload>({
      query: (payload) => ({ url: "/auth/generate-v2", method: "POST", body: payload }),
    }),
    refreshToken: builder.mutation<{ message: string; ast: string }, void>({
      query: () => ({
        url: "/api/auth/refresh-token",
        method: "POST",
        body: {}, // Empty body since refresh token is in httpOnly cookie
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
export const { useLazyGetChallengeQuery, useGenerateAuthMutation, useRefreshTokenMutation, useLogoutMutation, useAuthPingMutation } = authApi;
