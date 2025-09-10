// components/StepGuard.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/Store/store';
import { OnboardingSteps } from '@/Ver2Designs/Pages/AuthAndOnboard/authStoreSlice';
import type { RootState } from '@/Store/store';

/**
 * StepGuard:
 * - Automatically navigates users to the appropriate step based on their completion status
 * - Skips completed steps and moves to the next incomplete step
 * - Allows access to the current step if all prerequisites are met
 */

const STEP_ORDER: OnboardingSteps[] = [
  OnboardingSteps.PairWallet,
  OnboardingSteps.SignAuthentication,
  OnboardingSteps.ConnectXAccount,
  OnboardingSteps.AssociateTokens,
];

const STEP_PATHS: Record<OnboardingSteps, string> = {
  [OnboardingSteps.PairWallet]: '/auth/pair-wallet',
  [OnboardingSteps.SignAuthentication]: '/auth/sign-authentication',
  [OnboardingSteps.ConnectXAccount]: '/auth/connect-x-account',
  [OnboardingSteps.AssociateTokens]: '/auth/associate-tokens',
};

const DASHBOARD_PATH = '/app/dashboard';

interface StepGuardProps {
  step: OnboardingSteps;
  children: React.ReactNode;
}

const StepGuard: React.FC<StepGuardProps> = ({ step, children }) => {
  // select primitive flags (avoid selecting whole objects)
  const walletIsPaired = useAppSelector(
    (s: RootState) => s.auth.userAuthAndOnBoardSteps.wallet.isPaired
  );
  const authIsAuthenticated = useAppSelector(
    (s: RootState) => s.auth.userAuthAndOnBoardSteps.auth.isAuthenticated
  );
  const xAccountIsConnected = useAppSelector(
    (s: RootState) => s.auth.userAuthAndOnBoardSteps.xAccount.isConnected
  );
  const tokensAreAllAssociated = useAppSelector(
    (s: RootState) => s.auth.userAuthAndOnBoardSteps.token.allAssociated
  );

  const navigate = useNavigate();

  // Helper function to check if a step is completed
  const isStepCompleted = (stepToCheck: OnboardingSteps): boolean => {
    switch (stepToCheck) {
      case OnboardingSteps.PairWallet:
        return walletIsPaired;
      case OnboardingSteps.SignAuthentication:
        return authIsAuthenticated;
      case OnboardingSteps.ConnectXAccount:
        return xAccountIsConnected;
      case OnboardingSteps.AssociateTokens:
        return tokensAreAllAssociated;
      default:
        return false;
    }
  };

  // Find the next incomplete step or return null if all completed
  const getNextIncompleteStep = (): OnboardingSteps | null => {
    for (const stepInOrder of STEP_ORDER) {
      if (!isStepCompleted(stepInOrder)) {
        return stepInOrder;
      }
    }
    return null; // All steps completed
  };

  useEffect(() => {
    const nextIncompleteStep = getNextIncompleteStep();

    // If all steps are completed, go to dashboard
    if (!nextIncompleteStep) {
      navigate(DASHBOARD_PATH);
      return;
    }

    // If current step is already completed, move to next incomplete step
    if (isStepCompleted(step)) {
      navigate(STEP_PATHS[nextIncompleteStep]);
      return;
    }

    // If current step is not completed but is the next in sequence, allow access
    if (step === nextIncompleteStep) {
      return; // Allow access to current step
    }

    // If trying to access a step that's not next in sequence, redirect to next incomplete
    navigate(STEP_PATHS[nextIncompleteStep]);
  }, [
    step,
    walletIsPaired,
    authIsAuthenticated,
    xAccountIsConnected,
    tokensAreAllAssociated,
    navigate,
  ]);

  return <>{children}</>;
};

export default StepGuard;
