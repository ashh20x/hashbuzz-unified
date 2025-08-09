import { useCallback, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/Store/store";
import { authenticated, connectXAccount, markAllTokensAssociated, setTokens, resetAuth, walletPaired } from "@/Ver2Designs/Pages/AuthAndOnboard";
import { useAuthPingMutation } from "@/Ver2Designs/Pages/AuthAndOnboard/api/auth";
import { useLazyGetAccountTokensQuery } from "@/API/mirrorNodeAPI";
import { useLazyGetCurrentUserQuery } from "@/API/user";
import { getCookieByName } from "@/Utilities/helpers";
import { useAccountId, useWallet } from "@buidlerlabs/hashgraph-react-wallets";
import { HWCConnector } from "@buidlerlabs/hashgraph-react-wallets/connectors";

export const useAppSessionManager = () => {
  const dispatch = useAppDispatch();
  const [sessionCheckPing] = useAuthPingMutation();
  const [getCurrentUser] = useLazyGetCurrentUserQuery();
  const [getAccountTokens] = useLazyGetAccountTokensQuery();

  // Auth + wallet state
  const {
    wallet: { isPaired },
    auth: { isAuthenticated },
  } = useAppSelector((s) => s.auth.userAuthAndOnBoardSteps);
  const isUserAuthenticated = isPaired && isAuthenticated;

  // Wallet connection state from connector
  const { isConnected, extensionReady } = useWallet(HWCConnector);
  const { data: accountID } = useAccountId();

  // Refs & state
  const lastWalletStatus = useRef<{ isConnected: boolean; extensionReady: boolean; accountID?: string } | null>(null);
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isRefreshingRef = useRef(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  // ------------------------------------------------------
  // Wallet pairing sync (merged from useWalletPairingSync)
  // ------------------------------------------------------
  useEffect(() => {
    const currentStatus = { isConnected, extensionReady, accountID };
    if (!lastWalletStatus.current || lastWalletStatus.current.isConnected !== isConnected || lastWalletStatus.current.extensionReady !== extensionReady || lastWalletStatus.current.accountID !== accountID) {
      if (extensionReady && isConnected) {
        dispatch(walletPaired(accountID));
      } else {
        dispatch(resetAuth());
      }
      lastWalletStatus.current = currentStatus;
    }
  }, [isConnected, extensionReady, accountID, dispatch]);

  // ------------------------------------------------------
  // Token association sync (merged from useTokenAssociationSync)
  // ------------------------------------------------------
  const syncTokenAssociations = useCallback(async () => {
    try {
      const user = await getCurrentUser().unwrap();
      const { contractAddress } = user.config;
      const userWalletId = user.hedera_wallet_id;

      localStorage.setItem("app_config", JSON.stringify(user.config));

      const [contractTokensRes, userTokensRes] = await Promise.all([getAccountTokens(contractAddress).unwrap(), getAccountTokens(userWalletId).unwrap()]);

      const contractTokens = contractTokensRes.tokens || [];
      const userTokens = userTokensRes.tokens || [];

      const isAllAssociated = Array.isArray(contractTokens) && contractTokens.length > 0 && contractTokens.every((ct) => userTokens.some((ut) => String(ut.token_id) === String(ct.token_id)));

      console.log("Token association sync:", { isAllAssociated, contractTokens, userTokens });

      dispatch(setTokens(contractTokens));
      if (isAllAssociated) dispatch(markAllTokensAssociated());
    } catch {
      // Optional error handling
    }
  }, [getCurrentUser, getAccountTokens, dispatch]);

  // ------------------------------------------------------
  // Token refresh (merged from useTokenRefresh)
  // ------------------------------------------------------
  const refreshToken = useCallback(async (): Promise<boolean> => {
    if (isRefreshingRef.current) return false;

    try {
      isRefreshingRef.current = true;
      console.log("Refreshing access token...");

      const response = await fetch(`${(import.meta as any).env.VITE_API_BASE_URL}/auth/refresh-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Device-ID": localStorage.getItem("device_id") || "",
        },
        credentials: "include",
      });

      if (response.ok) {
        console.log("Token refreshed successfully");
        return true;
      } else {
        console.warn("Token refresh failed");
        return false;
      }
    } catch (err) {
      console.error("Token refresh error:", err);
      return false;
    } finally {
      isRefreshingRef.current = false;
    }
  }, []);

  const startTokenRefreshTimer = useCallback(() => {
    if (refreshIntervalRef.current) return;
    if (getCookieByName("access_token")) {
      refreshIntervalRef.current = setInterval(refreshToken, 14 * 60 * 1000);
      console.log("Token refresh timer started");
    }
  }, [refreshToken]);

  const stopTokenRefreshTimer = useCallback(() => {
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
      console.log("Token refresh timer stopped");
    }
  }, []);

  // ------------------------------------------------------
  // Session validation (merged from TokenRefreshProvider)
  // ------------------------------------------------------
  const validateSession = useCallback(async () => {
    if (hasInitialized) return;

    try {
      const { isAuthenticated, connectedXAccount } = await sessionCheckPing().unwrap();

      if (isAuthenticated) {
        dispatch(authenticated());
        startTokenRefreshTimer();
      }

      if (connectedXAccount) {
        dispatch(connectXAccount(connectedXAccount));
      }
    } catch (error: any) {
      if (error?.originalStatus === 429) {
        console.log("Rate limited - skipping refresh start");
      } else if (error?.data?.error?.description === "AUTH_TOKEN_NOT_PRESENT") {
        console.log("No token - new user flow");
      } else {
        console.error("Session validation failed:", error);
      }
    } finally {
      setHasInitialized(true);
    }
  }, [hasInitialized, sessionCheckPing, dispatch, startTokenRefreshTimer]);

  // ------------------------------------------------------
  // Lifecycle effects
  // ------------------------------------------------------
  useEffect(() => {
    if (!hasInitialized) validateSession();
  }, [hasInitialized, validateSession]);

  useEffect(() => {
    if (isUserAuthenticated) {
      syncTokenAssociations();
    }
  }, [isUserAuthenticated, syncTokenAssociations]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopTokenRefreshTimer();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      stopTokenRefreshTimer();
    };
  }, [stopTokenRefreshTimer]);
};

export default useAppSessionManager;
