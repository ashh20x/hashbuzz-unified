import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { CampaignStatus, getCardStausText, getSymbol } from "../../../../Utilities/helpers";
import { useStore } from "../../../../Store/StoreProvider";

const RenderSymbol = (props: GridRenderCellParams<any, any, any>) => {
  const store = useStore();
  const entities = store.balances;
  return <span>{props.row?.type === "HBAR" ? "HBAR" : getSymbol(entities, props.row?.fungible_token_id)}</span>;
}

export const campaignListColumns: GridColDef[] = [
  { field: "id", headerName: "Card No.", width: 100, align: "center" },
  { field: "name", headerName: "Name", minWidth: 150, flex: 0.75 },
  {
    field: "type",
    headerName: "Token Reward",
    minWidth: 150,
    flex: 0.75,
    renderCell: (params) => <RenderSymbol {...params} />,
  },
  {
    field: "campaign_budget",
    headerName: "Allocated Budget",
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
      return <span>{cellValues?.row?.type === "HBAR" ? cellValues?.row?.amount_spent / 1e8 : cellValues?.row?.amount_spent / Math.pow(10, Number(cellValues?.row?.decimals))}</span>;
    },
  },
  {
    field: "amount_claimed",
    headerName: "Amount Claimed",
    width: 150,
    renderCell: (cellValues) => {
      return <span>{cellValues?.row?.type === "HBAR" ? cellValues?.row?.amount_claimed / 1e8 : cellValues?.row?.amount_claimed / Math.pow(10, Number(cellValues?.row?.decimals))}</span>;
    },
  },
  { field: "card_status", headerName: "Status", minWidth: 150, flex: 0.75, valueGetter: ({ value }) => getCardStausText(value as CampaignStatus) },
];
