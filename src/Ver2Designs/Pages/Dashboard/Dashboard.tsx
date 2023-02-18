import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import BusinessIcon from "@mui/icons-material/Business";
import LinkIcon from "@mui/icons-material/Link";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import TwitterIcon from "@mui/icons-material/Twitter";
import { Box, Button, Container, Divider, Grid, IconButton, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import React from "react";
import { useApiInstance } from "../../../APIConfig/api";
// import { User } from "../../../APIConfig/api";
import ℏicon from "../../../IconsPng/ℏicon.png";
import { useStore } from "../../../Providers/StoreProvider";
import HashbuzzLogo from "../../../SVGR/HashbuzzLogo";
import HederaIcon from "../../../SVGR/HederaIcon";
import CampaignList from "./CampaignList";
import { CardGenUtility } from "./CardGenUtility";
import SpeedDialTooltipOpen from "./SpeedDialTooltipOpen";
// import { useTheme } from "@emotion/react";

const Dashboard = () => {
  const store = useStore();
  const theme = useTheme();
  const aboveXs = useMediaQuery(theme.breakpoints.up("sm"));
  const {User} = useApiInstance()

  React.useEffect(() => {
    (async () => {
      const currentUser = await User.getCurrentUser();
      store?.updateState((perv) => ({ ...perv, currentUser }));
    })();
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
        <Stack alignItems={"center"} justifyContent="center" direction={"row"}>
          <HashbuzzLogo height={160} />
        </Stack>
        <Grid container spacing={3}>
          {/* Card for wallet info */}
          <CardGenUtility
            startIcon={<AccountBalanceWalletIcon color="inherit" fontSize={"inherit"} />}
            title={"Hedera account Id"}
            content={
              store?.currentUser?.hedera_wallet_id ? (
                <Typography variant="body2">{store?.currentUser?.hedera_wallet_id}</Typography>
              ) : (
                <Button variant="contained" disableElevation startIcon={<LinkIcon />}>
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
          <CardGenUtility
            startIcon={<HederaIcon fill="#fff" fillBg="rgba(82, 102, 255, 0.5)" size={48} />}
            title={"Hbar(ℏ) Balance"}
            content={
              <Stack
                direction={aboveXs ? "row" : "column-reverse"}
                justifyContent="center"
                alignItems={aboveXs ? "center" : "normal"}
                sx={{ height: aboveXs ? 35 : "auto" }}
              >
                <Typography variant="h5">
                  <img src={ℏicon} alt={"ℏ"} style={{ height: "1.5rem", width: "auto", marginRight: 10, display: "inline-block" }} />
                  {/* {(store?.currentUser?.available_budget ?? 0 / 1e8).toFixed(4)} */}
                  {"00000.0000"}
                </Typography>
                {aboveXs && <Divider orientation={"vertical"} sx={{ marginLeft: 0.75 }} />}
                <Box>
                  <IconButton size={"small"} title="Top your campaign budget" disabled={!Boolean(store
                  ?.currentUser?.hedera_wallet_id)}>
                    <AddCircleIcon fontSize="inherit" />
                  </IconButton>
                  <IconButton size={"small"} title="Reimburse campaign budget" disabled={!Boolean(store
                  ?.currentUser?.hedera_wallet_id)}>
                    <RemoveCircleIcon fontSize="inherit" />
                  </IconButton>
                </Box>
              </Stack>
            }
          />
        </Grid>

        {/* Campaign List section */}
        <CampaignList user={store?.currentUser}/>

        {/* speed dial  action button */}
        <SpeedDialTooltipOpen user={store?.currentUser}/>
      </Container>
    </Box>
  );
};

export default Dashboard;
