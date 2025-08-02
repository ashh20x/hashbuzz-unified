import { AuthCred, CurrentUser, UserPing } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export enum OnboardingSteps {
  PairWallet = "pair-wallet",
  SignAuthentication = "sign",
  ConnectXAccount = "connect-x-account",
  AssociateTokens = "associate-tokens",
}

export interface AuthState {
  currentStep: OnboardingSteps;
  isSmDeviceModalOpen?: boolean;
  currentUser?: CurrentUser;
  ping?: UserPing;
  cred?: Partial<AuthCred>;
}

const initialState: AuthState = {
  currentStep: OnboardingSteps.PairWallet,
  isSmDeviceModalOpen: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    advanceStep(state, action: PayloadAction<{ isSmDeviceModalOpen?: boolean }>) {
      switch (state.currentStep) {
        case OnboardingSteps.PairWallet:
          state.currentStep = OnboardingSteps.SignAuthentication;
          state.isSmDeviceModalOpen = action.payload.isSmDeviceModalOpen ?? true;
          break;
        case OnboardingSteps.SignAuthentication:
          state.currentStep = OnboardingSteps.ConnectXAccount;
          state.isSmDeviceModalOpen = action.payload.isSmDeviceModalOpen ?? true;
          break;
        case OnboardingSteps.ConnectXAccount:
          state.currentStep = OnboardingSteps.AssociateTokens;
          state.isSmDeviceModalOpen = action.payload.isSmDeviceModalOpen ?? true;
          break;
        default:
          break;
      }
    },
    setStep(
      state,
      action: PayloadAction<{ step: AuthState["currentStep"]; isSmDeviceModalOpen?: boolean }>
    ) {
      state.currentStep = action.payload.step;
      state.isSmDeviceModalOpen = action.payload.isSmDeviceModalOpen ?? true;
    },
    toggleSmDeviceModal(state, action: PayloadAction<boolean>) {
      state.isSmDeviceModalOpen = action.payload;
    },

  },
});

export const { advanceStep, setStep , toggleSmDeviceModal } = authSlice.actions;
export default authSlice.reducer;
