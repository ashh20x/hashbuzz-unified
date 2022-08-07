import React from "react";
import { ContainerWrapper } from "../components/ContainerStyled/ContainerWrapper";
import Logo from "../components/Logo/Logo";
import { InvTranPage } from "../components/Pages/InvTranPage/InvTranPage";

export const Invoice = () => {
  return (
    <ContainerWrapper>
      <Logo />
      <InvTranPage />
    </ContainerWrapper>
  );
};