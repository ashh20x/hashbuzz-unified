/**
 * Token Association Sync Module
 * Handles token synchronization between contract and user wallet
 * @version 3.0.0
 */

import { useCallback } from 'react';
import { useAppDispatch } from '@/Store/store';
import { setTokens, markAllTokensAssociated } from '@/Ver2Designs/Pages/AuthAndOnboard';
import { useLazyGetAccountTokensQuery } from '@/API/mirrorNodeAPI';
import { useLazyGetCurrentUserQuery } from '@/API/user';
import { AUTH_STORAGE_KEYS } from './constants';
import { logError, logDebug } from './utils';
import { updateCurrentUser } from '@/Store/miscellaneousStoreSlice';

export const useTokenAssociationSync = () => {
  const dispatch = useAppDispatch();
  const [getCurrentUser] = useLazyGetCurrentUserQuery();
  const [getAccountTokens] = useLazyGetAccountTokensQuery();

  // ============================================================================
  // TOKEN ASSOCIATION SYNC
  // ============================================================================

  const syncTokenAssociations = useCallback(async () => {
    try {
      const user = await getCurrentUser().unwrap();
      
      if (!user || !user.config || !user.hedera_wallet_id) {
        throw new Error("Invalid user data received");
      }
      
      const { contractAddress } = user.config;
      const userWalletId = user.hedera_wallet_id;

     

      if (!contractAddress || !userWalletId) {
        throw new Error("Missing contract or wallet address");
      }

      localStorage.setItem(AUTH_STORAGE_KEYS.APP_CONFIG, JSON.stringify(user.config));

      const [contractTokensRes, userTokensRes] = await Promise.all([
        getAccountTokens(contractAddress).unwrap(), 
        getAccountTokens(userWalletId).unwrap()
      ]);

      const contractTokens = contractTokensRes?.tokens || [];
      const userTokens = userTokensRes?.tokens || [];

      if (!Array.isArray(contractTokens) || !Array.isArray(userTokens)) {
        throw new Error("Invalid token data format");
      }

      const isAllAssociated = contractTokens.length > 0 && 
        contractTokens.every((ct) => 
          ct && ct.token_id && userTokens.some((ut) => 
            ut && ut.token_id && String(ut.token_id) === String(ct.token_id)
          )
        );

      logDebug("Token association sync completed", { 
        isAllAssociated, 
        contractTokens: contractTokens.length, 
        userTokens: userTokens.length 
      }, "[TOKEN ASSOCIATION]");

      dispatch(setTokens(contractTokens));
      if (isAllAssociated) dispatch(markAllTokensAssociated());
       dispatch(updateCurrentUser(user));
    } catch (error) {
      logError(error, "Token association sync failed", "[TOKEN ASSOCIATION]");
    }
  }, [getCurrentUser, getAccountTokens, dispatch]);

  // ============================================================================
  // PUBLIC API
  // ============================================================================

  return {
    syncTokenAssociations
  };
};
