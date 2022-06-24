import React from "react";
import { ContainerWrapper } from "../ContainerStyled/ContainerWrapper";
import Logo from "../Logo/Logo";
import {CreateTwitterPage} from "../Pages/CreateCard/CreateTwitterPage";

export const CreateTwitterCard = () => {
  return (
    <ContainerWrapper>
      <Logo />
      <CreateTwitterPage />
    </ContainerWrapper>
  );
};

