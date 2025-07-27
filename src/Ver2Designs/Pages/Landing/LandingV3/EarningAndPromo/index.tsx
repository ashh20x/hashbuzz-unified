import { Box } from "@mui/material";
import * as styles from "./styles";
import Engagers from "./Engagers/Engagers";
import Campaigners from "./Campaigners/Campaigners";

const EarningAndPromo = () => {
  return (
    <Box id="earning-and-promo-section" component="section" sx={styles.earningAndPromoSection}>
      <Box id="earning-and-promo-container" sx={styles.earningAndPromoContainer}>
        <h3>
          Start <span>Earning</span> or Start <span>Promoting</span>
        </h3>
        <Engagers />
        <Campaigners />
      </Box>
    </Box>
  );
};

export default EarningAndPromo;
