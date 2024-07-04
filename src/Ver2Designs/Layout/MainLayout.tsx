import { Box, Container, useTheme } from "@mui/material";
import React from "react";
import { Outlet } from "react-router-dom";
import { toast } from "react-toastify";
import { useApiInstance } from "../../APIConfig/api";
import { useStore } from "../../Store/StoreProvider";
import { getErrorMessage } from "../../Utilities/helpers";
import { DashboardHeader } from "../Components";
// import { DashboardHeader } from "../../Components";
const MainLayout = () => {
  const theme = useTheme();
  const store = useStore();
  const { User } = useApiInstance();
  // const navigate = useNavigate();

  const getUserData = React.useCallback(async () => {
    try {
      const currentUser = await User.getCurrentUser();
      store?.updateState((perv) => ({ ...perv, currentUser }));
    } catch (error) {
      toast.error(getErrorMessage(error) ?? "Error while getting current user details.");
    }
  }, [User, store]);

  React.useEffect(() => {
    getUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container
      maxWidth="xl"
      sx={{
        background: "hsl(0, 0%, 95%)",
        minHeight: "100vh",
        [theme.breakpoints.up("sm")]: {
          display: "grid",
          gridTemplateRows: "auto 1fr",
          height: "100vh",
          gridGap:"12px"
        },
      }}
    >
      <DashboardHeader />
      <Outlet />
    </Container>
  );
};

export default MainLayout;
