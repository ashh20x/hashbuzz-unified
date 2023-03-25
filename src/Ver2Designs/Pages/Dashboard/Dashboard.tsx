import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import BusinessIcon from "@mui/icons-material/Business";
import LinkIcon from "@mui/icons-material/Link";
import TwitterIcon from "@mui/icons-material/Twitter";
import { Box, Button, Container, Grid, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useApiInstance } from "../../../APIConfig/api";
import { useHashconnectService } from "../../../HashConnect";
import { useStore } from "../../../Providers/StoreProvider";
import { forceClearStorage } from "../../../Utilities/Constant";
import { DashboardHeader } from "../../Components";
import AdminPasswordSetup from "./AdminPasswordSetup";
import Balances from "./Balances";
import CampaignList from "./CampaignList";
import { CardGenUtility } from "./CardGenUtility";
import ConsentModal from "./ConsentModal";

import SpeedDialTooltipOpen from "./SpeedDialTooltipOpen";
// import { useTheme } from "@emotion/react";

const Dashboard = () => {
  const store = useStore();
  const theme = useTheme();
  const aboveXs = useMediaQuery(theme.breakpoints.up("sm"));
  const { User } = useApiInstance();
  const navigate = useNavigate();
  const isDeviceIsSm = useMediaQuery(theme.breakpoints.down("sm"));

  //Hashconnect Hook
  //Hashpack hook init
  const { connectToExtension, availableExtension } = useHashconnectService();

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
  }, []);

  //Hashpack functions
  const connectHashpack = async () => {
    try {
      if (isDeviceIsSm) {
        toast.warning("Please connect with HashPack extension on your desktop to make a payment");
        return alert("Please connect with HashPack extension on your desktop to make a payment");
      }
      if (availableExtension) {
        connectToExtension();
      } else {
        // await sendMarkOFwalletInstall();
        // Taskbar Alert - Hashpack browser extension not installed, please click on <Go> to visit HashPack website and install their wallet on your browser
        alert(
          "Alert - HashPack browser extension not installed, please click on <<OK>> to visit HashPack website and install their wallet on your browser.  Once installed you might need to restart your browser for Taskbar to detect wallet extension first time."
        );
        window.open("https://www.hashpack.app");
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Box
      sx={{
        background: "hsl(0, 0%, 95%)",
        minHeight: "100vh",
      }}
    >
      <Container maxWidth="xl">
        <DashboardHeader />
        <Grid container spacing={3}>
          {/* Card for wallet info */}
          <CardGenUtility
            startIcon={<AccountBalanceWalletIcon color="inherit" fontSize={"inherit"} />}
            title={"Hedera account Id"}
            content={
              store?.currentUser?.hedera_wallet_id ? (
                <Typography variant="h5">{store?.currentUser?.hedera_wallet_id}</Typography>
              ) : (
                <Button variant="contained" disableElevation startIcon={<LinkIcon />} onClick={() => connectHashpack()}>
                  Connect to wallet
                </Button>
              )
            }
          />

          {/* card for personal twitter handle */}
          <CardGenUtility
            startIcon={<TwitterIcon color="inherit" fontSize={"inherit"} />}
            title={"Personal twitter handle"}
            content={
              store?.currentUser?.personal_twitter_handle ? (
                <Typography variant="h5">{"@" + store?.currentUser?.personal_twitter_handle}</Typography>
              ) : (
                <Button variant="contained" disableElevation startIcon={<TwitterIcon />}>
                  Connect
                </Button>
              )
            }
          />

          {/* card for Brand twitter handle */}
          <CardGenUtility
            startIcon={<BusinessIcon color="inherit" fontSize={"inherit"} />}
            title={"Brand twitter handle"}
            content={
              store?.currentUser?.business_twitter_handle ? (
                <Typography variant="h5">{"@" + store?.currentUser?.business_twitter_handle}</Typography>
              ) : (
                <Button variant="contained" disableElevation startIcon={<TwitterIcon />}>
                  Connect
                </Button>
              )
            }
          />

          {/* Card for account balance */}
          {/* <CardGenUtility
            startIcon={<HederaIcon fill="#fff" fillBg="rgba(82, 102, 255, 0.5)" size={48} />}
            title={"Balances (ℏ)"}
            content={
              <Stack
                direction={aboveXs ? "row" : "column-reverse"}
                justifyContent="center"
                alignItems={aboveXs ? "center" : "normal"}
                sx={{ height: aboveXs ? 35 : "auto" }}
              >
                <Typography variant="h5">
                  <img src={ℏicon} alt={"ℏ"} style={{ height: "1.5rem", width: "auto", marginRight: 10, display: "inline-block" }} />
                  {"00000.0000"}
                </Typography>
                {aboveXs && <Divider orientation={"vertical"} sx={{ marginLeft: 0.75 }} />}
                <Box>
                  <IconButton size={"small"} title="Top your campaign budget" disabled={!Boolean(store?.currentUser?.hedera_wallet_id)}>
                    <AddCircleIcon fontSize="inherit" />
                  </IconButton>
                  <IconButton size={"small"} title="Reimburse campaign budget" disabled={!Boolean(store?.currentUser?.hedera_wallet_id)}>
                    <RemoveCircleIcon fontSize="inherit" />
                  </IconButton>
                </Box>
              </Stack>
            }
          /> */}

          <Balances />
        </Grid>

        {/* Campaign List section */}
        <CampaignList user={store?.currentUser} />

        {/* speed dial  action button */}
        <SpeedDialTooltipOpen user={store?.currentUser} />

        {/* Concent modal for requesting concent form user */}
        {!store?.currentUser?.consent ? <ConsentModal user={store?.currentUser!} /> : null}

        {/* Show modal to admin user for updating email and password */}
        {!store?.currentUser?.emailActive && ["SUPER_ADMIN", "ADMIN"].includes(store?.currentUser?.role!) ? (
          <AdminPasswordSetup user={store?.currentUser!} />
        ) : null}
      </Container>
    </Box>
  );
};

export default Dashboard;
