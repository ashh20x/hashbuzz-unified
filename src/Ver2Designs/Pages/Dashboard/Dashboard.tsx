import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import BusinessIcon from "@mui/icons-material/Business";
import LinkIcon from "@mui/icons-material/Link";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import TwitterIcon from "@mui/icons-material/Twitter";
import { Box, Button, Card, Container, Divider, Grid, IconButton, Stack, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React from "react";
import { User } from "../../../APIConfig/api";
import { useStore } from "../../../Providers/StoreProvider";
import HashbuzzLogo from "../../../SVGR/HashbuzzLogo";
import HederaIcon from "../../../SVGR/HederaIcon";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import ℏicon from "../../../IconsPng/ℏicon.png";
// import { useTheme } from "@emotion/react";

const columns: GridColDef[] = [
  { field: "name", headerName: "Campaign Name", width: 150 },
  { field: "campaign_stats", headerName: "Campaign stats", width: 150 },
  { field: "campaign_budget", headerName: "Campaign Budget", width: 150 },
  { field: "amount_spent", headerName: "Amount Spent", width: 150 },
  { field: "amount_claimed", headerName: "Amount Claimed", width: 150 },
  { field: "action", headerName: "Actions", width: 150 },
];

const cardStyle = {
  minHeight: 100,
  backgroundColor: "#E1D9FF",
  p: 2,
  // background: "rgb(241,241,241)",
  // background: "linear-gradient(190deg, rgba(241,241,241,1) 0%, rgba(255,255,255,1) 35%, rgba(225,217,255,1) 100%)",
  // background: "radial-gradient(circle, rgba(225,217,255,1) 0%, rgba(255,255,255,1) 100%)",
};

const Dashboard = () => {
  const store = useStore();
  const theme = useTheme();
  const aboveXs = useMediaQuery(theme.breakpoints.up("sm"));
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
          <CardGenUtility
            startIcon={<HederaIcon fill="#fff" fillBg="rgba(82, 102, 255, 0.5)" size={48} />}
            title={"Hbar(ℏ) Balance"}
            content={
              <Stack direction={aboveXs?"row":"column-reverse"} justifyContent="center" alignItems={aboveXs?"center":"normal"} sx={{ height: aboveXs?35:"auto" }}>
                <Typography variant="h5">
                  <img src={ℏicon} alt={"ℏ"} style={{ height: "1.5rem", width: "auto", marginRight: 10, display: "inline-block" }} />
                  {/* {(store?.currentUser?.available_budget ?? 0 / 1e8).toFixed(4)} */}
                  {"00000.0000"}
                </Typography>
                {aboveXs && <Divider orientation={"vertical"} sx={{ marginLeft: 0.75}} />}
                <Box>
                  <IconButton size={"small"} title="Top your campaign budget">
                    <AddCircleIcon fontSize="inherit" />
                  </IconButton>
                  <IconButton size={"small"} title="Reimburse campaign budget">
                    <RemoveCircleIcon fontSize="inherit" />
                  </IconButton>
                </Box>
              </Stack>
            }
          />
        </Grid>
        <Box
          sx={{
            marginTop: 4,
            marginBottom: 2,
          }}
        >
          <DataGrid rows={[]} columns={columns} paginationMode="server" />
        </Box>
      </Container>
    </Box>
  );
};

interface CardGenUtilityProps {
  title: string;
  content: React.ReactNode;
  startIcon: React.ReactNode;
}

const CardGenUtility = ({ title, content, startIcon }: CardGenUtilityProps) => {
  const theme = useTheme();
  const aboveXs = useMediaQuery(theme.breakpoints.up("sm"));
  return (
    <Grid item lg={3} xl={3} md={4} sm={6} xs={6}>
      <Card elevation={0} sx={cardStyle}>
        <Stack direction={aboveXs ? "row" : "column"} alignItems={aboveXs?"flex-start":"normal"} sx={{ height: "100%" , width:"100%" }}>
          <Stack
            direction={"row"}
            alignItems="center"
            justifyContent={"center"}
            sx={{
              color: "rgba(82, 102, 255, 0.5)",
              height: "100%",
              paddingRight: aboveXs?2:0,
              paddingBottom:aboveXs?0:2,
              fontSize: 48,
            }}
          >
            {startIcon}
          </Stack>
          <Divider orientation={aboveXs?"vertical":"horizontal"} />
          <Box sx={{ flexGrow: 1, flexBasis: 0, maxWidth: "100%", textAlign: "center" }}>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
              {title}
            </Typography>
            {content}
          </Box>
        </Stack>
      </Card>
    </Grid>
  );
};

export default Dashboard;
