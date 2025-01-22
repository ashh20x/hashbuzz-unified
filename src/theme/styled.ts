import { css } from 'styled-components';

export const screens =  {
    'sm': '640px',
  
    'md': '768px',
    // => @media (min-width: 768px) { ... }
  
    'lg': '1024px',
    // => @media (min-width: 1024px) { ... }
  
    'xl': '1280px',
    // => @media (min-width: 1280px) { ... }
  
    '2xl': '1536px',
    // => @media (min-width: 1536px) { ... }
  }

  

const media = {
    sm: (styles: TemplateStringsArray, ...args: any[]) => css`
        @media (min-width: 640px) {
            ${css(styles, ...args)}
        }
    `,
    md: (styles: TemplateStringsArray, ...args: any[]) => css`
        @media (min-width: 768px) {
            ${css(styles, ...args)}
        }
    `,
    lg: (styles: TemplateStringsArray, ...args: any[]) => css`
        @media (min-width: 1024px) {
            ${css(styles, ...args)}
        }
    `,
    xl: (styles: TemplateStringsArray, ...args: any[]) => css`
        @media (min-width: 1280px) {
            ${css(styles, ...args)}
        }
    `,
    '2xl': (styles: TemplateStringsArray, ...args: any[]) => css`
        @media (min-width: 1536px) {
            ${css(styles, ...args)}
        }
    `,
};

export { media };