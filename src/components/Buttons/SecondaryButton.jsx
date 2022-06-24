import React from "react";
import Button from "@mui/material/Button";
import styled from "styled-components";

const SecondaryButton = ({
  text,
  variant,
  onclick,
  width,
  height,
  radius,
  inverse,
  margin,
  ...props
}) => {
  return (
    <SecondaryStyledButton
      variant={variant}
      onClick={onclick}
      width={width}
      height={height}
      radius={radius}
      inverse={inverse}
      margin={margin}
    >
      {text}
    </SecondaryStyledButton>
  );
};

export default SecondaryButton;

const SecondaryStyledButton = styled(Button)`
  && {
    padding: 5px 10px;
    border-radius: ${({ radius }) => (radius ? radius : "100px")};
    margin-right: ${({ margin }) => (margin ? margin : "")};
    background-color: ${({ inverse }) => (inverse ? "#fff" : "#2C2A44")};
    color: ${({ inverse }) => (inverse ? "#2C2A44" : "#fff")};
    border: ${({ inverse }) => (inverse ? "1px solid #2C2A44" : "none")};
    font-size: 10px;
    font-weight: 500;
    font-family: Poppins;
    &:hover{
      background-color: ${({ inverse }) => (inverse ? "#fff" : "#2C2A55")};
    }
  }
`;
