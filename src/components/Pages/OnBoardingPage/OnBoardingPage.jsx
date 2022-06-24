import React from "react";
import { HeaderText, Connect } from "./OnBoardingPage.style";
import { useNavigate } from "react-router-dom";
import Typography from "../../../Typography/Typography";
import Card from "../../Card/Card";
import TwitterSVG from "../../../SVGR/Twitter";
import PrimaryButton from "../../Buttons/PrimaryButton";
import { ContainerStyled } from "../../ContainerStyled/ContainerStyled";

export const OnBoardingPage = () => {
  const theme = {
    color: "#696969",
    size: "18px",
    weight: "600",
  };
  let navigate = useNavigate();

  const handleClaim = () => {
    navigate("/invoice");
  };
  return (
    <ContainerStyled align="center">
      <HeaderText>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc eu iaculis
        urna, nec vestibulum elit. Praesent quam risus, varius vel venenatis
        non, elementum at sapien. Maecenas feugiat dictum tortor, in tincidunt
        metus dignissim eget. Pellentesque quis tincidunt quam. Integer a nibh
        nec ante imperdiet vehicula. Duis ac velit vel nulla pellentesque porta
        vel vel massa. Quisque tellus ante, ultricies vel ipsum id, bibendum
        suscipit mi. Nunc ullamcorper dolor tortor, vitae bibendum lectus
        elementum convallis. Praesent quam nisl, pellentesque ac massa placerat,
        tempus fermentum ligula. Nulla facilisi. Praesent consectetur dapibus
        interdum.
      </HeaderText>
      <Card title="Enter Personal Twitter Handle" icon={<TwitterSVG />} />
      <Connect>
        <Typography theme={theme}>
          You have accumulated xxh while engaging with Ibiza campaigns on
          Twitter
        </Typography>
      </Connect>
      <PrimaryButton text="Claim" variant="contained" onclick={handleClaim} />
    </ContainerStyled>
  );
};
