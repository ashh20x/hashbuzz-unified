import { CopyAll } from "@mui/icons-material";
import { Box, Button, Snackbar, Stack } from "@mui/material";
import { useState } from "react";
import * as styles from "./styles";


const QRCode = () => {
  const [open, setOpen] = useState(false);
  const connectionString = "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2"; // Replace with actual pairing string
  return (
    <Box component="section" sx={styles.qrCodeSection}>
      <p>Copy pairing string and paste it in your wallet extension or scan QR code with your mobile wallet.</p>
      <Stack
        direction={{
          xs: "column",
          sm: "row",
        }}
        alignItems="center"
        sx={styles.qrAndStringWrapper}
      >
        <Box sx={styles.qrCodeImageContainer}></Box>
        <p>OR</p>
        <Box sx={styles.connectionStringcontainer}>
          <label htmlFor="pairing-string">Pairing String:</label>
          <input id="pairing-string" type="text" readOnly value={connectionString} />
          <Button
            variant="text"
            endIcon={<CopyAll />}
            onClick={() => {
              navigator.clipboard.writeText(connectionString);
              setOpen(true);
            }}
          >
            Copy
          </Button>
        </Box>
      </Stack>
      <Snackbar
        open={open}
        autoHideDuration={2000}
        onClose={() => setOpen(false)}
        message="Pairing string copied!"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
};
export default QRCode;