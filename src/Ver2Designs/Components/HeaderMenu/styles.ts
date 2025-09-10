import { Theme, SxProps } from '@mui/material';

export const styles = {
  container: {
    position: 'absolute',
    right: 10,
    top: 20,
  } as SxProps<Theme>,

  avatarButton: {
    ml: 2,
  } as SxProps<Theme>,

  avatar: {
    width: 32,
    height: 32,
  } as SxProps<Theme>,

  menuPaper: {
    elevation: 0,
    sx: {
      overflow: 'visible',
      filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
      mt: 1.5,
      '& .MuiAvatar-root': {
        width: 32,
        height: 32,
        ml: -0.5,
        mr: 1,
      },
      '&:before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        top: 0,
        right: 14,
        width: 10,
        height: 10,
        bgcolor: 'background.paper',
        transform: 'translateY(-50%) rotate(45deg)',
        zIndex: 0,
      },
    },
  },

  menuItemAvatar: {
    height: 35,
    width: 35,
  } as SxProps<Theme>,

  hederaIcon: {
    size: 23,
    fill: 'white',
    fillBg: '#ccc',
  },
} as const;
