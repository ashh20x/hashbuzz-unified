import { Box, Stack } from "@mui/material";
import * as styles from "./styles";


const QRCode = () => {
  return (
    <Box component="section" sx={styles.qrCodeSection}>
      <p>Copy pairing string and paste it in your wallet extension or scan QR code with your mobile wallet.</p>
      <Stack>
        <Box sx={styles.qrCodeImageContainer}></Box>
        <Box sx={styles.connectionStringcontainer}></Box>
      </Stack>
    </Box>
  );
};
export default QRCode;