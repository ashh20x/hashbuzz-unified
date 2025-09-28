import { useAppSelector } from '@/Store/store';
import CloseIcon from '@mui/icons-material/Close';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import MenuIcon from '@mui/icons-material/Menu';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import HashbuzzLogo from '../../SVGR/HashbuzzLogo';
import HeaderMenu from './HeaderMenu';
import * as SC from './styled';

const Header = () => {
  const { currentUser } = useAppSelector(s => s.app);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();

  const [active, setActive] = useState<'dashboard' | 'leaderboard'>(
    'dashboard'
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Update active state based on current route
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/app/dashboard') || path === '/app') {
      setActive('dashboard');
    } else if (path.includes('/app/leaderboard')) {
      setActive('leaderboard');
    }
  }, [location.pathname]);

  const handleMenuItemClick = (item: 'dashboard' | 'leaderboard') => {
    setActive(item);
    setMobileMenuOpen(false);

    // Navigate to the appropriate route
    if (item === 'dashboard') {
      navigate('/app/dashboard');
    } else if (item === 'leaderboard') {
      navigate('/app/leaderboard');
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const menuItems = [
    {
      key: 'dashboard' as const,
      label: 'Dashboard',
      icon: <DashboardIcon sx={{ fontSize: 20 }} />,
    },
    {
      key: 'leaderboard' as const,
      label: 'Leaderboard',
      icon: <LeaderboardIcon sx={{ fontSize: 20 }} />,
    },
  ];

  return (
    <>
      <SC.StyledHeaderContainer>
        <SC.StyledHeaderContent>
          {/* Left side - Logo and Desktop Menu */}
          <SC.StyledHeaderLeft>
            <HashbuzzLogo height={isMobile ? 32 : 40} />

            {/* Desktop Menu Items */}
            {!isMobile && (
              <SC.StyledDesktopMenu>
                {menuItems.map(item => (
                  <SC.StyledMenuButton
                    key={item.key}
                    onClick={() => handleMenuItemClick(item.key)}
                    startIcon={item.icon}
                    $isActive={active === item.key}
                  >
                    {item.label}
                  </SC.StyledMenuButton>
                ))}
              </SC.StyledDesktopMenu>
            )}
          </SC.StyledHeaderLeft>

          {/* Right side - HeaderMenu and Mobile Hamburger */}
          <SC.StyledHeaderRight>
            {!isMobile && <HeaderMenu />}

            {isMobile && (
              <SC.StyledMobileMenuButton
                onClick={toggleMobileMenu}
                aria-label='Open menu'
              >
                <MenuIcon />
              </SC.StyledMobileMenuButton>
            )}
          </SC.StyledHeaderRight>
        </SC.StyledHeaderContent>
      </SC.StyledHeaderContainer>

      {/* Mobile Sidebar */}
      <SC.StyledDrawer
        anchor='right'
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      >
        <SC.StyledDrawerContainer>
          {/* Sidebar Header */}
          <SC.StyledDrawerHeader>
            <HashbuzzLogo height={32} />
            <SC.StyledDrawerCloseButton
              onClick={() => setMobileMenuOpen(false)}
              aria-label='Close menu'
            >
              <CloseIcon />
            </SC.StyledDrawerCloseButton>
          </SC.StyledDrawerHeader>

          {/* User Info Section */}
          {currentUser && (
            <SC.StyledUserInfoSection>
              <SC.StyledUserInfoContainer>
                {currentUser.profile_image_url ? (
                  <SC.StyledProfileImageContainer>
                    <SC.StyledProfileImage
                      src={currentUser.profile_image_url}
                      alt='Profile'
                    />
                  </SC.StyledProfileImageContainer>
                ) : (
                  <SC.StyledAvatarPlaceholder>
                    {currentUser.personal_twitter_handle
                      ?.charAt(0)
                      ?.toUpperCase() || 'U'}
                  </SC.StyledAvatarPlaceholder>
                )}
                <Box>
                  <Typography variant='body1' component={SC.StyledUserName}>
                    @{currentUser.personal_twitter_handle}
                  </Typography>
                  <Typography
                    variant='body2'
                    component={SC.StyledUserDisplayName}
                  >
                    {currentUser.name || 'User'}
                  </Typography>
                </Box>
              </SC.StyledUserInfoContainer>
            </SC.StyledUserInfoSection>
          )}

          {/* Navigation Items */}
          <SC.StyledNavigationSection>
            <SC.StyledNavigationList>
              {menuItems.map(item => (
                <SC.StyledNavigationItem key={item.key}>
                  <SC.StyledNavigationButton
                    onClick={() => handleMenuItemClick(item.key)}
                    $isActive={active === item.key}
                  >
                    <SC.StyledNavigationIcon $isActive={active === item.key}>
                      {item.icon}
                    </SC.StyledNavigationIcon>
                    <SC.StyledNavigationText $isActive={active === item.key}>
                      {item.label}
                    </SC.StyledNavigationText>
                  </SC.StyledNavigationButton>
                </SC.StyledNavigationItem>
              ))}
            </SC.StyledNavigationList>
          </SC.StyledNavigationSection>

          {/* Bottom Section with HeaderMenu */}
          <SC.StyledDrawerFooter>
            <HeaderMenu />
          </SC.StyledDrawerFooter>
        </SC.StyledDrawerContainer>
      </SC.StyledDrawer>
    </>
  );
};
export default Header;
