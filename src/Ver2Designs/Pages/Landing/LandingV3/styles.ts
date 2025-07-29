import { SxProps, Theme } from "@mui/material";
export const LandingPageContainerStyles = (theme: Theme): SxProps<Theme> => ({
  padding: 0,
  margin: 0,
  background: "#ababac",
  position: "relative",
});

export const containerStyles: SxProps<Theme> = {
  width: {
    xs: "100%",
    sm: "90%",
    md: "80%",
    lg: "76%",
  },
  padding: {
    xs: "0 12px",
    sm: "0 24px",
    md: "0 24px",
    lg: "0 24px",
  },
  margin: {
    xs: 0,
    md: "0 auto",
  },
};
