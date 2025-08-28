import { CampaignStatus, getCardStausText } from '@/comman/helpers';
import { GridColDef } from '@mui/x-data-grid';
import { RenderAmountClaimed } from './components/RenderAmountClaimed';
import { RenderAmountSpent } from './components/RenderAmountSpent';
import { RenderBudget } from './components/RenderBudget';
import { RenderSymbol } from './components/RenderSymbol';

export const campaignListColumns: GridColDef[] = [
  { field: 'id', headerName: 'Card No.', width: 100, align: 'center' },
  { field: 'name', headerName: 'Name', minWidth: 150, flex: 0.75 },
  {
    field: 'type',
    headerName: 'Token Reward',
    minWidth: 150,
    flex: 0.75,
    renderCell: params => <RenderSymbol {...params} />,
  },
  {
    field: 'campaign_budget',
    headerName: 'Allocated Budget',
    minWidth: 150,
    flex: 0.45,
    renderCell: RenderBudget,
  },
  {
    field: 'amount_spent',
    headerName: 'Amount Spent',
    width: 150,
    renderCell: RenderAmountSpent,
  },
  {
    field: 'amount_claimed',
    headerName: 'Amount Claimed',
    width: 150,
    renderCell: RenderAmountClaimed,
  },
  {
    field: 'card_status',
    headerName: 'Status',
    minWidth: 150,
    flex: 0.75,
    valueGetter: status => getCardStausText(status as CampaignStatus),
  },
];
