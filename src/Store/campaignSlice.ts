import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface MediaFile {
  file: File;
  type: string;
  url: string;
}

export interface CampaignFormData {
  name: string;
  tweet_text: string;
  comment_reward: string;
  retweet_reward: string;
  like_reward: string;
  quote_reward: string;
  follow_reward: string;
  campaign_budget: string;
  type: 'HBAR' | 'FUNGIBLE';
  fungible_token_id: string;
}

export interface CampaignState {
  // Form data
  formData: CampaignFormData;

  // Media management
  media: string[];
  displayMedia: string[];
  mediaFiles: MediaFile[];

  // UI state
  showEmojis: boolean;
  isYoutube: boolean;
  addMedia: boolean;
  gifSelected: boolean;

  // YouTube specific
  srcLink: string;
  videoTitle: string | null;

  // Button tags from hashtags
  buttonTags: string[];

  // Validation and errors
  errorNameMessage: string;
  errorTextMessage: string;
  budgetMessage: string;
  buttonDisabled: boolean;

  // Token management
  selectedToken: string;
  allTokens: Array<{
    value: string;
    token_symbol: string;
    tokenBalance: number;
  }>;

  // Modal states
  open: boolean;
}

const initialState: CampaignState = {
  formData: {
    name: '',
    tweet_text: '',
    comment_reward: '0',
    retweet_reward: '0',
    like_reward: '0',
    quote_reward: '0',
    follow_reward: '0',
    campaign_budget: '0',
    type: 'HBAR',
    fungible_token_id: '',
  },
  media: [],
  displayMedia: [],
  mediaFiles: [],
  showEmojis: false,
  isYoutube: false,
  addMedia: false,
  gifSelected: false,
  srcLink: 'https://www.youtube.com/embed/1lzba8D4FCU',
  videoTitle: null,
  buttonTags: [],
  errorNameMessage: '',
  errorTextMessage: '',
  budgetMessage: '',
  buttonDisabled: false,
  selectedToken: '',
  allTokens: [],
  open: false,
};

const campaignSlice = createSlice({
  name: 'campaign',
  initialState,
  reducers: {
    // Form data updates
    updateFormField: (
      state,
      action: PayloadAction<{ field: keyof CampaignFormData; value: string }>
    ) => {
      const { field, value } = action.payload;
      (state.formData as any)[field] = value;

      // Handle specific field validations
      if (field === 'name') {
        state.errorNameMessage = value === '' ? 'Please enter some value' : '';
      }

      if (field === 'tweet_text') {
        state.errorTextMessage = value === '' ? 'Please enter some value' : '';
        // Extract hashtags for button tags
        const hashtags = value.split(' ').filter(item => item.startsWith('#'));
        state.buttonTags = hashtags;
      }
    },

    // Media management
    addMediaFile: (state, action: PayloadAction<MediaFile>) => {
      const mediaFile = action.payload;

      // Reset YouTube if adding other media
      if (state.isYoutube) {
        state.isYoutube = false;
      }

      // Handle GIF selection logic
      if (state.media.length === 0 && mediaFile.type.includes('gif')) {
        state.displayMedia.push(mediaFile.url);
        state.gifSelected = true;
      } else if (
        state.media.length < 4 &&
        !mediaFile.type.includes('gif') &&
        !state.gifSelected
      ) {
        state.displayMedia.push(mediaFile.url);
      } else {
        return; // Max 4 files or gif limit reached
      }

      state.mediaFiles.push(mediaFile);
    },

    removeMediaFile: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      state.displayMedia.splice(index, 1);
      state.media.splice(index, 1);
      state.mediaFiles.splice(index, 1);

      // Reset gif selection if no media left
      if (state.displayMedia.length === 0) {
        state.gifSelected = false;
      }
    },

    // YouTube management
    setYouTubeUrl: (state, action: PayloadAction<string>) => {
      const url = action.payload.trim();
      let videoId = '';

      if (url.indexOf('youtube') !== -1) {
        const urlParts = url.split('?v=');
        videoId = urlParts?.[1]?.substring(0, 11) || '';
      } else if (url.indexOf('youtu.be') !== -1) {
        const urlParts = url.replace('//', '').split('/');
        videoId = urlParts[1]?.substring(0, 11) || '';
      }

      if (videoId === '') {
        state.srcLink = url;
      } else {
        state.srcLink = `https://www.youtube.com/embed/${videoId}`;
      }

      state.media = [url];
      state.displayMedia = [];
    },

    setVideoTitle: (state, action: PayloadAction<string>) => {
      state.videoTitle = action.payload;
    },

    // UI state management
    toggleEmojis: state => {
      state.showEmojis = !state.showEmojis;
    },

    toggleYoutube: state => {
      state.isYoutube = !state.isYoutube;
    },

    toggleAddMedia: state => {
      state.addMedia = !state.addMedia;
    },

    setOpen: (state, action: PayloadAction<boolean>) => {
      state.open = action.payload;
    },

    // Token management
    setAllTokens: (
      state,
      action: PayloadAction<
        Array<{ value: string; token_symbol: string; tokenBalance: number }>
      >
    ) => {
      state.allTokens = action.payload;
      if (action.payload.length > 0) {
        state.selectedToken = action.payload[0].value;
      }
    },

    setSelectedToken: (state, action: PayloadAction<string>) => {
      state.selectedToken = action.payload;
    },

    // Budget validation
    validateBudget: (
      state,
      action: PayloadAction<{
        budget: string;
        userBalance: number;
        decimals?: number;
      }>
    ) => {
      const { budget, userBalance, decimals = 8 } = action.payload;
      const budgetValue = parseFloat(budget);

      if (state.formData.type === 'HBAR') {
        const budgetInTinyHbar = Math.round(
          budgetValue * Math.pow(10, decimals)
        );
        if (budgetInTinyHbar <= userBalance) {
          state.formData.campaign_budget = budget;
          state.budgetMessage = '';
          state.buttonDisabled = false;
        } else {
          state.budgetMessage = `You have exceeded the total budget of ${userBalance / Math.pow(10, decimals)} ℏ`;
          state.buttonDisabled = true;
        }
      } else {
        const currentToken = state.allTokens.find(
          token => token.value === state.selectedToken
        );
        if (budgetValue <= (currentToken?.tokenBalance || 0)) {
          state.formData.campaign_budget = budget;
          state.budgetMessage = '';
          state.buttonDisabled = false;
        } else {
          state.budgetMessage = `You have exceeded the total budget of ${currentToken?.tokenBalance || 0} ${currentToken?.token_symbol || ''}`;
          state.buttonDisabled = true;
        }
      }
    },

    // Emoji handling
    addEmoji: (state, action: PayloadAction<string>) => {
      const emoji = action.payload;
      const currentLength = state.formData.tweet_text.length;

      if (270 - currentLength >= 2) {
        state.formData.tweet_text += emoji;
        // Update button tags
        const hashtags = state.formData.tweet_text
          .split(' ')
          .filter(item => item.startsWith('#'));
        state.buttonTags = hashtags;
      }
    },

    // Reset form
    resetForm: () => {
      return initialState;
    },

    // Error messages
    setErrorMessage: (
      state,
      action: PayloadAction<{
        field: 'name' | 'text' | 'budget';
        message: string;
      }>
    ) => {
      const { field, message } = action.payload;
      if (field === 'name') state.errorNameMessage = message;
      if (field === 'text') state.errorTextMessage = message;
      if (field === 'budget') state.budgetMessage = message;
    },
  },
});

export const {
  updateFormField,
  addMediaFile,
  removeMediaFile,
  setYouTubeUrl,
  setVideoTitle,
  toggleEmojis,
  toggleYoutube,
  toggleAddMedia,
  setOpen,
  setAllTokens,
  setSelectedToken,
  validateBudget,
  addEmoji,
  resetForm,
  setErrorMessage,
} = campaignSlice.actions;

export default campaignSlice.reducer;
