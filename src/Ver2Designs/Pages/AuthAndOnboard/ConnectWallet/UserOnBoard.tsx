import { Box } from "@mui/material";
import * as HabuzzTabs from "./Tabs";
import { SyntheticEvent, useState } from "react";
import BrowserExtension from "./BrowserExtension";
import * as styles from "./styles";

const tabLabels = [
  { label: "Browser extension", component: <BrowserExtension /> },
  { label: "QR Code", component: null }, // Placeholder for future QR Code component
];

const UserOnBoard = () => {
  const [value, setValue] = useState(0);

  const handleChange = (_: SyntheticEvent, newValue: number) => setValue(newValue);

  return (
    <Box component="section" sx={styles.conenctWalletSection}>
      <Box sx={styles.header}>
        <h1>Connect Hashpack Wallet</h1>
        <p>Choose any of the options to connect wallet</p>
      </Box>
      <Box sx={styles.tabsContainer}>
        <HabuzzTabs.StyledTabs value={value} onChange={handleChange} aria-label="wallet connect connection tab options">
          {tabLabels.map((tab, idx) => (
            <HabuzzTabs.StyledTab
              key={tab.label}
              label={tab.label}
              id={`wallet-connect-tab-${idx}`}
              aria-controls={`wallet-connect-tabpanel-${idx}`}
            />
          ))}
        </HabuzzTabs.StyledTabs>
        {tabLabels.map((tab, idx) => (
          <HabuzzTabs.TabPanel key={tab.label} value={value} index={idx}>
            {tab.component}
          </HabuzzTabs.TabPanel>
        ))}
      </Box>
    </Box>
  );
};

export default UserOnBoard;
