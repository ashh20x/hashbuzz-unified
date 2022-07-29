import React from "react";
import { ContainerWrapper } from "../ContainerStyled/ContainerWrapper";
import Logo from "../Logo/Logo";
import { CreateTwitterPage } from "../Pages/CreateCard/CreateTwitterPage";
import { LogoutButton } from "../Buttons/LogoutButton"

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

