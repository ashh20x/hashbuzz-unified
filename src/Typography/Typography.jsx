import React from "react";
import { ThemeProvider } from "styled-components";
import { TypographyStyles } from "./Typography.styles";

const Typography = ({ children, theme }) => {
  return (
    <ThemeProvider theme={theme}>
      <TypographyStyles>{children}</TypographyStyles>
    </ThemeProvider>
  );
};

export default Typography;
