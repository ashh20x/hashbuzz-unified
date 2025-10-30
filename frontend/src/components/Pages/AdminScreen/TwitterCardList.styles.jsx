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
export const ImgWrap = styled.div`
  position: absolute;
  left: 50px;
  img {
    cursor: pointer;
  }
`;
export const TableSection = styled.div`
  display: flex;
  border-radius: 10px;
  border: 1px solid #bebebe;
  width: 95%;
  //   height: 300px;
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

export const WrappeText = styled.p`
  width: 100%;
  text-align: center;
`;
