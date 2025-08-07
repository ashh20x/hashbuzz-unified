import PrimaryButtonV2 from "@/components/Buttons/PrimaryButtonV2";
import WalletDispalyIcon from "@/IconsPng/walletDisplayIcon.png";
import { useAppDispatch } from "@/Store/store";
import SuccessStepIcon from "@/SVGR/SuccessStepIcon";
import { useAccountId, useAuthSignature, UserRefusedToSignAuthError, useWallet } from "@buidlerlabs/hashgraph-react-wallets";
import { HWCConnector } from "@buidlerlabs/hashgraph-react-wallets/connectors";
import AuthIcon from '@mui/icons-material/Login';
import { Box, Stack, useMediaQuery } from "@mui/material";
import { Buffer } from "buffer";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useGenerateAuthMutation, useGetChallengeQuery } from "../api/auth";
import { OnboardingSteps, setAuthSignature, setStep } from "../authStoreSlice";
import SectionHeader from "../Components/SectionHeader";
import * as styles from "./styles";

const Authenticate = () => {
    const { data: accountId } = useAccountId();
    const isSmDevice = useMediaQuery((theme) => theme.breakpoints.down("sm"));
    const { isConnected, disconnect, signer } = useWallet(HWCConnector);
    const dispatch = useAppDispatch();
    const { data: Challenge } = useGetChallengeQuery();
    const [getGeneratedAuth] = useGenerateAuthMutation();
    const { signAuth } = useAuthSignature();

    const handleAuthenticate = async () => {
        if (!Challenge?.payload || !Challenge.server) return;

        try {
            const message = JSON.stringify(Challenge.payload);
            const bytes = new TextEncoder().encode(message); // UTF-8 encoding
            const signatureObjs = await signer?.sign([bytes]);
            const sigObj = signatureObjs[0];

            const signatureBase64 = Buffer.from(sigObj.signature).toString("base64");
            const accountIdStr = sigObj.accountId.toString();
            const publicKeyStr = sigObj.publicKey.toString();

            dispatch(setAuthSignature({
                publicKey: publicKeyStr,
                signature: signatureBase64,
                accountId: accountIdStr,
            }));

            await getGeneratedAuth({
                payload: Challenge.payload,
                signatures: {
                    server: Challenge.server.signature || "",
                    wallet: {
                        accountId: accountIdStr,
                        signature: signatureBase64,
                    },
                },
            }).unwrap();

            toast.success("Authentication successful!");
        } catch (e) {
            console.error("Error during authentication:", e);
            if (e instanceof UserRefusedToSignAuthError) {
                toast.error("User refused to sign authentication. Please try again.");
                disconnect();
                dispatch(setStep({ step: OnboardingSteps.PairWallet, isSmDeviceModalOpen: isSmDevice }));
            }
        }
    };

    // if not connected, redirect to pair wallet step
    useEffect(() => {
        if (!isConnected && !accountId) {
            dispatch(setStep({ step: OnboardingSteps.PairWallet, isSmDeviceModalOpen: isSmDevice }));
        }
    }, [isConnected, accountId]);


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
                    <PrimaryButtonV2 onClick={handleAuthenticate} endIcon={<AuthIcon />}>Authenticate</PrimaryButtonV2>
                </Box>
            </Stack>
        </Box>
    );
};

export default Authenticate;