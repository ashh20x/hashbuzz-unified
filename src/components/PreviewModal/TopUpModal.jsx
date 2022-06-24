import React, { useState } from 'react';
import { Dialog } from "@mui/material";
import PrimaryButton from "../Buttons/PrimaryButton";
import {
    BoxCont,
    ButtonWrapPrimary,
    CustomParagraph,
    CustomInput,
    Label,
    Row
} from "./PreviewModal.styles";
import { useNavigate } from "react-router-dom";
import Typography from "../../Typography/Typography";


const TopUpModal = ({
    open,
    setOpen
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
        console.log(e.target.value)
        const percent = (parseInt(e.target.value)*10)/100 | 0;
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
                    height: "80%",
                    maxWidth: 1010,
                    scrollbarWidth: "none",
                },
            }}
        >

            <BoxCont>

                <Typography theme={theme}>TopUp account</Typography>
                <Row>
                    <>

                        <Label>Amount in HBAR</Label>
                    </>
                    <>
                        <CustomInput
                            placeholder=""
                            onChange={(e)=>handleChange(e)}
                        />
                    </>
                    <>
                        <Label>+ {fee}</Label>
                    </>

                </Row>
                <CustomParagraph>Note 1: the price excludes Hedera network fee</CustomParagraph>
                <CustomParagraph>Note 2: the budget can be used over multiple campaigns</CustomParagraph>
            </BoxCont>

            <ButtonWrapPrimary>
                <PrimaryButton
                    text="CANCEL"
                    inverse={true}
                    onclick={handleClose}
                    colors="#EF5A22"
                    border="1px solid #EF5A22"
                />
                <PrimaryButton text="PAY" onclick={submit} />
            </ButtonWrapPrimary>
            <div style={{ marginBottom: 30 }}></div>
        </Dialog>
    );
};

export default TopUpModal;
