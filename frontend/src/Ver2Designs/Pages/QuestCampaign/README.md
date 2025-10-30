# Quest Campaign Feature

## Overview

The Quest Campaign feature allows campaign creators to engage users through quiz-based reward campaigns. Users answer multiple-choice questions, and those who answer correctly share the reward pool equally.

## Features

### 1. **Quest Creation**

- **Campaign Name**: Catchy, descriptive name (max 50 characters)
- **Question**: Clear, engaging question (max 280 characters)
- **Answer Options**: 2-6 multiple choice options
- **Correct Answer Selection**: Mark which option is correct
- **Reward Configuration**:
  - HBAR or Fungible Token (HTS) rewards
  - Budget allocation
  - Expected participants

### 2. **User Experience**

- Clean, intuitive interface
- Real-time validation
- Visual feedback for selected correct answer (highlighted in green)
- Budget calculator showing reward per correct answer

### 3. **Components**

#### `CreateQuestCampaign.tsx`

Main component for creating quest campaigns with:

- Quest configuration form
- Dynamic options list (add/remove)
- Budget and token selection
- Draft saving
- Publishing workflow

#### `useQuestCampaign.ts`

Custom React hook managing:

- Form state and validation
- API interactions (draft/publish)
- Token balance tracking
- Budget validation
- Error handling

## Usage

```typescript
import { CreateQuestCampaign } from '@/Ver2Designs/Pages/QuestCampaign';

function App() {
  return <CreateQuestCampaign onBack={() => navigate(-1)} />;
}
```

## Form Structure

```typescript
interface QuestCampaignFormData {
  name: string; // Campaign name
  question: string; // Quiz question
  question_options?: string[]; // Array of answer options
  correct_answer_index?: number; // Index of correct answer
  expected_engaged_users: number; // Expected participants
  campaign_budget: number; // Total budget
  type: 'HBAR' | 'FUNGIBLE'; // Reward token type
  fungible_token_id?: string; // Token ID if FUNGIBLE
}
```

## Features

### Option Management

- **Add Option**: Up to 6 options supported
- **Remove Option**: Minimum 2 options required
- **Select Correct Answer**: Click radio button to mark correct option
- Visual feedback with green highlight for correct answer

### Budget & Rewards

- Integrates with existing budget validation system
- Shows user's available balance
- Calculates reward per correct answer
- Supports both HBAR and fungible tokens

### Validation

- All fields required before publishing
- Minimum 2 answer options
- Correct answer must be selected
- Budget must be positive and within user's balance

## API Endpoints (TODO)

Currently using V201 campaign endpoints as placeholder. Need to implement:

### Draft API

```
POST /api/quest-campaign/draft
Body: QuestCampaignFormData
Response: { campaignId: string, draftId: string }
```

### Publish API

```
POST /api/quest-campaign/publish
Body: QuestCampaignFormData & { campaignId: string }
Response: { success: boolean, campaignId: string }
```

## Configuration

Enable/disable via remote config:

```json
{
  "quest_campaign": true
}
```

## Styling

Uses Material-UI components with consistent design:

- **Color Coding**: Green for correct answers, grey for regular options
- **Icons**: Radio buttons for selection, delete icons for removal
- **Paper Components**: Sections for question and budget configuration
- **Alert Components**: Instructions, validation messages, success notifications

## Dependencies

- `@mui/material` - UI components
- `@mui/icons-material` - Icons
- `react-toastify` - Toast notifications
- `react-router-dom` - Navigation
- Custom hooks: `useBudgetValidation`, `useRemoteConfig`, `useQuestCampaign`

## Future Enhancements

1. **Multiple Questions**: Support quiz with multiple questions
2. **Time Limits**: Add timer for answering
3. **Leaderboard**: Show top performers
4. **Analytics**: Track participation and correct answer rates
5. **Media Support**: Add images/videos to questions
6. **Question Bank**: Reuse questions from previous quests
7. **Difficulty Levels**: Easy, Medium, Hard categories
8. **Hints System**: Optional hints for users

## Testing Checklist

- [ ] Create quest with HBAR rewards
- [ ] Create quest with fungible token rewards
- [ ] Add/remove options (min 2, max 6)
- [ ] Select correct answer
- [ ] Validate budget exceeds balance
- [ ] Save draft functionality
- [ ] Publish quest functionality
- [ ] Form reset functionality
- [ ] Error handling for API failures
- [ ] Responsive design on mobile/tablet

## Notes

- Currently uses V201 campaign API endpoints as placeholder
- Backend API endpoints need to be implemented for quest-specific data
- Question options and correct answer index need to be stored separately in database
- Consider adding preview functionality before publishing
