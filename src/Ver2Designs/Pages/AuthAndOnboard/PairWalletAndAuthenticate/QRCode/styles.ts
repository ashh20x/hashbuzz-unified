import { SxProps, Theme } from "@mui/material";

export const qrCodeSection: SxProps<Theme> = {
  background: "#F9FAFF",
  border: "1px solid #E9EAFF",
  padding: {
    xs: "1rem",
    sm: "1.5rem",
    md: "3rem 45px",
  },
  borderRadius: "8px",
  marginBottom: "1rem",
  marginTop: "1rem",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  "& img": {
    maxWidth: "100%",
    borderRadius: "8px",
  },
  "& p": {
    fontSize: "1.125rem",
    lineHeight: "1.5",
    marginBottom: "1rem",
    width: {
      xs: "100%",
      sm: "80%",
      md: "65%",
    },
    textAlign: "center",
    color: "#181D27",
  },
};

export const qrCodeImageContainer: SxProps<Theme> = {
  display: "flex",
  width: "294px",
  height: "294px",
  border: "4px solid #FFF",
  borderRadius: "8px",
};

export const connectionStringcontainer: SxProps<Theme> = {
  width: "294px",
  height: "294px",
  background: "#E9EAFF",
  borderRadius: "8px",
  alignItems: "center",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  gap: ".5rem",
  "& label": {
    fontSize: "0.75rem",
    fontWeight: 600,
    color: "#181D27",
  },
  "& input": {
    background: "transparent",
    border: "none",
    outline: "none",
    textAlign: "center",
    color: "#181D27",
    maxWidth: "75%",
    fontSize: "0.875rem",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
};

export const qrAndStringWrapper: SxProps<Theme> = {
  marginTop:'2rem',
  gap: {
    xs: "2rem",
    sm: "1rem",
    md: 0
  },
  "&  p": {
    width: "max-content",
    fontSize: "1.125rem",
    fontWeight: 600,
    margin: {
      xs: "1rem 0",
      sm: "0 1rem",
      md: "0 3rem"
    }
  },
};
