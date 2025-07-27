import { SxProps, Theme } from "@mui/material";
import { containerStyles } from "../styles";

export const NexAndSecurityProviderSection: SxProps<Theme> = {
  backgroundColor: "#000120",
  padding: 0,
 
  position: "relative",
  "& hr": {
    position: "absolute",
    backgroundColor: "#fff",
    opacity: 0.3,
    width: "1px",
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
};

export const contentContainer: SxProps<Theme> = {
  ...containerStyles,
   height: "420px",
};

export const content: SxProps<Theme> = {
  height: "420px",
  "& h2": {
    color: "#939DEC",
    fontSize: "1rem",
    fontWeight: 600,
    marginBottom: "2.2rem",
    marginTop: "60px",
  },
  "& p": {
    color: "#fff",
    fontSize: "2rem",
    lineHeight: 1.2,
    fontWeight: 500,
    width:"90%"
  },
  "& .certik-emblem": {
    width:"auto !impoertant",
  }
};
