import { SxProps, Theme } from '@mui/material';

export const TokenListItemStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '12px 16px',
  borderBottom: '1px solid #eee',
  '&:hover': {
    backgroundColor: '#f5f5f5',
  },
};
