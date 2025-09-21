import {
  useCreateCampaignDraftV201Mutation,
  usePublishCampaignV201Mutation,
} from '@/API/campaign';
import { useGetCurrentUserQuery, useGetTokenBalancesQuery } from '@/API/user';
import { TokenBalances } from '@/types';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// V201 Campaign form data structure
export interface V201CampaignFormData {
  name: string;
  tweet_text: string;
  expected_engaged_users: number;
  campaign_budget: number;
  type: 'HBAR' | 'FUNGIBLE';
  media: File[];
  fungible_token_id?: string;
}

// Form validation errors
export interface V201CampaignErrors {
  name?: string;
  tweet_text?: string;
  expected_engaged_users?: string;
  campaign_budget?: string;
  fungible_token_id?: string;
  media?: string;
}

// Hook return type
export interface UseV201CampaignReturn {
  // Form state
  formData: V201CampaignFormData;
  setFormData: React.Dispatch<React.SetStateAction<V201CampaignFormData>>;
  errors: V201CampaignErrors;

  // API state
  isDraftLoading: boolean;
  isPublishLoading: boolean;
  isLoading: boolean;
  savedDraftId: string | null;

  // Token data
  tokenBalances: TokenBalances[] | undefined;
  isLoadingTokens: boolean;

  // Actions
  handleFieldChange: (
    field: keyof V201CampaignFormData
  ) => (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | { target: { value: string } }
  ) => void;
  handleMediaUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  removeMediaFile: (index: number) => void;
  validateForm: () => boolean;
  saveDraft: () => Promise<void>;
  publishCampaign: () => Promise<void>;
  resetForm: () => void;

  // User balance for the selected token type
  getUserBalance: () => number;
  getMaxBudget: () => number;
}

// Initial form state
const initialFormData: V201CampaignFormData = {
  name: '',
  tweet_text: '',
  expected_engaged_users: 100,
  campaign_budget: 0,
  type: 'HBAR',
  media: [],
  fungible_token_id: '',
};

export const useV201Campaign = (): UseV201CampaignReturn => {
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] =
    useState<V201CampaignFormData>(initialFormData);
  const [errors, setErrors] = useState<V201CampaignErrors>({});
  const [savedDraftId, setSavedDraftId] = useState<string | null>(null);

  // API hooks
  const [createDraft, { isLoading: isDraftLoading }] =
    useCreateCampaignDraftV201Mutation();
  const [publishCampaignMutation, { isLoading: isPublishLoading }] =
    usePublishCampaignV201Mutation();
  const { data: tokenBalances, isLoading: isLoadingTokens } =
    useGetTokenBalancesQuery();
  const { data: currentUser } = useGetCurrentUserQuery();

  const isLoading = isDraftLoading || isPublishLoading;

  // Reset form to initial state
  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setErrors({});
    setSavedDraftId(null);
  }, []);

  // Get user balance for current type
  const getUserBalance = useCallback((): number => {
    if (formData.type === 'HBAR') {
      // available_budget is in tinybars, convert to HBAR
      const hbarTinybars = currentUser?.available_budget || 0;
      return hbarTinybars / 100_000_000; // Convert tinybars to HBAR
    } else if (formData.fungible_token_id) {
      // Find selected fungible token balance
      const selectedToken = tokenBalances?.find(
        token => token.token_id === formData.fungible_token_id
      );
      return selectedToken?.available_balance || 0;
    }
    return 0;
  }, [
    formData.type,
    formData.fungible_token_id,
    tokenBalances,
    currentUser?.available_budget,
  ]);

  // Get maximum budget user can set (80% of available balance for safety)
  const getMaxBudget = useCallback((): number => {
    const balance = getUserBalance();
    return Math.floor(balance * 0.8); // Reserve 20% for fees and safety
  }, [getUserBalance]);

  // Handle field changes with type safety
  const handleFieldChange = useCallback(
    (field: keyof V201CampaignFormData) =>
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
              ? Number(value) || 0
              : value,
        }));

        // Clear error when user starts typing
        if (field in errors && errors[field as keyof V201CampaignErrors]) {
          setErrors(prev => ({ ...prev, [field]: undefined }));
        }
      },
    [errors]
  );

  // Handle media file uploads
  const handleMediaUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (files) {
        const fileArray = Array.from(files);

        // Validate maximum number of files (backend allows 2)
        if (fileArray.length > 2) {
          setErrors(prev => ({
            ...prev,
            media: `Too many files selected. Maximum 2 files allowed, but ${fileArray.length} were selected.`,
          }));
          return;
        }

        // Validate file sizes (max 10MB per file, matching backend limit)
        const maxSize = 10 * 1024 * 1024; // 10MB
        const oversizedFiles = fileArray.filter(file => file.size > maxSize);

        if (oversizedFiles.length > 0) {
          setErrors(prev => ({
            ...prev,
            media: `Some files exceed the 10MB limit: ${oversizedFiles.map(f => f.name).join(', ')}`,
          }));
          return;
        }

        // Validate file types (only images allowed by backend)
        const allowedTypes = ['image/'];
        const invalidFiles = fileArray.filter(
          file => !allowedTypes.some(type => file.type.startsWith(type))
        );

        if (invalidFiles.length > 0) {
          setErrors(prev => ({
            ...prev,
            media: `Invalid file types: ${invalidFiles.map(f => f.name).join(', ')}. Only images are allowed.`,
          }));
          return;
        }

        setFormData(prev => ({
          ...prev,
          media: fileArray,
        }));

        // Clear media error if valid files selected
        if (errors.media) {
          setErrors(prev => ({ ...prev, media: undefined }));
        }
      }
    },
    [errors.media]
  );

  // Remove media file by index
  const removeMediaFile = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      media: prev.media.filter((_, i) => i !== index),
    }));
  }, []);

  // Form validation
  const validateForm = useCallback((): boolean => {
    const newErrors: V201CampaignErrors = {};

    // Required fields validation
    if (!formData.name.trim()) {
      newErrors.name = 'Campaign name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Campaign name must be at least 3 characters';
    } else if (formData.name.length > 50) {
      newErrors.name = 'Campaign name must not exceed 50 characters';
    }

    if (!formData.tweet_text.trim()) {
      newErrors.tweet_text = 'Tweet text is required';
    } else if (formData.tweet_text.length < 10) {
      newErrors.tweet_text = 'Tweet text must be at least 10 characters';
    } else if (formData.tweet_text.length > 280) {
      newErrors.tweet_text = 'Tweet text must not exceed 280 characters';
    }

    // Expected engaged users validation
    if (formData.expected_engaged_users < 1) {
      newErrors.expected_engaged_users =
        'Expected engaged users must be at least 1';
    } else if (formData.expected_engaged_users > 1000000) {
      newErrors.expected_engaged_users =
        'Expected engaged users cannot exceed 1,000,000';
    }

    // Budget validation
    if (formData.campaign_budget <= 0) {
      newErrors.campaign_budget = 'Campaign budget must be greater than 0';
    } else {
      const userBalance = getUserBalance();
      const maxBudget = getMaxBudget();

      if (formData.campaign_budget > userBalance) {
        newErrors.campaign_budget = `Budget cannot exceed your ${formData.type === 'HBAR' ? 'HBAR' : 'token'} balance: ${userBalance}`;
      } else if (formData.campaign_budget > maxBudget) {
        newErrors.campaign_budget = `For safety, budget should not exceed ${maxBudget} (80% of available balance)`;
      }
    }

    // Token validation for FUNGIBLE type
    if (formData.type === 'FUNGIBLE' && !formData.fungible_token_id) {
      newErrors.fungible_token_id =
        'Please select a token for fungible campaigns';
    }

    // Media validation (optional but if provided, must be valid)
    if (formData.media.length > 5) {
      newErrors.media = 'Maximum 5 media files allowed';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, getUserBalance, getMaxBudget]);

  // Save draft
  const saveDraft = useCallback(async (): Promise<void> => {
    if (!validateForm()) {
      toast.error('⚠️ Please fix the validation errors before saving', {
        position: 'top-right',
        autoClose: 4000,
      });
      return;
    }

    try {
      // Create FormData for file uploads (same as legacy campaign)
      const formDataPayload = new FormData();

      // Add form fields
      formDataPayload.append('name', formData.name);
      formDataPayload.append('tweet_text', formData.tweet_text);
      formDataPayload.append(
        'expected_engaged_users',
        formData.expected_engaged_users.toString()
      );
      formDataPayload.append(
        'campaign_budget',
        formData.campaign_budget.toString()
      );
      formDataPayload.append('type', formData.type);

      if (formData.type === 'FUNGIBLE' && formData.fungible_token_id) {
        formDataPayload.append('fungible_token_id', formData.fungible_token_id);
      }

      // Add media files directly (not as base64)
      formData.media.forEach((file: File) => {
        formDataPayload.append('media', file);
      });

      const result = await createDraft(formDataPayload).unwrap();

      if (result.success && result.data.campaignId) {
        setSavedDraftId(result.data.campaignId);
        toast.success(
          '✅ Campaign draft saved successfully! You can now publish it.',
          {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );
        resetForm();
        navigate('app/dashboard');
      } else {
        toast.error(result.message || 'Failed to save campaign draft', {
          position: 'top-right',
          autoClose: 5000,
        });
      }
    } catch (error: unknown) {
      console.error('Failed to save campaign draft:', error);
      const err = error as {
        data?: { message?: string; error?: string; status?: number };
        message?: string;
        status?: number;
      };

      // Extract error message and specific error type
      const errorMessage =
        err?.data?.message ||
        err?.message ||
        'Failed to save campaign draft. Please try again.';
      const errorType = err?.data?.error;

      // Handle specific file upload errors with targeted messages
      if (
        errorType === 'FILE_TOO_LARGE' ||
        errorMessage.includes('File too large')
      ) {
        toast.error(
          '📁 One or more files exceed the 10MB size limit. Please choose smaller files.',
          {
            position: 'top-right',
            autoClose: 6000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );
        return;
      }

      if (
        errorType === 'TOO_MANY_FILES' ||
        errorMessage.includes('Too many files')
      ) {
        toast.error(
          '📁 You can upload a maximum of 2 files. Please remove some files and try again.',
          {
            position: 'top-right',
            autoClose: 6000,
          }
        );
        return;
      }

      if (
        errorType === 'UNEXPECTED_FILE_FIELD' ||
        errorMessage.includes('Unexpected file')
      ) {
        toast.error(
          '📁 Invalid file upload format. Please try uploading your files again.',
          {
            position: 'top-right',
            autoClose: 6000,
          }
        );
        return;
      }

      // Check for specific Twitter API errors and provide targeted feedback
      if (errorMessage.includes('TWITTER_AUTH_EXPIRED')) {
        toast.error(
          '🔐 Your 𝕏 account authentication has expired. Please reconnect your business 𝕏 account to continue publishing campaigns.',
          {
            position: 'top-right',
            autoClose: false, // Don't auto-close for authentication errors
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            className: 'twitter-auth-expired-toast',
          }
        );

        // Show a second informational toast about reconnecting
        setTimeout(() => {
          toast.info(
            '💡 Click here to reconnect your business 𝕏 account and continue publishing.',
            {
              position: 'top-center',
              autoClose: 10000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              className: 'twitter-reconnect-toast',
              onClick: () => {
                // Trigger business Twitter connection flow
                fetch('/api/integrations/twitter/bizHandle', {
                  method: 'GET',
                  credentials: 'include',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                })
                  .then(response => response.json())
                  .then(data => {
                    if (data.url) {
                      window.location.href = data.url;
                    }
                  })
                  .catch(console.error);
                toast.dismiss();
              },
            }
          );
        }, 2000);
      } else if (errorMessage.includes('TWITTER_FORBIDDEN')) {
        toast.error(
          '🚫 Your 𝕏 account does not have permission to post. Please check your account permissions.',
          {
            position: 'top-right',
            autoClose: 6000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );
      } else if (errorMessage.includes('TWITTER_RATE_LIMITED')) {
        toast.error(
          '⏰ 𝕏 API rate limit exceeded. Please wait a few minutes before trying again.',
          {
            position: 'top-right',
            autoClose: 6000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );
      } else if (errorMessage.includes('TWITTER_DUPLICATE')) {
        toast.error(
          '📝 This tweet content has already been posted. Please modify your campaign text.',
          {
            position: 'top-right',
            autoClose: 6000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );
      } else {
        // Generic error handling for other cases
        toast.error(errorMessage, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    }
  }, [
    formData,
    validateForm,
    createDraft,
    setSavedDraftId,
    navigate,
    resetForm,
  ]);

  // Publish campaign
  const publishCampaignAction = useCallback(async (): Promise<void> => {
    if (!savedDraftId) {
      toast.error('Please save a draft first before publishing');
      return;
    }

    if (!validateForm()) {
      toast.error('Please fix the validation errors before publishing');
      return;
    }

    try {
      const result = await publishCampaignMutation({
        campaignId: parseInt(savedDraftId.toString()),
        campaignDuration: 30, // Default 30 days
        anyFinalComment: 'Published via V201 interface',
      }).unwrap();

      if (result.success) {
        toast.success(
          '🚀 Campaign published successfully! Redirecting to dashboard...',
          {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );

        // Small delay to show success message before navigation
        setTimeout(() => {
          navigate('/dashboard?tab=campaigns&refresh=true');
        }, 1500);
      } else {
        toast.error(result.message || 'Failed to publish campaign', {
          position: 'top-right',
          autoClose: 5000,
        });
      }
    } catch (error: unknown) {
      console.error('Failed to publish campaign:', error);
      const err = error as { data?: { message?: string }; message?: string };
      const errorMessage =
        err?.data?.message ||
        err?.message ||
        'Failed to publish campaign. Please try again.';
      toast.error(errorMessage);
    }
  }, [savedDraftId, validateForm, publishCampaignMutation, navigate]);

  return {
    // Form state
    formData,
    setFormData,
    errors,

    // API state
    isDraftLoading,
    isPublishLoading,
    isLoading,
    savedDraftId,

    // Token data
    tokenBalances,
    isLoadingTokens,

    // Actions
    handleFieldChange,
    handleMediaUpload,
    removeMediaFile,
    validateForm,
    saveDraft,
    publishCampaign: publishCampaignAction,
    resetForm,

    // Balance helpers
    getUserBalance,
    getMaxBudget,
  };
};
