import { Box, Grid, Stack, useTheme, Link } from "@mui/material";
import * as styles from "./styles";
import HashbuzzLogoMainTransparent from "../../../../../SVGR/HashbuzzLogo";
import XPlatformIcon from "../../../../../SVGR/XPlatformIcon";

const Footer = () => {

  return (
    <Box component="footer" sx={styles.footerSectionStyles}>
      <Box id="footer-top" sx={styles.footerTopStyles}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={10}>
            <HashbuzzLogoMainTransparent height={46} />
            <Box component="p" sx={{ mt: 1, mb: 2 }}>
              Design amazing digital experiences that create more happy in the world.
            </Box>
            <Box component="ul" sx={{ display: "flex", gap: 2, listStyle: "none", p: 0, m: 0 }}>
              <li>
                <Link href="#" underline="hover">Terms & Conditions</Link>
              </li>
              <li>
                <Link href="#" underline="hover">Privacy Policy</Link>
              </li>
              <li>
                <Link href="#" underline="hover">Cookies</Link>
              </li>
            </Box>
          </Grid>
          <Grid item xs={12} md={2}>
            <Stack
              height="100%"
              direction="column"
              alignItems="center"
              justifyContent="center"
              sx={{ pb: { xs: 2, md: 0 } }}
            >
              <Link href="#" aria-label="X Platform" underline="none">
                <XPlatformIcon size={22} />
              </Link>
            </Stack>
          </Grid>
        </Grid>
      </Box>
      <Box id="footer-bottom" sx={styles.footerBottomStyles}>
        <Box component="p" sx={{ m: 0 }}>
          © 2025 Hashbuzz. All rights reserved.
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
