# Quest API Integration Guide

## Overview

The Quest API provides a complete TypeScript/React interface for managing quest-based campaigns in the frontend application. Built with RTK Query, it offers automatic caching, request deduplication, and optimized data fetching.

## Features

- ✅ **Full TypeScript Support** - Complete type definitions for all requests and responses
- ✅ **RTK Query Integration** - Automatic caching and state management
- ✅ **File Upload Support** - Handle media attachments with FormData
- ✅ **Automatic Cache Invalidation** - Smart cache updates on mutations
- ✅ **Pagination Support** - Built-in pagination for quest lists
- ✅ **Error Handling** - Standardized error responses
- ✅ **Authentication** - Automatic token handling via base query

## Installation

The Quest API is already integrated into your application. Just import the hooks you need:

```typescript
import {
  useDraftQuestCampaignMutation,
  usePublishQuestCampaignMutation,
  useGetAllQuestCampaignsQuery,
  useGetQuestCampaignByIdQuery,
  // ... other hooks
} from '../API/quest';
```

## API Endpoints

### 1. Create Quest Draft

**Mutation:** `useDraftQuestCampaignMutation`

Creates a new quest campaign draft with optional media attachments.

```typescript
import { useDraftQuestCampaignMutation } from '../API/quest';

function CreateQuestForm() {
  const [draftQuest, { isLoading, error, data }] = useDraftQuestCampaignMutation();

  const handleSubmit = async (formData: FormData) => {
    try {
      const result = await draftQuest({
        name: 'My Quest Campaign',
        tweet_text: 'Join our quest! #crypto #quest',
        expected_engaged_users: 100,
        campaign_budget: 1000,
        type: 'HBAR', // or 'FUNGIBLE'
        fungible_token_id: undefined, // Required if type is 'FUNGIBLE'
        media: [], // Array of File objects
      }).unwrap();

      console.log('Quest created:', result.data?.questId);
    } catch (err) {
      console.error('Failed to create quest:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create Quest'}
      </button>
      {error && <div>Error: {error.message}</div>}
    </form>
  );
}
```

### 2. Publish Quest Campaign

**Mutation:** `usePublishQuestCampaignMutation`

Publishes a previously drafted quest campaign.

```typescript
import { usePublishQuestCampaignMutation } from '../API/quest';

function QuestActions({ questId }: { questId: string }) {
  const [publishQuest, { isLoading }] = usePublishQuestCampaignMutation();

  const handlePublish = async () => {
    try {
      const result = await publishQuest({ questId }).unwrap();
      console.log('Quest published:', result);
    } catch (err) {
      console.error('Failed to publish quest:', err);
    }
  };

  return (
    <button onClick={handlePublish} disabled={isLoading}>
      {isLoading ? 'Publishing...' : 'Publish Quest'}
    </button>
  );
}
```

### 3. Get All Quest Campaigns

**Query:** `useGetAllQuestCampaignsQuery`

Fetches all quest campaigns for the current user with pagination.

```typescript
import { useGetAllQuestCampaignsQuery } from '../API/quest';

function QuestList() {
  const { data, isLoading, error, refetch } = useGetAllQuestCampaignsQuery({
    page: 1,
    limit: 10,
  });

  if (isLoading) return <div>Loading quests...</div>;
  if (error) return <div>Error loading quests</div>;

  const quests = data?.data?.quests || [];
  const pagination = data?.data?.pagination;

  return (
    <div>
      <h2>My Quest Campaigns ({pagination?.total || 0})</h2>
      {quests.map(quest => (
        <div key={quest.id}>
          <h3>{quest.name}</h3>
          <p>Status: {quest.status}</p>
          <p>Budget: {quest.budget}</p>
          <p>Type: {quest.type}</p>
        </div>
      ))}

      {/* Pagination controls */}
      <Pagination
        current={pagination?.page || 1}
        total={pagination?.pages || 1}
        onChange={(page) => refetch({ page, limit: 10 })}
      />
    </div>
  );
}
```

### 4. Get Quest by ID

**Query:** `useGetQuestCampaignByIdQuery`

Fetches detailed information about a specific quest.

```typescript
import { useGetQuestCampaignByIdQuery } from '../API/quest';
import { useParams } from 'react-router-dom';

function QuestDetails() {
  const { questId } = useParams<{ questId: string }>();
  const { data, isLoading, error } = useGetQuestCampaignByIdQuery(questId || '');

  if (isLoading) return <div>Loading quest details...</div>;
  if (error) return <div>Quest not found</div>;

  const quest = data?.data?.quest;

  return (
    <div>
      <h1>{quest?.name}</h1>
      <p>{quest?.tweetText}</p>
      <div>
        <strong>Status:</strong> {quest?.status}
      </div>
      <div>
        <strong>Budget:</strong> ${quest?.budget}
      </div>
      <div>
        <strong>Spent:</strong> ${quest?.spent}
      </div>
      <div>
        <strong>Remaining:</strong> ${quest?.remaining}
      </div>

      {quest?.stats && (
        <div>
          <h3>Statistics</h3>
          <p>Total Submissions: {quest.stats.totalSubmissions}</p>
          <p>Approved: {quest.stats.approvedSubmissions}</p>
          <p>Pending: {quest.stats.pendingReview}</p>
        </div>
      )}
    </div>
  );
}
```

### 5. Get Quest State

**Query:** `useGetQuestStateQuery`

Gets the current state and progress of a quest campaign.

```typescript
import { useGetQuestStateQuery } from '../API/quest';

function QuestProgress({ questId }: { questId: string }) {
  const { data, isLoading } = useGetQuestStateQuery(questId, {
    pollingInterval: 30000, // Poll every 30 seconds
  });

  const state = data?.data;

  return (
    <div>
      <h3>Quest Progress</h3>
      {state?.progress && (
        <div>
          <p>Total Submissions: {state.progress.totalSubmissions}</p>
          <p>Approved: {state.progress.approvedSubmissions}</p>
          <p>Pending Review: {state.progress.pendingReview}</p>
          <p>Rejected: {state.progress.rejectedSubmissions}</p>
        </div>
      )}

      {state?.budget && (
        <div>
          <h4>Budget Status</h4>
          <ProgressBar
            total={state.budget.total}
            spent={state.budget.spent}
            remaining={state.budget.remaining}
          />
        </div>
      )}
    </div>
  );
}
```

### 6. Get Quest Submissions

**Query:** `useGetQuestSubmissionsQuery`

Fetches all submissions for a quest campaign.

```typescript
import { useGetQuestSubmissionsQuery } from '../API/quest';

function QuestSubmissions({ questId }: { questId: string }) {
  const { data, isLoading } = useGetQuestSubmissionsQuery(questId);

  const submissions = data?.data?.submissions || [];

  return (
    <div>
      <h3>Submissions</h3>
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Tweet</th>
            <th>Status</th>
            <th>Submitted At</th>
            <th>Reward</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map(submission => (
            <tr key={submission.id}>
              <td>{submission.userName}</td>
              <td>
                <a href={submission.tweetUrl} target="_blank" rel="noopener noreferrer">
                  View Tweet
                </a>
              </td>
              <td>{submission.status}</td>
              <td>{new Date(submission.submittedAt).toLocaleDateString()}</td>
              <td>{submission.rewardAmount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

### 7. Grade Quest Submissions

**Mutation:** `useGradeQuestSubmissionsMutation`

Grade quest submissions and distribute rewards.

```typescript
import { useGradeQuestSubmissionsMutation } from '../API/quest';

function GradeSubmissions({ questId }: { questId: string }) {
  const [gradeSubmissions, { isLoading }] = useGradeQuestSubmissionsMutation();

  const handleGrade = async (submissionIds: string[], approvalDecisions: Record<string, boolean>) => {
    try {
      const result = await gradeSubmissions({
        questId,
        submissionIds,
        approvalDecisions,
      }).unwrap();

      console.log(`Graded ${result.data?.gradedCount} submissions`);
      console.log(`Approved: ${result.data?.approvedCount}`);
      console.log(`Total rewards: ${result.data?.totalRewardsDistributed}`);
    } catch (err) {
      console.error('Failed to grade submissions:', err);
    }
  };

  return (
    <button onClick={() => handleGrade(['1', '2'], { '1': true, '2': false })} disabled={isLoading}>
      Grade Submissions
    </button>
  );
}
```

### 8. Close Quest Campaign

**Mutation:** `useCloseQuestCampaignMutation`

Manually close a quest campaign.

```typescript
import { useCloseQuestCampaignMutation } from '../API/quest';

function CloseQuest({ questId }: { questId: string }) {
  const [closeQuest, { isLoading }] = useCloseQuestCampaignMutation();

  const handleClose = async () => {
    if (!confirm('Are you sure you want to close this quest?')) return;

    try {
      const result = await closeQuest(questId).unwrap();
      console.log('Quest closed:', result);
    } catch (err) {
      console.error('Failed to close quest:', err);
    }
  };

  return (
    <button onClick={handleClose} disabled={isLoading} className="btn-danger">
      {isLoading ? 'Closing...' : 'Close Quest'}
    </button>
  );
}
```

## Advanced Usage

### Using Lazy Queries

For queries that should only run on demand:

```typescript
import { useLazyGetQuestCampaignByIdQuery } from '../API/quest';

function SearchQuest() {
  const [trigger, { data, isLoading }] = useLazyGetQuestCampaignByIdQuery();

  const handleSearch = (questId: string) => {
    trigger(questId);
  };

  return (
    <div>
      <input onChange={(e) => handleSearch(e.target.value)} />
      {isLoading && <div>Searching...</div>}
      {data && <QuestCard quest={data.data?.quest} />}
    </div>
  );
}
```

### Cache Invalidation

The API automatically invalidates caches when mutations succeed:

- Creating a draft invalidates: `Quest`, `Campaign` tags
- Publishing a quest invalidates: `Quest`, `Campaign`, specific quest by ID
- Grading submissions invalidates: quest and its submissions
- Closing a quest invalidates: `Quest` tag and specific quest

### Manual Cache Management

```typescript
import { questApi } from '../API/quest';
import { useDispatch } from 'react-redux';

function RefreshButton({ questId }: { questId: string }) {
  const dispatch = useDispatch();

  const handleRefresh = () => {
    // Manually invalidate cache
    dispatch(
      questApi.util.invalidateTags([{ type: 'Quest', id: questId }])
    );
  };

  return <button onClick={handleRefresh}>Refresh</button>;
}
```

### Optimistic Updates

```typescript
import { useDraftQuestCampaignMutation } from '../API/quest';

function OptimisticCreate() {
  const [createQuest] = useDraftQuestCampaignMutation();

  const handleCreate = async questData => {
    try {
      await createQuest(questData, {
        // Optimistic update
        onSuccess: data => {
          // Update local state immediately
        },
      }).unwrap();
    } catch (err) {
      // Rollback on error
    }
  };
}
```

## Type Definitions

All types are exported from `../types/quest.ts`:

```typescript
import type {
  QuestType,
  QuestStatus,
  DraftQuestRequest,
  DraftQuestResponse,
  QuestDetails,
  QuestSubmission,
  // ... more types
} from '../types';
```

## Error Handling

All API calls return standardized error responses:

```typescript
const [createQuest, { error }] = useDraftQuestCampaignMutation();

if (error) {
  if ('status' in error) {
    // HTTP error
    console.error('Error status:', error.status);
    console.error('Error data:', error.data);
  } else {
    // Network error
    console.error('Network error:', error.message);
  }
}
```

## Best Practices

1. **Use TypeScript** - Leverage the full type definitions
2. **Handle Loading States** - Always show loading indicators
3. **Error Boundaries** - Wrap components in error boundaries
4. **Pagination** - Use pagination for large lists
5. **Cache Management** - Let RTK Query handle caching automatically
6. **Polling** - Use polling for real-time updates when needed
7. **Optimistic Updates** - For better UX on mutations

## Testing

Example test with RTK Query:

```typescript
import { renderHook } from '@testing-library/react-hooks';
import { useGetAllQuestCampaignsQuery } from '../API/quest';
import { wrapper } from '../test-utils';

test('should fetch quests', async () => {
  const { result, waitForNextUpdate } = renderHook(
    () => useGetAllQuestCampaignsQuery({ page: 1, limit: 10 }),
    { wrapper }
  );

  expect(result.current.isLoading).toBe(true);
  await waitForNextUpdate();
  expect(result.current.data).toBeDefined();
});
```

## Troubleshooting

### TypeScript Errors

If you see type errors, make sure:

- Types are exported from `src/types/index.ts`
- Quest tag is added to `apiBase.ts` tagTypes

### API Not Working

Check:

- Backend routes are correctly configured at `/v2/quest/*`
- Authentication tokens are being sent
- CORS is properly configured
- Network tab for actual request/response

### Cache Issues

To reset cache:

```typescript
import { questApi } from '../API/quest';
dispatch(questApi.util.resetApiState());
```

## Migration from Old API

If migrating from a previous API implementation:

**Old:**

```typescript
const response = await fetch('/api/quest/all');
const data = await response.json();
```

**New:**

```typescript
const { data, isLoading } = useGetAllQuestCampaignsQuery();
```

Benefits:

- ✅ Automatic caching
- ✅ No manual state management
- ✅ Type safety
- ✅ Loading/error states
- ✅ Request deduplication

## Additional Resources

- [RTK Query Documentation](https://redux-toolkit.js.org/rtk-query/overview)
- [Backend API Documentation](../backend/docs/QUEST_API.md)
- [Type Definitions](../types/quest.ts)
- [Example Components](../examples/QuestComponents.tsx)
