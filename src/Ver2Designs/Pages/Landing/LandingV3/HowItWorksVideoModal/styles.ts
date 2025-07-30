import { SxProps, Theme } from "@mui/material";


export const howItWorksVideoModalContainer: SxProps<Theme> = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 2,
  borderRadius: 2,
  width: { xs: '95vw', sm: '90vw', md: '80vw', lg: '60vw' },
  maxWidth: 900,
  maxHeight: '80vh',
  overflowY: 'auto',
};

export const modalContainer = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 };

export const videoIframeStyles: SxProps<Theme> = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  border: 0,
};

export const modalHeader: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: 0.5,
  '& h6': {
    fontSize: '1.25rem',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    gap: 1,
  },
};
