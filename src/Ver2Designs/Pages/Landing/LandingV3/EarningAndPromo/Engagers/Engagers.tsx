import { Box, Grid, Button } from "@mui/material";
import * as styles from "./styles";
import XPlatformIcon from "../../../../../../SVGR/XPlatformIcon";
import MoneyIcon from "../../../../../../SVGR/MoneyIcon";
import SearchIcon from "../../../../../../SVGR/SearchIcon";

export const Engagers = () => {
  return (
    <Box id="engagers-section" component="section" sx={styles.earningAndPromoSection}>
      <Grid container>
        <Grid item md={5} sx={styles.headingConetnt}>
          <h4>Engagers</h4>
          <Button sx={styles.startNowBtn} disableElevation size="medium" variant="contained" color="primary">
            Get Started
          </Button>
        </Grid>
        <Grid item md={7} sx={styles.content}>
          <p>Step into the world of hashbuzz as an engager and turn your voice into value. By joining the platform, you’ll gain access to a curated stream of brand promotions on 𝕏, where your genuine interactions—likes, reposts, comments—are recognised and rewarded in HTS tokens.</p>
          <p>No gimmicks, no empty clicks—just meaningful participation that earns you real digital assets. Whether you’re here to support projects you believe in or simply engage with high-quality content, hashbuzz makes every action count.</p>
        </Grid>
      </Grid>
      <Grid container id="info-icons-section" sx={styles.infoIconsSection}>
        <Grid item md={4}>
          <Box
            sx={styles.infoIconsContainer}
            borderRight={{
              borderColor: "#DBDDFF",
              borderRightWidth: 1,
            }}
          >
            <SearchIcon size={40} />
            <h4>Explore Promos</h4>
            <p>Browse promo posts from your dashboard.</p>
          </Box>
        </Grid>
        <Grid item md={4}>
          <Box
            sx={styles.infoIconsContainer}
            borderRight={{
              borderColor: "#DBDDFF",
              borderRightWidth: 1,
            }}
          >
            <XPlatformIcon size={40} />
            <h4>Engage on 𝕏</h4>
            <p>Like, repost, or comment on selected 𝕏 posts.</p>
          </Box>
        </Grid>
        <Grid item md={4}>
          <Box sx={styles.infoIconsContainer}>
            <MoneyIcon size={40} />
            <h4>Earn Instantly</h4>
            <p>Earn credits directly after completing simple engagement tasks.</p>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Engagers;
