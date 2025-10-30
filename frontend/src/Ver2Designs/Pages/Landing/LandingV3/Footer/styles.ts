import { SxProps, Theme } from '@mui/material';
import { containerStyles } from '../styles';

export const footerSectionStyles: SxProps<Theme> = {
  width: '100%',
  paddingTop: '3rem',
  background: '#F5F6FF',
  borderTop: '1px solid #D9D9D9',
};

export const footerTopStyles: SxProps<Theme> = {
  ...containerStyles,
  display: 'flex',
  paddingBottom: '2rem',
  '& p': {
    fontSize: '1rem',
    lineHeight: '1.5',
    color: '#717680',
    fontWeight: 400,
    margin: '2rem 0',
  },
  '& ul': {
    display: 'flex',
    flexDirection: {
      xs: 'column',
      sm: 'row',
    },
    listStyle: 'none',
    padding: 0,
    paddingLeft: 0,
    marginBottom: '1rem',
    '& li': {
      marginRight: '1.5rem',
      '& a': {
        textDecoration: 'none',
        color: '#535862',
        fontSize: '1rem',
        lineHeight: '1.5',
        fontWeight: 400,
        '&:hover': {
          color: '#535861',
        },
      },
    },
  },
};

export const footerBottomStyles: SxProps<Theme> = {
  backgroundColor: '#DBDDFF',
  height: '72px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '1rem',
  lineHeight: '1.5',
  color: '#717680',
  fontWeight: 400,
};
