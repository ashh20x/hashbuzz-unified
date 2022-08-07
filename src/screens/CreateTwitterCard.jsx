import React from "react";
import { ContainerWrapper } from "../components/ContainerStyled/ContainerWrapper";
import Logo from "../components/Logo/Logo";
import { CreateTwitterPage } from "../components/Pages/CreateCard/CreateTwitterPage";
import { LogoutButton } from "../components/Buttons/LogoutButton"

export const CreateTwitterCard = () => {
  return (
    <ContainerWrapper>
      {/* <Loader></Loader> */}
      <Logo />
      <LogoutButton/>
      <CreateTwitterPage />
    </ContainerWrapper>
  );
};

