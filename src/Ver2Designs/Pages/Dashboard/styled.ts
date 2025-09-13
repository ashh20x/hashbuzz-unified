import { Alert, Box, Button, IconButton, styled } from '@mui/material';

export const StyledCardGenUtility = styled('div')`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  @media only screen and (max-width: 1000px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
  @media only screen and (max-width: 500px) {
    grid-template-columns: repeat(1, 1fr);
    gap: 20px;
  }
  width: 100%;
`;

export const StyledAlert = styled(Alert)`
  && {
    margin-bottom: 16px;
    margin-top: 16px;
  }
`;

export const StyledPromoBanner = styled(Box)`
  && {
    background: linear-gradient(135deg, #5265ff 0%, #243ae9 100%);
    border-radius: 24px;
    padding: 16px;
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
    @media (min-width: 600px) {
      padding: 24px;
      min-height: 80px;
    }
    @media (min-width: 900px) {
      flex-direction: row;
      gap: 0;
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
    @media (min-width: 600px) {
      gap: 16px;
      flex-direction: row;
      text-align: left;
    }
    @media (min-width: 900px) {
      width: auto;
    }
  }
`;

export const StyledSpeakerImage = styled('img')`
  width: clamp(60px, 15vw, 100px);
  height: auto;
  max-height: 60px;
  object-fit: contain;
`;

export const StyledBannerSubtitle = styled('div')`
  opacity: 0.9;
  margin-bottom: 4px;
  font-size: 0.75rem;
  @media (min-width: 600px) {
    font-size: 0.875rem;
  }
`;

export const StyledBannerTitle = styled('div')`
  font-weight: 700;
  margin-bottom: 0;
  font-size: 1rem;
  @media (min-width: 600px) {
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
    @media (min-width: 600px) {
      gap: 16px;
    }
    @media (min-width: 900px) {
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
    font-size: 0.75rem;
    min-width: auto;
    transition: all 0.2s ease;
    @media (min-width: 600px) {
      padding: 12px 24px;
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
    padding-top: 32px;
    padding-bottom: 32px;
  }
`;

export const StyledConnectBrandButton = styled(Button)`
  && {
    background-color: #667eea;
    color: white;
    font-weight: 600;
    padding: 12px 32px;
    border-radius: 16px;
    font-size: 0.9rem;
    transition: all 0.2s ease;
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
  gap: 20px;
  height: 100%;
  width: 100%;
`;

export const StyledCardHeader = styled(Box)`
  && {
    display: flex;
    align-items: center;
    gap: 12px;
  }
`;

export const StyledIconContainer = styled(Box)`
  && {
    color: #667eea;
    font-size: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    @media (min-width: 600px) {
      font-size: 32px;
    }
  }
`;

export const StyledCardTitle = styled('div')`
  color: #1e293b;
  font-weight: 600;
  font-size: 0.9rem;
  line-height: 1.2;
  @media (min-width: 600px) {
    font-size: 1.1rem;
  }
`;

export const StyledCardContent = styled(Box)`
  && {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    flex-grow: 1;
  }
`;

export const StyledImageContainer = styled(Box)`
  && {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    border-radius: 16px;
    overflow: hidden;
    background-color: #f8fafc;
    border: 1px solid rgba(0, 0, 0, 0.05);
    @media (min-width: 600px) {
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
  gap: 6.4px;
  flex-grow: 1;
  min-width: 0;
`;

interface StyledCardTextProps {
  $isFirst: boolean;
}

export const StyledCardText = styled('div')<StyledCardTextProps>`
  color: ${props => (props.$isFirst ? '#475569' : '#64748b')};
  font-size: 0.75rem;
  line-height: 1.4;
  font-weight: ${props => (props.$isFirst ? 500 : 400)};
  word-break: break-word;
  @media (min-width: 600px) {
    font-size: 0.825rem;
  }
`;
