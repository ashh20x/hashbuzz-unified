import {
  AccessTime,
  ArrowForward,
  ChatBubbleOutline,
  FavoriteBorderOutlined as FavoriteOutline,
  FormatQuote,
  Repeat,
} from '@mui/icons-material';
import { CardContent, Typography } from '@mui/material';
import React from 'react';
import { AllPromos as promosData } from '../../../../Data/Promos';
import {
  StyledActionChip,
  StyledBrandAvatar,
  StyledBrandInfo,
  StyledBrandName,
  StyledContainer,
  StyledDurationContainer,
  StyledDurationInfo,
  StyledFooter,
  StyledGrid,
  StyledHeader,
  StyledPrizeContainer,
  StyledPromoCard,
  StyledPromoTitle,
  StyledTotalPrize,
  StyledViewPromoButton,
} from './styled';

const AllPromos = () => {
  const getActionIcon = (action: string) => {
    const icons: { [key: string]: React.ReactElement } = {
      comment: <ChatBubbleOutline sx={{ fontSize: 16 }} />,
      repost: <Repeat sx={{ fontSize: 16 }} />,
      quote: <FormatQuote sx={{ fontSize: 16 }} />,
      like: <FavoriteOutline sx={{ fontSize: 16 }} />,
    };
    return (
      icons[action.toLowerCase()] || <ChatBubbleOutline sx={{ fontSize: 16 }} />
    );
  };

  // const getActionColor = (actionType: string): string => {
  //   const colors: { [key: string]: string } = {
  //     comment: '#1DA1F2',
  //     repost: '#00BA7C',
  //     quote: '#657786',
  //     like: '#E91E63',
  //   };
  //   return colors[actionType.toLowerCase()] || '#1976d2';
  // };

  return (
    <StyledContainer>
      <StyledGrid>
        {promosData.map((promo, index) => (
          <div key={promo.id || index}>
            <StyledPromoCard>
              <CardContent sx={{ p: 3 }}>
                {/* Header */}
                <StyledHeader>
                  <StyledBrandInfo>
                    <StyledBrandAvatar
                      brandcolor={promo.brandColor}
                      src={promo.brandLogo || undefined}
                      sx={{
                        backgroundColor: !promo.brandLogo
                          ? promo.brandColor
                          : 'transparent',
                        color: !promo.brandLogo ? '#fff' : 'inherit',
                      }}
                    >
                      {!promo.brandLogo && promo.brand.charAt(0)}
                    </StyledBrandAvatar>
                    <StyledBrandName>{promo.brand}</StyledBrandName>
                  </StyledBrandInfo>
                  <StyledTotalPrize>{promo.totalEarned}</StyledTotalPrize>
                </StyledHeader>

                {/* Title */}
                <StyledPromoTitle>{promo.promo}</StyledPromoTitle>

                {/* Action Chips - Using actions array */}
                <StyledPrizeContainer>
                  {promo.actions.map((action, actionIndex) => (
                    <StyledActionChip
                      key={actionIndex}
                      actioncolor={action.color}
                      variant='outlined'
                      size='small'
                      icon={getActionIcon(action.type)}
                      label={action.reward}
                    />
                  ))}
                </StyledPrizeContainer>

                {/* Footer */}
                <StyledFooter>
                  <StyledDurationContainer>
                    <StyledDurationInfo>
                      <AccessTime
                        sx={{ fontSize: 14, color: 'text.secondary' }}
                      />
                      <Typography variant='caption' color='text.secondary'>
                        {promo.date}
                      </Typography>
                    </StyledDurationInfo>
                    <Typography variant='caption' color='text.secondary'>
                      {promo.time}
                    </Typography>
                  </StyledDurationContainer>
                  <StyledViewPromoButton
                    variant='text'
                    endIcon={<ArrowForward sx={{ fontSize: 16 }} />}
                  >
                    View Promo
                  </StyledViewPromoButton>
                </StyledFooter>
              </CardContent>
            </StyledPromoCard>
          </div>
        ))}
      </StyledGrid>
    </StyledContainer>
  );
};

export default AllPromos;
