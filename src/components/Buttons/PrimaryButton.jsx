import React from 'react';
import Button from '@mui/material/Button';
import styled from 'styled-components';

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
  position,
  right,
  top,
  disabled,
  margin,
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
      position={position}
      top={top}
      right={right}
      margin={margin}
      disabled={disabled}
    >
      {text}
    </StyledButton>
  );
};

export default PrimaryButton;

const StyledButton = styled(Button)`
  && {
    width: ${({ width }) => (width ? width : '215px')};
    margin: ${({ margin }) => (margin ? margin : '0px')};
    height: ${({ height }) => (height ? height : '56px')};
    border-radius: ${({ radius }) => (radius ? radius : '8px')};
    background-color: ${({ inverse }) => (inverse ? '#fff' : '#2546EB')};
    color: ${({ colors }) => (colors ? colors : '#fff')};
    border: ${({ border }) => border};
    position: ${({ position }) => (position ? position : 'none')};
    right: ${({ right }) => (right ? right : '10px')};
    top: ${({ top }) => (top ? top : '10px')};
    font-size: 15px;
    font-weight: 500;
    font-family: Poppins;

    &:hover {
      background-color: ${({ inverse }) => (inverse ? '#fff' : '#2555EB')};
    }
    @media (max-width: 960px) {
      width: ${({ width }) => (width ? width : '100%')};
    }
  }
`;
