import { useGetAccountTokensQuery } from "@/API/mirrorNodeAPI";
import PrimaryButtonV2 from "@/components/Buttons/PrimaryButtonV2";
import { useAppDispatch, useAppSelector } from "@/Store/store";
import { CheckCircleOutlineOutlined } from '@mui/icons-material';
import { Box, Button } from "@mui/material";
import { markAllTokensAssociated } from "../authStoreSlice";
import SectionHeader from "../Components/SectionHeader/SectionHeader";
import * as styles from "./styles";


const AssociateTokens = () => {
  const { wallet: { address }, token: { allAssociated, tokens } } = useAppSelector(state => state.auth.userAuthAndOnBoardSteps);
  const { data: accountTokens } = useGetAccountTokensQuery(address, {
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
          title="Associate reward tokens"
          subtitle="Select and click on associate tokens to connect it"
        />
        <Box sx={styles.listContainer}>
          <h4>Tokens List</h4>
          <Box>
            {tokens.map((token, index) => (
              <Box key={index} sx={styles.tokensListItem}>
                <Box className="tokenIIcons">
                  <span>FG</span>
                </Box>
                <Box className="tokenDetails">
                  {/* <h4>{token.name}</h4> */}
                  <p>{token.token.token_id}</p>
                </Box>
                <Box className="linkOrStatus">
                  <Button startIcon={<CheckCircleOutlineOutlined />} variant="outlined" color="primary"  >
                    Associated
                  </Button>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

      </Box>
      <Box sx={styles.associateTokenFooter}>
        <Button onClick={handleSkipOrContinue} variant="text" color="secondary" size="large">
          Skip
        </Button>
        <PrimaryButtonV2 onClick={handleSkipOrContinue} color="primary" aria-label="help">
          <span>Proceed</span>
        </PrimaryButtonV2>
      </Box>
    </Box>
  );
};

export default AssociateTokens;
