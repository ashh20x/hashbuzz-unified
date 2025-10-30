import { SxProps, Theme } from '@mui/material';

export const authicateContainer: SxProps<Theme> = {
  minHeight: '100vh',
  background: '#ffffff',
  padding: {
    xs: '20px 16px',
    sm: '32px 24px',
    md: '48px 40px',
    lg: '64px 60px',
    xl: '80px 200px',
  },
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',

  // Subtle background pattern
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.03) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(147, 197, 253, 0.03) 0%, transparent 50%),
      linear-gradient(180deg, rgba(239, 246, 255, 0.4) 0%, rgba(255, 255, 255, 0.8) 100%)
    `,
    pointerEvents: 'none',
  },
};

export const authenticateContent: SxProps<Theme> = {
  marginTop: {
    xs: '40px',
    sm: '60px',
    md: '80px',
  },
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: {
    xs: '20px',
    sm: '24px',
    md: '32px',
  },
  padding: {
    xs: '24px 20px',
    sm: '32px 24px',
    md: '40px 32px',
    lg: '48px 40px',
  },
  borderRadius: '24px',
  backdropFilter: 'blur(20px)',
  border: '2px solid rgba(59, 130, 246, 0.1)',
  position: 'relative',
  zIndex: 1,
  maxWidth: {
    xs: '100%',
    sm: '500px',
    md: '600px',
  },

  // Top border accent
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '60px',
    height: '4px',
    background: '#3b82f6',
    borderRadius: '0 0 8px 8px',
  },

  // Success icon container
  '& .success-icon-container': {
    padding: {
      xs: '16px',
      md: '20px',
    },
    background: 'rgba(34, 197, 94, 0.1)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid rgba(34, 197, 94, 0.2)',
  },

  // Title styling
  '& h2': {
    fontSize: {
      xs: '1.5rem',
      sm: '1.75rem',
      md: '2rem',
    },
    fontWeight: 700,
    lineHeight: 1.3,
    color: '#1e293b',
    textAlign: 'center',
    margin: 0,
    letterSpacing: '-0.025em',
  },

  // Description text
  '& p': {
    fontSize: {
      xs: '0.9rem',
      sm: '1rem',
      md: '1.125rem',
    },
    fontWeight: 400,
    lineHeight: 1.6,
    color: '#64748b',
    textAlign: 'center',
    margin: 0,
    maxWidth: {
      xs: '100%',
      sm: '80%',
      md: '70%',
    },
  },

  // Button styling
  '& button': {
    marginTop: {
      xs: '24px',
      md: '32px',
    },
    padding: {
      xs: '14px 32px',
      md: '16px 40px',
    },
    fontSize: {
      xs: '0.95rem',
      md: '1rem',
    },
    fontWeight: 600,
    borderRadius: '12px',
    textTransform: 'none',
    minWidth: {
      xs: '200px',
      md: '240px',
    },
    boxShadow:
      '0 4px 6px -1px rgba(59, 130, 246, 0.2), 0 2px 4px -1px rgba(59, 130, 246, 0.1)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',

    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow:
        '0 10px 15px -3px rgba(59, 130, 246, 0.3), 0 4px 6px -2px rgba(59, 130, 246, 0.2)',
    },

    '&:active': {
      transform: 'translateY(0)',
    },

    '&:disabled': {
      opacity: 0.6,
      transform: 'none',
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    },
  },
};

export const walletDisplayContainer: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: {
    xs: '12px',
    sm: '16px',
    md: '20px',
  },
  background: 'rgba(239, 246, 255, 0.6)',
  padding: {
    xs: '16px 20px',
    sm: '18px 24px',
    md: '20px 28px',
  },
  borderRadius: '16px',
  border: '1px solid rgba(59, 130, 246, 0.15)',
  minWidth: {
    xs: '280px',
    sm: '320px',
    md: '360px',
  },
  position: 'relative',
  overflow: 'hidden',

  // Subtle shine effect
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background:
      'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%)',
    transition: 'left 0.6s ease',
  },

  '&:hover::before': {
    left: '100%',
  },

  // Wallet icon styling
  '& img': {
    width: {
      xs: '40px',
      sm: '44px',
      md: '48px',
    },
    height: 'auto',
    flexShrink: 0,
    filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))',
    transition: 'transform 0.3s ease',
  },

  '&:hover img': {
    transform: 'scale(1.05)',
  },

  // Account ID text
  '& p': {
    fontSize: {
      xs: '0.85rem',
      sm: '0.9rem',
      md: '0.95rem',
    },
    fontWeight: 600,
    color: '#1e40af',
    margin: 0,
    fontFamily: 'monospace',
    letterSpacing: '0.02em',
    wordBreak: 'break-all',
    textAlign: 'center',
    flex: 1,
  },
};

// Additional responsive utilities
export const sectionHeaderWrapper: SxProps<Theme> = {
  marginBottom: {
    xs: '20px',
    sm: '24px',
    md: '32px',
  },
  textAlign: 'center',
  position: 'relative',
  zIndex: 1,
};

export const mainStack: SxProps<Theme> = {
  flex: 1,
  minHeight: 'calc(100vh - 120px)',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
  zIndex: 1,
};
