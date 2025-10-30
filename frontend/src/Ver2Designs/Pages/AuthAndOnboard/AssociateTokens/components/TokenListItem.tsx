import {
  CheckCircle,
  CheckCircleOutlineOutlined,
  TokenOutlined,
} from '@mui/icons-material';
import { Box, Button, Typography, Skeleton, Chip, Fade } from '@mui/material';
import { useGetTokenQuery } from '../../../../../API/mirrorNodeAPI';
import { AccountTokensResponse } from '../../../../../types/mirrorTypes';
import { ConnectedToken } from '../../authStoreSlice';
import * as styled from './styles';

export interface TokenListItemProps {
  token: ConnectedToken;
  onAssociate?: (token: ConnectedToken) => void;
  userAccountTokens?: AccountTokensResponse;
}

const TokenListItem = ({
  token,
  onAssociate,
  userAccountTokens,
}: TokenListItemProps) => {
  const { data, isLoading } = useGetTokenQuery(token.token.token_id);

  const isAlreadyAssociated = userAccountTokens?.tokens.find(
    t => t.token_id === token.token.token_id
  );

  const handleAssociate = () => {
    if (!isAlreadyAssociated && onAssociate) {
      onAssociate(token);
    }
  };

  if (isLoading) {
    return (
      <Box sx={styled.TokenListItemStyles}>
        <Box className='tokenIcons'>
          <Skeleton variant='circular' width={52} height={52} />
        </Box>
        <Box className='tokenDetails' sx={{ flex: 1, ml: 2 }}>
          <Skeleton variant='text' width='60%' height={24} />
          <Skeleton variant='text' width='80%' height={20} sx={{ mt: 0.5 }} />
        </Box>
        <Box className='linkOrStatus'>
          <Skeleton variant='rounded' width={120} height={40} />
        </Box>
      </Box>
    );
  }

  return (
    <Fade in timeout={300}>
      <Box sx={styled.TokenListItemStyles}>
        <Box className='tokenIcons'>
          <Box className='tokenIconWrapper'>
            {data?.symbol ? (
              <Typography className='tokenSymbol'>
                {data.symbol.substring(0, 3)}
              </Typography>
            ) : (
              <TokenOutlined className='fallbackIcon' />
            )}
          </Box>
          {isAlreadyAssociated && (
            <Box className='associatedBadge'>
              <CheckCircle fontSize='small' />
            </Box>
          )}
        </Box>

        <Box className='tokenDetails'>
          <Typography variant='h6' className='tokenName'>
            {data?.name || 'Unknown Token'}
          </Typography>
          <Typography variant='body2' className='tokenId'>
            ID: {token.token.token_id}
          </Typography>
          {data?.symbol && (
            <Chip
              label={data.symbol}
              size='small'
              variant='outlined'
              className='tokenSymbolChip'
            />
          )}
        </Box>

        <Box className='linkOrStatus'>
          <Button
            startIcon={
              isAlreadyAssociated ? (
                <CheckCircle />
              ) : (
                <CheckCircleOutlineOutlined />
              )
            }
            variant={isAlreadyAssociated ? 'contained' : 'outlined'}
            disabled={!!isAlreadyAssociated}
            color={isAlreadyAssociated ? 'success' : 'primary'}
            onClick={handleAssociate}
            sx={styled.associateButton}
            size='large'
          >
            {isAlreadyAssociated ? 'Associated' : 'Associate'}
          </Button>
        </Box>
      </Box>
    </Fade>
  );
};

export default TokenListItem;
