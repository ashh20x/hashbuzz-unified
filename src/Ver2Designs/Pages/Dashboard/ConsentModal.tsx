import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { CurrentUser } from "../../../types";
import { useApiInstance } from "../../../APIConfig/api";
import { useStore } from "../../../Providers/StoreProvider";
import { toast } from "react-toastify";
import { forceLogout } from "../../../Utilities/Constant";

interface ConsentModalProps {
  user: CurrentUser;
}

const ConsentModal = ({ user }: ConsentModalProps) => {
  const [consentModalOpen, setConsentModalOpen] = React.useState(false);
  const { User } = useApiInstance();
  const store = useStore();

  React.useEffect(() => {
    setConsentModalOpen(Boolean(!user?.consent));
    return () =>{
      setConsentModalOpen(false)
    }
  }, [user?.consent]);

  const handleConcentAgree = async () => {
    try {
      const updateUser = await User.updateConsent({ consent: true });
      if (store?.updateState) store.updateState((_d) => ({ ..._d, currentUser: updateUser }));
      setConsentModalOpen(false);
    } catch (error) {
      //@ts-ignore
      toast.error(error?.message ?? "Server Error");
      forceLogout();
    }
  };

  return (
    <Dialog
      open={consentModalOpen}
      onClose={(event, reason) => {}}
      aria-labelledby="twitter-concent-dialog-title"
      aria-describedby="twitter-concent-dialog-description"
    >
      <DialogTitle id="twitter-concent-dialog-title">{"Consent to hashbuzz"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="twitter-concent-dialog-description">
          I authorize hashbuzz to Direct Message (DM) me on need basis to inform me of unclaimed reward or campaign status.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {/* <Button onClick={handleClose}>Disagree</Button> */}
        <Button onClick={handleConcentAgree} disableElevation autoFocus variant="contained">
          Agree
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConsentModal;
