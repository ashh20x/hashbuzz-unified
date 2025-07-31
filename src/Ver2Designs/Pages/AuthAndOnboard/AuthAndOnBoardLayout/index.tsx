import { Box, Stack, useTheme } from "@mui/material";
import { Outlet } from "react-router-dom";
import OnBoardingSteps from "../OnBoardingSteps";
import * as styles from "./styles";

const AuthAndOnBoardLayout = () => {
  const theme = useTheme();
  return (
    <Stack component="main" flexDirection="row" sx={styles.authAndOnBoardLayoutStyles}>
      <OnBoardingSteps />
      <Box flex={1} component="section">
        <Outlet />
      </Box>
    </Stack>
  );
};

export default AuthAndOnBoardLayout;
