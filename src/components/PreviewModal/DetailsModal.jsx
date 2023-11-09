import { Dialog } from "@mui/material";
import React from 'react';
import Typography from "../../Typography/Typography";
import {
    BoxCont,
    CustomParagraph
} from "./PreviewModal.styles";


const DetailsModal = ({
    open,
    setOpen,
    data
}) => {
    const handleClose = () => setOpen(false);
    const theme = {
        weight: 500,
        size: "25px",
        color: "#000000",
        sizeRes: "28px",
    };


    return (
        <Dialog
            open={open}
            onClose={handleClose}
            PaperProps={{
                style: {
                    borderRadius: 11,
                    padding: 0,
                    width: "50%",
                    height: "35%",
                    maxWidth: 1010,
                    scrollbarWidth: "none",
                    background: "#E1D9FF"
                },
            }}
        >

            <BoxCont>
                <Typography theme={theme}>Engagement Detail</Typography>
                <table style={{width: "100%", background: "#cec2ff", marginTop:"40px"}}>
                    <tr style={{textAlign:"center"}}>
                        <th style={{padding:"20px 0px"}}>Retweets</th>
                        <th style={{padding:"20px 0px"}}>Replies</th>
                        <th style={{padding:"20px 0px"}}>Likes</th>
                        <th style={{padding:"20px 0px"}}>Quotes</th>
                    </tr>
                    <tr style={{textAlign:"center"}}>
                        <td style={{padding:"20px 0px"}}> {data?.retweet_count}</td>
                        <td style={{padding:"20px 0px"}}>{data?.reply_count}</td>
                        <td style={{padding:"20px 0px"}}>{data.like_count}</td>
                        <td style={{padding:"20px 0px"}}>{data.quote_count}</td>
                    </tr>
                </table>
            </BoxCont>
            <div style={{ marginBottom: 30 }}></div>
        </Dialog>
    );
};

export default DetailsModal;
