import { Box, Card } from '@mui/material';
import { styled } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import * as React from 'react';
import { cardStyle } from '../../../../components/Card/Card.styles';
import AdminViews from './AdminView';

interface StyledTabsProps {
  children?: React.ReactNode;
  value: number;
  onChange: (event: React.SyntheticEvent, newValue: number) => void;
}

const StyledTabs = styled((props: StyledTabsProps) => (
  <Tabs
    {...props}
    TabIndicatorProps={{ children: <span className='MuiTabs-indicatorSpan' /> }}
  />
))({
  // position: 'absolute',
  // transform: 'translateY(-100%)',
  top: '-10px',
  '& .MuiTabs-indicator': {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  '& .MuiTabs-indicatorSpan': {
    maxWidth: '90%',
    width: '100%',
    backgroundColor: '#635ee7',
  },
});

interface StyledTabProps {
  label: string;
}

const StyledTab = styled((props: StyledTabProps) => (
  <Tab disableRipple {...props} />
))(({ theme }) => ({
  textTransform: 'none',
  fontWeight: theme.typography.fontWeightRegular,
  fontSize: theme.typography.pxToRem(15),
  marginRight: theme.spacing(1),
  backgroundColor: '#E1D9FF',
  border: 3,
  borderRadius: 1,
  borderColor: 'hsl(252, 100%, 88%)',
  '&.Mui-selected': {
    color: '#fff',
    fontWeight: 'bold',
  },
  '&.Mui-focusVisible': {
    backgroundColor: 'rgba(100, 95, 228, 0.32)',
  },
}));

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <Box
      sx={{ height: 'calc(100% - 40px)' }}
      role='tabpanel'
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </Box>
  );
}

function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

const AdminDashboard = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <Box sx={{ position: 'relative' }}>
      <StyledTabs
        value={value}
        onChange={handleChange}
        aria-label='Admin dashboard menu'
      >
        <StyledTab label='User Dashboard' {...a11yProps(0)} />
        <StyledTab label='Admin Dashboard' {...a11yProps(1)} />
      </StyledTabs>
      <TabPanel value={value} index={1}>
        <Box
          className='usersList-Table'
          sx={{ paddingBottom: 2, height: '100%', minHeight: 500 }}
        >
          <Card elevation={0} sx={{ ...cardStyle, height: '100%' }}>
            <AdminViews />
          </Card>
        </Box>
      </TabPanel>
      {/* <TabPanel value={value} index={0}>
        <DashboardUser />
      </TabPanel> */}
    </Box>
  );
};

export default AdminDashboard;
