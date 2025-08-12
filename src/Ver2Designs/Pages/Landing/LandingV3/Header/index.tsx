import HashbuzzIcon from "@/SVGR/HashbuzzIcon";
import HashbuzzLogoMainTransparent from "@/SVGR/HashbuzzLogo";
import { Box, Button, useMediaQuery, useTheme } from "@mui/material";
import useAuthHandler from "../hook/use-auth-handler";
import * as styles from "./styles";

const Header = () => {
  const theme = useTheme();
  const isSmallDevice = useMediaQuery(theme.breakpoints.down("sm"));
  const { authSteps, authBtnClickHandler } = useAuthHandler();


  const handleGetStarted = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    authBtnClickHandler();
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
            <Button startIcon={authSteps.wallet.isPaired && <HashbuzzIcon color="#fff" size={20} />} onClick={handleGetStarted} sx={styles.headerSectionGetStartedBtn} disableElevation size="medium" variant="contained" color="primary">
              {authSteps.wallet.address ??  "Get Started"}
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Header;
