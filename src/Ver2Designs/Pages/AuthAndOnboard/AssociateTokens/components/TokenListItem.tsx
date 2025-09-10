import { CheckCircle, CheckCircleOutlineOutlined } from '@mui/icons-material';
import { Box, Button } from '@mui/material';
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

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <Box key={token.token.token_id} sx={styled.TokenListItemStyles}>
      <Box className='tokenIIcons'>
        <span>{data?.symbol}</span>
      </Box>
      <Box className='tokenDetails'>
        <p>{token.token.token_id}</p>
        <span>{data?.name}</span>
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
          variant='outlined'
          disabled={!!isAlreadyAssociated}
          color='primary'
          onCanPlay={() => onAssociate?.(token)}
        >
          Associated
        </Button>
      </Box>
    </Box>
  );
};

export default TokenListItem;
