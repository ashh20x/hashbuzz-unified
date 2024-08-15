import RefreshICon from "@mui/icons-material/Cached";
import RejectedIcon from "@mui/icons-material/Cancel";
import ApproveIcon from "@mui/icons-material/Done";
import InfoIcon from "@mui/icons-material/Info";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import PreviewIcon from "@mui/icons-material/RemoveRedEye";
import { Box, Button, Card, Divider, IconButton, Stack, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { uniqBy } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import Countdown from "react-countdown";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useApiInstance } from "../../../../APIConfig/api";
import { useStore } from "../../../../Store/StoreProvider";
import { CampaignStatus, getErrorMessage } from "../../../../Utilities/helpers";
import { Loader } from "../../../../components/Loader/Loader";
import DetailsModal from "../../../../components/PreviewModal/DetailsModal";
import { CampaignCommands, CurrentUser } from "../../../../types";
import AssociateModal from "../AssociateModal";
import { cardStyle } from "../CardGenUtility";
import CampaignCardDetailModal from "./CampaignCardDetailModal";
import { campaignListColumnsAdmin } from "./CampaignListColumnsAdmin";
import { claimRewardCampaignColumns } from "./ClaimRewardCampaignList";
import { campaignListColumns } from "./campaignListCoulmns";

interface CampaignListProps {
  user?: CurrentUser;
}

const isButtonDisabled = (campaignStats: CampaignStatus, approve: boolean) => {
  const disabledStatuses: CampaignStatus[] = [CampaignStatus.RewardDistributionInProgress, CampaignStatus.CampaignDeclined, CampaignStatus.RewardsDistributed, CampaignStatus.CampaignRunning, CampaignStatus.ApprovalPending];
  return disabledStatuses.includes(campaignStats) || approve === false;
};

const getButtonLabel = (campaignStats: CampaignStatus, campaignStartTime: number) => {
  switch (campaignStats) {
    case CampaignStatus.RewardDistributionInProgress:
    case CampaignStatus.RewardsDistributed:
      return "Completed";
    case CampaignStatus.ApprovalPending:
    case CampaignStatus.CampaignApproved:
      return "Start";
    case CampaignStatus.CampaignRunning:
      return <Countdown date={new Date(campaignStartTime).getTime() + +(process.env.REACT_APP_CAMPAIGN_DURATION ?? 1440) * 60 * 1000} />;
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

const CampaignList = ({ user }: CampaignListProps) => {
  const navigate = useNavigate();
  const [openAssociateModal, setOpenAssociateModal] = useState<boolean>(false);
  const store = useStore();

  const currentUser = store?.currentUser;

  const [open, setOpen] = useState<boolean>(false);
  const [modalData, setModalData] = useState<Object>({});
  const [adminPendingCards, setAdminPendingCards] = useState([]);
  const [claimPendingRewards, setClaimPendingRewards] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const { User, Admin } = useApiInstance();
  const [buttonDisabled, setButtonDisabled] = useState(false);
  // const balances = store?.balances;
  const [runningCampaigns, setRunningCampaigns] = useState(false);
  const handleTemplate = () => {
    navigate("/campaign");
    // navigate("/create-campaign");
  };
  const [rows, setRows] = React.useState<GridRowsProp>([]);
  const { Campaign } = useApiInstance();
  const [loading, setLoading] = React.useState(false);
  const [previewCard, setPreviewCard] = useState<any>(null);

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
      console.log(response, "ClaimRewardsResponse");
      //@ts-ignore;
      setClaimPendingRewards((prev) => uniqBy([...prev, ...response.rewardDetails], "id"));
    } catch (error) {
      console.log(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const getUserData = React.useCallback(async () => {
    try {
      const currentUser = await User.getCurrentUser();
      console.log(currentUser, "currentUser");
      store.dispatch({ type: "UPDATE_CURRENT_USER", payload: currentUser });
    } catch (error) {
      toast.error(getErrorMessage(error) ?? "Error while getting current user details.");
    }
  }, [User, store]);
  useEffect(() => {
    if (process.env.REACT_APP_ADMIN_ADDRESS === currentUser?.hedera_wallet_id) {
      getAllPendingCampaigns();
    }
    getClaimAllRewards();
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

      let data = [];
      allCampaigns?.forEach((item: any) => {
        if (item?.card_status === CampaignStatus.CampaignRunning || item?.card_status === CampaignStatus.ApprovalPending || item?.card_status === CampaignStatus.CampaignDeclined) {
          setRunningCampaigns(true);
          return;
        }
      });
      if (allCampaigns?.length > 0) {
        data = allCampaigns?.map((item: any) => {
          return {
            id: item?.id,
            name: item?.name,
            card_status: item?.card_status,
            campaign_budget: item?.campaign_budget,
            amount_spent: item?.amount_spent,
            amount_claimed: item?.amount_claimed,
            fungible_token_id: item?.fungible_token_id,
            type: item?.type,
            campaign_start_time: item?.campaign_start_time,
            decimals: item?.decimals,
          };
        });
      }
      setRows(data);
    } catch (err) {
      console.log(err);
    }
  };

  React.useEffect(() => {
    getAllCampaigns();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCardsRefresh = () => {
    getAllCampaigns();
  };

  const handleCreateCampaignDisablity = React.useCallback(() => {
    //If no Entity balance is grater that zero
    const entityBal = Boolean(store.balances.find((b) => +b.entityBalance > 0));
    // There there is any running card;
    // Theere will be no business user handle connected to the system
    return Boolean(!entityBal || runningCampaigns || user?.business_twitter_handle);
  }, []);

  // !store?.balances.find((ent) => +ent.entityBalance > 0) || runningCampaigns || !user?.hedera_wallet_id || !user?.business_twitter_handle

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
              {getButtonLabel(cellValues.row.card_status, cellValues.row.campaign_start_time)}
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
      renderCell: (cellValues) => {
        console.log(cellValues, "cellValues");
        return (
          <>
            <IconButton aria-label="Preview Campaign" title="Preview Campaign" onClick={() => setPreviewCard(cellValues.row)}>
              <PreviewIcon />
            </IconButton>
            <IconButton
              aria-label="Approve Campaign"
              title="Approve Campaign"
              // variant="contained"
              // color="primary"
              onClick={async () => {
                const data = {
                  approve: true,
                  id: cellValues?.row?.id,
                };
                try {
                  const response = await Admin.updateStatus(data);
                  getAllPendingCampaigns();
                  getAllCampaigns();
                  toast(response?.message);
                  console.log(response, "update status");
                } catch (err) {
                  console.log(err);
                }
              }}
            >
              <ApproveIcon />
            </IconButton>
            <IconButton
              // variant="contained"
              // color="primary"
              color="error"
              aria-label="Reject Icon "
              title="Reject Campaign"
              style={{ marginLeft: "10px" }}
              onClick={async () => {
                const data = {
                  approve: false,
                  id: cellValues?.row?.id,
                };
                try {
                  const response = await Admin.updateStatus(data);
                  getAllPendingCampaigns();
                  getAllCampaigns();
                  toast(response?.message);
                } catch (err) {
                  console.log(err);
                }
              }}
            >
              <RejectedIcon />
            </IconButton>
          </>
        );
      },
    },
  ];

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
                In the current beta phase, please note that only one campaign can be run at a time. Each initiated campaign will automatically end 24 hours after its start. We plan to incrementally ease these restrictions in the future. Also, be informed that your balance can be used without any limits across different campaigns.
              </Typography>
            </Stack>
            {process.env.REACT_APP_ADMIN_ADDRESS === currentUser?.hedera_wallet_id && (
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
          <div style={{ display: "flex", gap: "10px", marginTop: "10px", alignItems: "center" }}>
            <Button
              size="large"
              variant={activeTab === "all" ? "contained" : "outlined"}
              disableElevation
              onClick={() => {
                setActiveTab("all");
              }}
            >
              Campaigns
            </Button>
            {process.env.REACT_APP_ADMIN_ADDRESS === currentUser?.hedera_wallet_id ? (
              <>
                <Button
                  size="large"
                  variant={activeTab === "pending" ? "contained" : "outlined"}
                  disableElevation
                  onClick={() => {
                    setActiveTab("pending");
                  }}
                >
                  Pending
                </Button>
                <Button
                  size="large"
                  variant={activeTab === "claimRewards" ? "contained" : "outlined"}
                  disableElevation
                  onClick={() => {
                    setActiveTab("claimRewards");
                  }}
                >
                  Claim Rewards
                </Button>
              </>
            ) : (
              <Button
                size="large"
                variant={activeTab === "claimRewards" ? "contained" : "outlined"}
                disableElevation
                onClick={() => {
                  setActiveTab("claimRewards");
                }}
              >
                Claim Rewards
              </Button>
            )}
            <Box sx={{ marginLeft: "auto" }}>
              <IconButton aria-label="Update Cards list" title="Update campaign cards" onClick={handleCardsRefresh}>
                <RefreshICon fontSize="inherit" />
              </IconButton>
            </Box>
          </div>
        </Box>

        <Divider sx={{ borderColor: cardStyle.borderColor }} />
        <Box sx={{ height: "calc(100vh - 436px)" }}>
          {process.env.REACT_APP_ADMIN_ADDRESS === currentUser?.hedera_wallet_id ? (
            <>
              <DataGrid rows={activeTab === "pending" ? adminPendingCards : activeTab === "claimRewards" ? uniqBy(claimPendingRewards, "id") : uniqBy(rows, "id")} columns={activeTab === "pending" ? ADMINCOLUMNS : activeTab === "claimRewards" ? CLAIMREWARDS : columns} paginationMode="server" rowsPerPageOptions={[20]} />
            </>
          ) : (
            <DataGrid rows={activeTab === "claimRewards" ? uniqBy(claimPendingRewards, "id") : uniqBy(rows, "id")} columns={activeTab === "claimRewards" ? CLAIMREWARDS : columns} paginationMode="server" rowsPerPageOptions={[20]} />
          )}
        </Box>
      </Box>
      <DetailsModal open={open} setOpen={setOpen} data={modalData} />
      <CampaignCardDetailModal open={Boolean(previewCard)} data={previewCard} onClose={() => setPreviewCard(null)} />
      <Loader open={loading} />
    </Box>
  );
};

export default CampaignList;
