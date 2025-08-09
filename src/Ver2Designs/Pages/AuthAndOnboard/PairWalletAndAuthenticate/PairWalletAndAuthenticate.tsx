import { Box, Stack } from "@mui/material";
import SectionHeader from "../Components/SectionHeader/SectionHeader";
import BrowserExtension from "./BrowserExtension/BrowserExtension";
import * as styles from "./styles";



const PairWalletAndAuthenticate = () => {
  
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
