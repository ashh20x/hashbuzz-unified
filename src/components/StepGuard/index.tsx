
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
    const { currentStep, canGoToAuthentication, canGoToXAccount, canGoToAssociateTokens } = useStepGuardHelper();

    if( currentStep !== step ) {
        return <Navigate to={`/auth/${currentStep}`} replace />;
    }

    // Step 1: Pair wallet and authenticate
    if (step === OnboardingSteps.PairWallet) {
        return <>{children}</>;
    }

    console.log("StepGuard: Invalid step access attempt" ,  {canGoToAuthentication , currentStep, step });

    // Step 2: Authenticate
    if (step === OnboardingSteps.SignAuthentication && canGoToAuthentication) {
        return <>{children}</>;
    }

    // Step 3: Connect X account
    if (step === OnboardingSteps.ConnectXAccount && canGoToXAccount) {
        return <>{children}</>;
    }
    // Step 4: Associate tokens
    if (step === OnboardingSteps.AssociateTokens && canGoToAssociateTokens) {
        return <>{children}</>;
    }
    // Fallback: redirect to first step
    return <Navigate to={`/auth/${OnboardingSteps.PairWallet}`} replace />;
};

export default StepGuard;