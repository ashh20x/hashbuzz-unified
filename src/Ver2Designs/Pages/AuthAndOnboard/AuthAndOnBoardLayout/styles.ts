import { SxProps, Theme } from "@mui/material";

export const authAndOnBoardLayoutStyles: SxProps<Theme> = {
  // display: "grid",
  height: "100dvh",
  overflowY: "auto"
};

export const stepsMobileHeaderStyles: SxProps<Theme> = {
  height: "64px",
  padding: '10px 1.5rem',
  borderBottom: "1px solid #E0E0E0",
  boxShadow:(theme) => theme.shadows[1],
  position: "sticky",
  top: 0,
  zIndex: 2,
  backgroundColor: "#fff"
}


