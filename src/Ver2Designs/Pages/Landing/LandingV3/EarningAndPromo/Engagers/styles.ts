import { SxProps, Theme } from "@mui/material";

export const earningAndPromoSection: SxProps<Theme> = {
  border: "1px solid #DBDDFF",
  borderRadius: "8px",
};

export const content: SxProps<Theme> = {
  padding: "36px",
  "&  p": {
    fontSize: "1.375rem",
    lineHeight: 1.64,
    fontWeight: 400,
    paragraphSpacing: "1.25rem",
    marginBottom: "2rem",
  },
};

export const headingConetnt: SxProps<Theme> = {
  padding: "36px",
  "& h4": {
    fontSize: "2.25rem",
    fontWeight: 600,
    lineHeight: 1.2,
    marginBottom: "1rem",
  },
  "& button": {
    width: "auto",
  },
};

export const startNowBtn: SxProps<Theme> = {
  backgroundColor: "#5265FF",
  textTransform: "capitalize",
  borderRadius: "8px",
  color: "#fff",
  "&:hover": {
    backgroundColor: "#5265FF",
  },
};

export const infoIconsSection: SxProps<Theme> = {
  backgroundColor: "#F5F6FF",
  borderBottomLeftRadius: "8px",
  borderBottomRightRadius: "8px",
  overflow: "hidden",
};

export const infoIconsContainer: SxProps<Theme> = {
  height: "255px",
  padding: "24px",
  color: "#181D27",
  "p , h4": {
    fontSize: "1.75rem",
    marginBottom: "1rem",
  },
  "& h4": {
    fontWeight: 600,
    lineHeight: 1.2,
    fontSize: "1.75rem",
    marginTop: "1rem",
  },
  "& p": {
    fontWeight: 400,
    lineHeight: 1.64,
    fontSize: "1.125rem",
  },
};
