import { Box, Button, Container, Divider, Grid, Stack, Typography, Avatar, Card } from "@mui/material";
// import { DashboardHeader } from ;
import React from "react";
import { unstable_batchedUpdates } from "react-dom";
import { useApiInstance } from "../../../APIConfig/api";
import { AllTokensQuery } from "../../../types";
import { DashboardHeader } from "../../Components";
import AddNewTokenModal from "./AddNewTokenModal";

const AdminDashboard = () => {
  const [tokenModalOpen, setTokenModalOpen] = React.useState(false);
  const [listedTokens, setListedTokens] = React.useState<AllTokensQuery | null>(null);

  const { Admin } = useApiInstance();

  React.useEffect(() => {
    (async () => {
      const data = await Admin.getListedTokens();
      setListedTokens(data);
      // console.log(request);
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
                <Grid container spacing={1} sx={{ marginTop: 2 }}>
                  {listedTokens?.data && listedTokens.data.length > 0
                    ? listedTokens.data.map((token) => {
                        const tokenInfo = token.tokendata;
                        return (
                          <Grid item md={6}>
                            <Box sx={{ display: "flex", alignItems: "center", padding: 1 }} component={Card}>
                              <Avatar variant="rounded">{tokenInfo.symbol}</Avatar>
                              <Stack spacing={0.5} sx={{ marginLeft: 2 }}>
                                <Typography fontWeight={700}>{tokenInfo.name}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Id:{tokenInfo.token_id} | Treasury Id: {tokenInfo.treasury_account_id}
                                </Typography>
                              </Stack>
                            </Box>
                          </Grid>
                        );
                      })
                    : null}
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
      <AddNewTokenModal
        open={tokenModalOpen}
        onClose={(data) => {
          unstable_batchedUpdates(() => {
            setTokenModalOpen(false);
            if (data)
              setListedTokens((_d) => {
                if (_d) {
                  _d.data = [..._d.data, data];
                  return { ..._d };
                } else return null;
              });
          });
        }}
      />
    </Box>
  );
};

export default AdminDashboard;
