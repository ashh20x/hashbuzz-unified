import { Box, useTheme } from '@mui/material';
import EarningAndPromo from './EarningAndPromo';
import Footer from './Footer';
import Header from './Header';
import HeroSection from './HeroSection';
import HowItWorksVideoModal from './HowItWorksVideoModal';
import HowToStartSection from './HowToStart';
import NextworkAndSecurityProvider from './NertowkAndSecurityProvicer';
import * as styles from './styles';

const LandingV3 = () => {
  const theme = useTheme();
  return (
    <Box
      component='main'
      id='landing-v3'
      sx={styles.LandingPageContainerStyles(theme)}
    >
      <Header />
      <HeroSection />
      <NextworkAndSecurityProvider />
      <EarningAndPromo />
      <HowToStartSection />
      <Footer />
      <HowItWorksVideoModal />
    </Box>
  );
};

export default LandingV3;
