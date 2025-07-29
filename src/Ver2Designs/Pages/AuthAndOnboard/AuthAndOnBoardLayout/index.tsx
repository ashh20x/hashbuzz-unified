import { Box, Stack, useTheme } from "@mui/material";
import * as styles from "./styles";
import { Outlet } from "react-router-dom";
import HashbuzzLogoMainTransparent from "../../../../SVGR/HashbuzzLogo";

const AuthAndOnBoardLayout = () => {
  const theme = useTheme();
  return (
    <Stack component="main" flexDirection="row" sx={styles.authAndOnBoardLayoutStyles(theme)}>
      <Stack component="aside" sx={styles.sideBar(theme)}>
        <Box sx={styles.sideBarLogoContainer(theme)}>
          <HashbuzzLogoMainTransparent height={46} />
        </Box>
        <Box flex={1} sx={styles.stepsList(theme)}>
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
      <Box flex={1} component="section">
        <Outlet />
      </Box>
    </Stack>
  );
};

export default AuthAndOnBoardLayout;
