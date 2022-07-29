import React from "react";
import { ContainerWrapper } from "../ContainerStyled/ContainerWrapper";
import Logo from "../Logo/Logo";
import {TwitterCardScreen} from "../Pages/AdminScreen/TwitterCardList";
import { LogoutButton } from "../Buttons/LogoutButton"
export const AdminPanel = () => {
  return (
    <ContainerWrapper>
      <Logo />
      <LogoutButton/>
      <TwitterCardScreen />
    </ContainerWrapper>
  );
};
