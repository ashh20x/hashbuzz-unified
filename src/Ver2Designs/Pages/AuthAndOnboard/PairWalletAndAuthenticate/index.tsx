import { Box, Stack, useMediaQuery } from "@mui/material";
import { SyntheticEvent, useState } from "react";
import BrowserExtension from "./BrowserExtension";
import GuideList from "./GuideList";
import QRCode from "./QRCode";
import * as HabuzzTabs from "./Tabs";
import { GuideMobile } from "./data";
import * as styles from "./styles";

const TAB_LABELS = [
  { label: "Browser extension", component: <BrowserExtension /> },
  { label: "QR Code", component: <QRCode /> },
];

const PairWalletAndAuthenticate = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const isSmallDevice = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const handleTabChange = (_: SyntheticEvent, newValue: number) => setTabIndex(newValue);

  const header = (<Box sx={styles.header}>
    <h1>Connect Hashpack Wallet</h1>
    <p>Choose any of the options to connect wallet</p>
  </Box>);

  if (isSmallDevice) {
    return (
      <Box component="section" sx={styles.conenctWalletSection}>
        {header}
        <Stack flexDirection="column" gap={2} sx={styles.smallDeviceContainer}>
          <GuideList guidesList={GuideMobile} />
          <QRCode />
        </Stack>
      </Box>
    );
  }

  return (
    <Box component="section" sx={styles.conenctWalletSection}>
      {header}
      <Box sx={styles.tabsContainer}>
        <HabuzzTabs.StyledTabs
          value={tabIndex}
          onChange={handleTabChange}
          aria-label="wallet connect connection tab options"
        >
          {TAB_LABELS.map((tab, idx) => (
            <HabuzzTabs.StyledTab
              key={tab.label}
              label={tab.label}
              id={`wallet-connect-tab-${idx}`}
              aria-controls={`wallet-connect-tabpanel-${idx}`}
            />
          ))}
        </HabuzzTabs.StyledTabs>
        {TAB_LABELS.map((tab, idx) => (
          <HabuzzTabs.TabPanel key={tab.label} value={tabIndex} index={idx}>
            {tab.component}
          </HabuzzTabs.TabPanel>
        ))}
      </Box>
    </Box>
  );
};

export default PairWalletAndAuthenticate;
