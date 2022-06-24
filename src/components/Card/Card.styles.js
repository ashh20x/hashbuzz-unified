import styled from "styled-components";

export const CardContainer = styled.div`
  background-color: ${({ theme: { colors } }) => colors.white};
  box-shadow: 0px 2px 31px #efefef;
  border-radius: 22px;
  width: 240px;
  height: 176px;
`;
export const IconWrapper = styled.div`
  padding-top: 30px;
  padding-bottom: 26px;
`;
export const TextWrapper = styled.div`
  cursor: pointer;
`;
