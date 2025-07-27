import { Box, Tabs, Tab } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { useState, ReactNode, SyntheticEvent } from "react";
import * as styles from "./styles";
import BrowserExtension from "./BrowserExtension";

interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

const TabPanel = ({ children, value, index, ...other }: TabPanelProps) => (
  <div role="tabpanel" hidden={value !== index} id={`wallet-connect-tabpanel-${index}`} aria-labelledby={`wallet-connect-tab-${index}`} {...other}>
    {value === index && <div>{children}</div>}
  </div>
);

const StyledTabs = styled(Tabs)({
  borderBottom: "1px solid #E9E9E9",
  "& .MuiTabs-indicator": {
    backgroundColor: "#5265FF",
  },
});

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: "capitalize",
  minWidth: 0,
  marginRight: theme.spacing(1),
  color: "#7B7B7B",
  fontSize: "1.125rem",
  lineHeight: 1.5,
  padding: "0.5rem",
  fontWeight: 600,
  "&:hover": {
    color: "#5265FF",
    opacity: 1,
  },
  "&.Mui-selected": {
    color: "#5265FF",
  },
  "&.Mui-focusVisible": {
    backgroundColor: "#8a98ff",
  },
}));

const tabLabels = ["Browser extension", "QR Code"];

const ConnectWallet = () => {
  const [value, setValue] = useState(0);
  const theme = useTheme();

  const handleChange = (_: SyntheticEvent, newValue: number) => setValue(newValue);

  return (
    <Box component="section" sx={styles.conenctWalletSection(theme)}>
      <Box sx={styles.header}>
        <h1>Connect Hashpack Wallet</h1>
        <p>Choose any of the options to connect wallet</p>
      </Box>
      <Box sx={styles.tabsContainer}>
        <StyledTabs value={value} onChange={handleChange} aria-label="wallet connect connection tab options">
          {tabLabels.map((label, idx) => (
            <StyledTab key={label} label={label} id={`wallet-connect-tab-${idx}`} aria-controls={`wallet-connect-tabpanel-${idx}`} />
          ))}
        </StyledTabs>

        <TabPanel value={value} index={0}>
          <BrowserExtension />
        </TabPanel>
      </Box>
    </Box>
  );
};

export default ConnectWallet;
