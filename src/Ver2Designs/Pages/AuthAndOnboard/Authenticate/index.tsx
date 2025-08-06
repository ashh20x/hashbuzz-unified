import PrimaryButtonV2 from "@/components/Buttons/PrimaryButtonV2";
import WalletDispalyIcon from "@/IconsPng/walletDisplayIcon.png";
import { useAppDispatch } from "@/Store/store";
import SuccessStepIcon from "@/SVGR/SuccessStepIcon";
import { useAccountId, useAuthSignature, useWallet, UserRefusedToSignAuthError } from "@buidlerlabs/hashgraph-react-wallets";
import { HWCConnector } from "@buidlerlabs/hashgraph-react-wallets/connectors";
import AuthIcon from '@mui/icons-material/Login';
import { Box, Stack, useMediaQuery } from "@mui/material";
import { useEffect } from "react";
import { OnboardingSteps, setAuthSignature, setStep } from "../authStoreSlice";
import SectionHeader from "../Components/SectionHeader";
import * as styles from "./styles";
import { useGetChallengeQuery } from "../api/auth";
import { toast } from "react-toastify";

const Authenticate = () => {
    const { data: accountId } = useAccountId();
    const isSmDevice = useMediaQuery((theme) => theme.breakpoints.down("sm"));
    const { isConnected, disconnect } = useWallet(HWCConnector);
    const dispatch = useAppDispatch();
    const { data: Challenge } = useGetChallengeQuery();
    const { signAuth } = useAuthSignature();


    console.log("Challenge", Challenge);

    const handleAuthenticate = async () => {
        try {
            const signerSignature = await signAuth(JSON.stringify(Challenge));
            console.log(signerSignature.signature.toString());
            dispatch(setAuthSignature({
                publicKey: signerSignature.publicKey.toString(),
                signature: signerSignature.signature.toString(),
                accountId: signerSignature.accountId.toString(),
            }))
        } catch (e) {
            if (e instanceof UserRefusedToSignAuthError) {
                toast.error("User refused to sign authentication. Please try again.");
                disconnect();
                dispatch(setStep({ step: OnboardingSteps.PairWallet, isSmDeviceModalOpen: isSmDevice }));
            }
        }
    }

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