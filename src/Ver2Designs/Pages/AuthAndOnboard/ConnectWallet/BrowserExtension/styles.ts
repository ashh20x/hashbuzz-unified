import { SxProps, Theme } from "@mui/material";

export const browserExtensionContainer: SxProps<Theme> = {
  padding: "1rem 0",
};

export const stepContainer: SxProps<Theme> = {
  background: "#F9FAFF",
  border: "1px solid #E9EAFF",
  padding: "1rem 1rem",
  borderRadius: "8px",
  marginBottom: "1rem",
  "& .counter": {
    height: "100%",
    display: "flex",
    alignItems: "center",
    width: "80px",
    "& span": {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      fontSize: "1.125rem",
      fontWeight: 400,
      background: "#E4E7FF",
      color: "#5265FF",
    },
  },
  "& .content": {
    flexGrow: "1",
    flexBasis: "0",
    maxWidth: "100%",
    "& h3": {
      fontSize: "1.25rem",
      lineHeight: 1.64,
      marginBottom: ".25rem",
      color: "#181D27",
      fontWeight: 600,
    },
    "& p": {
      fontSize: "1.125rem",
      fontWeight: 400,
      lineHeight: 1.2,
      color: "#181D27",
    },
  },
  "& .linkOrStatus": {
    display: "inline-flex",
    flexDirection: "flex-end",
    "& a": {
      color: "#5265FF",
      textDecoration: "underline",
      fontSize: "1rem",
      display: "inline-flex",
      alignItems: "center",
      "& span": {
        display: "inline-block",
        marginLeft: "1rem",
      },
    },
  },
};

export const connectWalletBtnContainer: SxProps<Theme> = {
  "& button": {
    marginTop: "2rem",
    backgroundColor: "#5265FF",
    textTransform: "capitalize",
    borderRadius: "8px",
    color: "#fff",
    "&:hover": {
      backgroundColor: "#5265FF",
    },
  },
};
