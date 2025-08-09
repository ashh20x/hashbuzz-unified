import { useAppDispatch } from "@/Store/store";
import { useAccountId, useWallet } from "@buidlerlabs/hashgraph-react-wallets";
import { HWCConnector } from '@buidlerlabs/hashgraph-react-wallets/connectors';
import { Link } from "@mui/icons-material";
import { Alert, Box, Button } from "@mui/material";
import { walletPaired } from "../../authStoreSlice";
import { Guide } from "../data";
import GuideList from "../GuideList";
import * as styles from "./styles";


const BrowserExtension = () => {
  const { isExtensionRequired, extensionReady, connect } =
    useWallet(HWCConnector);
  const { data: accountId } = useAccountId();
  const dispatch = useAppDispatch();

  const handleConnect = async () => {
    try {
      const session = await connect();
      if (session.isConnected) {
        dispatch(walletPaired(accountId));
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  console.log("BrowserExtension Rendered", { isExtensionRequired, extensionReady, accountId });

  return (
    <Box sx={styles.browserExtensionContainer}>
      <GuideList guidesList={Guide} />
      {isExtensionRequired && !extensionReady ? (
        <Alert severity="warning" sx={styles.extensionAlert}>
          Please install the HashConnect browser extension to connect your wallet.
        </Alert>
      ) : (
        <Box sx={styles.connectWalletBtnContainer} display="flex" alignItems="center" justifyContent="flex-end" className="connectIcon">
          <Button disableElevation variant="contained" startIcon={<Link />} onClick={handleConnect}>Connect Wallet</Button>
        </Box>
      )}
    </Box>
  );
};

export default BrowserExtension;
