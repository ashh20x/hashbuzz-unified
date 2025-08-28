import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AppStatus {
  isAppReady: boolean;
  isLoading: boolean;
  shouldShowSplash: boolean;
}

const defaultState: AppStatus = {
  isAppReady: false,
  isLoading: false,
  shouldShowSplash: true,
};

const appStatusSlice = createSlice({
  name: 'appStatus',
  initialState: defaultState,
  reducers: {
    setAuthStatus: (state, action: PayloadAction<Partial<AppStatus>>) => {
      const { isAppReady, isLoading, shouldShowSplash } = action.payload;
      state.isAppReady = isAppReady ?? state.isAppReady;
      state.isLoading = isLoading ?? state.isLoading;
      state.shouldShowSplash = shouldShowSplash ?? state.shouldShowSplash;
    },

    resetAuth: () => defaultState,
  },
});

export const { setAuthStatus, resetAuth } = appStatusSlice.actions;
export default appStatusSlice.reducer;
