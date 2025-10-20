import type {
  CloseQuestResponse,
  DraftQuestRequest,
  DraftQuestResponse,
  GetAllQuestsResponse,
  GetQuestByIdResponse,
  GradeQuestRequest,
  GradeQuestResponse,
  PublishQuestRequest,
  PublishQuestResponse,
  QuestListItem,
  QuestPaginationParams,
  QuestStateResponse,
  QuestSubmissionsResponse,
  StandardApiResponse,
} from '../types';
import { apiBase } from './apiBase';

/**
 * Quest API endpoints injected into the base RTK Query slice.
 * Handles quest campaign creation, management, and monitoring.
 */
export const questApi = apiBase.injectEndpoints({
  endpoints: builder => ({
    /**
     * Create a new quest campaign draft
     * @mutation
     */
    draftQuestCampaign: builder.mutation<
      StandardApiResponse<DraftQuestResponse>,
      DraftQuestRequest
    >({
      query: body => {
        const formData = new FormData();
        formData.append('name', body.name);
        formData.append('tweet_text', body.tweet_text);
        formData.append(
          'expected_engaged_users',
          body.expected_engaged_users.toString()
        );
        formData.append('campaign_budget', body.campaign_budget.toString());
        formData.append('type', body.type);

        if (body.fungible_token_id) {
          formData.append('fungible_token_id', body.fungible_token_id);
        }

        // Append quest options (each option as separate array element)
        if (body.options && body.options.length > 0) {
          body.options.forEach((option: string) => {
            formData.append('options[]', option);
          });
        }

        // Append correct answer
        if (body.correct_answers) {
          formData.append('correct_answers', body.correct_answers);
        }

        // Append YouTube URL if provided (as single string, not array)
        if (body.youtube_url) {
          formData.append('youtube_url', body.youtube_url);
        }

        // Append media files (images)
        if (body.media && body.media.length > 0) {
          body.media.forEach((file: File) => {
            formData.append('media', file);
          });
        }

        return {
          url: '/api/V201/quest/draft',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['Quest', 'Campaign'],
    }),

    /**
     * Publish a quest campaign by ID
     * @mutation
     */
    publishQuestCampaign: builder.mutation<
      StandardApiResponse<PublishQuestResponse>,
      PublishQuestRequest
    >({
      query: ({ questId }) => ({
        url: `/api/V201/quest/publish`,
        method: 'POST',
        body: { questId },
      }),
      invalidatesTags: (_result, _error, { questId }) => [
        'Quest',
        'Campaign',
        { type: 'Quest' as const, id: questId.toString() },
      ],
    }),

    /**
     * Get quest campaign state/status information
     * @query
     */
    getQuestState: builder.query<
      StandardApiResponse<QuestStateResponse>,
      string
    >({
      query: questId => ({
        url: `/api/V201/quest/${questId}/state`,
        method: 'GET',
      }),
      providesTags: (_result, _error, questId) => [
        { type: 'Quest' as const, id: questId.toString() },
      ],
    }),

    /**
     * Get all submissions for a quest campaign
     * @query
     */
    getQuestSubmissions: builder.query<
      StandardApiResponse<QuestSubmissionsResponse>,
      string
    >({
      query: questId => ({
        url: `/api/V201/quest/${questId}/submissions`,
        method: 'GET',
      }),
      providesTags: (_result, _error, questId) => [
        { type: 'Quest' as const, id: `${questId}-submissions` },
      ],
    }),

    /**
     * Grade quest submissions and distribute rewards
     * @mutation
     */
    gradeQuestSubmissions: builder.mutation<
      StandardApiResponse<GradeQuestResponse>,
      GradeQuestRequest
    >({
      query: ({ questId, ...body }) => ({
        url: `/api/V201/quest/${questId}/grade`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_result, _error, { questId }) => [
        { type: 'Quest' as const, id: questId.toString() },
        { type: 'Quest' as const, id: `${questId}-submissions` },
      ],
    }),

    /**
     * Manually close a quest campaign
     * @mutation
     */
    closeQuestCampaign: builder.mutation<
      StandardApiResponse<CloseQuestResponse>,
      string
    >({
      query: questId => ({
        url: `/api/V201/quest/${questId}/close`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, questId) => [
        'Quest',
        { type: 'Quest' as const, id: questId.toString() },
      ],
    }),

    /**
     * Get all quest campaigns for the current user with pagination
     * @query
     */
    getAllQuestCampaigns: builder.query<
      StandardApiResponse<GetAllQuestsResponse>,
      QuestPaginationParams | void
    >({
      query: params => {
        const page = params?.page ?? 1;
        const limit = params?.limit ?? 10;

        return {
          url: '/api/V201/quest/all',
          method: 'GET',
          params: { page, limit },
        };
      },
      providesTags: result =>
        result?.data?.quests
          ? [
              ...result.data.quests.map(({ id }: QuestListItem) => ({
                type: 'Quest' as const,
                id: id.toString(),
              })),
              { type: 'Quest' as const, id: 'LIST' },
            ]
          : [{ type: 'Quest' as const, id: 'LIST' }],
    }),

    /**
     * Get specific quest campaign details by ID
     * @query
     */
    getQuestCampaignById: builder.query<
      StandardApiResponse<GetQuestByIdResponse>,
      string
    >({
      query: questId => ({
        url: `/api/V201/quest/${questId}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, questId) => [
        { type: 'Quest' as const, id: questId.toString() },
      ],
    }),
  }),
  overrideExisting: false,
});

// Export hooks for usage in functional components
export const {
  // Mutations
  useDraftQuestCampaignMutation,
  usePublishQuestCampaignMutation,
  useGradeQuestSubmissionsMutation,
  useCloseQuestCampaignMutation,

  // Queries
  useGetQuestStateQuery,
  useGetQuestSubmissionsQuery,
  useGetAllQuestCampaignsQuery,
  useGetQuestCampaignByIdQuery,

  // Lazy Queries
  useLazyGetQuestStateQuery,
  useLazyGetQuestSubmissionsQuery,
  useLazyGetAllQuestCampaignsQuery,
  useLazyGetQuestCampaignByIdQuery,
} = questApi;
