import BuiltOnHedera from "@/SVGR/BuiltOnHedera";
import { CertikEmblem } from "@/Ver2Designs/Components";
import { Box, Grid, Stack, useMediaQuery, useTheme } from "@mui/material";
import * as styles from "./styles";

const NextworkAndSecurityProvider = () => {
  const theme = useTheme();
  const isSmallDevice = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Box component="section" id="network-and-security-provider" sx={styles.NexAndSecurityProviderSection}>
      <Box id="network-and-security-provider-content" sx={styles.contentContainer}>
        <Grid container>
          <Grid sx={styles.content} size={{ xs: 12, md: 8 }}>
            <h2>Speed, Security & Transparency</h2>
            <p>Discover the power of hashbuzz, a dynamic platform that elevates brand communities through incentivized 𝕏 posts.</p>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack direction="column" sx={styles.networkIcons(theme)}>
              <Box component="div" className="built-on-hedera" flex={1} display="flex" alignItems="center" justifyContent="center">
                {/* Top content here */}
                <BuiltOnHedera height={isSmallDevice ? 78 : 100} />
              </Box>
              <Box component="div" className="security-certificate" flex={1} display="flex" alignItems="center" justifyContent="center">
                {/* Bottom content here */}
                <CertikEmblem projectId="hashbuzz" dataId="68dcae96" />
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Box>
      <hr className="horizonatal" />
      <hr className="vertical" />
    </Box>
  );
};

export default NextworkAndSecurityProvider;
