import { Search } from '@mui/icons-material';
import { Box, InputAdornment, Typography } from '@mui/material';
import { Engagers, Promoters } from './components/index';
import { StyledHeaderContainer, StyledSearchField } from './styled';

const LeaderBoard = () => {
  return (
    <Box p={2}>
      <StyledHeaderContainer>
        <Typography variant='h6' fontWeight='bold' mb={2}>
          LeaderBoard
        </Typography>
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

      <Box display='flex' flexDirection={{ xs: 'column', md: 'row' }} gap={2}>
        <Box flex={1}>
          <Engagers />
        </Box>
        <Box flex={1}>
          <Promoters />
        </Box>
      </Box>
    </Box>
  );
};

export default LeaderBoard;
