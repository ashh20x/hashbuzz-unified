import { Box, Button , IconButton } from "@mui/material";
import RefreshICon from "@mui/icons-material/Cached";

export type TabsLabel = "all" | "pending" | "claimRewards";

interface TabNavigationProps {
  activeTab: TabsLabel;
  setActiveTab: (tab: TabsLabel) => void;
  isAdmin: boolean;
  handleCardsRefresh:() => void;
}

const TabNavigation = ({ activeTab, setActiveTab, handleCardsRefresh , isAdmin}: TabNavigationProps) => (
  <div style={{ display: "flex", gap: "10px", marginTop: "10px", alignItems: "center" }}>
    <Button size="large" variant={activeTab === "all" ? "contained" : "outlined"} onClick={() => setActiveTab("all")}>
      Campaigns
    </Button>
    {/* <Button size="large" variant={activeTab === "claimRewards" ? "contained" : "outlined"} onClick={() => setActiveTab("claimRewards")}>
      Claim Rewards
    </Button> */}
    {isAdmin && (
      <Button size="large" variant={activeTab === "pending" ? "contained" : "outlined"} onClick={() => setActiveTab("pending")}>
        Pending
      </Button>
    )}
    <Box sx={{ marginLeft: "auto" }}>
      <IconButton aria-label="Update Cards list" title="Update campaign cards" onClick={handleCardsRefresh}>
        <RefreshICon fontSize="inherit" />
      </IconButton>
    </Box>
  </div>
);

export default TabNavigation;
