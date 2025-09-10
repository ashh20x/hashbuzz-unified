import React from 'react';
import { ContainerWrapper } from '../components/ContainerStyled/ContainerWrapper';
import { MainPage } from '../components/Pages/MainPage/MainPage';
import Logo from '../components/Logo/Logo';
export const Main = () => {
  return (
    <ContainerWrapper>
      <Logo />
      <MainPage />
    </ContainerWrapper>
  );
};
