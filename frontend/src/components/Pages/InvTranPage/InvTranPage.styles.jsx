import styled from 'styled-components';

export const TableSection = styled.div`
  display: flex;
  width: 99%;
  height: 45vh;
  overflow-y: scroll;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
  @media screen and (max-width: 960px) {
    overflow: scroll;
  }
`;
export const ToggleButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 8px 2px;
  width: 30%;

  background: #ffffff;
  box-shadow: 0px 2px 31px #efefef;
  border-radius: 30px;

  @media screen and (max-width: 960px) {
    width: 100%;
    border-radius: 30px;
    padding: 8px;
    overflow: scroll;
  }
`;
export const TitleWrap = styled.div`
  margin: 3% 0;
`;
