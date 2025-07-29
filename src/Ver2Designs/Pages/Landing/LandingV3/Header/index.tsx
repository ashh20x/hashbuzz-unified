import { Box, Button, Hidden, useMediaQuery, useTheme } from "@mui/material";
import HashbuzzLogoMainTransparent from "../../../../../SVGR/HashbuzzLogo";
import * as styles from "./styles";

const Header = () => {
  const theme = useTheme();
  const isSmallDevice = useMediaQuery(theme.breakpoints.down("sm"));
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
            <Button sx={styles.headerSectionGetStartedBtn} disableElevation size="medium" variant="contained" color="primary">
              Get Started
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Header;
