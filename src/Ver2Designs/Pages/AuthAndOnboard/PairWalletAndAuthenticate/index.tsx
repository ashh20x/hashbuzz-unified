import { useAppDispatch } from "@/Store/store";
import { useAccountId, useWallet } from "@buidlerlabs/hashgraph-react-wallets";
import { HWCConnector } from "@buidlerlabs/hashgraph-react-wallets/connectors";
import { Box, Stack, useMediaQuery } from "@mui/material";
import { useEffect } from "react";
import { advanceStep, OnboardingSteps, setStep } from "../authStoreSlice";
import SectionHeader from "../Components/SectionHeader";
import BrowserExtension from "./BrowserExtension";
import * as styles from "./styles";



const PairWalletAndAuthenticate = () => {
  const isSmdevice = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const { isConnected } =
    useWallet(HWCConnector);
  const dispatch = useAppDispatch();
  const { data: accountId } = useAccountId();

  useEffect(() => {
    if (isConnected && accountId) {
      dispatch(advanceStep({ isSmDeviceModalOpen: isSmdevice })); // Dispatch action to advance the step in the onboarding process
    }
  }, [isConnected, accountId, dispatch]);
  return (
    <Box component="section" sx={styles.conenctWalletSection}>
      <SectionHeader
        title="Connect your wallet"
        subtitle="Choose any of the options to connect wallet"
      />
      <Stack flexDirection="column" gap={2} sx={styles.smallDeviceContainer}>
        <BrowserExtension />
      </Stack>
    </Box>
  );
};

export default PairWalletAndAuthenticate;
