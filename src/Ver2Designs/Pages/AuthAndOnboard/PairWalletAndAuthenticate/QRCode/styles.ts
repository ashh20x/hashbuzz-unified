import { SxProps, Theme } from "@mui/material";

export const qrCodeSection: SxProps<Theme> = {
  background: "#F9FAFF",
  border: "1px solid #E9EAFF",
  padding: "1rem",
  borderRadius: "8px",
  marginBottom: "1rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  "& img": {
    maxWidth: "100%",
    borderRadius: "8px",
  },
};

export const qrCodeImageContainer: SxProps<Theme> = {
    display: "flex",
}

export const connectionStringcontainer: SxProps<Theme> = {
    display: "flex",
}