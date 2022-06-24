import React from "react";
import { CardContainer, IconWrapper, TextWrapper } from "./Card.styles";
import WalletSVG from "../../SVGR/Wallet";
import Typography from "../../Typography/Typography";
export const Card = ({ title, icon}) => {
  const theme = {
    color: "#696969",
    size: "14px",
    weight: "600",
  };

  return (
   
    <CardContainer >
      <IconWrapper>{icon}</IconWrapper>
      <TextWrapper>
        <Typography theme={theme}>{title}</Typography>
      </TextWrapper>
    </CardContainer>
  );
};

export default Card;
