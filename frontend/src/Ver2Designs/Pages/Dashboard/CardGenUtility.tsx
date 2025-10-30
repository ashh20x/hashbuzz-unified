import { Card, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';

import React from 'react';
import { cardStyle } from '../../../components/Card/Card.styles';
import * as SC from './styled';

interface CardGenUtilityProps {
  title: string;
  content: {
    image?: string;
    texts: string[];
  };
  startIcon: React.ReactNode;
}

export const CardGenUtility = ({
  title,
  content,
  startIcon,
}: CardGenUtilityProps) => {
  return (
    <Grid size={{ xs: 6, sm: 6, xl: 3, lg: 3 }}>
      <Card elevation={0} sx={cardStyle}>
        <SC.StyledCardStack>
          <SC.StyledCardHeader>
            <SC.StyledIconContainer>{startIcon}</SC.StyledIconContainer>
            <Typography variant='h6' component={SC.StyledCardTitle}>
              {title}
            </Typography>
          </SC.StyledCardHeader>

          <SC.StyledCardContent>
            {/* Image */}
            {content.image && (
              <SC.StyledImageContainer>
                <SC.StyledCardImage src={content.image} alt='' />
              </SC.StyledImageContainer>
            )}

            <SC.StyledTextContainer>
              {content.texts?.map((text, index) => (
                <Typography
                  key={index}
                  variant='body2'
                  component={SC.StyledCardText}
                  $isFirst={index === 0}
                >
                  {text}
                </Typography>
              ))}
            </SC.StyledTextContainer>
          </SC.StyledCardContent>
        </SC.StyledCardStack>
      </Card>
    </Grid>
  );
};
