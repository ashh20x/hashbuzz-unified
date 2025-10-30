import { SxProps, Theme } from '@mui/material/styles';
import styled from 'styled-components';

export const CardContainer = styled.div`
  background-color: ${({ theme: { colors } }) => colors.white};
  box-shadow: 0px 2px 31px #efefef;
  border-radius: 22px;
  width: 240px;
  height: 176px;
`;
export const IconWrapper = styled.div`
  padding-top: 30px;
  padding-bottom: 26px;
`;
export const TextWrapper = styled.div`
  cursor: pointer;
`;

export const cardStyle: SxProps<Theme> = {
  height: {
    xs: 'auto',
    sm: 'auto',
    md: 180,
  },
  backgroundColor: '#ffffff',
  p: 3,
  borderRadius: 4,
  border: '2px solid rgba(0, 0, 0, 0.08)',
  // boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
    transform: 'translateY(-2px)',
    borderColor: 'rgba(102, 126, 234, 0.15)',
  },
};
