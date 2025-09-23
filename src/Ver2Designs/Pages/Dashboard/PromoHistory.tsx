import { Search } from '@mui/icons-material';
import { InputAdornment } from '@mui/material';
import { useState } from 'react';
import { AllPromos, RewardsHistory } from './Promo&History/index';
import {
  StyledContainer,
  StyledContentContainer,
  StyledHeaderContainer,
  StyledSearchField,
  StyledTab,
  StyledTabsContainer,
} from './styled';

const PromoHistory = () => {
  const [isActive, setIsActive] = useState('promo');

  return (
    <StyledContainer>
      {/* Top Row: Tabs + Search */}
      <StyledHeaderContainer>
        {/* Clickable Text Tabs */}
        <StyledTabsContainer>
          <StyledTab
            variant='h6'
            isActive={isActive === 'promo'}
            onClick={() => setIsActive('promo')}
          >
            All Promos
          </StyledTab>

          <StyledTab
            variant='h6'
            isActive={isActive === 'history'}
            onClick={() => setIsActive('history')}
          >
            Rewards History
          </StyledTab>
        </StyledTabsContainer>

        {/* Search Input */}
        <StyledSearchField
          size='small'
          placeholder='Search...'
          variant='outlined'
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <Search fontSize='small' />
              </InputAdornment>
            ),
          }}
        />
      </StyledHeaderContainer>

      {/* Main Content */}
      <StyledContentContainer>
        {isActive === 'promo' ? <AllPromos /> : <RewardsHistory />}
      </StyledContentContainer>
    </StyledContainer>
  );
};

export default PromoHistory;
