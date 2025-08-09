import { CurrentUser, GnerateReseponseV2, UserPing } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export enum OnboardingSteps {
  PairWallet = "pair-wallet",
  SignAuthentication = "sign-authentication",
  ConnectXAccount = "connect-x-account",
  AssociateTokens = "associate-tokens",
}

export interface SignerSignatureString {
  publicKey: string;
  signature: string;
  accountId: string;
}

interface UserAuthAndOnBoardSteps {
  wallet: { isPaired: boolean; address?: string };
  auth: { isAuthenticated: boolean };
  xAccount: { isConnected: boolean; handle?: string };
  token: { isAllAssociated: boolean; userTokens?: any[] };
  currentStep: OnboardingSteps;
}

export interface AuthState {
  currentStep: OnboardingSteps;
  isSmDeviceModalOpen?: boolean;
  authSignature?: SignerSignatureString;
  currentUser?: CurrentUser;
  ping?: UserPing;
  cred?: Partial<GnerateReseponseV2>;
  userAuthAndOnBoardSteps: UserAuthAndOnBoardSteps;
}

const initialAuthState: UserAuthAndOnBoardSteps = {
  wallet: { isPaired: false },
  auth: { isAuthenticated: false },
  xAccount: { isConnected: false },
  token: { isAllAssociated: false },
  currentStep: OnboardingSteps.PairWallet,
};

const initialState: AuthState = {
  currentStep: OnboardingSteps.PairWallet,
  isSmDeviceModalOpen: true,
  userAuthAndOnBoardSteps: initialAuthState,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    advanceStep(state, action: PayloadAction<{ isSmDeviceModalOpen?: boolean }>) {
      switch (state.currentStep) {
        case OnboardingSteps.PairWallet:
          state.currentStep = OnboardingSteps.SignAuthentication;
          state.isSmDeviceModalOpen = action?.payload?.isSmDeviceModalOpen ?? true;
          break;
        case OnboardingSteps.SignAuthentication:
          state.currentStep = OnboardingSteps.ConnectXAccount;
          state.isSmDeviceModalOpen = action?.payload?.isSmDeviceModalOpen ?? true;
          break;
        case OnboardingSteps.ConnectXAccount:
          state.currentStep = OnboardingSteps.AssociateTokens;
          state.isSmDeviceModalOpen = action?.payload?.isSmDeviceModalOpen ?? true;
          break;
        default:
          break;
      }
    },
    setStep(state, action: PayloadAction<{ step: AuthState["currentStep"]; isSmDeviceModalOpen?: boolean }>) {
      state.currentStep = action.payload.step;
      state.isSmDeviceModalOpen = action.payload.isSmDeviceModalOpen ?? true;
    },
    toggleSmDeviceModal(state, action: PayloadAction<boolean>) {
      state.isSmDeviceModalOpen = action.payload;
    },
    setAuthSignature(state, action: PayloadAction<SignerSignatureString>) {
      console.log("Setting Auth Signature", action.payload);
      state.authSignature = action.payload;
    },
    setAppCreds(state, action: PayloadAction<Partial<GnerateReseponseV2>>) {
      state.cred = { ...state.cred, ...action.payload };
    },
    walletPaired: (state, action: PayloadAction<string>) => {
      if (!state.userAuthAndOnBoardSteps) {
        state.userAuthAndOnBoardSteps = {
          wallet: { isPaired: false },
          auth: { isAuthenticated: false },
          xAccount: { isConnected: false },
          token: { isAllAssociated: false },
          currentStep: OnboardingSteps.PairWallet,
        };
      }
      state.userAuthAndOnBoardSteps.wallet.isPaired = true;
      state.userAuthAndOnBoardSteps.wallet.address = action.payload;
      state.userAuthAndOnBoardSteps.currentStep = OnboardingSteps.SignAuthentication;
    },
    authenticated: (state) => {
      if (!state.userAuthAndOnBoardSteps) return;
      state.userAuthAndOnBoardSteps.auth.isAuthenticated = true;
      state.userAuthAndOnBoardSteps.currentStep = OnboardingSteps.ConnectXAccount;
    },
    connectXAccount: (state, action: PayloadAction<string>) => {
      if (!state.userAuthAndOnBoardSteps) return;
      state.userAuthAndOnBoardSteps.xAccount.isConnected = true;
      state.userAuthAndOnBoardSteps.xAccount.handle = action.payload;
      state.userAuthAndOnBoardSteps.currentStep = OnboardingSteps.AssociateTokens;
    },
    associateTokens: (state, action: PayloadAction<any[]>) => {
      if (!state.userAuthAndOnBoardSteps) return;
      state.userAuthAndOnBoardSteps.token.isAllAssociated = true;
      state.userAuthAndOnBoardSteps.token.userTokens = action.payload;
    },
    resetAuth: () => initialState,
  },
});

export const { advanceStep, setStep, toggleSmDeviceModal, setAuthSignature, setAppCreds , walletPaired, authenticated, connectXAccount, associateTokens, resetAuth  } = authSlice.actions;
export default authSlice.reducer;
