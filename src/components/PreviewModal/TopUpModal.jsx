import { Dialog } from "@mui/material";
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Typography from "../../Typography/Typography";
import PrimaryButton from "../Buttons/PrimaryButton";
import {
    BoxCont,
    ButtonWrapPrimary, CustomInput, CustomParagraph, Label,
    Row
} from "./PreviewModal.styles";


const TopUpModal = ({
    open,
    setOpen,
    isTopUp
}) => {
    const [fee, setfee] = useState(0);

    let navigate = useNavigate();
    const handleClose = () => setOpen(false);
    const theme = {
        weight: 500,
        size: "25px",
        color: "#000000",
        sizeRes: "28px",
    };

    // const handleSubmit = () => {
    //     navigate("/onboarding");
    // };

    const handleChange = (e) => {
        const percent = (parseInt(e.target.value) * 10) / 100 | 0;
        setfee(percent)
    };

    const submit = (e) => {
        console.log(e)
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
                    height: "88%",
                    maxWidth: 1010,
                    scrollbarWidth: "none",
                },
            }}
        >

            <BoxCont>
                <Typography theme={theme}>{isTopUp ? 'TopUp' : 'Reimburse'} account</Typography>
                <Row>
                    <>
                        <Label>Amount in HBAR</Label>
                    </>
                    <>
                        <CustomInput
                            placeholder=""
                            onChange={(e) => handleChange(e)}
                        />
                    </>
                    <>
                        {isTopUp ? <Label>+ {fee}</Label> : <Label></Label>}
                    </>

                </Row>
                {isTopUp ?
                    <>
                        <CustomParagraph>
                            Note1: the specified amount excludes Hedera network fee
                        </CustomParagraph>
                        <CustomParagraph>
                            Note2: the specified amount can be used over multiple campaigns
                        </CustomParagraph>
                        <CustomParagraph>
                            Note3: hashbuzz applies 10% charge fee on top of the specified amount
                        </CustomParagraph>
                    </>
                    :
                    <>
                        <CustomParagraph>
                            Note1: the specified amount excludes Hedera network fee
                        </CustomParagraph>
                        <CustomParagraph>
                            Note2: reimbursements are free of charge
                        </CustomParagraph>
                    </>
                }

            </BoxCont>

            <ButtonWrapPrimary>
                <PrimaryButton
                    text="CANCEL"
                    inverse={true}
                    onclick={handleClose}
                    colors="#EF5A22"
                    border="1px solid #EF5A22"
                />
                <PrimaryButton text={isTopUp ? "PAY" : "Reimburse"} onclick={submit} />
            </ButtonWrapPrimary>
            <div style={{ marginBottom: 30 }}></div>
        </Dialog>
    );
};

export default TopUpModal;
