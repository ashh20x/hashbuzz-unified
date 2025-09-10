import React from 'react';
import { ThemeProvider } from 'styled-components';

const theme = {
  colors: {
    dimgrey: '#696969',
    palatinateblue: '#2546EB',
    turmericroot: '#FDAF0D',
    blackviolet: '#2C2A44',
    silk: '#F3F3F3',
    waiting: '#9D9D9D',
    mawhite: '#F6F7FE',
    shadow: 'rgba(193, 193, 193, 0.25)',
    white: '#fff',
    black: '#000',
  },
  fonts: ['sans-serif', 'Roboto'],
  fontSizes: {
    small: '1em',
    medium: '2em',
    large: '3em',
  },
};
const Theme = ({ children }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);
export default Theme;
