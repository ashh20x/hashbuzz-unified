import styled from "styled-components";

export const TypographyStyles = styled.div`
  color: ${(props) => props.theme.color};
  font-size: ${(props) => props.theme.size};
  font-weight: ${(props) => props.theme.weight};
  font-family: Poppins;
  @media screen and (max-width: 960px) {
    font-size: ${(props) => (props.theme.sizeRes? props.theme.sizeRes: '')};
  }
`;
