import { Box, Container, Link, Stack, Typography, Grid, Alert, useTheme } from "@mui/material";
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
  const theme = useTheme();
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
    if (pairedAccount && !ping?.status && !cookies?.aSToken) {
      handleAuthenticate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pairedAccount, ping?.status, cookies]);

  const StyledText = styled.div`
    display: flex;
    flex-direction: column;
    font-family: "Roboto", "Helvetica", "Arial", sans-serif !important;
    gap: 10px;

    p {
      width: 100%;
      word-wrap: break-word;
    }
  `;

  return (
    <Box
      sx={{
        background: "linear-gradient(to right bottom, #071159, #07114d, #091140, #0b0f34, #0d0c28, #0c0a23, #0a081f, #08061a, #07051b, #05051c, #03041e, #01041f)",
        backgroundImage: `url("./images/landing-bg-2.jpg")`,
        minHeight: "100vh",
        backgroundRepeat: "no-repeat",
        // paddingBottom: "20px",
        backgroundSize: "cover",
        backgroundPosition: "right bottom",
        [theme.breakpoints.between("md", "xl")]: {
          backgroundPosition: "top right",
        },
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
            background: "linear-gradient(rgba(0, 96, 231, 0.5), rgba(80, 360, 350, 0.7))",
            p: 3,
            borderRadius: 1,
            [theme.breakpoints.up("md")]: {
              maxWidth: "900",
              width: "75%",
              marginTop: 2,
            },
            // maxWidth: 1250,
            [theme.breakpoints.up("lg")]: {
              maxWidth: 1150,
              marginTop: 3,
            },
            [theme.breakpoints.up("xl")]: {
              maxWidth: 800,
              marginTop: 5,
            },
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
                {authStatusLog.length > 0 ? <Alert severity={authStatusLog[authStatusLog.length - 1]?.type ?? "info"}>{authStatusLog[authStatusLog.length - 1]?.message ?? "Message"}</Alert> : null}
              </Grid>
            </Grid>
          ) : null}
          <Stack sx={{ color: "rgb(255, 255, 255)" }} spacing={2}>
            <Typography variant="subtitle1">
              Discover the power of hashbuzz, a dynamic platform that elevates brand communities through incentivized Xposts. By leveraging project tokens, brands can significantly boost their visibility and exposure. This approach not only enhances token adoption within the community but also transforms regular posts into viral sensations. Expect a substantial increase in overall engagement, as your audience becomes more interactive and invested in your brand's success. Additionally, hashbuzz
              drives authentic interactions, builds long-term brand loyalty, and taps into new audience segments, fostering a stronger, more vibrant community around your brand.
            </Typography>

            <Typography>In this proof of concept, campaigners can run Xpost promos and reward their dedicated influencers with either HBAR or from a selection of whitelisted fungible HTS tokens.</Typography>

            <Typography>Our goal is to create a seamless rewarding mechanism that bridges both web2 and web3. It's all about ensuring that the right individuals receive recognition for their contributions.</Typography>
            <Typography>
              <StyledText>
                Ready to get started?
                <div>
                  * Learn how to launch your very first promo [{" "}
                  <Typography component={Link} style={{ color: "red" }} href="#">
                    here
                  </Typography>
                  ].
                </div>
                <div>
                  * To request the whitelisting of your token, simply submit a request [
                  <Typography component={Link} style={{ color: "red" }} href={"https://about.hashbuzz.social/whitelist-token"}>
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
                </div>
                <div>
                  * Read our terms and conditions, and privacy policy [
                  <Typography component={Link} style={{ color: "red" }} href={"/#"}>
                    here
                  </Typography>
                  ].
                </div>
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
