
import { OnboardingSteps } from '@/Ver2Designs/Pages/AuthAndOnboard/authStoreSlice';
import React from 'react';
import { Navigate } from 'react-router-dom';
import useStepGuardHelper from './use-step-guard-helper';

interface StepGuardProps {
    step: OnboardingSteps
    children: React.ReactNode;
}

/**
 * Guards access to each onboarding step in the sequence:
 * 1. Pair wallet & authenticate (PairWallet)
 * 2. Connect X account (ConnectXAccount)
 * 3. Associate tokens (AssociateTokens)
 *
 * Redirects if:
 * - Trying to enter ConnectXAccount before PairWallet or currentStep mismatches
 * - Trying to enter AssociateTokens before ConnectXAccount or currentStep mismatches
 * - Any other invalid step
 *
 * @param {OnboardingSteps} step - The step to protect.
 * @param {React.ReactNode} children - Content to render when allowed.
 * @returns {JSX.Element} The children if allowed, else a <Navigate />.
 */

const StepGuard: React.FC<StepGuardProps> = ({ step, children }) => {
    const { currentStep, canGoToXAccount, canGoToAssociateTokens } = useStepGuardHelper();

    // Step 1: Pair wallet and authenticate
    if (step === OnboardingSteps.PairWallet) {
        return <>{children}</>;
    }
    // Step 2: Connect X account
    if (step === OnboardingSteps.ConnectXAccount) {
        if (!canGoToXAccount) {
            return <Navigate to={`/auth/${OnboardingSteps.PairWallet}`} replace />;
        }
        if (currentStep !== step) {
            return <Navigate to={`/auth/${currentStep}`} replace />;
        }
        return <>{children}</>;
    }
    // Step 3: Associate tokens
    if (step === OnboardingSteps.AssociateTokens) {
        if (!canGoToAssociateTokens) {
            return <Navigate to={`/auth/${OnboardingSteps.ConnectXAccount}`} replace />;
        }
        if (currentStep !== step) {
            return <Navigate to={`/auth/${currentStep}`} replace />;
        }
        return <>{children}</>;
    }
    // Fallback: redirect to first step
    return <Navigate to={`/auth/${OnboardingSteps.PairWallet}`} replace />;
};

export default StepGuard;