import React from 'react';
import Logo from '../components/Logo/Logo';
import { TwitterCardScreen } from '../components/Pages/AdminScreen/TwitterCardList';
import { LogoutButton } from '../components/Buttons/LogoutButton';
import { ContainerWrapper } from '../components/ContainerStyled/ContainerWrapper';
export const AdminPanel = () => {
  return (
    <ContainerWrapper>
      <Logo />
      <LogoutButton />
      <TwitterCardScreen />
    </ContainerWrapper>
  );
};
