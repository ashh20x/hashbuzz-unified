import { useLazyGetAccountTokensQuery } from "@/API/mirrorNodeAPI";
import { useLazyGetCurrentUserQuery } from "@/API/user";
import { useAppDispatch, useAppSelector } from "@/Store/store";
import { markAllTokensAssociated, setTokens } from "@/Ver2Designs/Pages/AuthAndOnboard";
import { useCallback, useEffect } from "react";

const useTokenAssociationSync = () => {
  const {
    wallet: { isPaired },
    auth: { isAuthenticated },
  } = useAppSelector((s) => s.auth.userAuthAndOnBoardSteps);
  const isUserAuthenticated = isPaired && isAuthenticated;
  const [getCurrentUser] = useLazyGetCurrentUserQuery();
  const [getAccountTokens] = useLazyGetAccountTokensQuery();
  const dispatch = useAppDispatch();

  const fetchCurrentUserDataAndSyncTokens = useCallback(async () => {
    try {
      const user = await getCurrentUser().unwrap();
      const { contractAddress: smartContractAccountId } = user.config;
      const userWalletId = user.hedera_wallet_id;

      localStorage.setItem("app_config", JSON.stringify(user.config));

      const [contractTokensRes, userTokensRes] = await Promise.all([getAccountTokens(smartContractAccountId).unwrap(), getAccountTokens(userWalletId).unwrap()]);

      const contractTokens = contractTokensRes.tokens || [];
      const userTokens = userTokensRes.tokens || [];

      const isAllAssociated = contractTokens.every((contractToken) => userTokens.some((ut) => ut.token_id === contractToken.token_id));

      dispatch(setTokens(userTokens));
      if (isAllAssociated) {
        dispatch(markAllTokensAssociated());
      }
    } catch (error) {
      // Optionally handle error (e.g., dispatch error state)
      // console.error("Token association sync failed", error);
    }
  }, [getCurrentUser, getAccountTokens, dispatch]);

  useEffect(() => {
    if (isUserAuthenticated) {
      fetchCurrentUserDataAndSyncTokens();
    }
  }, [isUserAuthenticated, fetchCurrentUserDataAndSyncTokens]);

  // No return value needed for this hook
  return;
};

export default useTokenAssociationSync;
