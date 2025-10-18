/**
 * Quest Campaign Type Definitions
 * Types for quest-based campaign management and API responses
 */

// ============================================================================
// Enums and Constants
// ============================================================================

export type QuestType = 'HBAR' | 'FUNGIBLE';
export type QuestStatus =
  | 'DRAFT'
  | 'PUBLISHED'
  | 'ACTIVE'
  | 'COMPLETED'
  | 'CLOSED'
  | 'CANCELLED';

// ============================================================================
// Request Types
// ============================================================================

/**
 * Request body for creating a quest campaign draft
 */
export interface DraftQuestRequest {
  name: string;
  tweet_text: string;
  expected_engaged_users: number;
  campaign_budget: number;
  type: QuestType;
  fungible_token_id?: string;
  media?: File[];
  options?: string[]; // Optional - for quiz-type quests
  correct_answers?: string; // Optional - for quiz-type quests
}

/**
 * Request params for publishing a quest campaign
 */
export interface PublishQuestRequest {
  questId: string;
}

/**
 * Request body for grading quest submissions
 */
export interface GradeQuestRequest {
  questId: string;
  // Add additional grading parameters as needed
  submissionIds?: string[];
  approvalDecisions?: Record<string, boolean>;
}

/**
 * Pagination parameters for quest lists
 */
export interface QuestPaginationParams {
  page?: number;
  limit?: number;
}

// ============================================================================
// Response Types
// ============================================================================

/**
 * Standard API response wrapper
 */
export interface StandardApiResponse<T> {
  status: 'success' | 'error';
  message: string;
  data?: T;
  metadata?: Record<string, unknown>;
  errors?: Record<string, unknown> | string[] | string;
}

/**
 * Response from creating a quest draft
 */
export interface DraftQuestResponse {
  questId: string;
  campaignStatus: QuestStatus;
}

/**
 * Response from publishing a quest
 */
export interface PublishQuestResponse {
  questId: string;
  status: QuestStatus;
  publishedAt?: string;
  contractId?: string;
}

/**
 * Quest state/status information
 */
export interface QuestStateResponse {
  questId: string;
  status: QuestStatus;
  progress?: {
    totalSubmissions: number;
    approvedSubmissions: number;
    pendingReview: number;
    rejectedSubmissions: number;
  };
  budget?: {
    total: number;
    spent: number;
    remaining: number;
  };
  metrics?: {
    engagements: number;
    uniqueParticipants: number;
    conversionRate: number;
  };
}

/**
 * Individual quest submission
 */
export interface QuestSubmission {
  id: string;
  userId: string;
  userName?: string;
  tweetId?: string;
  tweetUrl?: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  rewardAmount?: number;
}

/**
 * Response containing quest submissions
 */
export interface QuestSubmissionsResponse {
  questId: string;
  submissions: QuestSubmission[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

/**
 * Response from grading quest submissions
 */
export interface GradeQuestResponse {
  questId: string;
  gradedCount: number;
  approvedCount: number;
  rejectedCount: number;
  totalRewardsDistributed: number;
}

/**
 * Response from closing a quest
 */
export interface CloseQuestResponse {
  questId: string;
  status: QuestStatus;
  closedAt: string;
  finalStats?: {
    totalParticipants: number;
    totalRewardsDistributed: number;
    budgetRemaining: number;
  };
}

/**
 * Individual quest item in list
 */
export interface QuestListItem {
  id: string;
  name: string | null;
  status: string;
  budget: number | null;
  type: string | null;
  createdAt: Date | null;
}

/**
 * Response containing all quests for a user
 */
export interface GetAllQuestsResponse {
  quests: QuestListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

/**
 * Detailed quest campaign information
 */
export interface QuestDetails {
  id: string;
  name: string;
  tweetText: string;
  status: QuestStatus;
  type: QuestType;
  budget: number;
  spent: number;
  remaining: number;
  expectedEngagedUsers: number;
  fungibleTokenId?: string;
  media: string[];
  createdAt: string;
  publishedAt?: string;
  closedAt?: string;
  ownerId: string;
  contractId?: string;
  stats?: {
    totalSubmissions: number;
    approvedSubmissions: number;
    rejectedSubmissions: number;
    pendingReview: number;
    uniqueParticipants: number;
  };
}

/**
 * Response for getting a specific quest by ID
 */
export interface GetQuestByIdResponse {
  quest: QuestDetails;
}

// ============================================================================
// Utility Types
// ============================================================================

/**
 * Filter options for quest lists
 */
export interface QuestFilterOptions {
  status?: QuestStatus[];
  type?: QuestType[];
  dateFrom?: string;
  dateTo?: string;
  minBudget?: number;
  maxBudget?: number;
}

/**
 * Sort options for quest lists
 */
export interface QuestSortOptions {
  field: 'createdAt' | 'name' | 'budget' | 'status';
  order: 'asc' | 'desc';
}
