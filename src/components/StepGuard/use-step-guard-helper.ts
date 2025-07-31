import { OnboardingSteps } from "@/Store/onboardSlice";
import { RootState } from "@/Store/store";
import { useSelector } from "react-redux";

const useStepGuardHelper = () => {
    const { currentStep, currentUser, ping, cred } = useSelector((state: RootState) => ({
        currentStep: state.auth.currentStep,
        currentUser: state.auth.currentUser,
        ping: state.auth.ping,
        cred: state.auth.cred,
    }));

    const hasWallet = Boolean(currentUser?.hedera_wallet_id);
    const isPingValid = Boolean(ping?.status && ping?.walletId === currentUser?.hedera_wallet_id);
    const hasCreds = Boolean(cred?.ast && cred?.auth);
    const hasTwitterHandle = Boolean(currentUser?.personal_twitter_handle);

    const canGoToXAccount =
        currentStep === OnboardingSteps.PairWallet &&
        hasWallet &&
        isPingValid &&
        hasCreds;

    const canGoToAssociateTokens =
        currentStep === OnboardingSteps.ConnectXAccount &&
        canGoToXAccount &&
        hasTwitterHandle;

    return { currentStep, canGoToXAccount, canGoToAssociateTokens };
};

export default useStepGuardHelper;