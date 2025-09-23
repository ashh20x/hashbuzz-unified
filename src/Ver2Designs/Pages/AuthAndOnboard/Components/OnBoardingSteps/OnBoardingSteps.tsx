import HashbuzzLogoMainTransparent from '@/SVGR/HashbuzzLogo';
import { Box, Stack, useMediaQuery, useTheme } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { OnboardingSteps } from '../../authStoreSlice';
import * as styles from './styles';

const OnBoardingSteps = () => {
  const isSmDevice = useMediaQuery(useTheme().breakpoints.down('sm'));
  const location = useLocation();

  const getActiveClassName = (path: OnboardingSteps) => {
    return location.pathname.includes(path) ? 'active' : '';
  };

  return (
    <Stack component='aside' sx={styles.sideBar}>
      <Box sx={styles.sideBarLogoContainer}>
        <Link to='/' style={{ display: 'flex', alignItems: 'center' }}>
          <HashbuzzLogoMainTransparent height={46} />
        </Link>
        {isSmDevice && (
          <Box
            component='p'
            sx={{
              background: 'linear-gradient(135deg, #5265ff 0%, #667eea 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontWeight: 600,
            }}
          >
            Complete these steps to get started with Hashbuzz
          </Box>
        )}
      </Box>

      <Box flex={1} sx={styles.stepsList}>
        <ul>
          <li
            className={
              getActiveClassName(OnboardingSteps.PairWallet) ||
              getActiveClassName(OnboardingSteps.SignAuthentication)
            }
          >
            <Box className='list-bullet'>1</Box>
            <Box className='list-name'>Connect Wallet</Box>
          </li>

          <li className={getActiveClassName(OnboardingSteps.ConnectXAccount)}>
            <Box className='list-bullet'>2</Box>
            <Box className='list-name'>Link 𝕏 account</Box>
          </li>

          <li className={getActiveClassName(OnboardingSteps.AssociateTokens)}>
            <Box className='list-bullet'>3</Box>
            <Box className='list-name'>Associate reward tokens</Box>
          </li>
        </ul>
      </Box>
    </Stack>
  );
};

export default OnBoardingSteps;
