import { Dialog } from '@mui/material';
import Typography from '../../Typography/Typography';
import { BoxCont } from './PreviewModal.styles';

const DetailsModal = ({ open, setOpen, data }) => {
  const handleClose = () => setOpen(false);
  const theme = {
    weight: 500,
    size: '20px',
    color: '#000000',
    sizeRes: '25px',
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        style: {
          borderRadius: 11,
          padding: 0,
          width: '94%',
          height: '35%',
          maxWidth: 1010,
          scrollbarWidth: 'none',
          background: '#E1D9FF',
        },
      }}
    >
      <BoxCont sx={{ width: '100%' }}>
        <Typography theme={theme}>Engagement Detail</Typography>
        <table
          style={{
            width: '100%',
            background: '#cec2ff',
            margin: '40px 40px 0 40px',
            overflowY: 'scroll',
            padding: '0 20px 0 20px',
          }}
        >
          <tr style={{ textAlign: 'center' }}>
            <th style={{ padding: '20px 0px', minWidth: '80px' }}>Reposts</th>
            <th style={{ padding: '20px 0px', minWidth: '80px' }}>Replies</th>
            <th style={{ padding: '20px 0px', minWidth: '80px' }}>Likes</th>
            <th style={{ padding: '20px 0px', minWidth: '80px' }}>Quotes</th>
          </tr>
          <tr style={{ textAlign: 'center' }}>
            <td style={{ padding: '20px 0px' }}> {data?.retweet_count}</td>
            <td style={{ padding: '20px 0px' }}>{data?.reply_count}</td>
            <td style={{ padding: '20px 0px' }}>{data.like_count}</td>
            <td style={{ padding: '20px 0px' }}>{data.quote_count}</td>
          </tr>
        </table>
      </BoxCont>
      <div style={{ marginBottom: 30 }}></div>
    </Dialog>
  );
};

export default DetailsModal;
