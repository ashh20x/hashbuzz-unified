import { Dialog } from '@mui/material';
import React from 'react';
import Typography from '../../Typography/Typography';
import PrimaryButton from '../Buttons/PrimaryButton';
import {
  BoxCont,
  ButtonWrapPrimary,
  CustomParagraph,
} from './PreviewModal.styles';

const ConfirmModal = ({ open, setOpen, confirmClick, cancelClick }) => {
  const handleClose = () => setOpen(false);
  const theme = {
    weight: 500,
    size: '25px',
    color: '#000000',
    sizeRes: '28px',
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        style: {
          borderRadius: 11,
          padding: 0,
          width: '50%',
          height: '35%',
          maxWidth: 1010,
          scrollbarWidth: 'none',
        },
      }}
    >
      <BoxCont>
        <Typography theme={theme}>Confirmation</Typography>
        <CustomParagraph>
          Do you want to authorise with same account?
        </CustomParagraph>
      </BoxCont>

      <ButtonWrapPrimary>
        <PrimaryButton
          text='NO'
          inverse={true}
          onclick={() => cancelClick()}
          colors='#EF5A22'
          border='1px solid #EF5A22'
        />
        <PrimaryButton text='YES' onclick={() => confirmClick()} />
      </ButtonWrapPrimary>
      <div style={{ marginBottom: 30 }}></div>
    </Dialog>
  );
};

export default ConfirmModal;
