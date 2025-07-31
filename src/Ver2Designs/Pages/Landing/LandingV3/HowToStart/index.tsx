import EarnReward from "@/SVGR/EarnReward";
import MoneyIconLine from "@/SVGR/MoneyLine";
import UserIcon from "@/SVGR/UserIcon";
import { Box, Button, Grid, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import * as styles from "./style";

export const HowToStartSection = () => {
  const navigate = useNavigate();

  const handleGetStarted = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    navigate("/auth/onboard");
  };


  return (
    <Box component="section" id="how-to-get-start" sx={styles.howToStartSection}>
      <Box sx={styles.howToStartSectionContainer}>
        <h3>How to Get Started</h3>
        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={styles.howToStartSteps }>
              <p>Step 1</p>
              <Box sx={styles.howToStartStepsContent }>
                <span>
                  <UserIcon size={30} />
                </span>
                <h4>Connect Wallet</h4>
              </Box>
            </Box>
          </Grid>
           <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={styles.howToStartSteps }>
              <p>Step 2</p>
              <Box sx={styles.howToStartStepsContent }>
                <span>
                  <MoneyIconLine size={30} />
                </span>
                <h4>Connect to 𝕏 Account</h4>
              </Box>
            </Box>
          </Grid>
           <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={styles.howToStartSteps }>
              <p>Step 3</p>
              <Box  sx={styles.howToStartStepsContent }>
                <span>
                  <EarnReward size={30} />
                </span>
                <h4>Start Engaging Cryto</h4>
              </Box>
            </Box>
          </Grid>
        </Grid>
        <Stack direction="row" justifyContent="center" alignItems="center">
          <Button onClick={handleGetStarted} sx={styles.startsNowBtn} disableElevation size="medium" variant="contained" color="primary">
            Start now
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default HowToStartSection;
