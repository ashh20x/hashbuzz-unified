import InfoIcon from "@mui/icons-material/Info";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Box, Button, Card, Divider, Stack, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { uniqBy } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import Countdown from "react-countdown";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useApiInstance } from "../../../../APIConfig/api";
import { useStore } from "../../../../Store/StoreProvider";
import { CampaignStatus } from "../../../../Utilities/helpers";
import { Loader } from "../../../../components/Loader/Loader";
import DetailsModal from "../../../../components/PreviewModal/DetailsModal";
import { CampaignCommands, UserConfig } from "../../../../types";
import AssociateModal from "../AssociateModal";
import { cardStyle } from "../CardGenUtility";
import AdminActionButtons from "./AdminActionButtons";
import CampaignCardDetailModal from "./CampaignCardDetailModal";
import { campaignListColumnsAdmin } from "./CampaignListColumnsAdmin";
import { claimRewardCampaignColumns } from "./ClaimRewardCampaignList";
import TabNavigation, { TabsLabel } from "./TabNavigationComponent";
import { campaignListColumns } from "./campaignListCoulmns";

const isButtonDisabled = (campaignStats: CampaignStatus, approve: boolean) => {
  const disabledStatuses = new Set([CampaignStatus.RewardDistributionInProgress, CampaignStatus.CampaignDeclined, CampaignStatus.RewardsDistributed, CampaignStatus.CampaignRunning, CampaignStatus.ApprovalPending]);
  const isDisabled = disabledStatuses.has(campaignStats) || !approve;
  return isDisabled;
};

const getButtonLabel = (campaignStats: CampaignStatus, campaignStartTime: number, config?: UserConfig) => {
  switch (campaignStats) {
    case CampaignStatus.RewardDistributionInProgress:
    case CampaignStatus.RewardsDistributed:
      return "Completed";
    case CampaignStatus.ApprovalPending:
    case CampaignStatus.CampaignApproved:
      return "Start";
    case CampaignStatus.CampaignRunning:
      const campaignDuration = config?.campaignDuration ?? import.meta.env.VITE_CAMPAIGN_DURATION ?? 1440;
      return <Countdown date={Number(new Date(campaignStartTime).getTime()) + Number(campaignDuration) * 60 * 1000} />;
    default:
      return "Update";
  }
};

const getCmapignCommand = (status: CampaignStatus): CampaignCommands => {
  switch (status) {
    case CampaignStatus.CampaignApproved:
      return CampaignCommands.StartCampaign;
    case CampaignStatus.RewardDistributionInProgress:
      return CampaignCommands.ClaimReward;
    case CampaignStatus.CampaignRunning:
    case CampaignStatus.ApprovalPending:
    case CampaignStatus.CampaignDeclined:
    case CampaignStatus.RewardsDistributed:
    case CampaignStatus.CampaignStarted:
    case CampaignStatus.InternalError:
      return CampaignCommands.UserNotAvalidCommand;
    default:
      return CampaignCommands.UserNotAvalidCommand;
  }
};

const CampaignList = () => {
  const navigate = useNavigate();
  const { User, Admin, Campaign } = useApiInstance();
  const store = useStore();
  const { currentUser, balances } = store;
  const userRole = currentUser?.role;
  const isAdmin = userRole && ["ADMIN", "SUPER_ADMIN"].includes(userRole);

  const [openAssociateModal, setOpenAssociateModal] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [modalData, setModalData] = useState<Object>({});
  const [adminPendingCards, setAdminPendingCards] = useState([]);
  const [claimPendingRewards, setClaimPendingRewards] = useState([]);
  const [activeTab, setActiveTab] = useState<TabsLabel>("all");
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [runningCampaigns, setRunningCampaigns] = useState(false);
  const [rows, setRows] = React.useState<GridRowsProp>([]);
  const [loading, setLoading] = React.useState(false);
  const [previewCard, setPreviewCard] = useState<any>(null);

  const handleTemplate = () => {
    navigate("/campaign");
  };

  const getAllPendingCampaigns = useCallback(async () => {
    try {
      const response = await Admin.getPendingCards();
      setAdminPendingCards(response);
    } catch (err) {
      console.log(err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const getClaimAllRewards = useCallback(async () => {
    try {
      const response = await User.getClaimRewards();
      //@ts-ignore;
      // setClaimPendingRewards((prev) => uniqBy([...prev, ...response.rewardDetails], "id"));
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) {
      getAllPendingCampaigns();
    }
    // getClaimAllRewards();
  }, [getAllPendingCampaigns, currentUser?.hedera_wallet_id, getClaimAllRewards]);

  const handleCard = async (id: number) => {
    const res = await User.getCardEngagement({ id: id });
    setModalData(res.data);
    setOpen(true);
  };

  const handleClick = async (values: any) => {
    try {
      setLoading(true);

      const campaign_command = getCmapignCommand(values?.card_status as CampaignStatus);

      if (campaign_command === CampaignCommands.UserNotAvalidCommand) {
        return toast.warning("Not a valid action for this capaign");
      }

      const data = {
        card_id: values.id,
        campaign_command,
      };
      const response = await Campaign.updateCampaignStatus(data);
      if (response) {
        getAllCampaigns();
        toast.success(response.message);
        setLoading(false);
      }
    } catch (err: any) {
      console.log(err);
      toast.error(err?.message);
    } finally {
      setLoading(false);
    }
  };

  const getAllCampaigns = async () => {
    try {
      const allCampaigns = await Campaign.getCampaigns();

      if (!allCampaigns || allCampaigns.length === 0) {
        setRows([]);
        return;
      }

      const isCampaignRunningOrPending = (status: CampaignStatus) => new Set([CampaignStatus.CampaignRunning, CampaignStatus.ApprovalPending]).has(status);

      const campaignData = allCampaigns.map((item) => ({
        id: item.id,
        name: item.name,
        card_status: item.card_status,
        campaign_budget: item.campaign_budget,
        amount_spent: item.amount_spent,
        amount_claimed: item.amount_claimed,
        fungible_token_id: item.fungible_token_id,
        type: item.type,
        campaign_start_time: item.campaign_start_time,
        decimals: item.decimals,
        approve: item.approve,
      }));

      const hasRunningCampaigns = allCampaigns.some((item: any) => isCampaignRunningOrPending(item.card_status));
      setRunningCampaigns(hasRunningCampaigns);
      setRows(campaignData);
    } catch (err) {
      console.error(err);
    }
  };

  React.useEffect(() => {
    getAllCampaigns();
  }, []);

  const handleCardsRefresh = () => {
    getAllCampaigns();
  };

  const handleAdminAction = async (command: CampaignCommands.AdminRejectedCampaign | CampaignCommands.AdminApprovedCampaign, cellValues: any) => {
    try {
      const data = {
        approve: Boolean(command === CampaignCommands.AdminApprovedCampaign),
        id: cellValues?.row?.id,
      };

      const response = await Admin.updateStatus(data);
      getAllPendingCampaigns();
      getAllCampaigns();
      toast(response?.message);
    } catch (err) {
      console.log(err);
    }
  };

  const handleCreateCampaignDisablity = React.useCallback(() => {
    const entityBal = Boolean(balances.find((b) => +b.entityBalance > 0));
    const isDisabled = Boolean(!entityBal || runningCampaigns || !currentUser?.business_twitter_handle);
    return isDisabled;
  }, [currentUser, runningCampaigns, balances]);

  /**
   * columns list for claim reward tab
   */
  const CLAIMREWARDS: GridColDef[] = [
    ...claimRewardCampaignColumns,
    {
      field: "action",
      headerName: "Actions",
      width: 200,
      renderCell: (cellValues) => {
        console.log(cellValues, "cellValues");
        return (
          <>
            <Button
              variant="contained"
              color="primary"
              disabled={buttonDisabled}
              onClick={async () => {
                const data = {
                  contract_id: cellValues?.row?.contract_id,
                  card_id: cellValues?.row?.id,
                };
                try {
                  setButtonDisabled(true);
                  const response = await User.buttonClaimRewards(data);
                  getClaimAllRewards();
                  getAllCampaigns();
                  toast(response?.message);
                  setButtonDisabled(false);
                } catch (err) {
                  console.log(err);
                  setButtonDisabled(false);
                }
              }}
            >
              {cellValues?.row?.card_status === CampaignStatus.RewardsDistributed ? "Campaign Expired" : "Claim Rewards"}
            </Button>
          </>
        );
      },
    },
  ];

  /** Column Def List for the user all campaign  list */
  const columns: GridColDef[] = [
    ...campaignListColumns,
    {
      field: "action",
      headerName: "Actions",
      width: 200,
      renderCell: (cellValues) => {
        return (
          <>
            <Button variant="contained" color="primary" disabled={isButtonDisabled(cellValues.row.card_status, cellValues.row.approve)} onClick={() => handleClick(cellValues.row)}>
              {getButtonLabel(cellValues.row.card_status, cellValues.row.campaign_start_time, currentUser?.config)}
            </Button>
            <div className="info-icon" onClick={() => handleCard(cellValues.row.id)}>
              <InfoIcon />
            </div>
          </>
        );
      },
    },
  ];

  /**
   * Coumns for addin table comuns
   */
  const ADMINCOLUMNS: GridColDef[] = [
    ...campaignListColumnsAdmin,
    {
      field: "action",
      headerName: "Actions",
      width: 200,
      renderCell: (cellValues) => <AdminActionButtons cellValues={cellValues} handleAdminAction={handleAdminAction} setPreviewCard={setPreviewCard} />,
    },
  ];

  const getRows = useCallback(() => {
    if (activeTab === "pending" && isAdmin) {
      return adminPendingCards;
    }
    if (activeTab === "claimRewards") {
      return uniqBy(claimPendingRewards, "id");
    }
    return uniqBy(rows, "id");
  }, [activeTab, isAdmin, adminPendingCards, claimPendingRewards, rows]);

  const getColumns = useCallback(() => {
    if (activeTab === "pending" && isAdmin) {
      return ADMINCOLUMNS;
    }
    if (activeTab === "claimRewards") {
      return CLAIMREWARDS;
    }
    return columns;
  }, [activeTab, isAdmin, ADMINCOLUMNS, CLAIMREWARDS, columns]);

  return (
    <Box>
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
          <Stack direction={{ xs: "column", sm: "column", md: "row" }} spacing={{ xs: 2, sm: 2 }} justifyContent="space-between" alignItems={{ xs: "left", sm: "left", md: "center" }}>
            <Stack direction={"row"}>
              <Box sx={{ marginRight: 1 }}>
                <InfoOutlinedIcon />
              </Box>
              <Typography sx={{ maxWidth: 700 }} variant="caption">
                In the current beta phase, please note that only one campaign can be run at a time. Each initiated campaign will automatically end 1 hour after its start. We plan to incrementally ease these restrictions in the future. Also, be informed that your balance can be used without any limits across different campaigns.
              </Typography>
            </Stack>
            {isAdmin && (
              <Button size="large" variant="contained" disableElevation onClick={() => setOpenAssociateModal(true)}>
                Associate
              </Button>
            )}
            <a style={{ textDecoration: "none", fontSize: "16px", color: "white", backgroundColor: "#10A37F", borderRadius: "4px", padding: "10px", textAlign: "center" }} href="https://chat.openai.com/g/g-cGD9GbBPY-hashbuzz" target="_blank" rel="noreferrer">
              CONNECT WITH CHATGPT
            </a>
            <Button size="large" variant="contained" disableElevation disabled={handleCreateCampaignDisablity()} onClick={handleTemplate}>
              Create Campaign
            </Button>
            <AssociateModal open={openAssociateModal} onClose={() => setOpenAssociateModal(false)} />
          </Stack>
          <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} isAdmin={!!isAdmin} handleCardsRefresh={handleCardsRefresh} />
        </Box>

        <Divider sx={{ borderColor: cardStyle.borderColor }} />
        <Box sx={{ height: "calc(100vh - 436px)" }}>
          <DataGrid rows={getRows()} columns={getColumns()} paginationMode="server" rowsPerPageOptions={[20]} />
        </Box>
      </Box>
      <DetailsModal open={open} setOpen={setOpen} data={modalData} />
      <CampaignCardDetailModal open={Boolean(previewCard)} data={previewCard} onClose={() => setPreviewCard(null)} />
      <Loader open={loading} />
    </Box>
  );
};

export default CampaignList;
