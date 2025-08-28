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
        <Link to='/'>
          <HashbuzzLogoMainTransparent height={46} />
        </Link>
        {isSmDevice && <p>Complete these steps to get started with Hashbuzz</p>}
      </Box>
      <Box flex={1} sx={styles.stepsList}>
        <ul>
          <li
            className={
              getActiveClassName(OnboardingSteps.PairWallet) ||
              getActiveClassName(OnboardingSteps.SignAuthentication)
            }
          >
            <span className='list-bullet'>1</span>
            <span className='list-name'>Connect Wallet</span>
          </li>
          <li className={getActiveClassName(OnboardingSteps.ConnectXAccount)}>
            <span className='list-bullet'>2</span>
            <span className='list-name'>Connect 𝕏 account </span>
          </li>
          <li className={getActiveClassName(OnboardingSteps.AssociateTokens)}>
            <span className='list-bullet'>3</span>
            <span className='list-name'>Associate reward tokens</span>
          </li>
        </ul>
      </Box>
    </Stack>
  );
};

export default OnBoardingSteps;
