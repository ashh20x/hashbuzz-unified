import React from "react";
import LogoSVG from "../../SVGR/Logo";
import Typography from "../../Typography/Typography";
import { Center, Logo, TextMargins } from "./MobileView.styles";

const MobileView = () => {
  const theme = {
    color: "#696969",
    size: "14px",
    weight: "600",
  };
  return (
    <Center>
      <Logo>
        <LogoSVG />
      </Logo>
      <TextMargins>
        <Typography theme={theme}>
          WebApp currently viewable on Desktop only, we are working to provide
          responsive WebApp soon
        </Typography>
      </TextMargins>
    </Center>
  );
};

export default MobileView;
