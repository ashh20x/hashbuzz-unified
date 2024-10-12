import { Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

interface Props {
    open: boolean;
    handleClose: () => void;
    handleAgree: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
}

const XAccountConnectionWarning = ({ open, handleAgree, handleClose }: Props) => {
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {"Connecting your 𝕏 account to Hashbuzz social platform"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    <Typography sx={{ marginBottom: 2 }} variant="body2"> Each Hedera account ID can only be linked to one 𝕏 account. If your 𝕏 account has already been used, you’ll be redirected to the dashboard without making a connection. By proceeding, you agree to this and understand multiple 𝕏 accounts cannot be linked to one Hedera ID.</Typography>
                    <Typography variant="body2">By connecting your 𝕏 account, you consent to our app accessing your public profile, posting on your behalf, and interacting with your account. We will not access private messages or share your information without permission. Please review our privacy policy for details.</Typography>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleAgree} variant="contained" color='primary' autoFocus>
                    Agree & Connect
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default XAccountConnectionWarning