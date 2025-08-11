import { Box, Card, Divider, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import React from "react";

interface CardGenUtilityProps {
  title: string;
  content: React.ReactNode;
  startIcon: React.ReactNode;
}

export const cardStyle = {
  height: 130,
  backgroundColor: "#E1D9FF",
  p: 2,
  border: 3,
  borderColor: "hsl(252, 100%, 88%)",
};

export const CardGenUtility = ({ title, content, startIcon }: CardGenUtilityProps) => {
  const theme = useTheme();
  const aboveXs = useMediaQuery(theme.breakpoints.up("sm"));
  return (
    <Grid size={{ xs: 6, sm: 6, xl: 3, lg: 3 }}>
      <Card elevation={0} sx={cardStyle}>
        <Stack direction={aboveXs ? "row" : "column"} alignItems={aboveXs ? "flex-start" : "normal"} sx={{ height: "100%", width: "100%"}}>
          <Stack
            direction={"row"}
            alignItems="center"
            justifyContent={"center"}
            sx={{
              color: "rgba(82, 102, 255, 0.5)",
              height: "100%",
              paddingRight: aboveXs ? 2 : 0,
              paddingBottom: aboveXs ? 0 : 2,
              fontSize: 48,
            }}
          >
            {startIcon}
          </Stack>
          <Divider orientation={aboveXs ? "vertical" : "horizontal"} />
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
