import { SxProps } from "@mui/material";
import { Theme } from "@mui/system";

export const conenctWalletSection : SxProps<Theme> = {
  background: "#FFFFFF",
  padding: {
    xs: "30px",
    md: "40px",
    xl: "45px 200px",
  },
  height: "100%",
  overflowY:"auto",
};

export const header: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  "& h1": {
    fontSize: "1.5rem",
    lineHeight: 1.64,
    fontWeight: 600,
    color: "#262626",
    letterSpacing: "2%",
  },
  "& p": {
    fontSize: "1rem",
    lineHeight: 1.64,
    fontWeight: 400,
    color: "#181D27",
  },
};

export const tabsContainer: SxProps<Theme> = {
  marginTop:"2rem"
};
