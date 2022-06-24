import React from "react";
import Button from "@mui/material/Button";
import styled from "styled-components";

const PrimaryButton = ({
  text,
  variant,
  onclick,
  width,
  height,
  radius,
  inverse,
  border,
  colors,
  ...props
}) => {
  return (
    <StyledButton
      variant={variant}
      onClick={onclick}
      width={width}
      height={height}
      radius={radius}
      inverse={inverse}
      border={border}
      colors={colors}
    >
      {text}
    </StyledButton>
  );
};

export default PrimaryButton;

const StyledButton = styled(Button)`
  && {
    width: ${({ width }) => (width ? width : "215px")};
    height: ${({ height }) => (height ? height : "56px")};
    border-radius: ${({ radius }) => (radius ? radius : "8px")};
    background-color: ${({ inverse }) => (inverse ? "#fff" : "#2546EB")};
    color: ${({ colors }) => (colors ? colors : "#fff")};
    border: ${({ border }) => border};
    font-size: 15px;
    font-weight: 500;
    font-family: Poppins;
    
    &:hover{
      background-color: ${({ inverse }) => (inverse ? "#fff" : "#2555EB")};
    }
    @media (max-width: 960px) {
      width: 100%;
    }
  }
`;
