import React from "react";
import { useNavigate } from "react-router-dom";
import LogoSVG from "../../SVGR/Logo";
import { LogoContainer } from "./Logo.styles";
export const Logo = () => {
  let navigate = useNavigate();

  const handleMain = () => {
    // navigate('/');   
  }
  return (
    <LogoContainer >
      <LogoSVG onClick={handleMain}/>
    </LogoContainer>
  );
};

export default Logo;
