import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  height: 60vh;
  @media (max-width: 960px) {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
`;

export const LeftSec = styled.div`
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: space-between;
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
export const CustomParagraph = styled.textarea`
  width: 85%;
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
    text-align: center;
    width: 100%;
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
  width: 70%;
  justify-content: center;
  button {
    margin-right: 50px;
    margin-bottom: 0;
  }
  @media screen and (max-width: 960px) {
    flex-direction: column;
    width: 100%;
    button {
      margin-right: 0px;
      margin-bottom: 5%;
    }
  }
`;
export const TableSection = styled.div`
  display: flex;
  width: 95%;
  overflow-y: scroll;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
  @media screen and (max-width: 960px) {
    overflow: scroll;
  }
`;
export const TextWrap = styled.div`
  display: flex;
  div {
    margin-right: 10px;
    white-space: nowrap;
    margin: 2%;
  }
`;
export const CustomInput = styled.input`
  height: 50px;
  width: 70%;
  background: #f3f3f3;
  border-radius: 4px;
  border: none;
  color: #9d9d9d;
  margin: 4% 0;
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
  height: 50%;
  width: 70%;
  @media screen and (max-width: 960px) {
    width: 100%;
    height: 30vh;
  }
`;
