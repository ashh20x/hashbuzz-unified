import { MirrorNodeToken } from "@/types/mirrorTypes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export enum OnboardingSteps {
  PairWallet = "pair-wallet",
  SignAuthentication = "sign-authentication",
  ConnectXAccount = "connect-x-account",
  ConnectXSuccess = "connect-x-success",
  AssociateTokens = "associate-tokens",
}

export interface SignerSignatureString {
  publicKey: string;
  signature: string;
  accountId: string;
}

export type ConnectedToken = {
  token: MirrorNodeToken;
  isAssociated: boolean;
};

export type TokenAssociation = {
  tokens: ConnectedToken[];
  allAssociated: boolean;
};

interface UserAuthAndOnBoardSteps {
  wallet: { isPaired: boolean; address?: string };
  auth: { isAuthenticated: boolean };
  xAccount: { isConnected: boolean; handle?: string };
  token: TokenAssociation;
  currentStep: OnboardingSteps;
}

interface AppStatus {
  isLoading: boolean;
  isAppReady: boolean;
  shouldShowSplash: boolean;
}

export interface AuthState {
  currentStep: OnboardingSteps;
  isSmDeviceModalOpen?: boolean;
  userAuthAndOnBoardSteps: UserAuthAndOnBoardSteps;
  appStatus: AppStatus;
}

const initialAuthState: UserAuthAndOnBoardSteps = {
  wallet: { isPaired: false },
  auth: { isAuthenticated: false },
  xAccount: { isConnected: false },
  token: { tokens: [], allAssociated: false },
  currentStep: OnboardingSteps.PairWallet,
};

const initialState: AuthState = {
  currentStep: OnboardingSteps.PairWallet,
  isSmDeviceModalOpen: true,
  userAuthAndOnBoardSteps: initialAuthState,
  appStatus: {
    isAppReady: false,
    isLoading: false,
    shouldShowSplash: true,
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    toggleSmDeviceModal(state, action: PayloadAction<boolean>) {
      state.isSmDeviceModalOpen = action.payload;
    },
    walletPaired: (state, action: PayloadAction<string>) => {
      if (!state.userAuthAndOnBoardSteps) {
        state.userAuthAndOnBoardSteps = {
          wallet: { isPaired: false },
          auth: { isAuthenticated: false },
          xAccount: { isConnected: false },
          token: { tokens: [], allAssociated: false },
          currentStep: OnboardingSteps.PairWallet,
        };
      }
      state.userAuthAndOnBoardSteps.wallet.isPaired = true;
      state.userAuthAndOnBoardSteps.wallet.address = action.payload;
      state.userAuthAndOnBoardSteps.currentStep = OnboardingSteps.SignAuthentication;
    },
    authenticated: (state) => {
      state.userAuthAndOnBoardSteps.auth.isAuthenticated = true;
      state.userAuthAndOnBoardSteps.currentStep = OnboardingSteps.ConnectXAccount;
    },
    connectXAccount: (state, action: PayloadAction<string>) => {
      state.userAuthAndOnBoardSteps.xAccount.isConnected = true;
      state.userAuthAndOnBoardSteps.xAccount.handle = action.payload;
      state.userAuthAndOnBoardSteps.currentStep = OnboardingSteps.AssociateTokens;
    },
    setTokens: (state, action: PayloadAction<MirrorNodeToken[]>) => {
      // Initialize tokens as not associated
      state.userAuthAndOnBoardSteps.token.tokens = action.payload.map((token) => ({
        token,
        isAssociated: false,
      }));
      state.userAuthAndOnBoardSteps.token.allAssociated = false;
    },
    setTokenAssociation: (state, action: PayloadAction<{ tokenId: string; isAssociated: boolean }>) => {
      const { tokenId, isAssociated } = action.payload;
      const tokenIndex = state.userAuthAndOnBoardSteps.token.tokens.findIndex((t) => t.token.token_id === tokenId);

      if (tokenIndex !== -1) {
        state.userAuthAndOnBoardSteps.token.tokens[tokenIndex].isAssociated = isAssociated;
        // Check if all tokens are now associated
        state.userAuthAndOnBoardSteps.token.allAssociated = state.userAuthAndOnBoardSteps.token.tokens.every((t) => t.isAssociated);
      }
    },
    markAllTokensAssociated: (state) => {
      state.userAuthAndOnBoardSteps.token.tokens.forEach((token) => {
        token.isAssociated = true;
      });
      state.userAuthAndOnBoardSteps.token.allAssociated = true;
    },

    updateAppStatus: (state, action: PayloadAction<Partial<AppStatus>>) => {
      state.appStatus = { ...state.appStatus, ...action.payload };
    },

    resetAuth: () => initialState,
  },
});

export const { toggleSmDeviceModal, walletPaired, authenticated, connectXAccount, setTokens, setTokenAssociation, markAllTokensAssociated, resetAuth, updateAppStatus } = authSlice.actions;
export default authSlice.reducer;
