import { SxProps, Theme } from "@mui/material";
export const associateTokensStyles: SxProps<Theme> = {
  background: "#FFFFFF",
  padding: {
    xs: "24px 16px",
    md: "40px",
    xl: "45px 200px",
  },
  height: "100dvh",
  overflowY: "auto",
};

export const associateTokenWrapper: SxProps<Theme> = {
  height: "calc(100dvh - 180px)",
  overflowY: "auto",
};

export const listContainer: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  padding: "1rem 2rem",
  border: "1px solid #E9EAFF",
  borderRadius: "8px",
  marginTop: "2rem",
  "& h4": {
    fontSize: "1.25rem",
    lineHeight: 1.64,
    fontWeight: 500,
  },
};

export const tokensListItem: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  padding: "12px 0",
  background: "#FFFFFF",
  borderBottom: "1px solid #eee",
  "&:last-child": {
    borderBottom: "none",
  },
  "& .tokenIIcons": {
    marginRight: "1.5rem",
    "& span": {
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      background: "#E4E7FF",
      display: "flex",
      alignItems: "center",
      fontSize: "0.85rem",
      justifyContent: "center",
    },
  },
  "& .tokenDetails": {
    "& h4": {
      fontSize: "1rem",
      lineHeight: 1.5,
      fontWeight: 500,
    },
    "& p": {
      fontSize: "0.875rem",
      lineHeight: 1.5,
      color: "#666",
    },
  },
  "& .linkOrStatus": {
    marginLeft: "auto",
  }
};


export const associateTokenFooter: SxProps<Theme> = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "80px",
}