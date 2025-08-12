import { useGetCurrentUserQuery } from "@/API/user";
import { updateCurrentUser } from "@/Store/miscellaneousStoreSlice";
import { useAppDispatch } from "@/Store/store";
import { Container, useTheme } from "@mui/material";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { DashboardHeader } from "../Components";
import useBalancesSync from "@/hooks/use-balances-sync";


const MainLayout = () => {
  useBalancesSync();
  const theme = useTheme();
  const { data: currentUser, isLoading } = useGetCurrentUserQuery()
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (currentUser) {
      dispatch(updateCurrentUser(currentUser));
    }
  }, [currentUser, dispatch]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
          gridGap: "12px"
        },
      }}
    >
      <DashboardHeader />
      <Outlet />
    </Container>
  );
};

export default MainLayout;
