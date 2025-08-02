import { Link } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import { Guide } from "../data";
import GuideList from "../GuideList";
import * as styles from "./styles";

const BrowserExtension = () => {
 
  return (
    <Box sx={styles.browserExtensionContainer}>
      <GuideList guidesList={ Guide} />
      <Box sx={styles.connectWalletBtnContainer} display="flex" alignItems="center" justifyContent="flex-end" className="connectIcon">
        <Button disableElevation variant="contained" startIcon={<Link />}>Connect Wallet</Button>
      </Box>
    </Box>
  );
};

export default BrowserExtension;
