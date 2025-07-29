import { SxProps, Theme } from "@mui/material";

export const sectionStyles: SxProps<Theme> = {
  border: "1px solid #DBDDFF",
  borderRadius: "8px",
  marginTop: "2rem",
};

export const content: SxProps<Theme> = {
  padding: {
    md: "36px",
    xs: "24px",
  },
  "&  p": {
    fontSize: {
      xs: "1.125rem",
      md: "1.25rem",
    },
    lineHeight: 1.64,
    fontWeight: 400,
    paragraphSpacing: "1.25rem",
    marginBottom: "2rem",
  },
  "& button": {
    width: "100%",
    display: {
      xs: "block",
      md: "none",
    },
  },
};

export const headingContent: SxProps<Theme> = {
  padding: {
    md: "36px",
    xs: "24px",
  },
  "& h4": {
    fontSize: {
      xs: "1.875rem",
      md: "2.25rem",
    },
    fontWeight: 600,
    lineHeight: 1.2,
    marginBottom: {
      xs: "0",
      md: "1rem",
    },
  },
  "& button": {
    width: "auto",
    display: {
      xs: "none",
    },
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
  height: {
    xs: "216px",
    sm: "255px",
  },
  padding: "24px",
  color: "#181D27",
  borderBottom: {
    xs: "1px solid #DBDDFF",
  },
  display: "flex",
  flexDirection: "column",
  alignItems: {
    xs: "center",
    md: "flex-start",
  },
  borderRight: { xs: "none", md: "1px solid #DBDDFF" },
  "p , h4": {
    fontSize: "1.75rem",
    marginBottom: "1rem",
    textAlign: {
      xs: "center",
      md: "left",
    },
  },
  "& h4": {
    fontWeight: 600,
    lineHeight: 1.2,
    fontSize: {
      xs: "1.5rem",
      md: "1.6875rem",
    },
    marginTop: {
      md: "1.5rem",
      xs: "2rem",
    },
  },
  "& p": {
    fontWeight: 400,
    lineHeight: 1.64,
    fontSize: {
      md: "1rem",
      xs: "1.125rem",
    },
  },
};
