import React from "react";
import { ContainerWrapper } from "../ContainerStyled/ContainerWrapper";
import Logo from "../Logo/Logo";
import {CreateTwitterPage} from "../Pages/CreateCard/CreateTwitterPage";
import {Loader} from "../Loader/Loader"

export const CreateTwitterCard = () => {
  return (
    <ContainerWrapper>
      {/* <Loader></Loader> */}
      <Logo />
      <CreateTwitterPage />
    </ContainerWrapper>
  );
};

