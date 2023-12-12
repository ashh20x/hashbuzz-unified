import { Box, Container, Link, Stack, Typography, Grid, Alert } from "@mui/material";
import HashbuzzLogo from "../../../SVGR/HashbuzzLogo";
import React from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../../Store/StoreProvider";
import { useHashconnectService } from "../../../Wallet";
import { SpeedDialActions } from "../../Components";
import styled from "styled-components";

const Landing = () => {
  const store = useStore();
  const [cookies] = useCookies(["aSToken"]);
  const { pairingData, handleAuthenticate, authStatusLog } = useHashconnectService();
  const navigate = useNavigate();
  const ping = store?.ping;
  console.log(store, "Storei")
  const pairedAccount = pairingData?.accountIds[0];

  React.useEffect(() => {
    if (cookies.aSToken && ping?.status && pairedAccount) {
      navigate("/dashboard");
    }
  }, [cookies.aSToken, navigate, pairedAccount, ping?.status]);

  React.useEffect(() => {
    if (pairedAccount && !ping?.status && !cookies?.aSToken) {
      handleAuthenticate();
    }
    // console.log(ping,pairingData?.accountIds[0])
  }, [pairedAccount, ping?.status, cookies]);

  const StyledText = styled.div`
  display: flex;
  flex-direction: column;
  font-family: "Roboto","Helvetica","Arial",sans-serif !important;
  gap: 10px;
  
  p{
    width: 100%;
  word-wrap: break-word;
  }

    
  `

  return (
    <Box
      sx={{
        backgroundImage: `url("./images/landing-bg-2.jpg")`,
        // backgroundColor: "rgba(255, 255, 255 , 0.5)",
        // background:"linear-gradient(rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.25)), url('./images/landing-bg-2.jpg')",
        minHeight: "100vh",
        backgroundRepeat: "no-repeat",
        paddingBottom: "20px",
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
          <Stack sx={{ color: "rgb(255, 255, 255)" }} spacing={2}>

            <Typography variant="subtitle1">
              Welcome to a world where sharing verified information on X is as easy as sending a tweet! We're talking about a groundbreaking social DAO (Decentralized Autonomous Organization) that empowers local communities to validate information right from its source.
            </Typography>

            <Typography>
            Our current Proof of Concept (PoC) is just the beginning of this grand vision. In this PoC, campaigners can run tweet promotions and reward their dedicated influencers with either hbar or from a selection of whitelisted fungible HTS tokens.
            </Typography>

            <Typography>
            Our goal with this PoC is to create a seamless rewarding mechanism that bridges both web2 and web3. It's all about ensuring that the right individuals receive recognition for their contributions.{" "}
            </Typography>
            <Typography>
            <StyledText>


              Ready to get started? 
              <div>
              * Learn how to launch your very first promo [{" "}
              <Typography component={Link} style={{ color: "red" }}>
                here
              </Typography>
              ].

              </div>
              <div>
              * To request the whitelisting of your token, simply submit a request [
              <Typography component={Link} style={{ color: "red" }}>
                here
              </Typography>
              ].

              </div>
              <div>
              * Stay in the loop with our latest updates and announcements by following us on{" "}
              <Typography component={Link} href={"https://x.com/hbuzzs"} style={{ color: "red" }}>
                X
              </Typography>{" "}
              -{" "}
              <Typography component={Link} href={"https://discord.com/invite/Zq6UAQ63Vc"} style={{ color: "red" }}>
                Discord
              </Typography>
              .

              </div>
               {" "}
              </StyledText>


            </Typography>

            <Typography>Join us in revolutionizing the way we share and validate information on social media.</Typography>

          </Stack>
        </Box>
      </Container>
      <SpeedDialActions />
    </Box>
  );
};

export default Landing;
