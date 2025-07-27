import React from "react";
import * as styles from "./styles";
import { Box , Button  , useTheme} from "@mui/material";
import {PlayCircle} from "@mui/icons-material";

const HeroSection = () => {
  const theme = useTheme();
  return (
    <Box component="section" id="hero-section-container" sx={styles.heroSectionContainer}>
      <Box component="div" id="hero-section-content" sx={styles.heroSectionContentArea(theme)}>
        <Box id="hero-section-content-area" sx={styles.heroSectionContent}>
          <h1>Grow your Brand Community with Incentivized 𝕏 Engagement</h1>
          <p>Connect your wallet, link your 𝕏 account, and start rewarding real interactions using crypto tokens — all in a few clicks.</p>
          <Box id="hero-section-btns">
            <Button sx={styles.howItWorksButton} disableElevation  size="medium" variant="contained" startIcon={<PlayCircle fontSize="inherit" />}>
              How it works
            </Button>
            <Button sx={styles.getStartedButton} disableElevation size="medium" variant="contained" color="primary">
              Get Started
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default HeroSection;
