import styled, { css } from "styled-components";
import { IconButton } from '@mui/material'

const backdropLayerCss = css`
  background: rgba( 170 ,196 , 255 , 0.35 );//rgb(170 196 255 / 35%)
  backdrop-filter: blur(5px);
`

export const LandingV2Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding:16px;
  background: rgb(6,38,121);
  // background: linear-gradient(47deg, rgba(6,38,121,1) 0%, rgba(48,77,147,1) 35%, rgba(225,239,255,1) 100%); 
  background-image: url("./images/landing-bg-2.jpg"), linear-gradient(90deg, rgb(1, 16, 73) 0%, 20.283%, rgb(13, 25, 111) 40.566%, 43.5535%, rgb(1, 32, 122) 46.5409%, 59.5912%, rgb(6, 53, 143) 72.6415%, 86.3208%, rgb(6, 38, 121) 100%); 

  background-size: cover;
  background-position: top right;
`;

export const ImageCarousalContainer = styled.div`
  // background: rgb(6,38,121);
  // background-image: url("./images/landing-bg-2.jpg"), linear-gradient(90deg, rgb(1, 16, 73) 0%, 20.283%, rgb(13, 25, 111) 40.566%, 43.5535%, rgb(1, 32, 122) 46.5409%, 59.5912%, rgb(6, 53, 143) 72.6415%, 86.3208%, rgb(6, 38, 121) 100%);
  
  //  background-size: cover;
  // background-position: top right;
`;

export const ContentWrapperDiv = styled.div`
  ${backdropLayerCss}
  left:24px;
  bottom: 24px;
  min-height: 100px;
  padding: 12px;
`;

export const LandingPageHeader = styled.h1`
  margin-bottom: 34px;
`;

export const RightSideColWrapper = styled.div``;

export const HeaderActionContainer = styled.div``;

export const RightSideContentContainer = styled.div`
  background-color: rgba(18, 91, 255, 0.35);
  backdrop-filter: blur(5px);
  border-radius: 24px;
`;

export const ConnectingPlatforms = styled.div`
  ${backdropLayerCss}
  width: 230px;
  height: 120px;
  margin: 0 auto;
  justify-content: space-around;
  align-items: center;
`;

export const StyledIconButton = styled(IconButton)`
  width: 80px;
  height: 80px;
  background-color: #fff !important;
  border-radius: 24px!important;
`

