# Quest API - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. Import the Hook

```typescript
import { useGetAllQuestCampaignsQuery } from './API/quest';
```

### 2. Use in Your Component

```typescript
function MyQuestsPage() {
  const { data, isLoading, error } = useGetAllQuestCampaignsQuery({
    page: 1,
    limit: 10,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading quests</div>;

  return (
    <div>
      {data?.data?.quests.map(quest => (
        <div key={quest.id}>
          <h3>{quest.name}</h3>
          <p>Status: {quest.status}</p>
        </div>
      ))}
    </div>
  );
}
```

### 3. Done! ✨

That's it! The API handles:

- ✅ Authentication
- ✅ Caching
- ✅ Error handling
- ✅ Loading states
- ✅ Type safety

## 📚 Full Documentation

- **Complete Guide:** `docs/QUEST_API_GUIDE.md`
- **Examples:** `src/examples/QuestComponents.tsx`
- **Types:** `src/types/quest.ts`
- **Summary:** `docs/QUEST_API_IMPLEMENTATION_SUMMARY.md`

## 🔗 All Available Hooks

### Mutations (Actions)

```typescript
useDraftQuestCampaignMutation(); // Create quest
usePublishQuestCampaignMutation(); // Publish quest
useGradeQuestSubmissionsMutation(); // Grade submissions
useCloseQuestCampaignMutation(); // Close quest
```

### Queries (Data Fetching)

```typescript
useGetAllQuestCampaignsQuery(); // List quests
useGetQuestCampaignByIdQuery(); // Get one quest
useGetQuestStateQuery(); // Get quest state
useGetQuestSubmissionsQuery(); // Get submissions
```

## 💡 Common Patterns

### Create a Quest

```typescript
const [create] = useDraftQuestCampaignMutation();

await create({
  name: 'My Quest',
  tweet_text: 'Join us!',
  expected_engaged_users: 100,
  campaign_budget: 1000,
  type: 'HBAR',
}).unwrap();
```

### Publish a Quest

```typescript
const [publish] = usePublishQuestCampaignMutation();
await publish({ questId: '123' }).unwrap();
```

### Get Quest Details

```typescript
const { data } = useGetQuestCampaignByIdQuery('123');
const quest = data?.data?.quest;
```

### Real-time Updates

```typescript
const { data } = useGetQuestStateQuery('123', {
  pollingInterval: 30000, // Update every 30s
});
```

## 🎯 Next Steps

1. Check the examples in `src/examples/QuestComponents.tsx`
2. Read the full guide in `docs/QUEST_API_GUIDE.md`
3. Import types from `src/types/quest.ts`
4. Start building! 🚀

## ❓ Need Help?

- See full examples in the docs folder
- Check TypeScript types for available options
- All responses include proper error handling
- Backend aligned with `/v2/quest/*` routes

---

**Happy Coding!** 💻✨
