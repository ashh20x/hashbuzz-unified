import React from "react";
import { ContainerWrapper } from "../ContainerStyled/ContainerWrapper";
import Logo from "../Logo/Logo";
import { TemplatePage } from "../Pages/TemplatePage/TemplatePage";
import {LogoutButton} from "../Buttons/LogoutButton"
export const Template = () => {
  return (
    <ContainerWrapper>
      <Logo />
      <LogoutButton/>
      <TemplatePage />
    </ContainerWrapper>
  );
};