import HashbuzzIcon from '@/SVGR/HashbuzzIcon';
import CloseIcon from '@mui/icons-material/Close';
import { Box, IconButton, Modal, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../Store/store';
import { setHowItWorksModalOpen } from '../landingPageStoreSlice';
import * as styles from './styles';


const videoURL = import.meta.env.VITE_YOUTUBE_VIDEO_URL || 'https://www.youtube.com/embed/zqpnoHG3JAk?si=PevOSpAtHML7wOQb&controls=0';

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
                <Box sx={styles.modalContainer}>
                    <Box sx={styles.modalHeader}>
                        <h6>
                             <HashbuzzIcon size={40} /> How Hashbuzz Works
                        </h6>
                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                            Watch the video below to learn about Hashbuzz’s features and benefits.
                        </Typography>
                    </Box>
                    <IconButton onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Box sx={{ position: 'relative', pb: '56.25%', height: 0 }}>
                    <Box
                        component="iframe"
                        width="560"
                        height="315"
                        src="https://www.youtube.com/embed/zqpnoHG3JAk?si=PevOSpAtHML7wOQb&controls=0"
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                        sx={styles.videoIframeStyles}
                    />
                </Box>
            </Box>
        </Modal>
    );
};

export default HowItWorksVideoModal;
