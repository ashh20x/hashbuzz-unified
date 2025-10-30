import { SxProps, Theme } from '@mui/material';

export const browserExtensionContainer: SxProps<Theme> = {
  padding: '1rem 0',
};

export const connectWalletBtnContainer: SxProps<Theme> = {
  '& button': {
    marginTop: '2rem',
    backgroundColor: '#5265FF',
    textTransform: 'capitalize',
    borderRadius: '8px',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#5265FF',
    },
  },
};

export const extensionAlert: SxProps<Theme> = {
  marginTop: '1rem',
  backgroundColor: '#FFF3CD',
  color: '#856404',
  borderRadius: '8px',
  padding: '1rem',
  fontSize: '0.875rem',
  fontWeight: '500',
};

export const pairedSuccessfullyAlert: SxProps<Theme> = {
  marginTop: '1rem',
  backgroundColor: '#D4EDDA',
  color: '#155724',
  borderRadius: '8px',
  padding: '1rem',
  fontSize: '0.875rem',
  fontWeight: '500',
};

export const pairedWalletInfoContainer: SxProps<Theme> = {
  padding: '1rem',
  backgroundColor: '#F8F9FA',
  borderRadius: '8px',
  '& p': {
    marginBottom: '0.5rem',
    fontSize: '0.875rem',
    color: '#212529',
  },
};
