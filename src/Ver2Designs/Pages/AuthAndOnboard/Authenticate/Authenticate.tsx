import PrimaryButtonV2 from "@/components/Buttons/PrimaryButtonV2";
import WalletDispalyIcon from "@/IconsPng/walletDisplayIcon.png";
import { useAppDispatch } from "@/Store/store";
import SuccessStepIcon from "@/SVGR/SuccessStepIcon";
import { useAccountId, UserRefusedToSignAuthError, useWallet } from "@buidlerlabs/hashgraph-react-wallets";
import { HWCConnector } from "@buidlerlabs/hashgraph-react-wallets/connectors";
import AuthIcon from '@mui/icons-material/Login';
import { Box, Stack } from "@mui/material";
import { Buffer } from "buffer";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useGenerateAuthMutation, useLazyGetChallengeQuery } from "../api/auth";
import { authenticated, connectXAccount, setAppCreds, setAuthSignature } from "../authStoreSlice";
import SectionHeader from "../Components/SectionHeader";
import * as styles from "./styles";
import { AUTH_STORAGE_KEYS } from "@/hooks/session-manager";

const Authenticate = () => {
    const { data: accountId } = useAccountId();
    const { isConnected, signer } = useWallet(HWCConnector);
    const dispatch = useAppDispatch();

    // Use query to get challenge with 30-second caching
    const [getChallenge, {
        isLoading: isChallengeLoading,
    }] = useLazyGetChallengeQuery();

    const [generateAuth, { isLoading: isAuthLoading }] = useGenerateAuthMutation();

    const handleAuthenticate = async () => {
        try {
            const challenge = await getChallenge({ walletId: accountId! }).unwrap();

            const message = JSON.stringify(challenge.payload);
            const bytes = new TextEncoder().encode(message); // UTF-8 encoding

            // Sign the message bytes
            const signatureObjs = await (signer as any).sign([bytes]);
            const sigObj = signatureObjs[0];

            const signatureBase64 = Buffer.from(sigObj.signature).toString("base64");
            const accountIdStr = sigObj.accountId.toString();
            const publicKeyStr = sigObj.publicKey.toString();

            dispatch(setAuthSignature({
                publicKey: publicKeyStr,
                signature: signatureBase64,
                accountId: accountIdStr,
            }));

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
                localStorage.setItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN_EXPIRY, String(new Date().getTime() + 15 * 60 * 1000));
                dispatch(setAppCreds({
                    deviceId: authResponse.deviceId,
                    message: authResponse.message,
                    user: authResponse.user,
                }));
                dispatch(authenticated());
                if (challenge.isExistingUser && challenge.connectedXAccount) {
                    dispatch(connectXAccount(challenge.connectedXAccount))
                }
            }

        } catch (e: any) {
            console.error("Error during authentication:", e);

            // Handle specific error cases
            if (e instanceof UserRefusedToSignAuthError) {
                toast.error("User refused to sign authentication. Please try again.");
            } else if (e?.data?.error?.description === 'SIGNING_MESSAGE_EXPIRED') {
                // Challenge expired during signing process
                toast.warning('Authentication challenge expired. Please refresh the page and try again.');
                window.location.reload(); // Reload to get a new challenge
            } else {
                toast.error("An error occurred during authentication. Please refresh the page and try again.");
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
                title="Signing and Authentication"
                subtitle="Please authenticate to continue"
            />
            <Stack direction="column" justifyContent="center" alignItems="center">
                <Box sx={styles.authenticateContent}>
                    <Stack>
                        <SuccessStepIcon size={48} />
                    </Stack>
                    <h2>Wallet paired successfully</h2>
                    <p>Your HashPack wallet has been connected successfully. Now sign the message to authenticate.</p>
                    <Box sx={styles.walletDisplayContainer} display="flex" alignItems="center" justifyContent="center">
                        <img src={WalletDispalyIcon} alt="Wallet Display" style={{ width: "48px", height: "auto" }} />
                        <p>{accountId}</p>
                    </Box>
                    <PrimaryButtonV2
                        onClick={handleAuthenticate}
                        endIcon={<AuthIcon />}
                        loading={isAuthLoading || isChallengeLoading}
                        disabled={!isConnected || isAuthLoading || isChallengeLoading}
                    >
                        {isAuthLoading ? 'Authenticating...' :
                            isChallengeLoading ? 'Loading Challenge...' :
                                'Authenticate'}
                    </PrimaryButtonV2>
                </Box>
            </Stack>
        </Box>
    );
};

export default Authenticate;