import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Box, Button, Card, Divider, Stack, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { CurrentUser } from "../../../types";
import { cardStyle } from "./CardGenUtility";

const columns: GridColDef[] = [
  { field: "id", headerName: "Card No.", width: 100, align: "center" },
  { field: "name", headerName: "Campaign Name", minWidth: 150, flex: 0.75 },
  { field: "campaign_stats", headerName: "Campaign stats", minWidth: 150, flex: 0.75 },
  { field: "campaign_budget", headerName: "Campaign Budget", minWidth: 150, flex: 0.45 },
  { field: "amount_spent", headerName: "Amount Spent", width: 150 },
  { field: "amount_claimed", headerName: "Amount Claimed", width: 150 },
  { field: "action", headerName: "Actions", width: 150 },
];

interface CampaignListProps {
  user?: CurrentUser;
}

const CampaignList = ({user}:CampaignListProps) => {
  return (
    <Box
      sx={{
        marginTop: 4,
        marginBottom: 2,
        backgroundColor: cardStyle.backgroundColor,
        border: 1,
        borderColor: cardStyle.borderColor,
      }}
      elevation={0}
      component={Card}
    >
      <Box sx={{ p: 2 }}>
        <Stack direction={"row"} justifyContent="space-between" alignItems={"center"}>
          <Stack direction={"row"}>
            <Box sx={{ marginRight: 1 }}>
              <InfoOutlinedIcon />
            </Box>
            <Typography sx={{ maxWidth: 400 }} variant="caption">
              At the moment you can only run one campaign at a time, and the topped up budget can be used across unlimited number of campaigns
            </Typography>
          </Stack>
          <Button
            size="large"
            variant="contained"
            disableElevation
            disabled={!user?.available_budget || !user?.hedera_wallet_id || !user?.business_twitter_handle}
          >
            Create Campaign
          </Button>
        </Stack>
      </Box>
      <Divider sx={{ borderColor: cardStyle.borderColor }} />
      <Box sx={{ height: "calc(100vh - 436px)" }}>
        <DataGrid rows={[]} columns={columns} paginationMode="server" rowsPerPageOptions={[5]} />
      </Box>
    </Box>
  );
};

export default CampaignList;
