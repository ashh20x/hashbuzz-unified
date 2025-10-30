import { SxProps, Theme } from '@mui/material';

export const onBoardingStepsModal: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  height: '100%',
  backgroundColor: '#FFF',
};

export const onBoardingStepsModalHeader: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  height: '64px',
  padding: '0 2rem',
  '& button': {
    marginLeft: 'auto',
  },
};

export const onBoardingStepsModalFooter: SxProps<Theme> = {
  marginTop: 'auto',
  padding: '1rem 2rem',
  '& button': {
    width: '100%',
  },
};
