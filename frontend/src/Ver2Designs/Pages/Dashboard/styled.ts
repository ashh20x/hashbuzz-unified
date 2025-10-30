import {
  Alert,
  Box,
  Button,
  IconButton,
  styled,
  TextField,
  Typography,
} from '@mui/material';

export const StyledCardGenUtility = styled('div')`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  width: 100%;

  /* Large screens (1200px+) */
  @media only screen and (max-width: 1199px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 14px;
  }

  /* Medium screens / Small laptops (900px - 1199px) */
  @media only screen and (max-width: 899px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 18px;
  }

  /* Tablets Portrait (768px - 899px) */
  @media only screen and (max-width: 767px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  /* Large Mobile / Small Tablet (600px - 767px) */
  @media only screen and (max-width: 599px) {
    grid-template-columns: repeat(1, 1fr);
    gap: 20px;
  }

  /* Small Mobile (480px and below) */
  @media only screen and (max-width: 479px) {
    grid-template-columns: repeat(1, 1fr);
    gap: 16px;
  }
`;

export const StyledAlert = styled(Alert)`
  && {
    margin-bottom: 16px;
    margin-top: 16px;

    @media only screen and (max-width: 767px) {
      margin-bottom: 12px;
      margin-top: 12px;
    }
  }
`;

export const StyledPromoBanner = styled(Box)`
  && {
    background: linear-gradient(135deg, #5265ff 0%, #243ae9 100%);
    border-radius: 24px;
    padding: 20px;
    margin-bottom: 24px;
    position: relative;
    overflow: hidden;
    color: white;
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: auto;
    flex-direction: column;
    gap: 16px;

    /* Small Mobile (480px and below) */
    @media only screen and (max-width: 479px) {
      padding: 16px;
      border-radius: 20px;
      margin-bottom: 20px;
      gap: 12px;
    }

    /* Large Mobile / Small Tablet (600px - 767px) */
    @media only screen and (min-width: 480px) and (max-width: 767px) {
      padding: 20px;
      gap: 16px;
    }

    /* Tablets Portrait (768px - 899px) */
    @media only screen and (min-width: 768px) and (max-width: 899px) {
      padding: 24px;
      flex-direction: row;
      gap: 20px;
      min-height: 90px;
    }

    /* Medium screens / Small laptops (900px+) */
    @media only screen and (min-width: 900px) {
      padding: 28px;
      flex-direction: row;
      gap: 0;
      min-height: 100px;
    }

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
      opacity: 0.1;
    }
  }
`;

export const StyledBannerLeftSide = styled(Box)`
  && {
    display: flex;
    align-items: center;
    gap: 12px;
    z-index: 1;
    flex-direction: column;
    text-align: center;
    width: 100%;

    /* Large Mobile / Small Tablet (600px - 767px) */
    @media only screen and (min-width: 600px) and (max-width: 767px) {
      gap: 14px;
      flex-direction: row;
      text-align: left;
    }

    /* Tablets Portrait (768px - 899px) */
    @media only screen and (min-width: 768px) and (max-width: 899px) {
      gap: 16px;
      flex-direction: row;
      text-align: left;
      width: auto;
    }

    /* Medium screens / Small laptops (900px+) */
    @media only screen and (min-width: 900px) {
      gap: 18px;
      flex-direction: row;
      text-align: left;
      width: auto;
    }
  }
`;

export const StyledSpeakerImage = styled('img')`
  width: clamp(50px, 12vw, 80px);
  height: auto;
  max-height: 50px;
  object-fit: contain;

  /* Large Mobile / Small Tablet (600px+) */
  @media only screen and (min-width: 600px) {
    width: clamp(60px, 10vw, 90px);
    max-height: 60px;
  }

  /* Tablets Portrait (768px+) */
  @media only screen and (min-width: 768px) {
    width: clamp(70px, 8vw, 100px);
    max-height: 70px;
  }

  /* Medium screens / Small laptops (900px+) */
  @media only screen and (min-width: 900px) {
    width: clamp(80px, 6vw, 110px);
    max-height: 80px;
  }
`;

export const StyledBannerSubtitle = styled('div')`
  opacity: 0.9;
  margin-bottom: 4px;
  font-size: 0.7rem;

  /* Large Mobile (480px+) */
  @media only screen and (min-width: 480px) {
    font-size: 0.75rem;
  }

  /* Large Mobile / Small Tablet (600px+) */
  @media only screen and (min-width: 600px) {
    font-size: 0.8rem;
  }

  /* Tablets Portrait (768px+) */
  @media only screen and (min-width: 768px) {
    font-size: 0.85rem;
  }

  /* Medium screens / Small laptops (900px+) */
  @media only screen and (min-width: 900px) {
    font-size: 0.875rem;
  }
`;

export const StyledBannerTitle = styled('div')`
  font-weight: 700;
  margin-bottom: 0;
  font-size: 0.9rem;
  line-height: 1.3;

  /* Large Mobile (480px+) */
  @media only screen and (min-width: 480px) {
    font-size: 1rem;
  }

  /* Large Mobile / Small Tablet (600px+) */
  @media only screen and (min-width: 600px) {
    margin-bottom: 4px;
    font-size: 1.1rem;
  }

  /* Tablets Portrait (768px+) */
  @media only screen and (min-width: 768px) {
    margin-bottom: 6px;
    font-size: 1.2rem;
    line-height: 1.2;
  }

  /* Medium screens / Small laptops (900px+) */
  @media only screen and (min-width: 900px) {
    margin-bottom: 8px;
    font-size: 1.25rem;
  }
`;

export const StyledBannerRightSide = styled(Box)`
  && {
    display: flex;
    align-items: center;
    gap: 8px;
    z-index: 1;
    width: 100%;
    justify-content: center;

    /* Large Mobile / Small Tablet (600px+) */
    @media only screen and (min-width: 600px) {
      gap: 12px;
    }

    /* Tablets Portrait (768px+) */
    @media only screen and (min-width: 768px) {
      gap: 14px;
      width: auto;
      justify-content: flex-end;
    }

    /* Medium screens / Small laptops (900px+) */
    @media only screen and (min-width: 900px) {
      gap: 16px;
      width: auto;
      justify-content: flex-end;
    }
  }
`;

export const StyledCampaignerButton = styled(Button)`
  && {
    background-color: rgba(255, 255, 255, 0.9);
    color: #667eea;
    font-weight: 600;
    padding: 8px 16px;
    border-radius: 16px;
    font-size: 0.7rem;
    min-width: auto;
    transition: all 0.2s ease;
    white-space: nowrap;

    /* Large Mobile (480px+) */
    @media only screen and (min-width: 480px) {
      padding: 10px 18px;
      font-size: 0.75rem;
    }

    /* Large Mobile / Small Tablet (600px+) */
    @media only screen and (min-width: 600px) {
      padding: 12px 20px;
      font-size: 0.8rem;
    }

    /* Tablets Portrait (768px+) */
    @media only screen and (min-width: 768px) {
      padding: 12px 24px;
      font-size: 0.85rem;
    }

    /* Medium screens / Small laptops (900px+) */
    @media only screen and (min-width: 900px) {
      padding: 14px 28px;
      font-size: 0.875rem;
    }

    &:hover {
      background-color: white;
      transform: translateY(-1px);
    }
  }
`;

export const StyledCloseIconButton = styled(IconButton)`
  && {
    color: rgba(255, 255, 255, 0.8);
    padding: 8px;

    /* Tablets Portrait (768px+) */
    @media only screen and (min-width: 768px) {
      padding: 10px;
    }

    &:hover {
      color: white;
    }
  }
`;

export const StyledBrandAccountContainer = styled(Box)`
  && {
    margin-bottom: 24px;
    display: flex;
    justify-content: center;
    padding-top: 24px;
    padding-bottom: 24px;

    /* Tablets Portrait (768px+) */
    @media only screen and (min-width: 768px) {
      padding-top: 32px;
      padding-bottom: 32px;
    }

    /* Medium screens / Small laptops (900px+) */
    @media only screen and (min-width: 900px) {
      padding-top: 40px;
      padding-bottom: 40px;
    }
  }
`;

export const StyledConnectBrandButton = styled(Button)`
  && {
    background-color: #667eea;
    color: white;
    font-weight: 600;
    padding: 12px 24px;
    border-radius: 16px;
    font-size: 0.85rem;
    transition: all 0.2s ease;

    /* Tablets Portrait (768px+) */
    @media only screen and (min-width: 768px) {
      padding: 14px 28px;
      font-size: 0.9rem;
    }

    /* Medium screens / Small laptops (900px+) */
    @media only screen and (min-width: 900px) {
      padding: 16px 32px;
      font-size: 0.95rem;
    }

    &:hover {
      background-color: #5a67d8;
      transform: translateY(-1px);
    }
    &:disabled {
      background-color: #a0aec0;
      color: white;
    }
  }
`;

// CardGenUtility styled components
export const StyledCardStack = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
  width: 100%;

  /* Tablets Portrait (768px+) */
  @media only screen and (min-width: 768px) {
    gap: 20px;
  }

  /* Medium screens / Small laptops (900px+) */
  @media only screen and (min-width: 900px) {
    gap: 24px;
  }
`;

export const StyledCardHeader = styled(Box)`
  && {
    display: flex;
    align-items: center;
    gap: 10px;

    /* Large Mobile / Small Tablet (600px+) */
    @media only screen and (min-width: 600px) {
      gap: 12px;
    }

    /* Tablets Portrait (768px+) */
    @media only screen and (min-width: 768px) {
      gap: 14px;
    }
  }
`;

export const StyledIconContainer = styled(Box)`
  && {
    color: #667eea;
    font-size: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    /* Large Mobile / Small Tablet (600px+) */
    @media only screen and (min-width: 600px) {
      font-size: 28px;
    }

    /* Tablets Portrait (768px+) */
    @media only screen and (min-width: 768px) {
      font-size: 30px;
    }

    /* Medium screens / Small laptops (900px+) */
    @media only screen and (min-width: 900px) {
      font-size: 32px;
    }
  }
`;

export const StyledCardTitle = styled('div')`
  color: #1e293b;
  font-weight: 600;
  font-size: 0.85rem;
  line-height: 1.3;

  /* Large Mobile / Small Tablet (600px+) */
  @media only screen and (min-width: 600px) {
    font-size: 0.95rem;
    line-height: 1.25;
  }

  /* Tablets Portrait (768px+) */
  @media only screen and (min-width: 768px) {
    font-size: 1.05rem;
    line-height: 1.2;
  }

  /* Medium screens / Small laptops (900px+) */
  @media only screen and (min-width: 900px) {
    font-size: 1.1rem;
  }
`;

export const StyledCardContent = styled(Box)`
  && {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    flex-grow: 1;

    /* Large Mobile / Small Tablet (600px+) */
    @media only screen and (min-width: 600px) {
      gap: 14px;
    }

    /* Tablets Portrait (768px+) */
    @media only screen and (min-width: 768px) {
      gap: 16px;
    }

    /* Medium screens / Small laptops (900px+) */
    @media only screen and (min-width: 900px) {
      gap: 18px;
    }
  }
`;

export const StyledImageContainer = styled(Box)`
  && {
    flex-shrink: 0;
    width: 36px;
    height: 36px;
    border-radius: 14px;
    overflow: hidden;
    background-color: #f8fafc;
    border: 1px solid rgba(0, 0, 0, 0.05);

    /* Large Mobile / Small Tablet (600px+) */
    @media only screen and (min-width: 600px) {
      width: 42px;
      height: 42px;
      border-radius: 16px;
    }

    /* Tablets Portrait (768px+) */
    @media only screen and (min-width: 768px) {
      width: 48px;
      height: 48px;
    }

    /* Medium screens / Small laptops (900px+) */
    @media only screen and (min-width: 900px) {
      width: 50px;
      height: 50px;
    }
  }
`;

export const StyledCardImage = styled('img')`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const StyledTextContainer = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex-grow: 1;
  min-width: 0;

  /* Tablets Portrait (768px+) */
  @media only screen and (min-width: 768px) {
    gap: 6.4px;
  }

  /* Medium screens / Small laptops (900px+) */
  @media only screen and (min-width: 900px) {
    gap: 7px;
  }
`;

interface StyledCardTextProps {
  $isFirst: boolean;
}

export const StyledCardText = styled('div')<StyledCardTextProps>`
  color: ${props => (props.$isFirst ? '#475569' : '#64748b')};
  font-size: 0.7rem;
  line-height: 1.5;
  font-weight: ${props => (props.$isFirst ? 500 : 400)};
  word-break: break-word;

  /* Large Mobile (480px+) */
  @media only screen and (min-width: 480px) {
    font-size: 0.75rem;
    line-height: 1.45;
  }

  /* Large Mobile / Small Tablet (600px+) */
  @media only screen and (min-width: 600px) {
    font-size: 0.8rem;
    line-height: 1.4;
  }

  /* Tablets Portrait (768px+) */
  @media only screen and (min-width: 768px) {
    font-size: 0.825rem;
  }

  /* Medium screens / Small laptops (900px+) */
  @media only screen and (min-width: 900px) {
    font-size: 0.85rem;
  }
`;

// promo and history tab nav and search input styled components

export const StyledContainer = styled(Box)(({ theme }) => ({
  padding: '24px',

  [theme.breakpoints.down('md')]: {
    padding: '16px',
  },

  [theme.breakpoints.down('sm')]: {
    padding: '12px',
  },
}));

export const StyledHeaderContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '24px',
  gap: '16px',

  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: '20px',
    marginBottom: '20px',
  },

  [theme.breakpoints.down('sm')]: {
    gap: '16px',
    marginBottom: '16px',
  },
}));

export const StyledTabsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '24px',

  [theme.breakpoints.down('md')]: {
    justifyContent: 'center',
    gap: '32px',
  },

  [theme.breakpoints.down('sm')]: {
    gap: '20px',
    justifyContent: 'space-around',
    width: '100%',
  },
}));

export const StyledTab = styled(Typography)<{
  isActive?: boolean;
}>(({ theme, isActive }) => ({
  cursor: 'pointer',
  fontWeight: isActive ? 600 : 400,
  paddingBottom: '8px',
  position: 'relative',
  color: isActive ? '#2563eb' : theme.palette.text.secondary,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  fontSize: '1.25rem',
  whiteSpace: 'nowrap',

  [theme.breakpoints.down('sm')]: {
    fontSize: '1.1rem',
  },

  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '3px',
    backgroundColor: '#2563eb',
    borderRadius: '2px 2px 0 0',
    transform: isActive ? 'scaleX(1)' : 'scaleX(0)',
    transformOrigin: 'left center',
    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },

  '&:hover': {
    color: isActive ? '#2563eb' : theme.palette.text.primary,

    '&::after': {
      transform: 'scaleX(1)',
      backgroundColor: isActive ? '#2563eb' : theme.palette.text.disabled,
    },
  },
}));

export const StyledSearchField = styled(TextField)(({ theme }) => ({
  minWidth: '220px',
  width: '100%',
  maxWidth: '300px',

  [theme.breakpoints.down('md')]: {
    minWidth: 'unset',
    width: '100%',
    maxWidth: '400px',
    alignSelf: 'center',
  },

  [theme.breakpoints.down('sm')]: {
    maxWidth: '100%',
  },

  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor:
      theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.05)'
        : 'rgba(0, 0, 0, 0.02)',
    transition: 'all 0.2s ease-in-out',

    [theme.breakpoints.down('sm')]: {
      borderRadius: '10px',
    },

    '&:hover': {
      backgroundColor:
        theme.palette.mode === 'dark'
          ? 'rgba(255, 255, 255, 0.08)'
          : 'rgba(0, 0, 0, 0.04)',

      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main,
      },
    },

    '&.Mui-focused': {
      backgroundColor:
        theme.palette.mode === 'dark'
          ? 'rgba(255, 255, 255, 0.1)'
          : 'rgba(0, 0, 0, 0.06)',

      '& .MuiOutlinedInput-notchedOutline': {
        borderWidth: '2px',
        borderColor: theme.palette.primary.main,
      },
    },

    '& .MuiOutlinedInput-notchedOutline': {
      borderColor:
        theme.palette.mode === 'dark'
          ? 'rgba(255, 255, 255, 0.12)'
          : 'rgba(0, 0, 0, 0.12)',
      transition: 'border-color 0.2s ease-in-out',
    },
  },

  '& .MuiInputAdornment-root': {
    color: theme.palette.text.secondary,
  },

  '& .MuiOutlinedInput-input': {
    '&::placeholder': {
      color: theme.palette.text.secondary,
      opacity: 0.7,
    },
  },
}));

export const StyledContentContainer = styled(Box)({});
