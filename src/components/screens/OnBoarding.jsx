import { ContainerWrapper } from "../ContainerStyled/ContainerWrapper";
import Logo from "../Logo/Logo";
import { OnBoardingPage } from "../Pages/OnBoardingPage/OnBoardingPage";

export const OnBoarding = () => {
  return (
    <ContainerWrapper>
      <Logo />
      <OnBoardingPage />
    </ContainerWrapper>
  );
};

