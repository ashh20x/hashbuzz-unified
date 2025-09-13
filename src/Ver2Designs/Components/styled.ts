import { Box, Button, Drawer, IconButton, styled } from '@mui/material';

// Footer styles (existing)
export const Footer = styled('footer')`
  background-color: rgba(0, 96, 231, 0.75);
`;

export const FooterContiner = styled('div')`
  display: flex;
  justify-content: space-between;
  padding: 20px;
  color: #fff;
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 24px;
  padding-bottom: 50px;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const FooterColumn = styled('div')`
  flex: 1;
  padding: 10px;
  flex-direction: column;
  align-items: center;

  & > a {
    display: inline-block;
  }

  h4 {
    margin-bottom: 10px;
  }

  ul {
    list-style: none;
    padding: 0;

    li {
      margin-bottom: 5px;

      a {
        color: #fff;
        text-decoration: none;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
`;

export const FooterLogo = styled('img')`
  max-width: 100px;
`;
// Header styles
export const StyledHeaderContainer = styled(Box)`
  && {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    border-bottom: 1px solid #f1f5f9;
    background-color: #fff;
    z-index: 1100;
    display: flex;
    justify-content: center;
  }
`;

export const StyledHeaderContent = styled(Box)`
  && {
    width: 100%;
    max-width: 1200px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;

    @media (min-width: 600px) {
      padding: 12px 24px;
    }
  }
`;

export const StyledHeaderLeft = styled(Box)`
  && {
    display: flex;
    align-items: center;
    gap: 16px;
  }
`;

export const StyledDesktopMenu = styled(Box)`
  && {
    display: flex;
    align-items: center;
    margin-left: 64px;
    gap: 8px;
  }
`;

interface StyledMenuButtonProps {
  $isActive: boolean;
}

export const StyledMenuButton = styled(Button)<StyledMenuButtonProps>`
  && {
    text-transform: none;
    border-radius: 8px;
    padding: 8px 16px;
    color: ${props => (props.$isActive ? '#667eea' : '#64748b')};
    background-color: ${props => (props.$isActive ? '#f8fafc' : 'transparent')};
    font-weight: ${props => (props.$isActive ? 600 : 400)};
    border: 1px solid ${props => (props.$isActive ? '#e2e8f0' : 'transparent')};
    transition: all 0.2s ease;

    &:hover {
      background-color: ${props => (props.$isActive ? '#f1f5f9' : '#f8fafc')};
      border-color: #e2e8f0;
    }
  }
`;

export const StyledHeaderRight = styled(Box)`
  && {
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

export const StyledMobileMenuButton = styled(IconButton)`
  && {
    color: #64748b;

    &:hover {
      background-color: #f8fafc;
    }
  }
`;

export const StyledDrawer = styled(Drawer)`
  && .MuiPaper-root {
    width: 70%;
    max-width: 300px;
    background-color: #ffffff;
    border-radius: 16px 0 0 16px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  }

  && .MuiBackdrop-root {
    background-color: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(4px);
  }
`;

export const StyledDrawerContainer = styled(Box)`
  && {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
`;

export const StyledDrawerHeader = styled(Box)`
  && {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24px;
    border-bottom: 1px solid #f1f5f9;
  }
`;

export const StyledDrawerCloseButton = styled(IconButton)`
  && {
    color: #64748b;

    &:hover {
      background-color: #f8fafc;
    }
  }
`;

export const StyledUserInfoSection = styled(Box)`
  && {
    padding: 24px;
    border-bottom: 1px solid #f1f5f9;
  }
`;

export const StyledUserInfoContainer = styled(Box)`
  && {
    display: flex;
    align-items: center;
    gap: 16px;
  }
`;

export const StyledProfileImageContainer = styled(Box)`
  && {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    overflow: hidden;
    border: 2px solid #e2e8f0;
  }
`;

export const StyledProfileImage = styled('img')`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const StyledAvatarPlaceholder = styled(Box)`
  && {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background-color: #667eea;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 600;
    font-size: 1.2rem;
  }
`;

export const StyledUserName = styled('div')`
  font-weight: 600;
  color: #1e293b;
  font-size: 1rem;
  line-height: 1.5;
`;

export const StyledUserDisplayName = styled('div')`
  color: #64748b;
  font-size: 0.875rem;
  line-height: 1.43;
`;

export const StyledNavigationSection = styled(Box)`
  && {
    flex-grow: 1;
    padding-top: 16px;
    padding-bottom: 16px;
  }
`;

export const StyledNavigationList = styled('div')`
  padding: 0 16px;
`;

export const StyledNavigationItem = styled('div')`
  margin-bottom: 8px;
`;

interface StyledNavigationButtonProps {
  $isActive: boolean;
}

export const StyledNavigationButton = styled(
  'div'
)<StyledNavigationButtonProps>`
  display: flex;
  align-items: center;
  width: 100%;
  border-radius: 16px;
  padding: 12px 16px;
  background-color: ${props => (props.$isActive ? '#f8fafc' : 'transparent')};
  border: 1px solid ${props => (props.$isActive ? '#e2e8f0' : 'transparent')};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f8fafc;
    border-color: #e2e8f0;
  }
`;

export const StyledNavigationIcon = styled(Box)<StyledNavigationButtonProps>`
  && {
    color: ${props => (props.$isActive ? '#667eea' : '#64748b')};
    margin-right: 16px;
    display: flex;
    align-items: center;
  }
`;

export const StyledNavigationText = styled('div')<StyledNavigationButtonProps>`
  font-weight: ${props => (props.$isActive ? 600 : 400)};
  color: ${props => (props.$isActive ? '#667eea' : '#64748b')};
  font-size: 0.95rem;
`;

export const StyledDrawerFooter = styled(Box)`
  && {
    padding: 24px;
    border-top: 1px solid #f1f5f9;
  }
`;
