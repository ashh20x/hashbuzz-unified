import { apiBase } from '@/API/apiBase';
import type {
  AdminLoginResponse,
  AdminUpdatePassword,
  AllTokensQuery,
  CampaignCards,
  ContractInfo,
  CurrentUser,
  TrailSetters,
  UpdatePasswordResponse,
} from '@/types';

/**
 * Admin API endpoints for administrative operations.
 * Includes user management, token management, campaign oversight, and system configuration.
 */
export const adminApi = apiBase.injectEndpoints({
  endpoints: builder => ({
    // Authentication endpoints
    adminLogin: builder.mutation<AdminLoginResponse, { password: string }>({
      query: body => ({
        url: '/auth/admin-login',
        method: 'POST',
        body,
      }),
    }),

    adminUpdatePassword: builder.mutation<
      UpdatePasswordResponse,
      AdminUpdatePassword
    >({
      query: body => ({
        url: '/auth/admin/update-password',
        method: 'PATCH',
        body,
      }),
    }),

    // User management endpoints
    getAllUsers: builder.query<
      { users: CurrentUser[]; count: number },
      { limit?: number; offset?: number }
    >({
      query: ({ limit = 10, offset = 0 } = {}) => ({
        url: '/api/admin/user/all',
        method: 'POST',
        body: { limit, offset },
      }),
    }),

    allowUserAsCampaigner: builder.mutation<
      { user: CurrentUser; success: boolean },
      number
    >({
      query: id => ({
        url: '/api/admin/user/allowCampaigner',
        method: 'PATCH',
        body: { id },
      }),
    }),

    removePersonalHandle: builder.mutation<
      { data: CurrentUser; message: string },
      number
    >({
      query: userId => ({
        url: '/api/admin/personal-handle',
        method: 'PATCH',
        body: { userId },
      }),
    }),

    removeBizHandle: builder.mutation<
      { data: CurrentUser; message: string },
      number
    >({
      query: userId => ({
        url: '/api/admin/biz-handle',
        method: 'PATCH',
        body: { userId },
      }),
    }),

    // Token management endpoints
    listToken: builder.mutation<
      Record<string, unknown>,
      { token_id: string; tokendata: string; token_type: string }
    >({
      query: body => ({
        url: '/api/admin/list-token',
        method: 'POST',
        body,
      }),
    }),

    getListedTokens: builder.query<AllTokensQuery, string | void>({
      query: fungibleToken => ({
        // pragma: allowlist secret
        url: `/api/admin/listed-tokens${fungibleToken ? `?tokenId=${fungibleToken}` : ''}`,
      }),
    }),

    // Campaign management endpoints
    getAllCampaigns: builder.query<CampaignCards[], void>({
      query: () => '/api/admin/campaigns/all',
    }),

    getPendingCampaigns: builder.query<CampaignCards[], void>({
      query: () => '/api/admin/twitter-pending-cards',
    }),

    approveCampaign: builder.mutation<
      { success: boolean; message: string },
      { approve: boolean; id: number }
    >({
      query: body => ({
        url: '/api/admin/update-status',
        method: 'PUT',
        body,
      }),
    }),

    getCampaignLogs: builder.query<Record<string, unknown>, string | number>({
      query: id => `/api/admin/campaign-logs/${id}`,
    }),

    // TrailSetters management endpoints
    getTrailSetters: builder.query<TrailSetters[], void>({
      query: () => '/api/admin/trailsetters',
    }),

    updateTrailSetters: builder.mutation<
      { data: TrailSetters[]; message: string },
      { accounts: string[] }
    >({
      query: body => ({
        url: '/api/admin/trailsetters',
        method: 'PUT',
        body,
      }),
    }),

    // System endpoints
    getActiveContractInfo: builder.query<ContractInfo, void>({
      query: () => '/api/admin/active-contract',
    }),

    // Analytics and monitoring endpoints
    getSystemStats: builder.query<Record<string, unknown>, void>({
      query: () => '/api/admin/system-stats',
    }),

    getUserStats: builder.query<Record<string, unknown>, void>({
      query: () => '/api/admin/user-stats',
    }),

    getCampaignStats: builder.query<Record<string, unknown>, void>({
      query: () => '/api/admin/campaign-stats',
    }),

    // Bulk operations
    bulkUpdateUsers: builder.mutation<
      { success: boolean; updated: number },
      { userIds: number[]; updates: Partial<CurrentUser> }
    >({
      query: body => ({
        url: '/api/admin/users/bulk-update',
        method: 'PATCH',
        body,
      }),
    }),

    bulkDeleteCampaigns: builder.mutation<
      { success: boolean; deleted: number },
      { campaignIds: number[] }
    >({
      query: body => ({
        url: '/api/admin/campaigns/bulk-delete',
        method: 'DELETE',
        body,
      }),
    }),

    // Advanced user management
    getUserActivity: builder.query<
      Record<string, unknown>,
      { userId: number; startDate?: string; endDate?: string }
    >({
      query: ({ userId, startDate, endDate }) => ({
        url: `/api/admin/user/${userId}/activity`,
        params: { startDate, endDate },
      }),
    }),

    suspendUser: builder.mutation<
      { user: CurrentUser; message: string },
      { userId: number; reason?: string }
    >({
      query: body => ({
        url: '/api/admin/user/suspend',
        method: 'PATCH',
        body,
      }),
    }),

    unsuspendUser: builder.mutation<
      { user: CurrentUser; message: string },
      number
    >({
      query: userId => ({
        url: '/api/admin/user/unsuspend',
        method: 'PATCH',
        body: { userId },
      }),
    }),

    // Configuration management
    getAppConfig: builder.query<Record<string, unknown>, void>({
      query: () => '/api/admin/config',
    }),

    updateAppConfig: builder.mutation<
      Record<string, unknown>,
      Record<string, unknown>
    >({
      query: body => ({
        url: '/api/admin/config',
        method: 'PUT',
        body,
      }),
    }),

    // Audit and logging
    getAuditLogs: builder.query<
      Record<string, unknown>,
      { page?: number; limit?: number; action?: string; userId?: number }
    >({
      query: ({ page = 1, limit = 20, action, userId } = {}) => ({
        url: '/api/admin/audit-logs',
        params: { page, limit, action, userId },
      }),
    }),

    // Export functionality
    exportUsers: builder.mutation<
      Blob,
      { format: 'csv' | 'xlsx'; filters?: Record<string, string> }
    >({
      query: body => ({
        url: '/api/admin/export/users',
        method: 'POST',
        body,
        responseHandler: response => response.blob(),
      }),
    }),

    exportCampaigns: builder.mutation<
      Blob,
      { format: 'csv' | 'xlsx'; filters?: Record<string, string> }
    >({
      query: body => ({
        url: '/api/admin/export/campaigns',
        method: 'POST',
        body,
        responseHandler: response => response.blob(),
      }),
    }),

    // Notification management
    sendNotification: builder.mutation<
      { success: boolean; message: string },
      {
        userIds?: number[];
        message: string;
        type: 'info' | 'warning' | 'success' | 'error';
      }
    >({
      query: body => ({
        url: '/api/admin/notifications/send',
        method: 'POST',
        body,
      }),
    }),

    getNotificationHistory: builder.query<
      Record<string, unknown>,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 20 } = {}) => ({
        url: '/api/admin/notifications/history',
        params: { page, limit },
      }),
    }),

    // Token analytics
    getTokenUsageStats: builder.query<
      Record<string, unknown>,
      { tokenId?: string; startDate?: string; endDate?: string }
    >({
      query: ({ tokenId, startDate, endDate } = {}) => ({
        url: '/api/admin/tokens/usage-stats',
        params: { tokenId, startDate, endDate },
      }),
    }),

    // Campaign moderation
    flagCampaign: builder.mutation<
      { success: boolean; message: string },
      { campaignId: number; reason: string }
    >({
      query: body => ({
        url: '/api/admin/campaigns/flag',
        method: 'POST',
        body,
      }),
    }),

    unflagCampaign: builder.mutation<
      { success: boolean; message: string },
      number
    >({
      query: campaignId => ({
        url: `/api/admin/campaigns/${campaignId}/unflag`,
        method: 'POST',
      }),
    }),

    getDatabaseStats: builder.query<Record<string, unknown>, void>({
      query: () => '/api/admin/system/database-stats',
    }),

    // Performance metrics
    getPerformanceMetrics: builder.query<
      Record<string, unknown>,
      { timeframe: 'hour' | 'day' | 'week' | 'month' }
    >({
      query: ({ timeframe = 'day' }) => ({
        url: '/api/admin/performance/metrics',
        params: { timeframe },
      }),
    }),
  }),
  overrideExisting: false,
});

// Export hooks for usage in React components
export const {
  // Authentication hooks
  useAdminLoginMutation,
  useAdminUpdatePasswordMutation,

  // User management hooks
  useGetAllUsersQuery,
  useLazyGetAllUsersQuery,
  useAllowUserAsCampaignerMutation,
  useRemovePersonalHandleMutation,
  useRemoveBizHandleMutation,
  useGetUserActivityQuery,
  useSuspendUserMutation,
  useUnsuspendUserMutation,
  useBulkUpdateUsersMutation,

  // Token management hooks
  useListTokenMutation,
  useGetListedTokensQuery,
  useLazyGetListedTokensQuery,
  useGetTokenUsageStatsQuery,

  // Campaign management hooks
  useGetAllCampaignsQuery,
  useLazyGetAllCampaignsQuery,
  useGetPendingCampaignsQuery,
  useLazyGetPendingCampaignsQuery,
  useApproveCampaignMutation,
  useGetCampaignLogsQuery,
  useFlagCampaignMutation,
  useUnflagCampaignMutation,
  useBulkDeleteCampaignsMutation,

  // TrailSetters hooks
  useGetTrailSettersQuery,
  useUpdateTrailSettersMutation,

  // System hooks
  useGetActiveContractInfoQuery,
  useGetSystemStatsQuery,
  useGetUserStatsQuery,
  useGetCampaignStatsQuery,
  useGetDatabaseStatsQuery,
  useGetPerformanceMetricsQuery,

  // Configuration hooks
  useGetAppConfigQuery,
  useUpdateAppConfigMutation,

  // Audit and logging hooks
  useGetAuditLogsQuery,

  // Export hooks
  useExportUsersMutation,
  useExportCampaignsMutation,

  // Notification hooks
  useSendNotificationMutation,
  useGetNotificationHistoryQuery,
} = adminApi;

export default adminApi;
