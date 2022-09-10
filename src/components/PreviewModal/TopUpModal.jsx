import { Dialog } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useHashconnectService } from "../../HashConnect";
import { useSmartContractServices } from "../../HashConnect/smartcontractService";
import Typography from "../../Typography/Typography";
import { delay } from "../../Utilities/Constant";
import PrimaryButton from "../Buttons/PrimaryButton";
import { BoxCont, ButtonWrapPrimary, CustomInput, CustomParagraph, Label, OverlayBox, Row } from "./PreviewModal.styles";

const TopUpModal = ({ open, setOpen }) => {
  const [amount, setAmount] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const { topUpAccount } = useSmartContractServices();
  const { pairingData, connectToExtension } = useHashconnectService();

  let navigate = useNavigate();
  const handleClose = () => setOpen(false);
  const theme = {
    weight: 500,
    size: "25px",
    color: "#000000",
    sizeRes: "28px",
  };

  const hbarTotinuHbar = (amount = 0) => {
    const topUpAmount = Math.round(amount * Math.pow(10, 8));
    const fee = Math.round(topUpAmount * 0.1);
    const total = topUpAmount + fee;
    return { topUpAmount, fee, total };
  };

  const submit = async (e) => {
    if (!pairingData) {
      setPaymentStatus("Wallet not connected...");
      await connectToExtension();
      setPaymentStatus("Connecting to wallet...");
      await delay(3000);
    }

    // const amountTotopup = (parseFloat(amount) + parseFloat(amount) * 0.1).toFixed(8);
    try {
      setPaymentStatus("Payment initialized keep waiting for popup...");
      const amounts = hbarTotinuHbar(amount);
      const transaction = await topUpAccount({ ...amounts }, pairingData.accountIds[0]);
      if (transaction.success) {
        setPaymentStatus("Payment Done");
        setAmount(0);
        setOpen(false);
        console.log(transaction);
      }
    } catch (err) {
      setPaymentStatus("Payment Error");
      setAmount(0);
      setOpen(false);
      console.log(err);
      toast.error(err.message);
    } finally {
      setPaymentStatus(null);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        style: {
          borderRadius: 11,
          padding: 0,
          width: "85%",
          height: "80%",
          maxWidth: 1010,
          scrollbarWidth: "none",
        },
      }}
    >
      <BoxCont>
        <Typography theme={theme}>TopUp account</Typography>
        <Row>
          <Label>Amount in HBAR</Label>

          <CustomInput placeholder="Amount in hbar" value={amount} onChange={(e) => setAmount(e.target.value)} />

          <Label>+ {(hbarTotinuHbar(amount).fee / Math.pow(10, 8)).toFixed(3)}</Label>
          <Label>=</Label>
          <Label>{(hbarTotinuHbar(amount).total / Math.pow(10, 8)).toFixed(3)}</Label>
        </Row>
        <CustomParagraph>Note 1: the price excludes Hedera network fee</CustomParagraph>
        <CustomParagraph>Note 2: the budget can be used over multiple campaigns</CustomParagraph>
      </BoxCont>

      <ButtonWrapPrimary>
        <PrimaryButton text="CANCEL" inverse={true} onclick={handleClose} colors="#EF5A22" border="1px solid #EF5A22" />
        <PrimaryButton text="PAY" onclick={submit} />
      </ButtonWrapPrimary>
      <div style={{ marginBottom: 30 }}></div>
      {paymentStatus && (
        <OverlayBox>
          <div className="overlay">{paymentStatus}</div>
        </OverlayBox>
      )}
    </Dialog>
  );
};

export default TopUpModal;
