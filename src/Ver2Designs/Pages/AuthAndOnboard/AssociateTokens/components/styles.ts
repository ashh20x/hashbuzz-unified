import { SxProps, Theme } from '@mui/material';

export const TokenListItemStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  padding: {
    xs: '16px',
    sm: '20px',
    md: '24px',
  },
  background: 'rgba(255, 255, 255, 0.8)',

  borderBottom: '1px solid #eee',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  position: 'relative',
  overflow: 'hidden',
  backdropFilter: 'blur(10px)',

  // Token Icons Section
  '& .tokenIcons': {
    marginRight: {
      xs: '12px',
      sm: '16px',
      md: '20px',
    },
    flexShrink: 0,
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  '& .tokenIconWrapper': {
    width: {
      xs: '48px',
      sm: '52px',
      md: '56px',
    },
    height: {
      xs: '48px',
      sm: '52px',
      md: '56px',
    },
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #5265ff 0%, #243ae9 100%)',

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 2px 8px rgba(102, 126, 234, 0.2)',
    position: 'relative',
    overflow: 'hidden',

    '&::before': {
      content: '""',
      position: 'absolute',
      inset: 0,
      background:
        'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 100%)',
      borderRadius: '50%',
    },
  },

  '& .tokenSymbol': {
    fontSize: {
      xs: '0.9rem',
      sm: '1rem',
      md: '1.1rem',
    },
    fontWeight: 700,
    color: '#ffffff',
    textTransform: 'uppercase',
    letterSpacing: '0.02em',
    position: 'relative',
    zIndex: 1,
  },

  '& .fallbackIcon': {
    fontSize: {
      xs: '1.5rem',
      md: '1.75rem',
    },
    color: '#ffffff',
    position: 'relative',
    zIndex: 1,
  },

  '& .associatedBadge': {
    position: 'absolute',
    top: -4,
    right: -4,
    background: '#10b981',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid #ffffff',
    // boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',

    '& svg': {
      fontSize: '12px',
      color: '#ffffff',
    },
  },

  // Token Details Section
  '& .tokenDetails': {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: {
      xs: '4px',
      md: '6px',
    },
  },

  '& .tokenName': {
    fontSize: {
      xs: '1rem',
      sm: '1.125rem',
      md: '1.25rem',
    },
    lineHeight: 1.3,
    fontWeight: 600,
    color: '#1f2937',
    margin: 0,
    letterSpacing: '-0.01em',
    transition: 'color 0.3s ease',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },

  '& .tokenId': {
    fontSize: {
      xs: '0.75rem',
      sm: '0.8125rem',
      md: '0.875rem',
    },
    lineHeight: 1.4,
    color: '#6b7280',
    margin: 0,
    fontFamily: 'monospace',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    letterSpacing: '0.01em',
  },

  '& .tokenSymbolChip': {
    height: {
      xs: '20px',
      md: '22px',
    },
    fontSize: {
      xs: '0.7rem',
      md: '0.75rem',
    },
    fontWeight: 600,
    borderColor: 'rgba(102, 126, 234, 0.3)',
    color: '#667eea',
    background: 'rgba(102, 126, 234, 0.08)',
    marginTop: '2px',
    maxWidth: 'fit-content',

    '& .MuiChip-label': {
      paddingX: {
        xs: '6px',
        md: '8px',
      },
    },
  },

  // Action Section
  '& .linkOrStatus': {
    marginLeft: 'auto',
    flexShrink: 0,
    paddingLeft: {
      xs: '8px',
      md: '16px',
    },
  },
};

export const associateButton: SxProps<Theme> = {
  padding: {
    xs: '8px 16px',
    sm: '10px 20px',
    md: '12px 24px',
  },
  fontSize: {
    xs: '0.8rem',
    sm: '0.875rem',
    md: '0.9rem',
  },
  fontWeight: 600,
  borderRadius: '10px',
  textTransform: 'none',
  minWidth: {
    xs: '100px',
    sm: '120px',
  },
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',

  // Primary (Associate) button styling
  '&.MuiButton-outlined': {
    borderColor: 'rgba(102, 126, 234, 0.3)',
    color: '#667eea',
    background: 'rgba(102, 126, 234, 0.05)',

    '&:hover': {
      borderColor: '#667eea',
      background: 'rgba(102, 126, 234, 0.1)',
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)',
    },

    '&:active': {
      transform: 'translateY(0)',
    },
  },

  // Success (Associated) button styling
  '&.MuiButton-contained': {
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',

    '&:hover': {
      background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)',
    },

    '&.Mui-disabled': {
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      color: '#ffffff',
      opacity: 1,
      cursor: 'default',
      transform: 'none',
    },
  },

  // Loading state
  '&.Mui-disabled:not(.MuiButton-contained)': {
    borderColor: 'rgba(156, 163, 175, 0.3)',
    color: '#9ca3af',
    background: 'rgba(156, 163, 175, 0.05)',
  },

  // Icon styling
  '& .MuiButton-startIcon': {
    marginRight: {
      xs: '4px',
      md: '6px',
    },

    '& svg': {
      fontSize: {
        xs: '1rem',
        md: '1.125rem',
      },
    },
  },
};
