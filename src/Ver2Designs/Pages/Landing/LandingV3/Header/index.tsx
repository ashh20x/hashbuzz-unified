import HashbuzzLogoMainTransparent from "@/SVGR/HashbuzzLogo";
import { Box, Button, useMediaQuery, useTheme } from "@mui/material";
import * as styles from "./styles";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const theme = useTheme();
  const isSmallDevice = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();


  const handleGetStarted = (e: React.MouseEvent<HTMLButtonElement>) => {
    navigate("/auth/connect-wallet");
  };


  return (
    <Box component="header" id="landing-header" sx={styles.headerContainer}>
      <Box id="header-content-container" sx={styles.headerContentContainer}>
        <HashbuzzLogoMainTransparent
          height={isSmallDevice ? 38 : 60}
          colors={{
            color1: "#fff",
          }}
        />
        {!isSmallDevice && (
          <Box id="landing-header-btns" sx={styles.headerActionContainer}>
            <Button onClick={handleGetStarted} sx={styles.headerSectionGetStartedBtn} disableElevation size="medium" variant="contained" color="primary">
              Get Started
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Header;
