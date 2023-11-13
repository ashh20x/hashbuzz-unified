import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Box, Button, Card, Divider, Stack, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { CurrentUser } from "../../../types";
import { cardStyle } from "./CardGenUtility";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { useApiInstance } from "../../../APIConfig/api";
import { toast } from "react-toastify";
import { Loader } from "../../../components/Loader/Loader";
import AssociateModal from "./AssociateModal";
import InfoIcon from "@mui/icons-material/Info";
import { useStore } from "../../../Store/StoreProvider";
import DetailsModal from "../../../components/PreviewModal/DetailsModal";

interface CampaignListProps {
  user?: CurrentUser;
}

const CampaignList = ({ user }: CampaignListProps) => {
  const navigate = useNavigate();
  const [openAssociateModal, setOpenAssociateModal] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [modalData, setModalData] = useState<Object>({});
  const { User } = useApiInstance();

  const store = useStore();
  const balances = store?.balances;
  const [runningCampaigns, setRunningCampaigns] = useState(false);
  const handleTemplate = () => {
    navigate("/campaign");
    // navigate("/create-campaign");
  };
  const [rows, setRows] = React.useState<GridRowsProp>([]);
  const { Campaign } = useApiInstance();
  const [loading, setLoading] = React.useState(false);

  const handleCard = async (id: number) => {
    const res = await User.getCardEngagement({ id: id });
    console.log(res, "CardEngagement");
    setModalData(res.data);
    setOpen(true)
  };

  const handleClick = async (values: any) => {
    console.log(values, "rtyuio");
    try {
      setLoading(true);
      let status = "";
      if (values?.campaign_stats === "Pending") {
        status = "running";
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
        await getAllCampaigns();
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
        return <span>{cellValues?.row?.type === "HBAR" ? cellValues?.row?.campaign_budget / 1e8 : cellValues?.row?.campaign_budget}</span>;
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
              disabled={cellValues.row.campaign_stats === "Completed"}
              onClick={() => {
                handleClick(cellValues.row);
              }}
            >
              {cellValues.row.campaign_stats === "Completed"
                ? "Completed"
                : cellValues.row.campaign_stats === "Pending"
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

  const getAllCampaigns = async () => {
    console.log(runningCampaigns, "Campaigns")
    try {
      // const tokenInfo =  await Admin.getTokenInfo(tokenId);
      const allCampaigns = await Campaign.getCampaigns();
      console.log(allCampaigns, "allcampaigns");
      let data = [];
      allCampaigns?.forEach((item: any) => {
        if (item?.card_status === "Pending" || item?.card_status === "Running") {
          setRunningCampaigns(true);
          return;
        }
      });
      if (allCampaigns?.length > 0) {
        data = allCampaigns?.map((item: any) => {
          return ({
            id: item?.id,
            name: item?.name,
            campaign_stats: item?.card_status,
            campaign_budget: item?.campaign_budget,
            amount_spent: item?.amount_spent,
            amount_claimed: item?.amount_claimed,
            type: item?.type,
          })
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
              <Typography sx={{ maxWidth: 400 }} variant="caption">
                During the beta phase, there is a limitation of running a single campaign concurrently. Each campaign will conclude automatically 24 hours after its initiation, unless you choose to end it earlier. We anticipate relaxing these constraints gradually. Additionally, your recharged balance is available for unlimited use across various campaigns.
              </Typography>
            </Stack>
            {process.env.REACT_APP_ADMIN_ADDRESS && (
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
        </Box>
        <Divider sx={{ borderColor: cardStyle.borderColor }} />
        <Box sx={{ height: "calc(100vh - 436px)" }}>
          <DataGrid rows={rows} columns={columns} paginationMode="server" rowsPerPageOptions={[20]} />
        </Box>
      </Box>
      <DetailsModal open={open} setOpen={setOpen} data={modalData} />
      <Loader open={loading} />
    </Box>
  );
};

export default CampaignList;
