import { Box, Button, Container, Divider, Grid, Stack, Typography } from "@mui/material";
// import { DashboardHeader } from ;
import React from "react";
import { DashboardHeader } from "../../Components";
import AddNewTokenModal from "./AddNewTokenModal";

const AdminDashboard = () => {
  const [tokenModalOpen, setTokenModalOpen] = React.useState(false);
  
  return (
    <Box
      sx={{
        background: "hsl(0, 0%, 95%)",
        minHeight: "100vh",
      }}
    >
      <Container maxWidth="xl">
        <DashboardHeader />
        <Box>
          <Grid container spacing={2} sx={{ backgroundColor: "#E1D9FF", borderRadius: 2 }}>
            <Grid md={6}>
              <Box sx={{ padding: 2.2 }}>
                <Typography variant="h4" sx={{ marginBottom: 2 }}>
                  Pending Cards
                </Typography>
                <Divider />
              </Box>
              <Box></Box>
            </Grid>
            <Grid md={6}>
              <Box sx={{ padding: 2.2 }}>
                <Stack direction={"row"} justifyContent={"space-between"} alignItems="flex-start">
                  <Typography variant="h4" sx={{ marginBottom: 2 }}>
                    Whitelisted Tokens
                  </Typography>
                  <Button disableElevation size="small" variant="contained" onClick={() => setTokenModalOpen(true)}>
                    Add New
                  </Button>
                </Stack>
                <Divider />
              </Box>
              <Box></Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
      <AddNewTokenModal open={tokenModalOpen} onClose={() => setTokenModalOpen(false)} />
    </Box>
  );
};

export default AdminDashboard;
