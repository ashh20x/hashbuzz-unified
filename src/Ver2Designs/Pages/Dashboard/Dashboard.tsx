import { Box, Card, Container, Grid, Stack } from "@mui/material";
import React from "react";
import HashbuzzLogo from "../../../SVGR/HashbuzzLogo";

import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";
import { useStore } from "../../../Providers/StoreProvider";
import { User } from "../../../APIConfig/api";

const columns: GridColDef[] = [
  { field: "col1", headerName: "Campaign Name", width: 150 },
  { field: "col2", headerName: "Campaign stats", width: 150 },
  { field: "col1", headerName: "Campaign Budget", width: 150 },
  { field: "col2", headerName: "Amount Spent", width: 150 },
  { field: "col2", headerName: "Amount Claimed", width: 150 },
  { field: "col2", headerName: "Actions", width: 150 },
];

const Dashboard = () => {
  const store = useStore()!;

  React.useEffect(() => {
    (async () => {
      const currentUser = await User.getCurrentUser();
      store.updateState((perv) => ({ ...perv, currentUser }));
    })();
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
        <Box
          sx={{
            marginTop: 4,
            marginBottom: 2,
          }}
        >
          <DataGrid rows={[]} columns={columns} />
        </Box>
      </Container>
    </Box>
  );
};

export default Dashboard;
