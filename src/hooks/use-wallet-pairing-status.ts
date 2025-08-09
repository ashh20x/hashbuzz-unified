import { useAppDispatch } from "@/Store/store";
import { resetAuth, walletPaired } from "@/Ver2Designs/Pages/AuthAndOnboard/authStoreSlice";
import { useAccountId, useWallet } from "@buidlerlabs/hashgraph-react-wallets";
import { HWCConnector } from "@buidlerlabs/hashgraph-react-wallets/connectors";
import { useEffect } from "react";

const useWalletPairingStatus = () => {
  const { isConnected, extensionReady } = useWallet(HWCConnector);
  const { data: accountID } = useAccountId();
  const dispatch = useAppDispatch();

  console.log('Wallet pairing status:', { isConnected, extensionReady, accountID });

  useEffect(() => {
    if (extensionReady && isConnected) {
      dispatch(walletPaired(accountID));
    } else {
      dispatch(resetAuth());

    }
  }, [isConnected]);
  return;
};

export default useWalletPairingStatus;
