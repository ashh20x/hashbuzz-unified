import { BalanceResponse } from "@/types";
import { AccountTokensResponse } from "@/types/mirrorTypes";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AccountInfoJson } from "node_modules/@hashgraph/sdk/lib/account/AccountInfo";

/**
 * Mirror Node API slice for querying Hedera Mirror Node REST API
 * Uses a separate base URL from the main application API
 */
export const mirrorNodeApi = createApi({
  reducerPath: "mirrorNodeApi",
  baseQuery: fetchBaseQuery({
    baseUrl: (import.meta as any).env.VITE_MIRROR_NODE_LINK || "https://testnet.mirrornode.hedera.com",
    prepareHeaders: (headers) => {
      // Add any required headers for Mirror Node API
      headers.set("Accept", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Account", "Transaction", "Token", "Topic", "Contract"],
  endpoints: (builder) => ({
    // Account endpoints
    getAccount: builder.query<AccountInfoJson, string>({
      query: (accountId) => `/api/v1/accounts/${accountId}`,
      providesTags: ["Account"],
    }),

    getAccountTokens: builder.query<AccountTokensResponse, string>({
      query: (accountId) => `/api/v1/accounts/${accountId}/tokens`,
      providesTags: ["Account", "Token"],
    }),

    getAccountTransactions: builder.query<any, { accountId: string; limit?: number; order?: "asc" | "desc" }>({
      query: ({ accountId, limit = 25, order = "desc" }) => `/api/v1/transactions?account.id=${accountId}&limit=${limit}&order=${order}`,
      providesTags: ["Transaction"],
    }),

    // Transaction endpoints
    getTransaction: builder.query<any, string>({
      query: (transactionId) => `/api/v1/transactions/${transactionId}`,
      providesTags: ["Transaction"],
    }),

    getTransactions: builder.query<any, { limit?: number; order?: "asc" | "desc"; timestamp?: string }>({
      query: ({ limit = 25, order = "desc", timestamp }) => {
        let url = `/api/v1/transactions?limit=${limit}&order=${order}`;
        if (timestamp) url += `&timestamp=${timestamp}`;
        return url;
      },
      providesTags: ["Transaction"],
    }),

    // Token endpoints
    getToken: builder.query<any, string>({
      query: (tokenId) => `/api/v1/tokens/${tokenId}`,
      providesTags: ["Token"],
    }),

    getTokens: builder.query<any, { limit?: number; order?: "asc" | "desc" }>({
      query: ({ limit = 25, order = "desc" }) => `/api/v1/tokens?limit=${limit}&order=${order}`,
      providesTags: ["Token"],
    }),

    // Topic endpoints
    getTopic: builder.query<any, string>({
      query: (topicId) => `/api/v1/topics/${topicId}`,
      providesTags: ["Topic"],
    }),

    getTopicMessages: builder.query<any, { topicId: string; limit?: number; order?: "asc" | "desc" }>({
      query: ({ topicId, limit = 25, order = "desc" }) => `/api/v1/topics/${topicId}/messages?limit=${limit}&order=${order}`,
      providesTags: ["Topic"],
    }),

    // Contract endpoints
    getContract: builder.query<any, string>({
      query: (contractId) => `/api/v1/contracts/${contractId}`,
      providesTags: ["Contract"],
    }),

    getContractResults: builder.query<any, { contractId: string; limit?: number; order?: "asc" | "desc" }>({
      query: ({ contractId, limit = 25, order = "desc" }) => `/api/v1/contracts/${contractId}/results?limit=${limit}&order=${order}`,
      providesTags: ["Contract"],
    }),

    // Network status endpoint
    getNetworkStatus: builder.query<any, void>({
      query: () => "/api/v1/network/nodes",
    }),

    getBalancesForAccountId: builder.query<BalanceResponse, string>({
      query: (accountId) => `/api/v1/balances?account.id=${accountId}`,
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetAccountQuery,
  useGetAccountTokensQuery,
  useGetAccountTransactionsQuery,
  useGetTransactionQuery,
  useGetTransactionsQuery,
  useGetTokenQuery,
  useGetTokensQuery,
  useGetTopicQuery,
  useGetTopicMessagesQuery,
  useGetContractQuery,
  useGetContractResultsQuery,
  useGetNetworkStatusQuery,
  useLazyGetAccountQuery,
  useLazyGetAccountTokensQuery,
  useLazyGetAccountTransactionsQuery,
  useLazyGetTransactionQuery,
  useLazyGetTransactionsQuery,
  useLazyGetTokenQuery,
  useLazyGetTokensQuery,
  useLazyGetTopicQuery,
  useLazyGetTopicMessagesQuery,
  useLazyGetContractQuery,
  useLazyGetContractResultsQuery,
  useLazyGetBalancesForAccountIdQuery,
} = mirrorNodeApi;
