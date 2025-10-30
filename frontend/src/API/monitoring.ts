import { apiBase } from './apiBase';

/**
 * Monitoring API endpoints for V201 system health and metrics.
 * Uses existing apiBase for consistency with other APIs.
 *
 * Backend endpoints: /api/v201/monitoring/*
 */

// Response types based on backend MonitoringController
interface BullMQHealthResponse {
  success: boolean;
  data: {
    isConnected: boolean;
    activeJobs: number;
    waitingJobs: number;
    completedJobs: number;
    failedJobs: number;
    delayedJobs?: number;
    // Event queue stats from EnhancedEventSystem
    eventQueue?: {
      pending: number;
      completed: number;
      failed: number;
      deadLetter: number;
    };
  };
  timestamp: string;
}

interface SystemHealthResponse {
  success: boolean;
  data: {
    bullmq: {
      isConnected: boolean;
      activeJobs: number;
      waitingJobs: number;
    };
    database: {
      connected: boolean;
    };
    redis: {
      connected: boolean;
    };
    overall: {
      healthy: boolean;
      services: {
        bullmq: string;
        database: string;
        redis: string;
      };
    };
  };
  timestamp: string;
}

interface StuckCampaignsResponse {
  success: boolean;
  data: {
    count: number;
    campaigns: Array<{
      id: number;
      type: string;
      status: string;
      end_date?: string;
      expiry_date?: string;
    }>;
    summary: {
      overdue_close: number;
      overdue_expiry: number;
    };
  };
}

interface TokenSyncResponse {
  success: boolean;
  data: {
    tokens: Array<{
      token_id: string;
      needsSync: boolean;
      last_synced?: string;
    }>;
  };
}

interface ProcessStuckCampaignsResponse {
  success: boolean;
  data: {
    processed: number;
    results: Array<{
      campaignId: number;
      success: boolean;
      error?: string;
    }>;
  };
}

/**
 * Monitoring API - extends existing apiBase
 */
export const monitoringApi = apiBase.injectEndpoints({
  endpoints: builder => ({
    /**
     * GET /api/v201/monitoring/health/bullmq
     * Check BullMQ queue health and job statistics
     */
    getBullMQHealth: builder.query<BullMQHealthResponse, void>({
      query: () => ({
        url: '/api/v201/monitoring/health/bullmq',
        method: 'GET',
      }),
    }),

    /**
     * GET /api/v201/monitoring/health/system
     * Check overall system health (BullMQ, Database, Redis)
     */
    getSystemHealth: builder.query<SystemHealthResponse, void>({
      query: () => ({
        url: '/api/v201/monitoring/health/system',
        method: 'GET',
      }),
    }),

    /**
     * GET /api/v201/monitoring/campaigns/stuck
     * Find campaigns that are stuck and should have been processed
     */
    getStuckCampaigns: builder.query<StuckCampaignsResponse, void>({
      query: () => ({
        url: '/api/v201/monitoring/campaigns/stuck',
        method: 'GET',
      }),
    }),

    /**
     * GET /api/v201/monitoring/tokens/sync-status
     * Get token synchronization status
     */
    getTokenSyncStatus: builder.query<TokenSyncResponse, void>({
      query: () => ({
        url: '/api/v201/monitoring/tokens/sync-status',
        method: 'GET',
      }),
    }),

    /**
     * POST /api/v201/monitoring/campaigns/stuck/process
     * Process stuck campaigns manually
     */
    processStuckCampaigns: builder.mutation<
      ProcessStuckCampaignsResponse,
      void
    >({
      query: () => ({
        url: '/api/v201/monitoring/campaigns/stuck/process',
        method: 'POST',
      }),
    }),
  }),
});

// Export hooks for use in components
export const {
  useGetBullMQHealthQuery,
  useGetSystemHealthQuery,
  useGetStuckCampaignsQuery,
  useGetTokenSyncStatusQuery,
  useProcessStuckCampaignsMutation,
} = monitoringApi;
