import { Box, Typography, Button, Divider } from '@mui/material';
import { QRCodeSVG } from 'qrcode.react';
import { ContentCopy } from '@mui/icons-material';
import { useState } from 'react';
import * as styles from './styles';

const QrCode = () => {
  const [pairingString] = useState(
    'eyJtZXRhZGF0YSI6eyJuYW1lIjoiV2FsbGV0Q29ubmVjdCBFeGFtcGxlIiwiZGVzY3JpcHRpb24iOiJBbiBleGFtcGxlIGFwcGxpY2F0aW9uIGZvciBXYWxsZXRDb25uZWN0In0sInNlc3Npb25Qcm9wZXJ0aWVzIjp7Im9wdGlvbmFsIjp7InJlcXVpcmVkIjpmYWxzZX19fQ'
  );

  const handleCopyPairingString = async () => {
    try {
      await navigator.clipboard.writeText(pairingString);
      // You can add a toast notification here
    } catch (err) {
      console.error('Failed to copy pairing string:', err);
    }
  };

  return (
    <Box sx={styles.qrCodeContainer}>
      {/* Instructions */}
      <Typography variant='body1' sx={styles.qrCodeInstructions}>
        Copy pairing string and paste it in your wallet extension or scan QR
        code with your mobile wallet.
      </Typography>

      {/* QR Code */}
      <Box sx={styles.qrCodeWrapper}>
        <QRCodeSVG
          value={pairingString}
          size={280}
          bgColor='#ffffff'
          fgColor='#000000'
          level='M'
          includeMargin={false}
        />
      </Box>

      {/* Divider with OR */}
      <Box sx={styles.dividerContainer}>
        <Divider sx={styles.divider} />
        <Typography variant='body2' sx={styles.orText}>
          OR
        </Typography>
        <Divider sx={styles.divider} />
      </Box>

      {/* Pairing String Section */}
      <Box sx={styles.pairingStringContainer}>
        <Typography variant='h6' sx={styles.pairingStringTitle}>
          Pairing String
        </Typography>

        <Typography variant='body2' sx={styles.pairingStringValue}>
          {`${pairingString.substring(0, 20)}...`}
        </Typography>

        <Button
          variant='text'
          startIcon={<ContentCopy />}
          onClick={handleCopyPairingString}
          sx={styles.copyButton}
        >
          Copy
        </Button>
      </Box>
    </Box>
  );
};

export default QrCode;
