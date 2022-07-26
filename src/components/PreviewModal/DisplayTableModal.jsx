import React, { useState, useEffect } from 'react';
import { Dialog } from "@mui/material";
import PrimaryButton from "../Buttons/PrimaryButton";
import { APICall, APIAuthCall } from "../../APIConfig/APIServices";
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
import {
    CustomRowHead,
    CustomTable2,
    CustomTableBodyCell,
    CustomTableHeadCell,
} from "../Tables/CreateTable.styles";
import {
    CardSection,
    TableSection,
    StatusSection,
} from "../Pages/CreateCard/CreateTwitterPage.styles";
import { TableRow, TableBody } from "@mui/material";
import { displayTableHeadRow } from "../../Data/TwitterTable"
import { useCookies } from 'react-cookie';

const DisplayTableModal = ({
    open,
    setOpen,
    item
}) => {
    const [cookies, setCookie] = useCookies(['token']);
    const [campaignData, setCampaignData] = useState({});

    useEffect(() => {
        let mounted = true;
        if (mounted) {
            getCampaignData();
        }
        return () => mounted = false;
    }, [])
    const getCampaignData = async() => {
        try {
            const response = await APICall("/campaign/twitter-card/stats/?card_id="+item.id, "GET", null, null, false, cookies.token);
            if (response.data) {
                setCampaignData(response.data)
            }
        }
        catch (err) {

        }
    };
    const handleClose = () => setOpen(false);
    const theme = {
        weight: 500,
        size: "25px",
        color: "#000000",
        sizeRes: "28px",
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
                    maxWidth: 1010,
                    scrollbarWidth: "none",
                },
            }}
        >

            <BoxCont>
                <PrimaryButton
                    text="X"
                    width="20px"
                    height="30px"
                    inverse={true}
                    onclick={handleClose}
                    colors="#EF5A22"
                    border="1px solid #EF5A22"
                    position="absolute"
                    top="10px"
                    right="10px"
                />
                <Typography theme={theme}>Campaign statistics</Typography>
                <TableSection>
                    <CustomTable2 stickyHeader aria-label="simple table">
                        <CustomRowHead>
                            <TableRow>
                                {displayTableHeadRow.map((item) => (
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
                                    <CustomTableBodyCell>{item.retweet_count}</CustomTableBodyCell>
                                    <CustomTableBodyCell>{item.quote_count}</CustomTableBodyCell>
                                    <CustomTableBodyCell>
                                        {item.reply_count}
                                    </CustomTableBodyCell>
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
