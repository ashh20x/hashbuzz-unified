import React from 'react';
import Image from './ZZ5H.gif';
import { Dialog } from '@mui/material';
export const Loader = ({ open }) => {
  return (
    <Dialog
      open={open}
      PaperProps={{
        style: {
          borderRadius: 11,
          padding: '0px',
          scrollbarWidth: 'none',
        },
      }}
    >
      <img src={Image} width='80px;' alt='Loading' />
    </Dialog>
  );
};
