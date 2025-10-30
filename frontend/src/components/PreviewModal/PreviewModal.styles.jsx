import styled from 'styled-components';

export const BoxCont = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3%;
`;
export const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  height: 60vh;
  margin-top: 3%;
  @media (max-width: 960px) {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
`;
export const IconsWrap = styled.div`
  font-size: 18px;
  display: flex;
  width: 75%;
  justify-content: start;
  img {
    cursor: pointer;
  }
`;
export const LeftSec = styled.div`
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid #bebebe;
  box-sizing: border-box;
  border-radius: 10px;
  @media screen and (max-width: 960px) {
    width: 100%;
    margin-bottom: 8%;
  }
`;

export const RightSec = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  @media screen and (max-width: 960px) {
    width: 100%;
    align-items: flex-start;
  }
`;
export const CustomParagraph = styled.p`
  width: 95%;
  text-align: left;
  font-weight: 400;
  font-size: 18px;
  line-height: 27px;
  color: #696969;
  word-wrap: break-word;
  border: none;
  resize: none;
  &:focus {
    outline: none;
  }
  @media screen and (max-width: 960px) {
    text-align: left;
    width: 90%;
  }
`;
export const ButtonWrap = styled.div`
  display: flex;
  overflow: auto;
  scrollbar-width: none;
  width: fit-content;
  flex-wrap: wrap;
  margin-top: 4%;
  button {
    margin: 10px;
  }
  @media screen and (max-width: 960px) {
    width: 100%;
    justify-content: space-around;
    button {
      margin-right: 0px;
    }
  }
`;
export const ButtonWrapPrimary = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  width: 95%;
  button {
    /* margin-right: 10px; */
    margin-bottom: 0;
  }
  @media screen and (max-width: 960px) {
    flex-direction: column;
    width: 75%;
    margin: auto;
    button {
      margin-right: 0px;
      margin-bottom: 5% !important;
    }
  }
`;
export const TableSection = styled.div`
  display: flex;
  border-radius: 10px;
  border: 1px solid #bebebe;
  width: 95%;
  overflow-y: scroll;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
  @media screen and (max-width: 960px) {
    width: 100%;
    overflow: scroll;
  }
`;
export const TextWrap = styled.div`
  display: flex;
  width: 95%;
  justify-content: flex-start;
  div {
    margin-right: 10px;
    white-space: nowrap;
    margin: 2%;
  }
`;
export const CustomInput = styled.input`
  height: 50px;
  width: 60%;
  background: #f3f3f3;
  border-radius: 4px;
  border: none;
  color: #000000;
  margin: 4% 0;
  font-size: 1.25rem;
  padding: 0 12px;
  &:focus {
    outline: none;
  }
  @media screen and (max-width: 960px) {
    width: 100%;
  }
`;
export const ContentWrap = styled.div`
  width: 70%;
  display: flex;
  flex-direction: column;
  @media screen and (max-width: 960px) {
    width: 100%;
    margin: 3% 0;
  }
`;
export const CustomIframe = styled.iframe`
  border-radius: 10px;
  height: 70%;
  width: 95%;
  @media screen and (max-width: 960px) {
    width: 90%;
    height: 30vh;
  }
`;

export const Border = styled.div`
  border-radius: 10px;
  border: 1px solid gray;
  height: 100%;
  margin: 30px;
`;

export const Label = styled.div`
  weight: 500;
  size: '25px';
  color: '#000000';
  sizeres: '28px';
  width: 100%;
  text-align: center;
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  width: 100%;

  // height: 5vh;
`;

export const OverlayBox = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(3px) opacity(0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  color: red;
`;
