import { SxProps, Theme } from '@mui/material';
import { getStartedButton } from '../HeroSection/styles';
import { containerStyles } from '../styles';

export const headerContainer: SxProps<Theme> = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '80px',
};

export const headerContentContainer: SxProps<Theme> = {
  ...containerStyles,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  height: '100%',
};

export const headerActionContainer: SxProps<Theme> = {
  display: 'flex',
  marginLeft: 0,
  width: 'auto',
};

export const headerSectionGetStartedBtn: SxProps<Theme> = {
  ...getStartedButton,
};
