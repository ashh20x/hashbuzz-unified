import { Box, Stack, useMediaQuery, useTheme } from '@mui/material';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet, useLocation } from 'react-router-dom';
import useResponsive from '../../../../hooks/use-responsive';
import { toggleSmDeviceModal } from '../authStoreSlice';
import OnBoardingSteps from '../Components/OnBoardingSteps/OnBoardingSteps';
// import ModalStepsDialog from './ModalStepsDialog';
import StepsMobileHeader from './StepsMobileHeader';
import * as styles from './styles';

const AuthAndOnBoardLayout = () => {
  const isSmDevice = useMediaQuery(useTheme().breakpoints.down('sm'));
  const dispatch = useDispatch();
  const location = useLocation();
  const { isDesktop } = useResponsive();

  // Handle small device modal for /auth routes
  useEffect(() => {
    if (isSmDevice && location.pathname.startsWith('/auth')) {
      dispatch(toggleSmDeviceModal(true));
    }
  }, [dispatch, isSmDevice, location.pathname]);

  return (
    <Stack
      component='main'
      flexDirection={{
        xs: 'column',
        sm: 'column',
        md: 'row',
      }}
      sx={styles.authAndOnBoardLayoutStyles}
    >
      {isDesktop && (
        <>
          {/* <StepsMobileHeader /> */}
          <OnBoardingSteps />
        </>
      )}

      <Box flex={1} component='section'>
        {!isDesktop && <StepsMobileHeader />}
        <Outlet />
      </Box>

      {/* {isSmDevice && <ModalStepsDialog />} */}
    </Stack>
  );
};

export default AuthAndOnBoardLayout;
