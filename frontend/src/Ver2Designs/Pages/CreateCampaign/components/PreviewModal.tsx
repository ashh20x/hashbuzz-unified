import { Close as CloseIcon, Send as SendIcon } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import React from 'react';
import { useDispatch } from 'react-redux';

// RTK Query hooks
import { useCreateCampaignMutation } from '@/API/campaign';
import { CampaignFormData, resetForm } from '@/Store/campaignSlice';
import { useAppSelector } from '@/Store/store';
import { useNavigate } from 'react-router-dom';

interface PreviewModalProps {
  open: boolean;
  onClose: () => void;
  formData: CampaignFormData;
  displayMedia: string[];
  isYoutube: boolean;
  videoTitle: string | null;
  srcLink: string;
  buttonTags: string[];
}

const PreviewModal: React.FC<PreviewModalProps> = ({
  open,
  onClose,
  formData,
  displayMedia,
  isYoutube,
  videoTitle,
  srcLink,
  buttonTags,
}) => {
  const dispatch = useDispatch();
  const [createCampaign, { isLoading: isCreating }] =
    useCreateCampaignMutation();
  const campaignState = useAppSelector(state => state.campaign);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const formDataToSend = new FormData();

      // Add form fields
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value as string);
      });
      campaignState.mediaFiles.forEach(mediaFile => {
        formDataToSend.append('media', mediaFile.file);
      });

      const result = await createCampaign(formDataToSend).unwrap();

      if (result.success) {
        dispatch(resetForm());
        onClose();
        // Navigate to campaigns list or show success message
        navigate('/app/dashboard');
      }
    } catch (error) {
      console.error('Error creating campaign:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
      <DialogTitle>
        Campaign Preview
        <IconButton
          aria-label='close'
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Card variant='outlined'>
          <CardContent>
            <Typography variant='h6' gutterBottom>
              {formData.name}
            </Typography>

            <Typography variant='body1' paragraph>
              {formData.tweet_text} #hashbuzz
            </Typography>

            {buttonTags.length > 0 && (
              <Stack direction='row' spacing={1} sx={{ mb: 2 }}>
                {buttonTags.map((tag, index) => (
                  <Chip key={index} label={tag.replace('#', '')} size='small' />
                ))}
              </Stack>
            )}

            {/* Media Display */}
            {displayMedia.length > 0 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {displayMedia.map((src, index) => (
                  <Box key={index} sx={{ width: 'calc(50% - 4px)' }}>
                    <img
                      src={src}
                      alt={`media-${index}`}
                      style={{ width: '100%', height: 'auto', borderRadius: 8 }}
                    />
                  </Box>
                ))}
              </Box>
            )}

            {/* YouTube Embed */}
            {isYoutube && srcLink && (
              <Box sx={{ mt: 2 }}>
                {videoTitle && (
                  <Typography variant='subtitle2' gutterBottom>
                    {videoTitle}
                  </Typography>
                )}
                <iframe
                  src={srcLink}
                  width='100%'
                  height='315'
                  frameBorder='0'
                  allow='autoplay; encrypted-media'
                  title='video'
                  style={{ borderRadius: 8 }}
                />
              </Box>
            )}

            {/* Rewards Table */}
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table size='small'>
                <TableHead>
                  <TableRow>
                    <TableCell>Action</TableCell>
                    <TableCell align='right'>Reward</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Comment</TableCell>
                    <TableCell align='right'>
                      {formData.comment_reward}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Like</TableCell>
                    <TableCell align='right'>{formData.like_reward}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Retweet</TableCell>
                    <TableCell align='right'>
                      {formData.retweet_reward}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Quote</TableCell>
                    <TableCell align='right'>{formData.quote_reward}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            <Typography variant='h6' sx={{ mt: 2 }}>
              Budget: {formData.campaign_budget}{' '}
              {formData.type === 'HBAR' ? 'ℏ' : 'Tokens'}
            </Typography>
          </CardContent>
        </Card>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant='contained'
          startIcon={<SendIcon />}
          disabled={isCreating}
        >
          {isCreating ? 'Creating...' : 'Create Campaign'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PreviewModal;
