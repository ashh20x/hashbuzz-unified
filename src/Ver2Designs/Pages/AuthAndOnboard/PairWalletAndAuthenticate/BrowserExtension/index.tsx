import { Box, Button, Stack } from "@mui/material";
import * as styles from "./styles";
import { Link } from "@mui/icons-material";
import Share from "../../../../../SVGR/ShareIcon";

const BrowserExtension = () => {
  const Guide = [
    {
      lable: "Extension installed",
      description: "Download and install HashPack Chrome extension",
      avialble: false,
      link: {
        lable: "Chrome web store",
        icon: <Share size={20} />,
        url: "https://chromewebstore.google.com/detail/hashpack/gjagmgiddbbciopjhllkdnddhcglnemk",
      },
    },
    {
      lable: "Wallet Account",
      description: "Login or Create account with HashPack wallet",
      avialble: false,
      link: {
        lable: "Hashpack wallet",
        icon: <Share size={20} />,
        url: "https://chromewebstore.google.com/detail/hashpack/gjagmgiddbbciopjhllkdnddhcglnemk",
      },
    },
    {
      lable: "Restart & Connect",
      description: "Once installed, restart your browser to connect wallet extension first time.",
      avialble: true,
    },
  ];
  return (
    <Box sx={styles.browserExtensionContainer}>
      {Guide.map((guide, index) => (
        <Stack flexDirection={{
          xs: "column",
          sm: "row",
          md: "row",
        }} alignItems={{
          xs: "flex-start",
          sm: "flex-start",
          md: "center",
        }} gap={{
          xs: 2,
          sm: 2,
          md: 0,
        }} sx={styles.stepContainer}>
          <div className="counter">
            <span>{index + 1}</span>
          </div>
          <div className="content">
            <h3>{guide.lable}</h3>
            <p>{guide.description}</p>
          </div>
          <div className="linkOrStatus">
            {guide.link && (
              <a target="_blank" href={guide.link.url}>
                {guide.link.lable}
                <span>{guide.link.icon}</span>
              </a>
            )}
          </div>
        </Stack>
      ))}
      <Box sx={styles.connectWalletBtnContainer} display="flex" alignItems="center" justifyContent="flex-end" className="connectIcon">
        <Button disableElevation variant="contained" startIcon={<Link />}>Connect Wallet</Button>
      </Box>
    </Box>
  );
};

export default BrowserExtension;
