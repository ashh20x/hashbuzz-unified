import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  AppState,
  EntityBalances,
  ContractInfo,
  CurrentUser,
  AuthCred,
} from '../types';

const initialState: AppState = {
  ping: {
    status: false,
    hedera_wallet_id: '',
  },
  checkRefresh: false,
  balances: [],
  toasts: [],
  balanceRefreshTimer: null,
};

const miscellaneousStoreSlice = createSlice({
  name: 'store',
  initialState,
  reducers: {
    setPing: (
      state: AppState,
      action: PayloadAction<{ status: boolean; hedera_wallet_id: string }>
    ) => {
      state.ping = action.payload;
      state.checkRefresh = true;
    },
    updateState: (
      state: AppState,
      action: PayloadAction<Partial<AppState>>
    ) => {
      Object.assign(state, action.payload);
    },
    setBalances: (state: AppState, action: PayloadAction<EntityBalances[]>) => {
      state.balances = action.payload;
    },
    setAuthCred: (state: AppState, action: PayloadAction<AuthCred>) => {
      state.auth = action.payload;
    },
    addToast: (
      state: AppState,
      action: PayloadAction<{ type: 'success' | 'error'; message: string }>
    ) => {
      state.toasts.push(action.payload);
    },
    resetToast: (state: AppState) => {
      state.toasts = [];
    },
    setContractInfo: (state: AppState, action: PayloadAction<ContractInfo>) => {
      state.contractInfo = action.payload;
    },
    updateCurrentUser: (
      state: AppState,
      action: PayloadAction<CurrentUser>
    ) => {
      state.currentUser = action.payload;
    },
    setBalanceQueryTimer: (
      state: AppState,
      action: PayloadAction<number | null>
    ) => {
      state.balanceRefreshTimer = action.payload;
    },
    resetState: () => initialState,
  },
});

export const {
  setPing,
  updateState,
  setBalances,
  setAuthCred,
  addToast,
  resetToast,
  setContractInfo,
  updateCurrentUser,
  resetState,
  setBalanceQueryTimer,
} = miscellaneousStoreSlice.actions;

export default miscellaneousStoreSlice.reducer;
