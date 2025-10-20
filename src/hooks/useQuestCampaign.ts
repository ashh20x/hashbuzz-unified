import {
  useDraftQuestCampaignMutation,
  usePublishQuestCampaignMutation,
} from '@/API/quest';
import { useGetTokenBalancesQuery } from '@/API/user';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAppSelector } from '../Store/store';

// Token balance type from balances.ts
interface TokenBalance {
  token_id: string;
  balance: number;
}

// Fallback type for API response - not used currently
// type TokenBalanceData = TokenBalance | Record<string, unknown>;

// Quest Campaign form data structure
export interface QuestCampaignFormData {
  name: string;
  question: string;
  question_options?: string[];
  correct_answer_index?: number | null;
  expected_engaged_users: number;
  campaign_budget: number;
  type: 'HBAR' | 'FUNGIBLE';
  fungible_token_id?: string;
  media?: string[] | File[];
}

// Form validation errors
export interface QuestCampaignErrors {
  name?: string;
  question?: string;
  expected_engaged_users?: string;
  campaign_budget?: string;
  fungible_token_id?: string;
}

// Hook return type
export interface UseQuestCampaignReturn {
  // Form state
  formData: QuestCampaignFormData;
  setFormData: React.Dispatch<React.SetStateAction<QuestCampaignFormData>>;
  errors: QuestCampaignErrors;

  // API state
  isDraftLoading: boolean;
  isPublishLoading: boolean;
  isLoading: boolean;
  savedDraftId: string | null;

  // Token data (using unknown to avoid type conflicts with API)
  tokenBalances: unknown;
  isLoadingTokens: boolean;

  // Actions
  handleFieldChange: (
    field: keyof QuestCampaignFormData
  ) => (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | { target: { value: string } }
  ) => void;
  validateForm: () => boolean;
  saveDraft: (data?: Partial<QuestCampaignFormData>) => Promise<void>;
  publishCampaign: (data?: Partial<QuestCampaignFormData>) => Promise<void>;
  resetForm: () => void;

  // User balance for the selected token type
  getUserBalance: () => number;
  getMaxBudget: () => number;
}

// Initial form state
const initialFormData: QuestCampaignFormData = {
  name: '',
  question: '',
  question_options: [],
  correct_answer_index: null,
  expected_engaged_users: 50,
  campaign_budget: 0,
  type: 'HBAR',
  fungible_token_id: '',
};

export const useQuestCampaign = (): UseQuestCampaignReturn => {
  const navigate = useNavigate();

  const currentUser = useAppSelector(state => state.app.currentUser);

  // Form state
  const [formData, setFormData] =
    useState<QuestCampaignFormData>(initialFormData);
  const [errors, setErrors] = useState<QuestCampaignErrors>({});
  const [savedDraftId, setSavedDraftId] = useState<string | null>(null);

  // API hooks
  const [createDraft, { isLoading: isDraftLoading }] =
    useDraftQuestCampaignMutation();
  const [publishCampaignMutation, { isLoading: isPublishLoading }] =
    usePublishQuestCampaignMutation();
  const { data: tokenBalances, isLoading: isLoadingTokens } =
    useGetTokenBalancesQuery();

  const isLoading = isDraftLoading || isPublishLoading;

  // Reset form to initial state
  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setErrors({});
    setSavedDraftId(null);
  }, []);

  // Handle field changes
  const handleFieldChange = useCallback(
    (field: keyof QuestCampaignFormData) =>
      (
        event:
          | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
          | { target: { value: string } }
      ) => {
        const value = event.target.value;
        setFormData(prev => ({
          ...prev,
          [field]:
            field === 'expected_engaged_users' || field === 'campaign_budget'
              ? Number(value)
              : value,
        }));

        // Clear error for this field
        setErrors(prev => ({ ...prev, [field]: undefined }));
      },
    []
  );

  // Validate form
  const validateForm = useCallback((): boolean => {
    const newErrors: QuestCampaignErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Campaign name is required';
    }

    if (!formData.question.trim()) {
      newErrors.question = 'Question is required';
    }

    if (formData.expected_engaged_users <= 0) {
      newErrors.expected_engaged_users =
        'Expected participants must be greater than 0';
    }

    if (formData.campaign_budget <= 0) {
      newErrors.campaign_budget = 'Budget must be greater than 0';
    }

    if (formData.type === 'FUNGIBLE' && !formData.fungible_token_id) {
      newErrors.fungible_token_id = 'Please select a token';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Get user balance for selected token type
  const getUserBalance = useCallback((): number => {
    if (formData.type === 'HBAR') {
      const hbarBalance = currentUser?.available_budget;

      return hbarBalance ? hbarBalance / 1e8 : 0;
    }
    if (!tokenBalances || tokenBalances.length === 0) return 0;
    const selectedToken = tokenBalances.find(
      (token: unknown) =>
        (token as TokenBalance).token_id === formData.fungible_token_id
    );
    return selectedToken
      ? Number((selectedToken as unknown as TokenBalance).balance)
      : 0;
  }, [
    tokenBalances,
    formData.type,
    formData.fungible_token_id,
    currentUser?.available_budget,
  ]);

  // Get maximum recommended budget (80% of balance)
  const getMaxBudget = useCallback((): number => {
    const balance = getUserBalance();
    return Math.floor(balance * 0.8);
  }, [getUserBalance]);

  // Save draft
  const saveDraft = useCallback(
    async (additionalData?: Partial<QuestCampaignFormData>) => {
      if (!validateForm()) {
        toast.error('Please fix form errors before saving');
        return;
      }

      try {
        // Get correct answer text from question_options array
        const correctAnswer =
          additionalData?.question_options &&
          additionalData.correct_answer_index !== undefined &&
          additionalData.correct_answer_index !== null
            ? additionalData.question_options[
                additionalData.correct_answer_index
              ]
            : '';

        // Prepare request data
        const requestData = {
          name: formData.name,
          tweet_text: formData.question,
          expected_engaged_users: formData.expected_engaged_users,
          campaign_budget: formData.campaign_budget,
          type: formData.type,
          fungible_token_id:
            formData.type === 'FUNGIBLE'
              ? formData.fungible_token_id
              : undefined,
          options: additionalData?.question_options || [],
          correct_answers: correctAnswer,
          // Handle media: if it's File array, send as media; if string (YouTube URL), send as youtube_url
          media:
            Array.isArray(additionalData?.media) &&
            additionalData.media.length > 0 &&
            additionalData.media[0] instanceof File
              ? (additionalData.media as File[])
              : undefined,
          youtube_url:
            Array.isArray(additionalData?.media) &&
            typeof additionalData.media[0] === 'string'
              ? additionalData.media[0]
              : undefined,
        };

        const result = await createDraft(requestData).unwrap();

        if (result?.data?.questId) {
          setSavedDraftId(result.data.questId);
          toast.success(result.message || 'Quest draft saved successfully!');
        }
      } catch (error: unknown) {
        console.error('Error saving draft:', error);
        const err = error as { data?: { message?: string } };
        toast.error(
          err?.data?.message || 'Failed to save draft. Please try again.'
        );
      }
    },
    [formData, validateForm, createDraft]
  );

  // Publish campaign
  const publishCampaign = useCallback(
    async (additionalData?: Partial<QuestCampaignFormData>) => {
      if (!validateForm()) {
        toast.error('Please fix form errors before publishing');
        return;
      }

      // Additional validation for quest-specific fields
      if (
        !additionalData?.question_options ||
        additionalData.question_options.length < 2
      ) {
        toast.error('Please add at least 2 answer options');
        return;
      }

      if (
        additionalData?.correct_answer_index === null ||
        additionalData?.correct_answer_index === undefined
      ) {
        toast.error('Please select the correct answer');
        return;
      }

      // Check if draft was saved first
      if (!savedDraftId) {
        toast.error('Please save a draft before publishing');
        return;
      }

      try {
        const result = await publishCampaignMutation({
          questId: savedDraftId,
        }).unwrap();

        if (result?.data) {
          toast.success(
            result.message || 'Quest campaign published successfully!'
          );
          resetForm();
          // Navigate to campaigns list or detail page
          setTimeout(() => {
            navigate('/dashboard/campaigns');
          }, 2000);
        }
      } catch (error: unknown) {
        console.error('Error publishing campaign:', error);
        const err = error as { data?: { message?: string } };
        toast.error(
          err?.data?.message || 'Failed to publish campaign. Please try again.'
        );
      }
    },
    [validateForm, publishCampaignMutation, resetForm, navigate, savedDraftId]
  );

  return {
    formData,
    setFormData,
    errors,
    isDraftLoading,
    isPublishLoading,
    isLoading,
    savedDraftId,
    tokenBalances,
    isLoadingTokens,
    handleFieldChange,
    validateForm,
    saveDraft,
    publishCampaign,
    resetForm,
    getUserBalance,
    getMaxBudget,
  };
};
