import { SxProps, Theme } from "@mui/material";

export const browserExtensionContainer: SxProps<Theme> = {
  padding: "1rem 0",
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
