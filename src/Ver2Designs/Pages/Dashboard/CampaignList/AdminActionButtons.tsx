import React from "react";
import RejectedIcon from "@mui/icons-material/Cancel";
import ApproveIcon from "@mui/icons-material/Done";
import PreviewIcon from "@mui/icons-material/RemoveRedEye";
import { IconButton } from "@mui/material";
import { GridRenderCellParams } from "@mui/x-data-grid";
import { CampaignCommands } from "../../../../types";

interface AdminActionButtonsProps {
  cellValues: GridRenderCellParams<any, any, any>;
  handleAdminAction: (CampaignCommands:  CampaignCommands.AdminRejectedCampaign | CampaignCommands.AdminApprovedCampaign, cellValues: GridRenderCellParams<any, any, any>) => void;
  setPreviewCard: React.Dispatch<any>;
}

const AdminActionButtons = ({ cellValues, handleAdminAction, setPreviewCard }: AdminActionButtonsProps) => (
  <>
    <IconButton aria-label="Preview Campaign" onClick={() => setPreviewCard(cellValues.row)}>
      <PreviewIcon />
    </IconButton>
    <IconButton aria-label="Approve Campaign" onClick={() => handleAdminAction(CampaignCommands.AdminApprovedCampaign, cellValues)}>
      <ApproveIcon />
    </IconButton>
    <IconButton color="error" aria-label="Reject Campaign" onClick={() => handleAdminAction(CampaignCommands.AdminRejectedCampaign, cellValues)}>
      <RejectedIcon />
    </IconButton>
  </>
);

export default AdminActionButtons;
