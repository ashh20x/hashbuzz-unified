import { Box, Stack, Typography } from "@mui/material";
import SectionHeader from "../../Components/SectionHeader";
import * as styles from "./styles";
import XPlatformIcon from "@/SVGR/XPlatformIcon";
import XPublicProfileCard from "./XPublicProfileCard";


const ConnectXSuccess = () => {
    return (
        <Box sx={styles.conectXSuccess}>
            <SectionHeader
                title="Personal 𝕏 linked."
                subtitle=""
            />
            <Stack direction="column" justifyContent="center" alignItems="center">
                <Box>
                    <XPlatformIcon size={80} />
                </Box>
                <Typography variant="h3">Connection Successful</Typography>
                <Typography>Your personal 𝕏 account has been successfully linked.</Typography>

                <XPublicProfileCard handle="ops295" />

            </Stack>
        </Box>
    );
};

export default ConnectXSuccess;
