import * as React from "react";
import Box from "@mui/material/Box";
import { Dialog } from "@mui/material";
import PrimaryButton from "../Buttons/PrimaryButton";
import {
    BoxCont,
    Border,
    ButtonWrapPrimary
} from "./PreviewModal.styles";
import { TemplateTable } from "../Tables/TemplateTable";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Typography from "../../Typography/Typography";
import ModalTable from "../Tables/ModalTable";


const ConsentModal = ({
    open,
    setOpen,
    submit
}) => {
    let navigate = useNavigate();
    const handleClose = () => setOpen(true);
    const theme = {
        weight: 500,
        size: "25px",
        color: "#000000",
        sizeRes: "28px",
    };
    const body = {
        weight: 700,
        size: "16px",
        color: "#000",
        sizeRes: "16px",
    };

    const handleSubmit = () => {
        navigate("/onboarding");
    };

    return (
        <Dialog
            open={open}
            PaperProps={{
                style: {
                    borderRadius: 11,
                    padding: 0,
                    width: "70%",
                    height: "60%",
                    maxWidth: 1010,
                    scrollbarWidth: "none",
                },
            }}
        >
            <Border>
                <BoxCont>

                    <Typography theme={theme}>Consent</Typography>
                    As per twitter low you couldn't edit twitter's tweet. So before posting this card to twitter read it carefully and then submit to the twiter.
                </BoxCont>
            </Border>
            <ButtonWrapPrimary>
              <PrimaryButton
                text="NO"
                inverse={true}
                onclick={handleClose}
                colors="#EF5A22"
                border="1px solid #EF5A22"
              />
              <PrimaryButton text="ACCEPT" onclick={submit} />
            </ButtonWrapPrimary>
            <div style={{marginBottom:30}}></div>
        </Dialog>
    );
};

export default ConsentModal;
