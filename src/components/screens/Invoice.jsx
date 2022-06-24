import React from "react";
import { ContainerWrapper } from "../ContainerStyled/ContainerWrapper";
import Logo from "../Logo/Logo";
import { InvTranPage } from "../Pages/InvTranPage/InvTranPage";

export const Invoice = () => {
  return (
    <ContainerWrapper>
      <Logo />
      <InvTranPage />
    </ContainerWrapper>
  );
};