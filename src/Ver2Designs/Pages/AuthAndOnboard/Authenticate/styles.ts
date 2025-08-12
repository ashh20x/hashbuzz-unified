import { SxProps, Theme } from "@mui/material";

export const authicateContainer: SxProps<Theme> = {
  background: "#FFFFFF",
  padding: {
    xs: "24px 16px",
    md: "40px",
    xl: "45px 200px",
  },
  height: "100%",
  overflowY: "auto",
};

export const authenticateContent: SxProps<Theme> = {
  marginTop: "60px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "24px",
  padding: "24px",
  borderRadius: "8px",
  "& button": {
    marginTop: "40px",
  },
  "& h2":{
    fontSize: "1.5rem",
    fontWeight: 600,
    lineHeight: 1.5,
    color: "#262626",
  },
  "&  p": {
    fontSize: "1rem",
    fontWeight: 400,
    lineHeight: 1.5,
    color: "#262626",
    textAlign: "center",
    width:"60%"
  }
};

export const walletDisplayContainer: SxProps<Theme> = {
  display: "flex",
  gap: "24px",
  background: "#F9FAFF",
  padding: 2,
  borderRadius: "8px",
};
