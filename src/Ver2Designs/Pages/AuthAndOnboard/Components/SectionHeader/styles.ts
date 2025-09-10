import { SxProps, Theme } from '@mui/material';

export const header: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  '& h1': {
    fontSize: '1.5rem',
    lineHeight: 1.64,
    fontWeight: 600,
    color: '#262626',
    letterSpacing: '2%',
  },
  '& p': {
    fontSize: '1rem',
    lineHeight: 1.64,
    fontWeight: 400,
    color: '#181D27',
  },
};
