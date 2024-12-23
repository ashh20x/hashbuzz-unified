import { SxProps, Theme } from "@mui/material";

export const LandingPageContainerStyles = (theme: Theme): SxProps<Theme> => ({
    background: 'linear-gradient(90deg, rgb(1, 16, 73) 0%, 20.283%, rgb(13, 25, 111) 40.566%, 43.5535%, rgb(1, 32, 122) 46.5409%, 59.5912%, rgb(6, 53, 143) 72.6415%, 86.3208%, rgb(6, 38, 121) 100%)',
    backgroundImage: `url("./images/landing-bg-2.jpg"), linear-gradient(90deg, rgb(1, 16, 73) 0%, 20.283%, rgb(13, 25, 111) 40.566%, 43.5535%, rgb(1, 32, 122) 46.5409%, 59.5912%, rgb(6, 53, 143) 72.6415%, 86.3208%, rgb(6, 38, 121) 100%)`,
    minHeight: "100vh",
    backgroundRepeat: "no-repeat",
    // paddingBottom: "20px",
    backgroundSize: "cover",
    backgroundPosition: "right bottom",
    [theme.breakpoints.between("md", "xl")]: {
        backgroundPosition: "top right",
    },
    backdropFilter: "blur(20px)",
})