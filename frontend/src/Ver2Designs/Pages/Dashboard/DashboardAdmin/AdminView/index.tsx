import { Box, Tab } from '@mui/material';
import Tabs from '@mui/material/Tabs';
import * as React from 'react';
import { BotExceptionsScreen } from '../../../../../components/Pages/AdminScreen/BotExceptionsScreen';
import AdminCampaignsView from './AdminCampaignsView';
import AdminMonitoringView from './AdminMonitoringView';
import AdminTrailSettersView from './AdminTrailSettersView';
import AdminTransactionsView from './AdminTransactionsView';
import AdminUsersViews from './AdminUsersView';
interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`admin-menu-tabpanel-${index}`}
      aria-labelledby={`admin-menu-tab-${index}`}
      {...other}
      style={{
        width: '100%',
      }}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

const AdminView = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    event.preventDefault();
    setValue(newValue);
  };
  return (
    <Box
      sx={{
        flexGrow: 1,
        bgcolor: 'background.paper',
        display: 'flex',
        height: '100%',
      }}
    >
      <Tabs
        orientation='vertical'
        variant='scrollable'
        value={value}
        onChange={handleChange}
        aria-label='Admin menus list'
        sx={{ borderRight: 1, borderColor: 'divider' }}
      >
        <Tab label='User List' {...a11yProps(0)} />
        <Tab label='TrailSetters' {...a11yProps(1)} />
        <Tab label='Monitoring' {...a11yProps(2)} />
        <Tab label='Campaigns' {...a11yProps(3)} />
        <Tab label='Bot Exceptions' {...a11yProps(4)} />
        <Tab label='Transactions' {...a11yProps(5)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <AdminUsersViews />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <AdminTrailSettersView />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <AdminMonitoringView />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <AdminCampaignsView />
      </TabPanel>
      <TabPanel value={value} index={4}>
        <BotExceptionsScreen />
      </TabPanel>
      <TabPanel value={value} index={5}>
        <AdminTransactionsView />
      </TabPanel>
    </Box>
  );
};

export default AdminView;
