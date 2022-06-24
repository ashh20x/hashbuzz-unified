import React from "react";
import { ContainerWrapper } from "../ContainerStyled/ContainerWrapper";
import { MainPage } from "../Pages/MainPage/MainPage";
import Logo from "../Logo/Logo";

export const Main = () => {
  return (
    <ContainerWrapper>
      <Logo />
      <MainPage />
    </ContainerWrapper>
  );
};


