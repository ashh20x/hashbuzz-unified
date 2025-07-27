import { Box, Grid, Stack } from "@mui/material";
import * as styles from "./styles";
import HashbuzzLogoMainTransparent from "../../../../../SVGR/HashbuzzLogo";
import XPlatformIcon from "../../../../../SVGR/XPlatformIcon";

const Footer = () => {
  return (
    <Box component="footer" sx={styles.footerSectionStyles}>
      <Box id="footer-top" sx={styles.footerTopStyles}>
        <Grid container spacing={2}>
          <Grid item md={10}>
            <HashbuzzLogoMainTransparent height={46} />
            <p>Design amazing digital experiences that create more happy in the world.</p>
            <ul>
              <li>
                <a>Terms & Conditions</a>
              </li>
              <li>
                <a>Privacy Policy</a>
              </li>
              <li>
                <a>Cookies</a>
              </li>
            </ul>
          </Grid>
          <Grid md={2}>
            <Stack sx={{height:"100%"}} direction="column" alignItems="center" justifyContent="center">
              <a>
                <XPlatformIcon size={22} />
              </a>
            </Stack>
          </Grid>
        </Grid>
        {/* Footer top content goes here */}
      </Box>
      <Box id="footer-bottom" sx={styles.footerBottomStyles}>
        {/* Footer bottom content goes here */}
        <p>© 2025 Hashbuzz. All rights reserved.</p>
      </Box>
    </Box>
  );
};

export default Footer;
