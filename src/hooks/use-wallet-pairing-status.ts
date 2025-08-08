import { useAppDispatch } from "@/Store/store";
import { walletDisconnected, walletPaired } from "@/Ver2Designs/Pages/AuthAndOnboard/authStoreSlice";
import { useAccountId, useWallet } from "@buidlerlabs/hashgraph-react-wallets";
import { HWCConnector } from "@buidlerlabs/hashgraph-react-wallets/connectors";
import { useEffect } from "react";

const useWalletPairingStatus = () => {
  const { isConnected, extensionReady } = useWallet(HWCConnector);
  const { data: accountID } = useAccountId();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (extensionReady && isConnected) {
      dispatch(walletPaired(accountID));
    } else {
      dispatch(walletDisconnected());
    }
  }, [isConnected]);
  return;
};

export default useWalletPairingStatus;
