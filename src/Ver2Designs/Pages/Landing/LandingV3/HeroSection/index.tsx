import { PlayCircle } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import { useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { setHowItWorksModalOpen } from "../landingPageStoreSlice";
import * as styles from "./styles";

const HeroSection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleOpenVideoPlayer = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatch(setHowItWorksModalOpen(true));
  };

  const handleGetStarted = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    navigate("/auth/pair-wallet");
  };

  return (
    <Box component="section" id="hero-section-container" sx={styles.heroSectionContainer}>
      <Box component="div" id="hero-section-content" sx={styles.heroSectionContentArea}>
        <Box id="hero-section-content-area" sx={styles.heroSectionContent}>
          <h1>Grow your Brand Community with Incentivized 𝕏 Engagement</h1>
          <p>Connect your wallet, link your 𝕏 account, and start rewarding real interactions using crypto tokens — all in a few clicks.</p>
          <Box id="hero-section-btns" className="heroSectionBtns">
            <Button onClick={handleOpenVideoPlayer} sx={styles.howItWorksButton} disableElevation  size="medium" variant="contained" startIcon={<PlayCircle fontSize="inherit" />}>
              How it works
            </Button>
            <Button onClick={handleGetStarted} sx={styles.getStartedButton} disableElevation size="medium" variant="contained" color="primary">
              Get Started
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default HeroSection;
