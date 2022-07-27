import React from "react";
import { ContainerWrapper } from "../ContainerStyled/ContainerWrapper";
import Logo from "../Logo/Logo";
import {TwitterCardScreen} from "../Pages/AdminScreen/TwitterCardList";

export const AdminPanel = () => {
  return (
    <ContainerWrapper>
      <Logo />
      <TwitterCardScreen />
    </ContainerWrapper>
  );
};
