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
  currentUser?: CurrentUser;
  ping?: UserPing;
  cred?: Partial<AuthCred>;
}

const initialState: AuthState = {
  currentStep: OnboardingSteps.PairWallet,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    advanceStep(state) {
      switch (state.currentStep) {
        case OnboardingSteps.PairWallet:
          state.currentStep = OnboardingSteps.SignAuthentication;
          break;
        case OnboardingSteps.SignAuthentication:
          state.currentStep = OnboardingSteps.ConnectXAccount;
          break;
        case OnboardingSteps.ConnectXAccount:
          state.currentStep = OnboardingSteps.AssociateTokens;
          break;
        default:
          break;
      }
    },
    setStep(state, action: PayloadAction<AuthState["currentStep"]>) {
      state.currentStep = action.payload;
    },
  },
});

export const { advanceStep, setStep } = authSlice.actions;
export default authSlice.reducer;
