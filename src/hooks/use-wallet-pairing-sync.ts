import { useAppDispatch } from "@/Store/store";
import { resetAuth, walletPaired } from "@/Ver2Designs/Pages/AuthAndOnboard/authStoreSlice";
import { useAccountId, useWallet } from "@buidlerlabs/hashgraph-react-wallets";
import { HWCConnector } from "@buidlerlabs/hashgraph-react-wallets/connectors";
import { useEffect, useRef } from "react";

const useWalletPairingSync = () => {
  const { isConnected, extensionReady } = useWallet(HWCConnector);
  const { data: accountID } = useAccountId();
  const dispatch = useAppDispatch();

  const lastStatus = useRef<{ isConnected: boolean; extensionReady: boolean; accountID: string | undefined } | null>(null);

  useEffect(() => {
    const currentStatus = { isConnected, extensionReady, accountID };

    if (
      !lastStatus.current ||
      lastStatus.current.isConnected !== isConnected ||
      lastStatus.current.extensionReady !== extensionReady ||
      lastStatus.current.accountID !== accountID
    ) {
      if (extensionReady && isConnected) {
        dispatch(walletPaired(accountID));
      } else {
        dispatch(resetAuth());
      }
      lastStatus.current = currentStatus;
    }
  }, [isConnected, extensionReady, accountID, dispatch]);

  return;
};

export default useWalletPairingSync;
