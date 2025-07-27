import { Box, Button } from "@mui/material";
import HashbuzzLogoMainTransparent from "../../../../../SVGR/HashbuzzLogo";
import * as styles from "./styles";
const Header = () => {
  return (
    <Box component="header" id="landing-header" sx={styles.headerContainer}>
        <Box id="header-content-container" sx={styles.headerContenntContainer}>
      <HashbuzzLogoMainTransparent
        height={60}
        colors={{
          color1: "#fff",
        }}
      />
      <Box id="landing-header-btns" sx={styles.headerActionContainer}>
        <Button sx={styles.headerSectionGetStartedBtn} disableElevation size="medium" variant="contained" color="primary">
          Get Started
        </Button>
      </Box>
      </Box>
    </Box>
  );
};

export default Header;
