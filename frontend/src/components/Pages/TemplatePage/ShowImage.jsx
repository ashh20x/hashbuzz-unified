import React from 'react';
import { DivWrapper, ContentDiv, CloseDiv } from './TemplatePage.styles';

export const ShowImage = ({ src, ind, setremoveImage }) => {
  const removeImage = index => setremoveImage(index);
  return (
    <DivWrapper>
      <ContentDiv>
        <img width={150} src={src} alt='Img' />
        <CloseDiv onClick={() => removeImage(ind)}>X</CloseDiv>
      </ContentDiv>
    </DivWrapper>
  );
};
