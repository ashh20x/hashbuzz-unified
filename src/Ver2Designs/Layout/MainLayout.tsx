import { Box, Container } from "@mui/material";
import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useApiInstance } from "../../APIConfig/api";
import { useStore } from "../../Providers/StoreProvider";
import { forceClearStorage } from "../../Utilities/Constant";
import { DashboardHeader } from "../Components";
// import { DashboardHeader } from "../../Components";
const MainLayout = () => {
  const store = useStore();


  const { User } = useApiInstance();
  const navigate = useNavigate();


  const getUserData = React.useCallback(async () => {
    try {
      const currentUser = await User.getCurrentUser();
      store?.updateState((perv) => ({ ...perv, currentUser }));
    } catch (error) {
      //@ts-ignore
      toast.error(error?.message ?? "Server Error");
      forceClearStorage();
      navigate("/");
    }
  }, [User, navigate, store]);

  React.useEffect(() => {
    getUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Box
      sx={{
        background: "hsl(0, 0%, 95%)",
        minHeight: "100vh",
      }}
    >
      <Container maxWidth="xl">
        <DashboardHeader />
        <Outlet />
      </Container>
    </Box>
  );
};

export default MainLayout;
