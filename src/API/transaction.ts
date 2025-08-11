import { apiBase } from "./apiBase"
import type { CreateTransactionByteBody, SetTransactionBody, reimburseAmountBody, TopUpResponse } from "../types"

/**
 * Transaction API endpoints injected into the base RTK Query slice.
 */
export const transactionApi = apiBase.injectEndpoints({
  endpoints: builder => ({
    createTransactionBytes: builder.mutation<Uint8Array, CreateTransactionByteBody>({
      query: body => ({
        url: "/api/transaction/create-topup-transaction",
        method: "POST",
        body,
      }),
    }),
    setTransactionAmount: builder.mutation<TopUpResponse, SetTransactionBody>({
      query: body => ({
        url: "/api/transaction/top-up",
        method: "POST",
        body,
      }),
    }),
    reimburseAmount: builder.mutation<any, reimburseAmountBody>({
      query: body => ({
        url: "/api/transaction/reimbursement",
        method: "POST",
        body,
      }),
    }),
  }),
  overrideExisting: false,
})

// Export hooks for usage in functional components
export const {
  useCreateTransactionBytesMutation,
  useSetTransactionAmountMutation,
  useReimburseAmountMutation,
} = transactionApi
