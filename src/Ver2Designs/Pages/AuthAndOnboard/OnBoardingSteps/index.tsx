import HashbuzzLogoMainTransparent from "@/SVGR/HashbuzzLogo";
import { Box, Stack } from "@mui/material";
import * as styles from "./styles";

const OnBoardingSteps = () => {
  return (
   <Stack component="aside" sx={styles.sideBar }>
        <Box sx={styles.sideBarLogoContainer }>
          <HashbuzzLogoMainTransparent height={46} />
        </Box>
        <Box flex={1} sx={styles.stepsList }>
          <ul>
            <li className="active">
              <span className="list-bullet">1</span>
              <span className="list-name">Connect Wallet</span>
            </li>
            <li>
              <span className="list-bullet">2</span>
              <span className="list-name">Connect 𝕏 account </span>
            </li>
            <li>
              <span className="list-bullet">3</span>
              <span className="list-name">Associate reward tokens</span>
            </li>
          </ul>
        </Box>
      </Stack>
  );
};

export default OnBoardingSteps;
