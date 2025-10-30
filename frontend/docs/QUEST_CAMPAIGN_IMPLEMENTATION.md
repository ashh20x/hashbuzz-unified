# Quest Campaign Implementation Guide

## ✅ Implementation Complete

The Quest API has been successfully integrated into the CreateQuestCampaign component through the `useQuestCampaign` hook.

---

## 📁 Files Modified

### 1. **`src/hooks/useQuestCampaign.ts`**

Updated to use the new Quest API endpoints:

**Before:**

```typescript
import {
  useCreateCampaignDraftV201Mutation,
  usePublishCampaignV201Mutation,
} from '@/API/campaign';
```

**After:**

```typescript
import {
  useDraftQuestCampaignMutation,
  usePublishQuestCampaignMutation,
} from '@/API/quest';
```

---

## 🎯 What Changed

### Save Draft Function

Now uses the proper Quest API endpoint:

- **Endpoint:** `POST /api/v201/quest/draft`
- **Returns:** `{ questId, campaignStatus }`
- **Uses:** `useDraftQuestCampaignMutation` hook

### Publish Campaign Function

Now uses the proper Quest API endpoint:

- **Endpoint:** `POST /api/v201/quest/:questId/publish`
- **Requires:** Saved `questId` from draft
- **Uses:** `usePublishQuestCampaignMutation` hook

---

## 📋 Request Flow

### 1. Create Draft

```typescript
const requestData = {
  name: 'My Quest Campaign',
  tweet_text: 'Answer this question!',
  expected_engaged_users: 100,
  campaign_budget: 1000,
  type: 'HBAR',
  fungible_token_id: undefined, // or token ID for FUNGIBLE type
  media: [], // File[] array for media uploads
};

const result = await createDraft(requestData).unwrap();
// Returns: { status, message, data: { questId, campaignStatus } }
```

### 2. Publish Quest

```typescript
const result = await publishCampaign({
  questId: savedDraftId,
}).unwrap();
// Returns: { status, message, data: { questId, status, publishedAt } }
```

---

## 🎨 Component Usage

The `CreateQuestCampaign` component automatically uses the updated hook:

```tsx
import { useQuestCampaign } from '@/hooks/useQuestCampaign';

function CreateQuestCampaign() {
  const {
    formData,
    errors,
    isDraftLoading,
    isPublishLoading,
    savedDraftId,
    handleFieldChange,
    saveDraft,
    publishCampaign,
    resetForm,
  } = useQuestCampaign();

  // Save draft with quest-specific data
  const handleSaveDraft = async () => {
    await saveDraft({
      question_options: ['Option 1', 'Option 2'],
      correct_answer_index: 0,
    });
  };

  // Publish campaign
  const handlePublish = async () => {
    await publishCampaign({
      question_options: ['Option 1', 'Option 2'],
      correct_answer_index: 0,
    });
  };

  return (
    <form>
      {/* Form fields */}
      <button onClick={handleSaveDraft} disabled={isDraftLoading}>
        Save Draft
      </button>
      <button
        onClick={handlePublish}
        disabled={isPublishLoading || !savedDraftId}
      >
        Publish
      </button>
    </form>
  );
}
```

---

## 🔄 State Management

### Loading States

- `isDraftLoading` - True while creating draft
- `isPublishLoading` - True while publishing
- `isLoading` - Combined loading state

### Draft State

- `savedDraftId` - Stores the quest ID after successful draft creation
- Required for publishing the quest

---

## ✨ Features

### Automatic Validation

- ✅ Form field validation before saving
- ✅ Quest-specific validation (options, correct answer)
- ✅ Budget validation against user balance
- ✅ Token type validation

### Error Handling

- ✅ API error messages displayed via toast
- ✅ Form validation errors shown inline
- ✅ Network error handling

### User Experience

- ✅ Loading indicators during API calls
- ✅ Success messages on completion
- ✅ Automatic navigation after publish
- ✅ Form reset after successful publish

---

## 🎯 Workflow

```
1. User fills out form
   ↓
2. Click "Save Draft"
   ↓
3. API: POST /api/v201/quest/draft
   ↓
4. Receive questId, store in state
   ↓
5. Click "Publish"
   ↓
6. API: POST /api/v201/quest/:questId/publish
   ↓
7. Success → Navigate to campaigns list
```

---

## 🔧 API Response Format

All responses follow the standard format:

### Success Response

```json
{
  "status": "success",
  "message": "Quest draft created successfully",
  "data": {
    "questId": "123",
    "campaignStatus": "DRAFT"
  }
}
```

### Error Response

```json
{
  "status": "error",
  "message": "Failed to create quest draft",
  "errors": {
    "campaign_budget": "Insufficient balance"
  }
}
```

---

## 📊 Type Definitions

The hook uses proper TypeScript types:

```typescript
interface QuestCampaignFormData {
  name: string;
  question: string;
  question_options?: string[];
  correct_answer_index?: number | null;
  expected_engaged_users: number;
  campaign_budget: number;
  type: 'HBAR' | 'FUNGIBLE';
  fungible_token_id?: string;
}

interface UseQuestCampaignReturn {
  formData: QuestCampaignFormData;
  errors: QuestCampaignErrors;
  isDraftLoading: boolean;
  isPublishLoading: boolean;
  isLoading: boolean;
  savedDraftId: string | null;
  saveDraft: (data?: Partial<QuestCampaignFormData>) => Promise<void>;
  publishCampaign: (data?: Partial<QuestCampaignFormData>) => Promise<void>;
  // ... more properties
}
```

---

## 🧪 Testing

### Manual Testing Steps

1. **Test Draft Creation**

   ```
   - Fill out all required fields
   - Click "Save Draft"
   - Verify success toast
   - Check questId is saved
   ```

2. **Test Publish**

   ```
   - Create a draft first
   - Click "Publish"
   - Verify success toast
   - Check navigation to campaigns list
   ```

3. **Test Validation**

   ```
   - Try saving without required fields
   - Try publishing without draft
   - Try invalid budget amounts
   - Verify error messages
   ```

4. **Test Error Handling**
   ```
   - Test with insufficient balance
   - Test with network errors
   - Verify error toasts appear
   ```

---

## 🚀 Next Steps

### Optional Enhancements

1. **Add Media Upload Support**

   ```typescript
   const [mediaFiles, setMediaFiles] = useState<File[]>([]);

   const handleSaveDraft = async () => {
     await saveDraft({
       ...formData,
       media: mediaFiles,
     });
   };
   ```

2. **Add Real-time Validation**

   ```typescript
   useEffect(() => {
     validateBudget(formData.campaign_budget, formData.type);
   }, [formData.campaign_budget, formData.type]);
   ```

3. **Add Auto-save**

   ```typescript
   useEffect(() => {
     const timer = setTimeout(() => {
       if (formData.name && formData.question) {
         saveDraft();
       }
     }, 3000);

     return () => clearTimeout(timer);
   }, [formData]);
   ```

4. **Add Progress Indicator**
   ```typescript
   const [step, setStep] = useState<'draft' | 'publish' | 'complete'>('draft');
   ```

---

## 🐛 Troubleshooting

### Issue: "Please save a draft before publishing"

**Solution:** Ensure `saveDraft()` is called and completes before attempting to publish.

### Issue: API returns 401 Unauthorized

**Solution:** Check that authentication tokens are valid. The Quest API requires authentication.

### Issue: Form validation errors

**Solution:** Ensure all required fields are filled:

- Campaign name
- Question text
- Budget > 0
- Expected users > 0
- Token selected (if FUNGIBLE type)

### Issue: Backend returns "questId not found"

**Solution:** The draft may not have been saved successfully. Check network tab for draft creation response.

---

## 📚 Related Documentation

- **Quest API Guide:** `docs/QUEST_API_GUIDE.md`
- **Quest API Summary:** `docs/QUEST_API_IMPLEMENTATION_SUMMARY.md`
- **Quest Types:** `src/types/quest.ts`
- **Example Components:** `src/examples/QuestComponents.tsx`

---

## ✅ Implementation Checklist

- [x] Import Quest API hooks
- [x] Update draft creation to use `useDraftQuestCampaignMutation`
- [x] Update publish to use `usePublishQuestCampaignMutation`
- [x] Use proper request data structure
- [x] Handle API responses correctly
- [x] Store questId after draft creation
- [x] Validate questId before publishing
- [x] Display success/error messages
- [x] Navigate after successful publish
- [x] Zero TypeScript errors

---

## 🎉 Summary

The Quest Campaign creation flow is now fully integrated with the Quest API:

- ✅ Uses proper API endpoints
- ✅ Correct request/response types
- ✅ Full error handling
- ✅ Loading states managed
- ✅ User feedback via toasts
- ✅ Type-safe implementation

**The component is ready for use!** 🚀
