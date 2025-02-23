import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";

interface Props {
  open: boolean;
  data: any;
  onClose: () => void;
}

const CampaignCardDetailModal = ({ open, onClose, data }: Props) => {
  const handleClose = () => {
    if (onClose) onClose();
  };
  if (!data) return null;
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      PaperProps={{
        style: {
          borderRadius: 11,
          padding: 0,
          scrollbarWidth: "none",
          background: "#E1D9FF",
        },
      }}
    >
      <DialogTitle>{data.name}</DialogTitle>
      <DialogContent>
        <Typography>{data.tweet_text}</Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between" }} className="media-container">
          {data.media.map((media: any, index: number) => (
            <Box key={index} sx={{ width: "50%" }}>
              <img src={media} alt={media} style={{ width: "100%" }} />
            </Box>
          ))}
        </Box>
        <Typography variant="subtitle2" sx={{ mt: 3 }}>
          Total string count: {String(data.tweet_text).length}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="contained" color="error">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CampaignCardDetailModal;
