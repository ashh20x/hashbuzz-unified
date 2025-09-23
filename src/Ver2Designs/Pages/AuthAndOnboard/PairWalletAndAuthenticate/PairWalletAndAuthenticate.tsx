import { Box, Stack } from '@mui/material';
import { useState } from 'react';
import SectionHeader from '../Components/SectionHeader/SectionHeader';
import BrowserExtension from './BrowserExtension/BrowserExtension';
import QrCode from './QrCode';
import { StyledTab, StyledTabs, TabPanel } from './Tabs';
import * as styles from './styles';

const PairWalletAndAuthenticate = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box component='section' sx={styles.conenctWalletSection}>
      <SectionHeader
        title='Connect your wallet'
        subtitle='Choose any of the options to connect wallet'
      />

      {/* Custom Tabs */}
      <Box sx={styles.tabsContainer}>
        <StyledTabs
          value={activeTab}
          onChange={handleChange}
          variant='fullWidth'
        >
          <StyledTab label='Browser Extension' />
          <StyledTab label='QR Code' />
        </StyledTabs>
      </Box>

      {/* Tab Content */}
      <Stack flexDirection='column' gap={2} sx={styles.smallDeviceContainer}>
        <TabPanel value={activeTab} index={0}>
          <BrowserExtension />
        </TabPanel>
        <TabPanel value={activeTab} index={1}>
          <QrCode />
        </TabPanel>
      </Stack>
    </Box>
  );
};

export default PairWalletAndAuthenticate;
