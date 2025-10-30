import type {
  CreateTransactionByteBody,
  reimburseAmountBody,
  SetTransactionBody,
  TopUpResponse,
} from '../types';
import { apiBase } from './apiBase';

/**
 * Transaction API endpoints injected into the base RTK Query slice.
 */
export const transactionApi = apiBase.injectEndpoints({
  endpoints: builder => ({
    createTransactionBytes: builder.mutation<
      { data: Uint8Array; type: string },
      CreateTransactionByteBody
    >({
      query: body => ({
        url: '/api/transaction/create-topup-transaction',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Transaction', 'UserData'],
    }),
    setTransactionAmount: builder.mutation<TopUpResponse, SetTransactionBody>({
      query: body => ({
        url: '/api/transaction/top-up',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Transaction', 'TokenBalance', 'UserData'],
    }),
    reimburseAmount: builder.mutation<
      { success: boolean; message?: string },
      reimburseAmountBody
    >({
      query: body => ({
        url: '/api/transaction/reimbursement',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Transaction', 'TokenBalance', 'UserData'],
    }),
  }),
  overrideExisting: false,
});

// Export hooks for usage in functional components
export const {
  useCreateTransactionBytesMutation,
  useSetTransactionAmountMutation,
  useReimburseAmountMutation,
} = transactionApi;
