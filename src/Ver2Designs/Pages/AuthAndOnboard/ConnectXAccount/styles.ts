import { SxProps, Theme } from "@mui/material";
import { dir } from "console";

export const connectXAccountStyles: SxProps<Theme> = {
  background: "#FFFFFF",
  padding: {
    xs: "24px 16px",
    md: "40px",
    xl: "45px 200px",
  },
  height: "100dvh",
  overflowY: "auto",
};

export const sectionTopContent: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  gap: "2rem",
  marginTop: "2rem",
  paddingBottom: "2rem",
  borderBottom: "1px solid #E9E9E9",
  "& >  p": {
    fontSize: "1.125rem",
    fontWeight: 500,
    lineHeight: 1.6,
    width: "80%",
  },
};

export const linkIconStackContainer: SxProps<Theme> = {
};

export const sectionBottomContent: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  padding: "3rem 0",
  "& h4": {
    fontSize: "1rem",
    lineHeight: 1.5,
    fontWeight: 500,
    marginBottom: "1rem",
  },
  "& ul": {
    listStyleType: "none",
    paddingLeft: 0,
    display: "flex",
    alignItems: "flex-start",
    flexDirection: "column",
    gap: "1rem",
    "& li": {
      display: "flex",
      alignItems: "center",
      fontSize: "1rem",
      gap: "1rem",
      fontWeight: 400,
      lineHeight: 1.5,
      color: "#181D27",
    },
  },
};

export const alertInfoContainer: SxProps<Theme> = {
  marginTop: "1rem",
  background: "#F9FAFF",
  width: "max-content",
  padding:".5rem 1rem",
  borderRadius: "8px",
}