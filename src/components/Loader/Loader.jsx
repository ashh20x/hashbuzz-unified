import React from "react";
import { ContainerWrapper } from "./LoaderStyle";
import Image from "./ZZ5H.gif"

export const Loader = () => {
  return (
    <ContainerWrapper>
      <img src={Image} alt="Loading" />
    </ContainerWrapper>
  );
};