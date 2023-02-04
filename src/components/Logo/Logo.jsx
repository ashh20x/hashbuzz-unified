import React from "react";
import { useNavigate } from "react-router-dom";
import HashbuzzLogo from "../../SVGR/HashbuzzLogo";
import LogoSVG from "../../SVGR/Logo";
import { LogoContainer } from "./Logo.styles";
export const Logo = () => {
  let navigate = useNavigate();

  const handleMain = () => {
    // navigate('/');
  };
  return (
    <LogoContainer>
      <HashbuzzLogo height={125} />
    </LogoContainer>
  );
};

export default Logo;
