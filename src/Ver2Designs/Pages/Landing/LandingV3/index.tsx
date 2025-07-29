import { Box, useTheme } from "@mui/material";
import * as styles from "./styles";
import HeroSection from "./HeroSection";
import Header from "./Header";
import NextworkAndSecurityProvider from "./NertowkAndSecurityProvicer";
import EarningAndPromo from "./EarningAndPromo";
import HowToStartSection from "./HowToStart";
import Footer from "./Footer";
import HowItWorksVideoModal from "./HowItWorksVideoModal/index.tsx";

const LandingV3 = () => {
  const theme = useTheme();
  return (
    <Box component="main" id="landing-v3" sx={styles.LandingPageContainerStyles(theme)}>
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
