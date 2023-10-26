import { Box, Container, Link, Stack, Typography, Grid, Alert } from "@mui/material";
import HashbuzzLogo from "../../../SVGR/HashbuzzLogo";
import React from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../../Store/StoreProvider";
import { useHashconnectService } from "../../../Wallet";
import { SpeedDialActions } from "../../Components";

const Landing = () => {
  const store = useStore();
  const [cookies] = useCookies(["aSToken"]);
  const { pairingData, handleAuthenticate, authStatusLog } = useHashconnectService();
  const navigate = useNavigate();
  const ping = store?.ping;
  const pairedAccount = pairingData?.accountIds[0];

  React.useEffect(() => {
    if (cookies.aSToken && ping?.status && pairedAccount) {
      navigate("/dashboard");
    }
  }, [cookies.aSToken, navigate, pairedAccount, ping?.status]);

  React.useEffect(() => {
    if (pairedAccount && !ping?.status) {
      console.log(pairingData, "testing");
      handleAuthenticate();
    }
    // console.log(ping,pairingData?.accountIds[0])
  }, [pairedAccount, ping?.status]);

  return (
    <Box
      sx={{
        backgroundImage: `url("./images/landing-bg-2.jpg")`,
        // backgroundColor: "rgba(255, 255, 255 , 0.5)",
        // background:"linear-gradient(rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.25)), url('./images/landing-bg-2.jpg')",
        height: "100vh",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "right bottom",
        backdropFilter: "blur(20px)",
      }}
    >
      <Container>
        <Stack
          direction={"row"}
          //</Container>alignItems={"center"}
          justifyContent={"center"}
        >
          <HashbuzzLogo
            height={150}
            colors={{
              color1: "#fff",
              color2: "#fff",
            }}
          />
        </Stack>
        <Box
          sx={{
            background: "linear-gradient(rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.15))",
            p: 3,
            borderRadius: 1,
            maxWidth: 600,
            marginTop: 5,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          {pairedAccount ? (
            <Grid container>
              <Grid item sm={6} xs={12} sx={{ color: "#fff" }}>
                <Typography variant="h4">{pairedAccount}</Typography>
              </Grid>
              <Grid item sm={6} xs={12}>
                {authStatusLog.length > 0 ? (
                  <Alert severity={authStatusLog[authStatusLog.length - 1]?.type ?? "info"}>
                    {authStatusLog[authStatusLog.length - 1]?.message ?? "Message"}
                  </Alert>
                ) : null}
              </Grid>
            </Grid>
          ) : null}
          <Stack sx={{ color: "#fff" }} spacing={2}>
            <Typography variant="subtitle1">
              Imagine a world where anyone can confidently share verified information on social media. We're talkin' about a social DAO where local
              communities are incentivized to validate information from the source of origin. The current Proof of Concept (PoC) we're workin' on is
              just a stepping stone towards this bigger vision.
            </Typography>

            <Typography>
              PoC Scope: campaigners can run a Twitter promo and reward their engaged organic influencers in $hbar or from a list of whitelisted
              fungible HTS tokens.
            </Typography>

            <Typography>
              Goal: to orchestrate web2 and web3 action-based rewarding mechanism. It's all about makin' sure the right people get rewarded for doin'
              the right thing.{" "}
            </Typography>

            <Typography component={Link} href="#">
              Learn how to launch your first promo.
            </Typography>
            {/* <link> */}
            <Typography component={Link} href="#">
              Submit request to whitelist your token.
            </Typography>
            {/* <link> */}
            <Typography>Follow us for latest update and new announcements: Twitter - Discord</Typography>
          </Stack>
        </Box>
      </Container>
      <SpeedDialActions />
    </Box>
  );
};

export default Landing;
