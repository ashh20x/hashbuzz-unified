import { SxProps } from '@mui/material';
import { Theme } from '@mui/system';

export const conenctWalletSection: SxProps<Theme> = {
  background: '#FFFFFF',
  padding: {
    xs: '24px 16px',
    md: '40px',
    xl: '45px 200px',
  },
  height: '100%',
  overflowY: 'auto',
};

export const tabsContainer: SxProps<Theme> = {
  marginTop: '2rem',
  // marginBottom: '1rem',
};

export const smallDeviceContainer: SxProps<Theme> = {
  padding: '1rem 0',
};

// QR Code Component Styles
export const qrCodeContainer: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 3,
  padding: '2rem 1rem',
  backgroundColor: '#F8F9FA',
  borderRadius: '12px',
  border: '1px solid #E9ECEF',
};

export const qrCodeInstructions: SxProps<Theme> = {
  textAlign: 'center',
  color: '#495057',
  fontSize: '1rem',
  lineHeight: 1.5,
  maxWidth: '400px',
  margin: '0 auto',
};

export const qrCodeWrapper: SxProps<Theme> = {
  padding: '1.5rem',
  backgroundColor: '#FFFFFF',
  borderRadius: '12px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

export const dividerContainer: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  maxWidth: '300px',
  gap: 2,
};

export const divider: SxProps<Theme> = {
  flex: 1,
  borderColor: '#DEE2E6',
};

export const orText: SxProps<Theme> = {
  color: '#6C757D',
  fontWeight: 500,
  fontSize: '0.875rem',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
};

export const pairingStringContainer: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 1.5,
  backgroundColor: '#E7E9FC',
  // padding: '0.5rem ',
  borderRadius: '12px',
  width: '100%',
};

export const pairingStringTitle: SxProps<Theme> = {
  color: '#495057',
  fontWeight: 600,
  fontSize: '1.125rem',
  paddingTop: '1rem',
};

export const pairingStringValue: SxProps<Theme> = {
  color: '#6C757D',
  fontSize: '0.875rem',
  fontFamily: 'monospace',
  backgroundColor: '#FFFFFF',
  padding: '0.75rem 1rem',
  borderRadius: '8px',
  border: '1px solid #DEE2E6',
  wordBreak: 'break-all',
  textAlign: 'center',
  minWidth: '200px',
};

export const copyButton: SxProps<Theme> = {
  color: '#5265FF',
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.875rem',
  gap: 1,
  paddingBottom: '1rem',
  '&:hover': {
    backgroundColor: 'rgba(82, 101, 255, 0.04)',
  },
};
