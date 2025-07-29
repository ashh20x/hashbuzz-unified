import CloseIcon from '@mui/icons-material/Close';
import { Box, IconButton, Modal, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../Store/store';
import { setHowItWorksModalOpen } from '../landingPageStoreSlice';
import * as styles from './styles';


const videoURL = import.meta.env.YOUTUBE_VIDEO_URL || 'https://youtu.be/zqpnoHG3JAk';

const HowItWorksVideoModal = () => {
    const dispatch = useDispatch();
    const isOpen = useSelector((state: RootState) => state.landingPage.howItWorksModalOpen);

    const handleClose = () => {
        dispatch(setHowItWorksModalOpen(false));
    };

    return (
        <Modal open={isOpen} onClose={handleClose}>
            <Box
                id="how-it-works-video-modal"
                sx={styles.howItWorksVideoModalContainer}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">How It Works</Typography>
                    <IconButton onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Box sx={{ position: 'relative', pb: '56.25%', height: 0 }}>
                    <Box
                        component="iframe"
                        src={videoURL}
                        title="How It Works"
                        frameBorder="0"
                        allow="autoplay; encrypted-media"
                        allowFullScreen
                        sx={styles.videoIframeStyles}
                    />
                </Box>
            </Box>
        </Modal>
    );
};

export default HowItWorksVideoModal;
