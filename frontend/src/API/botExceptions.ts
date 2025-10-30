import { apiBase } from './apiBase';

export interface BotException {
  id: number;
  twitter_user_id: string;
  twitter_username: string | null;
  reason: string;
  notes: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  added_by_admin_id: string | null;
  added_by_admin?: {
    id: string;
    name: string;
    business_twitter_handle: string;
  } | null;
}

export interface CreateBotExceptionRequest {
  twitter_user_id: string;
  twitter_username?: string;
  reason: string;
  notes?: string;
}

export interface GetBotExceptionsResponse {
  status: 'success' | 'error';
  message: string;
  data?: {
    exceptions: BotException[];
    count: number;
  };
  errors?: Array<{ msg: string; path?: string; value?: string }>;
}

export interface BotExceptionApiResponse {
  status: 'success' | 'error';
  message: string;
  data?: BotException[] | BotException | boolean;
  errors?: Array<{ msg: string; path?: string; value?: string }>;
}

// Bot Exceptions API endpoints
export const botExceptionsApi = apiBase.injectEndpoints({
  endpoints: builder => ({
    // Get all bot detection exceptions
    getBotExceptions: builder.query<GetBotExceptionsResponse, void>({
      query: () => '/api/V201/bot-exceptions',
      providesTags: ['BotException'],
    }),

    // Add a new bot detection exception
    addBotException: builder.mutation<
      BotExceptionApiResponse,
      CreateBotExceptionRequest
    >({
      query: data => ({
        url: '/api/V201/bot-exceptions',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['BotException'],
    }),

    // Remove a bot detection exception
    removeBotException: builder.mutation<
      BotExceptionApiResponse,
      { twitter_user_id: string }
    >({
      query: ({ twitter_user_id }) => ({
        url: `/api/V201/bot-exceptions/${twitter_user_id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['BotException'],
    }),

    // Check if a user is in the exception list
    checkBotException: builder.query<
      BotExceptionApiResponse,
      { twitter_user_id: string }
    >({
      query: ({ twitter_user_id }) =>
        `/api/V201/bot-exceptions/check/${twitter_user_id}`,
      providesTags: ['BotException'],
    }),
  }),
});

export const {
  useGetBotExceptionsQuery,
  useAddBotExceptionMutation,
  useRemoveBotExceptionMutation,
  useCheckBotExceptionQuery,
} = botExceptionsApi;
