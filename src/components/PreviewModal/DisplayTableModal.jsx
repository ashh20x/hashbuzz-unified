import { Dialog, TableBody, TableRow } from '@mui/material';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useDappAPICall } from '../../APIConfig/dAppApiServices';
import { displayTableHeadRow } from '../../Data/TwitterTable';
import Typography from '../../Typography/Typography';
import { TableSection } from '../Pages/CreateCard/CreateTwitterPage.styles';
import {
  CustomRowHead,
  CustomTable2,
  CustomTableBodyCell,
  CustomTableHeadCell,
} from '../Tables/CreateTable.styles';
import { BoxCont } from './PreviewModal.styles';

const DisplayTableModal = ({ open, setOpen, item }) => {
  const [cookies, setCookie] = useCookies(['token']);
  const [campaignData, setCampaignData] = useState({});
  const { dAppAPICall } = useDappAPICall();
  useEffect(() => {
    let mounted = true;
    if (mounted) {
      getCampaignData();
    }
    return () => (mounted = false);
  }, []);
  const getCampaignData = async () => {
    try {
      // const response = await APICall("/campaign/twitter-card/stats/?card_id="+item.id, "GET", null, null, false, cookies.token);
      const response = await dAppAPICall({
        url: 'campaign/stats',
        method: 'POST',
        data: {
          card_id: item.id,
        },
      });
      if (response) {
        setCampaignData(response);
      }
    } catch (err) {}
  };
  const handleClose = () => setOpen(false);
  const theme = {
    weight: 500,
    size: '25px',
    color: '#000000',
    sizeRes: '28px',
  };

  const submit = e => {
    console.log(e);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        style: {
          borderRadius: 11,
          padding: 0,
          width: '85%',
          maxWidth: 1010,
          scrollbarWidth: 'none',
        },
      }}
    >
      <BoxCont>
        {/* <PrimaryButton
                    text="X"
                    width="15px"
                    height="30px"
                    inverse={true}
                    onclick={handleClose}
                    colors="#EF5A22"
                    border="0px solid #EF5A22"
                    position="absolute"
                    top="10px"
                    right="5px"
                /> */}
        <Typography theme={theme}>Campaign statistics</Typography>
        <TableSection>
          <CustomTable2 stickyHeader aria-label='simple table'>
            <CustomRowHead>
              <TableRow>
                {displayTableHeadRow.map(item => (
                  <CustomTableHeadCell
                    key={item.id}
                    align={item.align}
                    style={{ minWidth: item.minWidth, width: item.width }}
                  >
                    {item.label}
                  </CustomTableHeadCell>
                ))}
              </TableRow>
            </CustomRowHead>
            <TableBody>
              {[campaignData].map((item, index) => (
                <TableRow>
                  <CustomTableBodyCell>{item.like_count}</CustomTableBodyCell>
                  <CustomTableBodyCell>
                    {item.retweet_count}
                  </CustomTableBodyCell>
                  <CustomTableBodyCell>{item.quote_count}</CustomTableBodyCell>
                  <CustomTableBodyCell>{item.reply_count}</CustomTableBodyCell>
                </TableRow>
              ))}
            </TableBody>
          </CustomTable2>
        </TableSection>
      </BoxCont>
    </Dialog>
  );
};

export default DisplayTableModal;
