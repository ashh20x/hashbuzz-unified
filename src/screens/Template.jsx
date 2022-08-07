import React from "react";
import { ContainerWrapper } from "../components/ContainerStyled/ContainerWrapper";
import Logo from "../components/Logo/Logo";
import { TemplatePage } from "../components/Pages/TemplatePage/TemplatePage";
import {LogoutButton} from "../components/Buttons/LogoutButton"
export const Template = () => {
  return (
    <ContainerWrapper>
      <Logo />
      <LogoutButton/>
      <TemplatePage />
    </ContainerWrapper>
  );
};