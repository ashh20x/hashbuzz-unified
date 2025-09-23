import RefreshIcon from '@mui/icons-material/Cached';
import { Box, Button, Tooltip } from '@mui/material';
import { RefreshButton } from './styles';

export type TabsLabel = 'all' | 'pending' | 'claimRewards';

interface TabNavigationProps {
  activeTab: TabsLabel;
  setActiveTab: (tab: TabsLabel) => void;
  isAdmin: boolean;
  handleCardsRefresh: () => void;
}

const TabNavigation = ({
  activeTab,
  setActiveTab,
  handleCardsRefresh,
  isAdmin,
}: TabNavigationProps) => (
  <div
    style={{
      display: 'flex',
      gap: '10px',
      marginTop: '10px',
      alignItems: 'center',
    }}
  >
    <Button
      size='large'
      variant={activeTab === 'all' ? 'contained' : 'outlined'}
      onClick={() => setActiveTab('all')}
    >
      Campaigns
    </Button>
    {/* <Button size="large" variant={activeTab === "claimRewards" ? "contained" : "outlined"} onClick={() => setActiveTab("claimRewards")}>
      Claim Rewards
    </Button> */}
    {isAdmin && (
      <Button
        size='large'
        variant={activeTab === 'pending' ? 'contained' : 'outlined'}
        onClick={() => setActiveTab('pending')}
      >
        Pending
      </Button>
    )}
    <Box sx={{ marginLeft: 'auto' }}>
      <Tooltip title='Refresh campaign data' arrow placement='top'>
        <RefreshButton
          aria-label='Update Cards list'
          onClick={handleCardsRefresh}
        >
          <RefreshIcon fontSize='inherit' />
        </RefreshButton>
      </Tooltip>
    </Box>
  </div>
);

export default TabNavigation;
