import { SxProps, Theme } from "@mui/material";
import { containerStyles } from "../styles";

export const howToStartSection: SxProps<Theme> = {
  backgroundColor: "#ffffff",
  padding: "3rem 0",
};

export const hoTOStartSectionContainer: SxProps<Theme> = {
  ...containerStyles,
  "& h3": {
    fontSize: "2.75rem",
    fontWeight: 600,
    lineHeight: 1.2,
    marginBottom: "2rem",
    textAlign: "center",
    color: "#181D27",
  },
  "& button": {
    display:"inline-block",
    alignSelf: "center",
    margin:"0 auto",
    marginTop: "2rem",
  } 
};

export const howToStartSteps: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  padding: "24px",
  height: "330px",
  borderRadius: "8px",
  border: "1px solid #DDE0F4",
  backgroundColor: "#F9FAFF",
  "& p": {
    color: "#5265FF",
    fontSize: "1rem",
    fontWeight: 600,
    lineHeight: 1.5,
  },
};

export const howToStartStepsContent: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  "& span": {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "75px",
    height: "75px",
    borderRadius: "50%",
    backgroundColor: "#FFFFFF",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.05)",
    marginBottom: "1.4rem",
  },
};

export const startsNowBtn: SxProps<Theme> = {
  backgroundColor: "#5265FF",
  textTransform: "capitalize",
  borderRadius: "8px",
  color: "#fff",
  "&:hover": {
    backgroundColor: "#5265FF",
  },
};
