import { useAppDispatch } from '@/Store/store';
import { useAccountId, useWallet } from '@buidlerlabs/hashgraph-react-wallets';
import { HWCConnector } from '@buidlerlabs/hashgraph-react-wallets/connectors';
import { Link } from '@mui/icons-material';
import { Alert, Box, Button } from '@mui/material';
import useResponsive from '../../../../../hooks/use-responsive';
import { walletPaired } from '../../authStoreSlice';
import { Guide } from '../data';
import { GuideList } from '../GuideList';
import * as styles from './styles';

const BrowserExtension = () => {
  const { isExtensionRequired, extensionReady, connect } =
    useWallet(HWCConnector);
  const { data: accountId } = useAccountId();
  const dispatch = useAppDispatch();
  const { isMobile } = useResponsive();

  const handleConnect = async () => {
    try {
      const session = await connect();
      if (session.isConnected) {
        dispatch(walletPaired(accountId));
      }
    } catch (error: any) {
      console.error(error.message);
    }
  };

  console.log('BrowserExtension Rendered', {
    isExtensionRequired,
    extensionReady,
    accountId,
  });

  return (
    <Box sx={styles.browserExtensionContainer}>
      <GuideList guidesList={Guide} />
      {isExtensionRequired && !extensionReady ? (
        <Alert severity='warning' sx={styles.extensionAlert}>
          Please install the HashConnect browser extension to connect your
          wallet.
        </Alert>
      ) : (
        <Box
          sx={{
            ...styles.connectWalletBtnContainer,
            display: 'flex',
            alignItems: 'center',
            justifyContent: { xs: 'center', sm: 'flex-end' },
            width: { xs: '100%', sm: 'auto' },
          }}
          className='connectIcon'
        >
          <Button
            disableElevation
            variant='contained'
            startIcon={<Link />}
            onClick={handleConnect}
            fullWidth={isMobile}
          >
            Connect Wallet
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default BrowserExtension;
