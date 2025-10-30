import { SxProps, Theme } from '@mui/material';

export const associateTokensStyles: SxProps<Theme> = {
  background: '#FFFFFF',
  padding: {
    xs: '16px 12px 0',
    md: '32px 40px',
    xl: '40px 200px',
  },
  height: {
    xs: '100dvh',
    md: 'auto',
  },
  display: {
    xs: 'flex',
    md: 'block',
  },
  flexDirection: {
    xs: 'column',
    md: 'initial',
  },
  overflowY: {
    xs: 'hidden',
    md: 'auto',
  },
};

export const associateTokenWrapper: SxProps<Theme> = {
  flex: {
    xs: 1,
    md: 'initial',
  },
  height: {
    xs: 'auto',
    md: 'calc(100dvh - 180px)',
  },
  overflowY: 'auto',
  paddingBottom: {
    xs: '12px',
    md: '16px',
  },
};

export const listContainer: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: {
    xs: '0.75rem',
    md: '1rem',
  },
  padding: {
    xs: '0.75rem 1rem',
    md: '1rem 2rem',
  },
  border: '1px solid #E9EAFF',
  borderRadius: '8px',
  marginTop: {
    xs: '1.5rem',
    md: '2rem',
  },
  '& h4': {
    fontSize: {
      xs: '1.1rem',
      md: '1.25rem',
    },
    lineHeight: 1.64,
    fontWeight: 500,
    margin: 0,
  },
};

export const tokensListItem: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  padding: {
    xs: '8px 0',
    md: '12px 0',
  },
  background: '#FFFFFF',
  borderBottom: '1px solid #eee',
  '&:last-child': {
    borderBottom: 'none',
  },
  '& .tokenIIcons': {
    marginRight: {
      xs: '1rem',
      md: '1.5rem',
    },
    '& span': {
      width: {
        xs: '32px',
        md: '40px',
      },
      height: {
        xs: '32px',
        md: '40px',
      },
      borderRadius: '50%',
      background: '#E4E7FF',
      display: 'flex',
      alignItems: 'center',
      fontSize: {
        xs: '0.75rem',
        md: '0.85rem',
      },
      justifyContent: 'center',
    },
  },
  '& .tokenDetails': {
    '& h4': {
      fontSize: {
        xs: '0.9rem',
        md: '1rem',
      },
      lineHeight: 1.5,
      fontWeight: 500,
      margin: 0,
    },
    '& p': {
      fontSize: {
        xs: '0.8rem',
        md: '0.875rem',
      },
      lineHeight: 1.5,
      color: '#666',
      margin: 0,
    },
  },
  '& .linkOrStatus': {
    marginLeft: 'auto',
  },
};

export const associateTokenFooter: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  height: '80px',
  ['@media (max-width:600px)']: {
    height: '30px', // mobile
  },
  ['@media (min-width:600px) and (max-width:900px)']: {
    height: '70px', // tablet
  },
  padding: {
    xs: '12px 12px 16px',
    md: '0',
  },
  borderTop: {
    xs: '1px solid #E9EAFF',
    md: 'none',
  },
  background: {
    xs: '#FFFFFF',
    md: 'transparent',
  },
  position: {
    xs: 'fixed',
    md: 'static',
  },
  bottom: {
    xs: 0,
    md: 'auto',
  },
  left: {
    xs: 0,
    md: 'auto',
  },
  right: {
    xs: 0,
    md: 'auto',
  },
  zIndex: {
    xs: 1000,
    md: 'auto',
  },
};
