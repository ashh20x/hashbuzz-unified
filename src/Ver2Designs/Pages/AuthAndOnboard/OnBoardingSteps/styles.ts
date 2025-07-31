import { SxProps, Theme } from "@mui/system";

export const sideBar: SxProps<Theme> = {
  width: "392px",
  paddingLeft: "45px",
  paddingRight:"1rem",
  background: "#F5F6FF",
};

export const sideBarLogoContainer: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  paddingTop: "45px",
};


export const stepsList: SxProps<Theme> = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "center",
  flexDirection:"column",
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
      fontWeight:600,
      position:"relative",
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
      "&::after":{
        content: `""`,
        position:"absolute",
        height:"30px",
        width:"2px",
        border:"1px dashed  #767676",
        left:"15px",
        top:"52px"
      },
      "&:last-child::after":{
        display:"none"
      }
    },
  },
};