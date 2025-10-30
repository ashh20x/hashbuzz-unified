import styled from 'styled-components';
import Theme from '../../theme/Theme';

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
  align-items: center;
`;
export const Brand = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 59px;
  align-items: center;
  margin-left: 70px;
  @media (max-width: 960px) {
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
