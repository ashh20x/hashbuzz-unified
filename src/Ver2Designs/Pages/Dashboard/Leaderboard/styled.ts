import { Box, styled, TextField } from '@mui/material';

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
