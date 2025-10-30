import { useGetAccountTokensQuery } from '@/API/mirrorNodeAPI';
import PrimaryButtonV2 from '@/components/Buttons/PrimaryButtonV2';
import { useAppDispatch, useAppSelector } from '@/Store/store';
import { Box, Button } from '@mui/material';
import { markAllTokensAssociated } from '../authStoreSlice';
import SectionHeader from '../Components/SectionHeader/SectionHeader';
import { TokenListItem } from './components';
import * as styles from './styles';

const AssociateTokens = () => {
  const {
    wallet: { address },
    token: { tokens },
  } = useAppSelector(state => state.auth.userAuthAndOnBoardSteps);
  const { data: accountTokens } = useGetAccountTokensQuery(address as string, {
    skip: !address,
  });
  const dispatch = useAppDispatch();

  const handleSkipOrContinue = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // Implement skip functionality
    dispatch(markAllTokensAssociated());
  };

  return (
    <Box sx={styles.associateTokensStyles}>
      <Box sx={styles.associateTokenWrapper}>
        <SectionHeader
          title='Associate reward tokens'
          subtitle='Select and click on associate tokens to connect it'
        />
        <Box sx={styles.listContainer}>
          <h4>Tokens List</h4>
          <Box>
            {tokens.map((token, index) => (
              <TokenListItem
                key={index}
                token={token}
                userAccountTokens={accountTokens}
              />
            ))}
          </Box>
        </Box>
      </Box>
      <Box sx={styles.associateTokenFooter}>
        <Button
          onClick={handleSkipOrContinue}
          variant='text'
          color='secondary'
          size='large'
        >
          Skip
        </Button>
        <PrimaryButtonV2
          onClick={handleSkipOrContinue}
          color='primary'
          aria-label='help'
        >
          <span>Proceed</span>
        </PrimaryButtonV2>
      </Box>
    </Box>
  );
};

export default AssociateTokens;
