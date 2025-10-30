import { GridColDef } from '@mui/x-data-grid';

export const claimRewardCampaignColumns: GridColDef[] = [
  {
    field: 'id',
    headerName: 'Card No.',
    width: 100,
    align: 'center',
    renderCell: cellValues => {
      console.log(cellValues, 'cellValues');
      return <span>{cellValues?.row?.id || 'HBAR'}</span>;
    },
  },
  {
    field: 'tokenId ',
    headerName: 'Fungible Token ID',
    minWidth: 150,
    flex: 0.75,
    renderCell: cellValues => {
      return <span>{cellValues?.row?.token_id || '--'}</span>;
    },
  },
  {
    field: 'title',
    headerName: 'Title',
    minWidth: 150,
    flex: 0.75,
    renderCell: cellValues => {
      return <span>{cellValues?.row?.name || '--'}</span>;
    },
  },

  {
    field: 'engagement_type',
    headerName: 'Enagement Type',
    width: 150,
    renderCell: cellValues => {
      return <span>{cellValues?.row?.engagement_type}</span>;
    },
  },
  {
    field: 'retweet_reward',
    headerName: 'Repost Reward',
    width: 150,
    renderCell: cellValues => {
      return (
        <span>
          {cellValues?.row?.type === 'HBAR'
            ? cellValues?.row?.retweet_reward / 1e8
            : cellValues?.row?.retweet_reward /
              Math.pow(10, Number(cellValues?.row?.decimals))}
        </span>
      );
    },
  },
  {
    field: 'like_reward',
    headerName: 'Like Reward',
    minWidth: 150,
    flex: 0.75,
    renderCell: cellValues => {
      return (
        <span>
          {cellValues?.row?.type === 'HBAR'
            ? cellValues?.row?.like_reward / 1e8
            : cellValues?.row?.like_reward /
              Math.pow(10, Number(cellValues?.row?.decimals))}
        </span>
      );
    },
  },
  {
    field: 'quote_reward',
    headerName: 'Quote Reward',
    minWidth: 150,
    flex: 0.75,
    renderCell: cellValues => {
      return (
        <span>
          {cellValues?.row?.type === 'HBAR'
            ? cellValues?.row?.quote_reward / 1e8
            : cellValues?.row?.quote_reward /
              Math.pow(10, Number(cellValues?.row?.decimals))}
        </span>
      );
    },
  },
  {
    field: 'comment_reward',
    headerName: 'Comment Reward',
    minWidth: 150,
    flex: 0.75,
    renderCell: cellValues => {
      return (
        <span>
          {cellValues?.row?.type === 'HBAR'
            ? cellValues?.row?.comment_reward / 1e8
            : cellValues?.row?.comment_reward /
              Math.pow(10, Number(cellValues?.row?.decimals))}
        </span>
      );
    },
  },
];
