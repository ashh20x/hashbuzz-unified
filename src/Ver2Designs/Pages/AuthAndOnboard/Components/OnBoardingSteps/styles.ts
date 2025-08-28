import { SxProps, Theme } from "@mui/system";

export const sideBar: SxProps<Theme> = {
  width: {
    xs: "100%",
    sm: "100%",
    md: "392px"
  },
  paddingLeft: {
    xs: '2rem',
    sm: '2rem',
    md: '45px'
  },
  paddingRight: {
    xs: '2rem',
    sm: '2rem',
    md: "1rem",
  },
  background:{
    xs: "#FFFFFF",
    sm: "#FFFFFF",
    md: "#F5F6FF"
  }
 
};

export const sideBarLogoContainer: SxProps<Theme> = {
  display: "flex",
  alignItems: {
    xs: "flex-start",
    sm: "flex-start",
    md: "center"
  },
  justifyContent: "flex-start",
  flexDirection: {
    xs: "column",
    sm: "column",
    md: "row"
  },
  paddingTop: {
    xs: "1rem",
    sm: "1rem",
    md: "45px",
  },
  marginBottom: {
    xs: "2rem",
    sm: "2rem",
    md: "auto",
  },
   "& p":{
    margin:'2rem 0',
    fontSize: "1rem",
    fontWeight: 500,
    color:'#181D27'
  }
};

export const stepsList: SxProps<Theme> = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: {
    xs: "flex-start",
    sm: "flex-start",
    md: "center"
  },
  flexDirection: "column",
  "& ul": {
    display: "flex",
    flexDirection: "column",
    gap: "65px",
    listStyle: "none",
    padding: 0,
    margin: 0,
    paddingInlineStart: "0px",
    "& li": {
      display: "flex",
      alignItems: "center",
      gap: "1rem",
      lineHeight: 1.5,
      fontSize: "1rem",
      fontWeight: 600,
      position: "relative",
      color: "#767676",
      "& .list-bullet": {
        width: "32px",
        height: "32px",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFFFFF",
        border: "1px solid #E2E2E2",
      },
      "&.active": {
        color: "#5265FF",
        "& .list-bullet": {
          backgroundColor: "#5265FF",
          color: "#FFFFFF",
          borderColor: "#5265FF",
        },
      },
      "&::after": {
        content: `""`,
        position: "absolute",
        height: "30px",
        width: "2px",
        borderLeft: "1px dashed  #767676",
        left: "15px",
        top: "52px",
      },
      "&:last-child::after": {
        display: "none",
      },
    },
  },
};
