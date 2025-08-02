import { Box, Stack, useMediaQuery, useTheme } from "@mui/material";
import { useEffect } from 'react';
import { useDispatch } from "react-redux";
import { Outlet, useLocation } from "react-router-dom";
import { toggleSmDeviceModal } from "../authStoreSlice";
import OnBoardingSteps from "../OnBoardingSteps";
import ModalStepsDialog from "./ModalStepsDialog";
import * as styles from "./styles";
import StepsMobileHeader from "./StepsMobleHeader";


const AuthAndOnBoardLayout = () => {
  const isSmDevice = useMediaQuery(useTheme().breakpoints.down("sm"));
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    if (isSmDevice && location.pathname.startsWith("/auth")) {
      dispatch(toggleSmDeviceModal(true));
    }
  }, [isSmDevice, location.pathname, dispatch]);

  return (
    <Stack component="main" flexDirection={{
      xs: "column",
      sm: "column",
      md: "row",
    }} sx={styles.authAndOnBoardLayoutStyles}>
      {isSmDevice ? <StepsMobileHeader /> : <OnBoardingSteps />}
      <Box flex={1} component="section">
        <Outlet />
      </Box>
      {isSmDevice && (<ModalStepsDialog />
      )}
    </Stack>
  );
};

export default AuthAndOnBoardLayout;
