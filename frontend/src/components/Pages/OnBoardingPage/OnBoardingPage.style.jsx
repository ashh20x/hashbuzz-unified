import styled from 'styled-components';

export const HeaderText = styled.span`
  color: ${({ theme: { colors } }) => colors.dimgrey};
  font-size: 18px;
  margin-bottom: 3%;
  width: 85%;
  @media screen and (max-width: 960px) {
    margin-bottom: 7%;
    width: 100%;
  }
`;
export const Connect = styled.div`
  margin: 3% 0;
  width: 30%;
  text-align: center;

  @media screen and (max-width: 960px) {
    margin: 5% 0;
    width: 100%;
  }
`;
