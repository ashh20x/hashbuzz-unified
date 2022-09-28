import { Dialog } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useHashconnectService } from "../../HashConnect";
import { useSmartContractServices } from "../../HashConnect/smartcontractService";
import { useStore } from "../../Providers/StoreProvider";
import Typography from "../../Typography/Typography";
import { delay } from "../../Utilities/Constant";
import PrimaryButton from "../Buttons/PrimaryButton";
import { BoxCont, ButtonWrapPrimary, CustomInput, CustomParagraph, Label, Row } from "./PreviewModal.styles";

const TopUpModal = ({ open, setOpen, isTopUp }) => {
  const [amount, setAmount] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const { topUpAccount } = useSmartContractServices();
  const { pairingData, connectToExtension } = useHashconnectService();
  const [fee, setfee] = useState(0);
  const {data} = useStore()

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

  // const handleSubmit = () => {
  //     navigate("/onboarding");
  // };
  const submitReimburse = async (e) => {};

  const submitPay = async (e) => {
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
      const transaction = await topUpAccount({ ...amounts }, data?.user?.hedera_wallet_id);
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

  const handleChange = (e) => {
    const percent = ((parseInt(e.target.value) * 10) / 100) | 0;
    setfee(percent);
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
        <Typography theme={theme}>{isTopUp ? "TopUp" : "Reimburse"} account</Typography>
        <Row>
          <>
            <Label>Amount in HBAR</Label>
          </>
          <>
            <CustomInput placeholder="Amount in hbar" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </>
          <>
            {isTopUp ? (
              <>
                <Label>+ {(hbarTotinuHbar(amount).fee / Math.pow(10, 8)).toFixed(3)}</Label>
                <Label>=</Label>
                <Label>{(hbarTotinuHbar(amount).total / Math.pow(10, 8)).toFixed(3)}</Label>
              </>
            ) : (
              <Label></Label>
            )}
          </>
        </Row>
        {isTopUp ? (
          <>
            <CustomParagraph>Note1: the specified amount excludes Hedera network fee</CustomParagraph>
            <CustomParagraph>Note2: the specified amount can be used over multiple campaigns</CustomParagraph>
            <CustomParagraph>Note3: hashbuzz applies 10% charge fee on top of the specified amount</CustomParagraph>
          </>
        ) : (
          <>
            <CustomParagraph>Note1: the specified amount excludes Hedera network fee</CustomParagraph>
            <CustomParagraph>Note2: reimbursements are free of charge</CustomParagraph>
          </>
        )}
      </BoxCont>

      <ButtonWrapPrimary>
        <PrimaryButton text="CANCEL" inverse={true} onclick={handleClose} colors="#EF5A22" border="1px solid #EF5A22" />
        {isTopUp ? <PrimaryButton text={"PAY"} onclick={submitPay} /> : <PrimaryButton text={"Reimburse"} onclick={submitReimburse} />}
      </ButtonWrapPrimary>
      <div style={{ marginBottom: 30 }}></div>
    </Dialog>
  );
};

export default TopUpModal;
