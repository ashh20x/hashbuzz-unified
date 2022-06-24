import React from "react";
import { ContainerWrapper } from "../ContainerStyled/ContainerWrapper";
import Logo from "../Logo/Logo";
import { TemplatePage } from "../Pages/TemplatePage/TemplatePage";

export const Template = () => {
  return (
    <ContainerWrapper>
      <Logo />
      <TemplatePage />
    </ContainerWrapper>
  );
};