import { Box, Button, Grid } from "@mui/material";
import React from "react";
import { SectionData } from "../types";
import * as styles from "./styles";


const EarningPromoSection: React.FC<SectionData> = ({ sectionId, heading, paragraphs, items }) => {
    const getStartedBtn = (
        <Button sx={styles.startNowBtn} disableElevation size="medium" variant="contained" color="primary">
            Get Started
        </Button>
    );

    return (
        <Box id={sectionId} component="section" sx={styles.sectionStyles}>
            <Grid container>
                <Grid item md={5} sx={styles.headingContent}>
                    <h4>{heading}</h4>
                    {getStartedBtn}
                </Grid>
                <Grid item md={7} sx={styles.content}>
                    {paragraphs.map((text, idx) => (
                        <p key={idx}>{text}</p>
                    ))}
                    {getStartedBtn}
                </Grid>
            </Grid>
            <Grid container id="info-icons-section" sx={styles.infoIconsSection}>
                {items.map((item, idx) => (
                    <Grid item xs={12} sm={12} md={4} key={item.title}>
                        <Box sx={styles.infoIconsContainer} id={item.id || item.title.replace(/\s+/g, "-").toLowerCase()}>
                            {item.icon}
                            <h4>{item.title}</h4>
                            <p>{item.desc}</p>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default EarningPromoSection;
