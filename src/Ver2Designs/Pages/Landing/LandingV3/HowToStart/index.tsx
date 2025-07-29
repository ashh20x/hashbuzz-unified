import { Box, Button, Grid, Stack, Theme, useTheme } from "@mui/material";
import * as styles from "./style";
import UserIcon from "../../../../../SVGR/UserIcon";
import MoneyIconLine from "../../../../../SVGR/MoneyLine";
import EarnReward from "../../../../../SVGR/EarnReward";

export const HowToStartSection = () => {
  const theme = useTheme()
  return (
    <Box component="section" id="how-to-get-start" sx={styles.howToStartSection}>
      {/* Content goes here */}
      <Box sx={styles.howToStartSectionContainer}>
        <h3>How to Get Started</h3>
        <Grid container spacing={2.5}>
          <Grid item xs={12} md={4}>
            <Box sx={styles.howToStartSteps(theme)}>
              <p>Step 1</p>
              <Box sx={styles.howToStartStepsContent(theme)}>
                <span>
                  <UserIcon size={30} />
                </span>
                <h4>Connect Wallet</h4>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={styles.howToStartSteps(theme)}>
              <p>Step 2</p>
              <Box sx={styles.howToStartStepsContent(theme)}>
                <span>
                  <MoneyIconLine size={30} />
                </span>
                <h4>Connect to 𝕏 Account</h4>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={styles.howToStartSteps(theme)}>
              <p>Step 3</p>
              <Box sx={styles.howToStartStepsContent(theme)}>
                <span>
                  <EarnReward size={30} />
                </span>
                <h4>Start Engaging Cryto</h4>
              </Box>
            </Box>
          </Grid>
        </Grid>
        <Stack direction="row" justifyContent="center" alignItems="center">
          <Button sx={styles.startsNowBtn} disableElevation size="medium" variant="contained" color="primary">
            Start now
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default HowToStartSection;
