import { apiBase } from '@/API/apiBase';
import PrimaryButtonV2 from '@/components/Buttons/PrimaryButtonV2';
import { useSessionManager } from '@/contexts/useSessionManager';
import WalletDispalyIcon from '@/IconsPng/walletDisplayIcon.png';
import { useAppDispatch } from '@/Store/store';
import SuccessStepIcon from '@/SVGR/SuccessStepIcon';
import {
  useAccountId,
  UserRefusedToSignAuthError,
  useWallet,
} from '@buidlerlabs/hashgraph-react-wallets';
import { HWCConnector } from '@buidlerlabs/hashgraph-react-wallets/connectors';
import AuthIcon from '@mui/icons-material/Login';
import { Box, Stack } from '@mui/material';
import { Buffer } from 'buffer';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useGenerateAuthMutation, useLazyGetChallengeQuery } from '../api/auth';
import {
  authenticated,
  connectXAccount,
  setTokenExpiry,
} from '../authStoreSlice';
import SectionHeader from '../Components/SectionHeader';
import * as styles from './styles';

const Authenticate = () => {
  const { data: accountId } = useAccountId();
  const { isConnected, signer } = useWallet(HWCConnector);
  const dispatch = useAppDispatch();
  const sessionManager = useSessionManager();

  // Use query to get challenge with 30-second caching
  const [getChallenge, { isLoading: isChallengeLoading }] =
    useLazyGetChallengeQuery();

  const [generateAuth, { isLoading: isAuthLoading }] =
    useGenerateAuthMutation();

  const handleAuthenticate = async () => {
    if (!accountId) {
      toast.error('No account ID available. Please connect your wallet.');
      return;
    }

    try {
      const challenge = await getChallenge({ walletId: accountId }).unwrap();

      const message = JSON.stringify(challenge.payload);
      const bytes = new TextEncoder().encode(message); // UTF-8 encoding

      // Sign the message bytes
      const signatureObjs = await (
        signer as {
          sign: (
            bytes: Uint8Array[]
          ) => Promise<
            { signature: Uint8Array; accountId: { toString: () => string } }[]
          >;
        }
      ).sign([bytes]);
      const sigObj = signatureObjs[0];

      const signatureBase64 = Buffer.from(sigObj.signature).toString('base64');
      const accountIdStr = sigObj.accountId.toString();

      const authResponse = await generateAuth({
        payload: challenge.payload,
        signatures: {
          server: challenge.server.signature ?? '',
          wallet: {
            accountId: accountIdStr,
            signature: signatureBase64,
          },
        },
      }).unwrap();

      if (authResponse) {
        // Use backend's expiresAt timestamp and dispatch to Redux
        if (authResponse.expiresAt) {
          console.warn(
            '[AUTHENTICATE] Backend token expiry:',
            new Date(authResponse.expiresAt).toISOString(),
            `(${Math.round((authResponse.expiresAt - Date.now()) / 1000)}s from now)`
          );

          // Dispatch to Redux store
          dispatch(setTokenExpiry(authResponse.expiresAt));

          // Start automatic token refresh via SessionManager
          if (sessionManager?.startTokenRefresh) {
            sessionManager.startTokenRefresh(authResponse.expiresAt);
          }
        } else {
          console.error('[AUTHENTICATE] Backend did not return expiresAt!');
        }

        // Clear RTK Query cache to prevent cross-user data contamination
        dispatch(apiBase.util.resetApiState());

        dispatch(authenticated());
        if (challenge.isExistingUser && challenge.connectedXAccount) {
          dispatch(connectXAccount(challenge.connectedXAccount));
        }
      }
    } catch (e: unknown) {
      console.error('Error during authentication:', e);

      // Handle specific error cases
      if (e instanceof UserRefusedToSignAuthError) {
        toast.error('User refused to sign authentication. Please try again.');
      } else if (
        typeof e === 'object' &&
        e !== null &&
        'data' in e &&
        typeof e.data === 'object' &&
        e.data !== null &&
        'error' in e.data &&
        typeof e.data.error === 'object' &&
        e.data.error !== null &&
        'description' in e.data.error &&
        e.data.error.description === 'SIGNING_MESSAGE_EXPIRED'
      ) {
        // Challenge expired during signing process
        toast.warning(
          'Authentication challenge expired. Please refresh the page and try again.'
        );
        window.location.reload(); // Reload to get a new challenge
      } else {
        toast.error(
          'An error occurred during authentication. Please refresh the page and try again.'
        );
      }
    }
  };

  useEffect(() => {
    if (accountId) {
      getChallenge({ walletId: accountId });
    }
  }, [accountId, getChallenge]);

  return (
    <Box sx={styles.authicateContainer}>
      <SectionHeader
        title='Signing and Authentication'
        subtitle='Please authenticate to continue'
      />
      <Stack direction='column' justifyContent='center' alignItems='center'>
        <Box sx={styles.authenticateContent}>
          <Stack>
            <SuccessStepIcon size={48} />
          </Stack>
          <h2>Wallet paired successfully</h2>
          <p>
            Your HashPack wallet has been connected successfully. Now sign the
            message to authenticate.
          </p>
          <Box
            sx={styles.walletDisplayContainer}
            display='flex'
            alignItems='center'
            justifyContent='center'
          >
            <img
              src={WalletDispalyIcon}
              alt='Wallet Display'
              style={{ width: '48px', height: 'auto' }}
            />
            <p>{accountId}</p>
          </Box>
          <PrimaryButtonV2
            onClick={handleAuthenticate}
            endIcon={<AuthIcon />}
            loading={isAuthLoading || isChallengeLoading}
            disabled={!isConnected || isAuthLoading || isChallengeLoading}
          >
            {isAuthLoading
              ? 'Authenticating...'
              : isChallengeLoading
                ? 'Loading Challenge...'
                : 'Authenticate'}
          </PrimaryButtonV2>
        </Box>
      </Stack>
    </Box>
  );
};

export default Authenticate;
