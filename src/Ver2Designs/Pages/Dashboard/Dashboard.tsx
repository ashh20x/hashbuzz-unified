import { Box, Card, Container, Grid, Stack } from "@mui/material";
import React from "react";
import HashbuzzLogo from "../../../SVGR/HashbuzzLogo";
const Dashboard = () => {
  const [data , setData] = React.useState()
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
        <Grid container spacing={2}>
          {[...new Array(6)].map((d, i) => (
            <Grid item lg={3}>
              <Card
                elevation={0}
                sx={{
                  height: 100,
                  backgroundColor: "#E1D9FF",
                  // background: "rgb(241,241,241)",
                  // background: "linear-gradient(190deg, rgba(241,241,241,1) 0%, rgba(255,255,255,1) 35%, rgba(225,217,255,1) 100%)",
                  // background: "radial-gradient(circle, rgba(225,217,255,1) 0%, rgba(255,255,255,1) 100%)",
                }}
              ></Card>
            </Grid>
          ))}
        </Grid>
        <Box></Box>
      </Container>
    </Box>
  );
};

export default Dashboard;
