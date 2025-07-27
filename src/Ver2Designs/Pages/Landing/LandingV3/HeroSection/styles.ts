import { SxProps, Theme } from "@mui/material";
import { containerStyles } from "../styles";

export const heroSectionContainer: SxProps<Theme> = {
  height: "auto",
};

export const heroSectionContentArea = (theme:Theme):SxProps<Theme> =>({
  paddingTop:"80px",
  height: "80dvh",
  background: "linear-gradient(90deg, rgb(1, 16, 73) 0%, 20.283%, rgb(13, 25, 111) 40.566%, 43.5535%, rgb(1, 32, 122) 46.5409%, 59.5912%, rgb(6, 53, 143) 72.6415%, 86.3208%, rgb(6, 38, 121) 100%)",
  backgroundImage: `url("./images/landing-v3-background.png"), linear-gradient(90deg, rgb(1, 16, 73) 0%, 20.283%, rgb(13, 25, 111) 40.566%, 43.5535%, rgb(1, 32, 122) 46.5409%, 59.5912%, rgb(6, 53, 143) 72.6415%, 86.3208%, rgb(6, 38, 121) 100%)`,
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  display: "flex",
  alignItems: "center",
  [theme.breakpoints.up("xl")]:{
    height:"74dvh",
  },
  [theme.breakpoints.up("lg")]:{
    height:"80dvh",
  },
});

export const heroSectionContent: SxProps<Theme> = {
  ...containerStyles,
  display: "flex",
  flexDirection: "column",
  color: "#fff",
  "& h1": {
    fontSize: "3.75rem",
    fontWeight: 600,
    marginBottom: '1.5rem',
    lineHeight: 1.2,
  },
  "& p": {
    fontSize: "1.25rem",
    lineHeight: 1.2,
    marginBottom: '3rem',
    width:'75%',
    fontWeight:400,
  },
};

export const howItWorksButton: SxProps<Theme> = {
  marginRight: "1rem",
  color: "#414651",
  backgroundColor: "#fff",
  textTransform:"capitalize",
  border: "none",
  borderRadius: "8px",
  "&:hover": {
    backgroundColor: "#fff",
  },
  "& .MuiButton-startIcon": {
    color: "#5265FF",
    fill: "#5265FF",
  },
};
export  const getStartedButton: SxProps<Theme> = {
  backgroundColor: "#5265FF",
  textTransform:"capitalize",
  borderRadius: "8px",
  color: "#fff",
  "&:hover": {
    backgroundColor: "#5265FF",
  },
};