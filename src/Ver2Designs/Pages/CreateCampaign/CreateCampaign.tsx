import React from "react";
import { Grid, Stack, TextField, Typography } from "@mui/material";
import TwitterTextField from "./CreateInputBox";

const CreateCampaign = () => {
  return (
    <Grid container spacing={2}>
      <Grid item lg={6}>
        <Stack spacing={2}>
          <TextField label="Campaign Title" fullWidth type="text" />
          <TwitterTextField />
        </Stack>
      </Grid>
      <Grid item lg={6}>
        <Stack spacing={2}>
          <Typography>Preview Tweet</Typography>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default CreateCampaign;
