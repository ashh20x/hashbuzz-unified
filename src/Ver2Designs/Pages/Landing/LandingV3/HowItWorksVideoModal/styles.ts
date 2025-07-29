import { SxProps, Theme } from "@mui/material";

export const howItWorksVideoModalContainer: SxProps<Theme> = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 2,
  borderRadius: 2,
  minWidth: 320,
  maxWidth: 600,
};

export const videoIframeStyles: SxProps<Theme> = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  border: 0,
};
