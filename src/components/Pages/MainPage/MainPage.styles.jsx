import styled from "styled-components";

export const ContentBoxContainer = styled.div`
  margin: 0px 4%;
  background-color: ${({ theme: { colors } }) => colors.white};
  box-shadow: 0px 4px 58px rgba(193, 193, 193, 0.25);
  border-radius: 20px;

  flex-grow: 0.9;
  padding: 5vh;
  display: flex;
  text-align: center;
  font-family: Poppins;
  flex-direction: column;
`;

export const ContentHeaderText = styled.span`
  color: ${({ theme: { colors } }) => colors.dimgrey};
  font-size: 18px;
  margin-bottom: 7%;
`;
export const Connect = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  @media screen and (max-width: 960px) {
    flex-direction: column;
  }
`;
export const Wallet = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 59px;
  margin-right: 3%;
  align-items: center;
`;
export const Brand = styled.div`
  width: 515px;
  display: flex;
  flex-direction: column;
  margin-bottom: 59px;
  align-items: flex-start;
  margin-left: 3%;

  @media (max-width: 960px) {
    width: 100%;
    align-items: center;
    margin-left: 0px;
  }
`;
export const CardSpacing = styled.div`
  margin-bottom: 59px;
`;
export const Col = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 59px;
  margin-left: 24px;
  @media (max-width: 960px) {
    margin-left: 0px;
  }
`;
export const Row = styled.div`
  display: flex;
  align-items: center;

  height: 5vh;
`;

export const Seperator = styled.hr`
  height: 175px;
  margin: inherit;
  color: #eee;
  @media (max-width: 960px) {
    height: 0px;
    margin-left: 0%;
    margin-bottom: 15%;
    width: 75%;
  }
`;
export const CardWrap = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  @media (max-width: 960px) {
    flex-direction: column;
    align-items: center;
    div {
      margin: 3% 0;
    }
  }
`;
export const CheckboxWrap = styled.div`
  display: flex;
  flex-direction: row;
  width: 90%;
  justify-content: space-between;
  margin: 0px 0;
  @media (max-width: 960px) {
    flex-direction: column;
    align-items: center;
    margin: 8px 0;
  }
`;
