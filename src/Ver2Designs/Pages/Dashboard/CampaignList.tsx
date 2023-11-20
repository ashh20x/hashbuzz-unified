import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Box, Button, Card, Divider, Stack, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { CurrentUser } from "../../../types";
import { cardStyle } from "./CardGenUtility";
import { useNavigate } from "react-router-dom";
import React, { useCallback, useEffect, useState } from "react";
import { useApiInstance } from "../../../APIConfig/api";
import { toast } from "react-toastify";
import { Loader } from "../../../components/Loader/Loader";
import AssociateModal from "./AssociateModal";
import InfoIcon from "@mui/icons-material/Info";
import { useStore } from "../../../Store/StoreProvider";
import DetailsModal from "../../../components/PreviewModal/DetailsModal";
import { getErrorMessage } from "../../../Utilities/helpers";

interface CampaignListProps {
  user?: CurrentUser;
}

const CampaignList = ({ user }: CampaignListProps) => {
  const navigate = useNavigate();
  const [openAssociateModal, setOpenAssociateModal] = useState<boolean>(false);
  const store = useStore();

  const currentUser = store?.currentUser;


  const [open, setOpen] = useState<boolean>(false);
  const [modalData, setModalData] = useState<Object>({});
  const [adminPendingCards, setAdminPendingCards] = useState([]);
  const [activeTab, setActiveTab] = useState('all')
  const { User, Admin } = useApiInstance();

  const getAllPendingCampaigns = useCallback(async () => {
    try {
      const response = await Admin.getPendingCards();
      setAdminPendingCards(response);
    } catch (err) {
      console.log(err);
    }
  }, []);
  const getUserData = React.useCallback(async () => {
    try {
      const currentUser = await User.getCurrentUser();
      store?.updateState((perv) => ({ ...perv, currentUser }));
    } catch (error) {
      toast.error(getErrorMessage(error) ?? "Error while getting current user details.");
    }
  }, [User, store]);
  useEffect(() => {
    if (process.env.REACT_APP_ADMIN_ADDRESS === currentUser?.hedera_wallet_id) {
      getAllPendingCampaigns();
    }
  }, [getAllPendingCampaigns, currentUser?.hedera_wallet_id]);

  const ADMINCOLUMNS: GridColDef[] = [
    { field: "id", headerName: "Card No.", width: 100, align: "center" },
    { field: "name", headerName: "Campaign Name", minWidth: 150, flex: 0.75 },
    {
      field: "type",
      headerName: "Campaign Type",
      minWidth: 150,
      flex: 0.75,
      renderCell: (cellValues) => {
        return <span>{cellValues?.row?.type || "HBAR"}</span>;
      },
    },
    {
      field: "campaign_budget",
      headerName: "Campaign Budget",
      minWidth: 150,
      flex: 0.45,
      renderCell: (cellValues) => {
        return <span>{cellValues?.row?.type === "HBAR" ? cellValues?.row?.campaign_budget / 1e8 : cellValues?.row?.campaign_budget / Math.pow(10, Number(cellValues?.row?.decimals))}</span>;
      },
    },
    {
      field: "amount_spent",
      headerName: "Amount Spent",
      width: 150,
      renderCell: (cellValues) => {
        return <span>{cellValues?.row?.type === "HBAR" ? cellValues?.row?.amount_spent / 1e8 : cellValues?.row?.amount_spent}</span>;
      },
    },
    {
      field: "amount_claimed",
      headerName: "Amount Claimed",
      width: 150,
      renderCell: (cellValues) => {
        return <span>{cellValues?.row?.type === "HBAR" ? cellValues?.row?.amount_claimed / 1e8 : cellValues?.row?.amount_claimed}</span>;
      },
    },
    { field: "card_status", headerName: "Campaign Status", minWidth: 150, flex: 0.75 },

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
              onClick={async () => {
                const data = {
                  approve: true,
                  id: cellValues?.row?.id,
                };
                try {
                  const response = await Admin.updateStatus(data);
                  getAllPendingCampaigns();
                  getAllCampaigns()
                  toast(response?.message);
                  console.log(response, "update status");
                } catch (err) {
                  console.log(err);
                }
              }}
            >
              Approve
            </Button>
            <Button
              variant="contained"
              color="primary"
              style={{ marginLeft: "10px" }}
              onClick={async () => {
                const data = {
                  approve: false,
                  id: cellValues?.row?.id,
                };
                try {
                  const response = await Admin.updateStatus(data);
                  getAllPendingCampaigns();
                  getAllCampaigns()
                  console.log(response, "update status");
                  toast(response?.message);
                } catch (err) {
                  console.log(err);
                }
              }}
            >
              Reject
            </Button>{" "}
          </>
        );
      },
    },
  ];

  const balances = store?.balances;
  const [runningCampaigns, setRunningCampaigns] = useState(false);
  const handleTemplate = () => {
    navigate("/campaign");
    // navigate("/create-campaign");
  };
  const [rows, setRows] = React.useState<GridRowsProp>([]);
  const { Campaign } = useApiInstance();
  const [loading, setLoading] = React.useState(false);
  // useEffect(() => {
  //   setActiveTableRows(rows)
  // }, [rows])
  const handleCard = async (id: number) => {
    const res = await User.getCardEngagement({ id: id });
    console.log(res, "CardEngagement");
    setModalData(res.data);
    setOpen(true);
  };

  const handleClick = async (values: any) => {
    console.log(values, "rtyuio");
    try {
      setLoading(true);
      let status = "";
      if (values?.campaign_stats === "Campaign Active") {
        status = "running";
        getUserData();
      }
      if (values?.campaign_stats === "Running") {
        status = "completed";
      }
      const data = {
        card_id: values.id,
        card_status: status,
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

  const columns: GridColDef[] = [
    { field: "id", headerName: "Card No.", width: 100, align: "center" },
    { field: "name", headerName: "Campaign Name", minWidth: 150, flex: 0.75 },
    {
      field: "type",
      headerName: "Campaign Type",
      minWidth: 150,
      flex: 0.75,
      renderCell: (cellValues) => {
        return <span>{cellValues?.row?.type || "HBAR"}</span>;
      },
    },
    {
      field: "campaign_budget",
      headerName: "Campaign Budget",
      minWidth: 150,
      flex: 0.45,
      renderCell: (cellValues) => {

        return <span>{cellValues?.row?.type === "HBAR" ? cellValues?.row?.campaign_budget / 1e8 : cellValues?.row?.campaign_budget / Math.pow(10, Number(cellValues?.row?.decimals))}</span>;
      },
    },
    {
      field: "amount_spent",
      headerName: "Amount Spent",
      width: 150,
      renderCell: (cellValues) => {
        return <span>{cellValues?.row?.type === "HBAR" ? cellValues?.row?.amount_spent / 1e8 : cellValues?.row?.amount_spent}</span>;
      },
    },
    {
      field: "amount_claimed",
      headerName: "Amount Claimed",
      width: 150,
      renderCell: (cellValues) => {
        return <span>{cellValues?.row?.type === "HBAR" ? cellValues?.row?.amount_claimed / 1e8 : cellValues?.row?.amount_claimed}</span>;
      },
    },
    { field: "campaign_stats", headerName: "Campaign Status", minWidth: 150, flex: 0.75 },

    {
      field: "action",
      headerName: "Actions",
      width: 200,
      renderCell: (cellValues) => {
        return (
          <>
            <Button
              variant="contained"
              color="primary"
              disabled={
                cellValues.row.campaign_stats === "Campaign Complete, Initiating Rewards" ||
                cellValues.row.approve === false ||
                cellValues.row.campaign_stats === "Under Review" ||
                cellValues.row.campaign_stats === "Campaign Declined" ||
                cellValues.row.campaign_stats === "Rewards Disbursed"
              }
              onClick={() => {
                handleClick(cellValues.row);
              }}
            >
              {cellValues.row.campaign_stats === "Campaign Complete, Initiating Rewards" || cellValues.row.campaign_stats === "Rewards Disbursed"
                ? "Completed"
                : cellValues.row.campaign_stats === "Campaign Active" ||
                  cellValues.row.campaign_stats === "Under Review" ||
                  cellValues.row.campaign_stats === "Campaign Declined"
                  ? "Start"
                  : cellValues.row.campaign_stats === "Running"
                    ? "Stop"
                    : "Update"}
            </Button>
            <div className="info-icon" onClick={() => handleCard(cellValues.row.id)}>
              <InfoIcon />
            </div>
          </>
        );
      },
    },
  ];
  // const [activeTableColumns, setActiveTableColumns] = useState(columns);
  const getAllCampaigns = async () => {
    try {
      // const tokenInfo =  await Admin.getTokenInfo(tokenId);
      const allCampaigns = await Campaign.getCampaigns();
      console.log(allCampaigns, "allcampaigns");
      let data = [];
      allCampaigns?.forEach((item: any) => {
        console.log(item.card_status, "Card_status");
        if (item?.card_status === "Campaign Active" || item?.card_status === "Running" || item?.card_status === "Under Review") {
          setRunningCampaigns(true);
          return;
        }
      });
      if (allCampaigns?.length > 0) {
        data = allCampaigns?.map((item: any) => {
          return {
            id: item?.id,
            name: item?.name,
            campaign_stats: item?.card_status,
            campaign_budget: item?.campaign_budget,
            amount_spent: item?.amount_spent,
            amount_claimed: item?.amount_claimed,
            fungible_token_id: item?.fungible_token_id,
            type: item?.type,
            decimals: item?.decimals
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
  }, []);

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
          <Stack direction={"row"} justifyContent="space-between" alignItems={"center"}>
            <Stack direction={"row"}>
              <Box sx={{ marginRight: 1 }}>
                <InfoOutlinedIcon />
              </Box>
              <Typography sx={{ maxWidth: 700 }} variant="caption">
                During the beta phase, there is a limitation of running a single campaign concurrently. Each campaign will conclude automatically 24
                hours after its initiation, unless you choose to end it earlier. We anticipate relaxing these constraints gradually. Additionally,
                your recharged balance is available for unlimited use across various campaigns.
              </Typography>
            </Stack>
            {process.env.REACT_APP_ADMIN_ADDRESS === currentUser?.hedera_wallet_id && (
              <Button size="large" variant="contained" disableElevation onClick={() => setOpenAssociateModal(true)}>
                Associate
              </Button>
            )}
            <Button
              size="large"
              variant="contained"
              disableElevation
              disabled={!user?.available_budget || runningCampaigns || !user?.hedera_wallet_id || !user?.business_twitter_handle}
              onClick={handleTemplate}
            >
              Create Campaign
            </Button>
            <AssociateModal open={openAssociateModal} onClose={() => setOpenAssociateModal(false)} />
          </Stack>
          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            {process.env.REACT_APP_ADMIN_ADDRESS === currentUser?.hedera_wallet_id && <><Button
              size="large"
              variant={activeTab === "all" ? "contained" : "outlined"}
              disableElevation
              onClick={() => {
                // setActiveTableRows(rows);
                // setActiveTableColumns(columns);
                setActiveTab('all')
              }}
            >
              All
            </Button>
              <Button
                size="large"
                variant={activeTab === "pending" ? "contained" : "outlined"}
                disableElevation
                onClick={() => {
                  // setActiveTableRows(adminPendingCards);
                  // setActiveTableColumns(ADMINCOLUMNS);
                  setActiveTab('pending')

                }}
              >
                Pending
              </Button>
            </>}
          </div>
        </Box>


        <Divider sx={{ borderColor: cardStyle.borderColor }} />
        <Box sx={{ height: "calc(100vh - 436px)" }}>
          <DataGrid
            rows={activeTab === 'pending' ? adminPendingCards : rows}
            columns={activeTab === 'pending' ? ADMINCOLUMNS : columns}
            paginationMode="server"
            rowsPerPageOptions={[20]}
          />
        </Box>
      </Box>
      <DetailsModal open={open} setOpen={setOpen} data={modalData} />
      <Loader open={loading} />
    </Box>
  );
};

export default CampaignList;
