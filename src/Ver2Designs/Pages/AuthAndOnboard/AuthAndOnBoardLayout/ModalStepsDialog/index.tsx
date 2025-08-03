import PrimaryButtonV2 from "@/components/Buttons/PrimaryButtonV2";
import { RootState } from "@/Store/store";
import { Close } from "@mui/icons-material";
import { Box, Dialog, IconButton } from "@mui/material";
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { forwardRef, ReactElement } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { OnboardingSteps, toggleSmDeviceModal } from "../../authStoreSlice";
import OnBoardingSteps from "../../Components/OnBoardingSteps";
import * as styles from "./styles";

const Transition = forwardRef<unknown, TransitionProps & { children: ReactElement<unknown> }>(
    (props, ref) => <Slide direction="right" ref={ref} {...props} />
);


const ModalStepsDialog = () => {
    const { isSmDeviceModalOpen, currentStep } = useSelector((state: RootState) => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleClose = () => {
        console.log("Closing modal for step:", currentStep);
        if (currentStep === OnboardingSteps.PairWallet) {
            navigate("/");
        }
        dispatch(toggleSmDeviceModal(false));
    };

    const startNowBtnClickHandler = () => {
        dispatch(toggleSmDeviceModal(false));
    };
    return (
        <Dialog
            fullScreen
            keepMounted
            open={!!isSmDeviceModalOpen}
            onClose={handleClose}
            slots={{
                transition: Transition,
            }}
        >
            <Box sx={styles.onBoardingStepsModal} id="on-boarding-steps-modal">
                <Box sx={styles.onBoardingStepsModalHeader} id="on-boarding-steps-modal-header">
                    <IconButton onClick={handleClose} color="inherit" aria-label="close">
                        <Close fontSize="inherit" />
                    </IconButton>
                </Box>
                <OnBoardingSteps />
                <Box sx={styles.onBoardingStepsModalFooter} id="on-boarding-steps-modal-footer">
                    <PrimaryButtonV2 size="large" onClick={startNowBtnClickHandler} >
                        Start Now
                    </PrimaryButtonV2>
                </Box>
            </Box>
        </Dialog>
    )
}

export default ModalStepsDialog;