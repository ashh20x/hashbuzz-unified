import { Box, Grid, Stack } from "@mui/material";
import * as styles from "./styles";
import BuiltOnHedera from "../../../../../SVGR/BuiltOnHedera";
import { CertikEmblem } from "../../../../Components";

const NextworkAndSecurityProvider = () => {
  return (
    <Box component="section" id="network-and-security-provider" sx={styles.NexAndSecurityProviderSection}>
      <Box id="network-and-security-provider-content" sx={styles.contentContainer}>
        <Grid container spacing={2}>
          <Grid item md={8} sx={styles.content}>
            <h2>Speed, Security & Transparency</h2>
            <p>Discover the power of hashbuzz, a dynamic platform that elevates brand communities through incentivized 𝕏 posts.</p>
          </Grid>
          <Grid item md={4}>
            <Stack direction="column" spacing={2} sx={{ height: '100%' }}>
                <Box flex={1} display="flex" alignItems="center" justifyContent="center">
                    {/* Top content here */}
                       <BuiltOnHedera height={100} />
                </Box>
                <Box flex={1} display="flex" alignItems="center" justifyContent="center">
                    {/* Bottom content here */}
                    <CertikEmblem projectId="hashbuzz" dataId="68dcae96" />
                </Box>
            </Stack>
          </Grid>
        </Grid>
      </Box>
      <hr className="horizonatal"/>
      <hr className="vertical"/>
    </Box>
  );
};

export default NextworkAndSecurityProvider;
