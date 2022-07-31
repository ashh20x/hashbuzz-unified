import React from "react";
import Image from "./ZZ5H.gif"
import { Dialog } from "@mui/material";
export const Loader = ({ open }) => {
  return (
    <Dialog
      open={open}
      PaperProps={{
        style: {
          borderRadius: 11,
          padding: "5px",
          scrollbarWidth: "none",
        },
      }}
    >
      <img src={Image} width="50px;" alt="Loading" />
    </Dialog>
  );
};