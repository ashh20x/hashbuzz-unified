import styled from "styled-components";

export const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  padding: 21px 42px;
  background: #ffffff;
  border: 1px solid #eeeeee;
  box-shadow: 0px 2px 61px rgba(239, 239, 239, 0.53);
  border-radius: 11px;

  @media screen and (max-width: 960px) {
    margin: 20px 0;
  }
`;

export const ButtonSection = styled.div`
    width: 120%;
    margin-top: 3%;
    display: flex;
    justify-content: space-around;
`