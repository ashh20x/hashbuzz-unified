import { SxProps, Theme } from "@mui/material";
import { containerStyles } from "../styles";

export const contentContainer: SxProps<Theme> = {
  ...containerStyles,
  height:{
    xs: "auto",
    sm: "420px",
  }
};

export const NexAndSecurityProviderSection = (theme: Theme): SxProps<Theme> => ({
  backgroundColor: "#000120",
  padding: 0,
  position: "relative",
  "& hr": {
    position: "absolute",
    backgroundColor: "#fff",
    opacity: 0.3,
    width: "1px",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  "& hr.vertical ": {
    height: "100%",
    bottom: 0,
    top: 0,
    left: "calc(13% + calc(74% / ( 12/8)) + 8px)",
  },
  "& hr.horizonatal": {
    top: "50%",
    right: 0,
    height: "1px",
    width: "calc(13% + calc(74% / ( 12/4)) - 8px)",
  },
});

export const content = (theme: Theme): SxProps<Theme> => ({
  height: "420px",
  "& h2": {
    color: "#939DEC",
    fontSize: "1rem",
    fontWeight: 600,
    marginBottom: "2.2rem",
    marginTop: "60px",
    [theme.breakpoints.down("sm")]: {
      marginTop: "45px",
    },
  },
  "& p": {
    color: "#fff",
    fontSize: "2rem",
    lineHeight: 1.2,
    fontWeight: 500,
    width: "90%",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      fontSize: "1.875rem",
      marginBottom: "2rem",
      letterSpacing: "2%",
      lineHeight: 1.5,
    },
  },
  "& .certik-emblem": {
    width: "auto !impoertant",
  },
  [theme.breakpoints.down("sm")]: {
    height: "auto",
  },
});

export const networkIcons = (theme: Theme): SxProps<Theme> => ({
  height: "100%",
  [theme.breakpoints.down("sm")]: {
    height: "calc(186px * 2 + 2px)",
    "& .built-on-hedera, .security-certificate": {
      height: "186px",
    },
    "& .built-on-hedera": {
      borderTop: "1px solid #E9E9E952",
      borderBottom: "1px solid #E9E9E952",
    },
    "& .security-certificate": {
      marginLeft: "-80px",
    },
  },
});
