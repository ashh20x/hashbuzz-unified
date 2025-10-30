import { SxProps, Theme } from '@mui/material';
import { containerStyles } from '../styles';

export const earningAndPromoSection = (theme: Theme): SxProps<Theme> => ({
  width: '100%',
  padding: '3rem 0',
  backgroundColor: '#FFFFFF',
  '& h3': {
    textAlign: 'center',
    marginBottom: '1rem',
    fontSize: '3.75rem',
    fontWeight: 600,
    color: '#181D27',
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.875rem',
    },
    '& span': {
      color: '#039855',
    },
  },
});

export const earningAndPromoContainer: SxProps<Theme> = {
  ...containerStyles,
};
