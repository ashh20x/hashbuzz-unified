import { Box, Grid, Button } from "@mui/material";
import * as styles from "./styles";
import XPlatformIcon from "../../../../../../SVGR/XPlatformIcon";
import MoneyIcon from "../../../../../../SVGR/MoneyIcon";
import SearchIcon from "../../../../../../SVGR/SearchIcon";
import LunchPromo from "../../../../../../SVGR/LunchPromo";
import RewardEngagement from "../../../../../../SVGR/RewardEngagement";

export const Engagers = () => {
  return (
    <Box id="campaigners-section" component="section" sx={styles.campaignerSection}>
      <Grid container>
        <Grid item md={5} sx={styles.headingConetnt}>
          <h4>Campaigner</h4>
          <Button sx={styles.startNowBtn} disableElevation size="medium" variant="contained" color="primary">
            Get Started
          </Button>
        </Grid>
        <Grid item md={7} sx={styles.content}>
          <p>Hashbuzz leveraging project tokens, brands can significantly boost their visibility and exposure. This approach not only enhances token adoption within the community but also transforms regular posts into viral sensations. Expect a substantial increase in overall engagement, as your audience becomes more interactive and invested in your brand's success. </p>
          <p>Additionally, hashbuzz drives authentic interactions, builds long-term brand loyalty, and taps into new audience segments, fostering a stronger, more vibrant community around your brand.</p>
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
            <LunchPromo size={40} />
            <h4>Launch Promos</h4>
            <p>Create multiple promo campaigns with custom links.</p>
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
              <MoneyIcon size={40} />
            <h4>Add Budget</h4>
            <p>Fund with HBAR or approved tokens.</p>
          </Box>
        </Grid>
        <Grid item md={4}>
          <Box sx={styles.infoIconsContainer}>
              <RewardEngagement size={40} />
            <h4>Reward Engagement</h4>
            <p>Reward real community members who engage with your brand.</p>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Engagers;
