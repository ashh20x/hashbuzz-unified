import styled from 'styled-components';

export const CardSection = styled.div`
  width: 100%;
  /* height: 25vh; */
  margin-bottom: 2%;
  display: flex;
  justify-content: space-around;
  @media screen and (max-width: 960px) {
    flex-direction: column;
  }
`;
export const TableSection = styled.div`
  display: flex;
  border: 1px solid #bebebe;
  border-radius: 8px;
  width: 80%;
  height: 300px;
  overflow-y: scroll;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
  @media screen and (max-width: 960px) {
    overflow: scroll;
  }
`;
export const StatusSection = styled.p`
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 21px;
  color: #696969;
`;

export const LinkContainer = styled.div`
  text-align: right;
  // width: 100%;
  a {
    position: absolute;
    right: 55px;
    top: 35px;
  }
  @media screen and (max-width: 960px) {
    a {
      position: inherit;
      right: 55px;
      top: 35px;
    }
  }
`;
