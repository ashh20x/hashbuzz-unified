import { GridColDef } from '@mui/x-data-grid';

export const campaignListColumnsAdmin: GridColDef[] = [
  { field: 'id', headerName: 'Card No.', width: 100, align: 'center' },
  { field: 'name', headerName: 'Campaign Name', minWidth: 150, flex: 0.75 },
  {
    field: 'type',
    headerName: 'Campaign Type',
    minWidth: 150,
    flex: 0.75,
    renderCell: cellValues => {
      return <span>{cellValues?.row?.type || 'HBAR'}</span>;
    },
  },
  {
    field: 'campaign_budget',
    headerName: 'Campaign Budget',
    minWidth: 150,
    flex: 0.45,
    renderCell: cellValues => {
      return (
        <span>
          {cellValues?.row?.type === 'HBAR'
            ? cellValues?.row?.campaign_budget / 1e8
            : cellValues?.row?.campaign_budget /
              Math.pow(10, Number(cellValues?.row?.decimals))}
        </span>
      );
    },
  },
  {
    field: 'amount_spent',
    headerName: 'Amount Spent',
    width: 150,
    renderCell: cellValues => {
      return (
        <span>
          {cellValues?.row?.type === 'HBAR'
            ? cellValues?.row?.amount_spent / 1e8
            : cellValues?.row?.amount_spent}
        </span>
      );
    },
  },
  {
    field: 'amount_claimed',
    headerName: 'Amount Claimed',
    width: 150,
    renderCell: cellValues => {
      return (
        <span>
          {cellValues?.row?.type === 'HBAR'
            ? cellValues?.row?.amount_claimed / 1e8
            : cellValues?.row?.amount_claimed}
        </span>
      );
    },
  },
  {
    field: 'card_status',
    headerName: 'Campaign Status',
    minWidth: 150,
    flex: 0.75,
  },
];
