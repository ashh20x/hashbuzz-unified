import { RootState } from "@/Store/store";
import { OnboardingSteps } from "@/Ver2Designs/Pages/AuthAndOnboard/authStoreSlice";
import { useAccountId, useWallet } from "@buidlerlabs/hashgraph-react-wallets";
import { HWCConnector } from "@buidlerlabs/hashgraph-react-wallets/connectors";
import { useSelector } from "react-redux";

const useStepGuardHelper = () => {
  const { currentStep, currentUser, ping, cred } = useSelector((state: RootState) => ({
    currentStep: state.auth.currentStep,
    currentUser: state.auth.currentUser,
    ping: state.auth.ping,
    cred: state.auth.cred,
  }));

  const { isConnected } = useWallet(HWCConnector);
  const {data:accountId} = useAccountId();

  const hasWallet = Boolean(currentUser?.hedera_wallet_id);
  const isPingValid = Boolean(ping?.status && ping?.walletId === currentUser?.hedera_wallet_id);
  const hasCreds = Boolean(cred?.ast && cred?.auth);
  const hasTwitterHandle = Boolean(currentUser?.personal_twitter_handle);

  const canGoToXAccount = currentStep === OnboardingSteps.PairWallet && hasWallet && isPingValid && hasCreds;

  const canGoToAssociateTokens = currentStep === OnboardingSteps.ConnectXAccount && canGoToXAccount && hasTwitterHandle;

  const canGoToAuthentication =  isConnected && accountId;

  return { currentStep, canGoToXAccount, canGoToAssociateTokens, canGoToAuthentication };
};

export default useStepGuardHelper;
