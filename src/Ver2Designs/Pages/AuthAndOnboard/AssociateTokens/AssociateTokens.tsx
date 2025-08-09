import PrimaryButtonV2 from "@/components/Buttons/PrimaryButtonV2";
import { CheckCircleOutlineOutlined } from '@mui/icons-material';
import { Box, Button } from "@mui/material";
import SectionHeader from "../Components/SectionHeader/SectionHeader";
import TookensData from "./data.json";
import * as styles from "./styles";


const AssociateTokens = () => {
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
            {TookensData.map((token, index) => (
              <Box key={index} sx={styles.tokensListItem}>
                <Box className="tokenIIcons">
                  <span>{token.symbol}</span>
                </Box>
                <Box className="tokenDetails">
                  <h4>{token.name}</h4>
                  <p>{token.token_id}</p>
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
        <Button variant="text" color="secondary" size="large">
          Skip
        </Button>
        <PrimaryButtonV2 color="primary" aria-label="help">
          <span>Proceed</span>
        </PrimaryButtonV2>
      </Box>
    </Box>
  );
};

export default AssociateTokens;
