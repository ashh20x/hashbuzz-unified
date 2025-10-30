import { ContainerWrapper } from '../components/ContainerStyled/ContainerWrapper';
import Logo from '../components/Logo/Logo';
import { OnBoardingPage } from '../components/Pages/OnBoardingPage/OnBoardingPage';

export const OnBoarding = () => {
  return (
    <ContainerWrapper>
      <Logo />
      <OnBoardingPage />
    </ContainerWrapper>
  );
};
