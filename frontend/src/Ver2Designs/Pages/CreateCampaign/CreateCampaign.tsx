import {
  ArrowBack as ArrowBackIcon,
  Close as CloseIcon,
  EmojiEmotions as EmojiIcon,
  Image as ImageIcon,
  Preview as PreviewIcon,
  YouTube as YouTubeIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import Picker, { EmojiClickData } from 'emoji-picker-react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// RTK Query hooks
import { useGetTokenBalancesQuery } from '@/API/user';

// Redux slice actions
import {
  addEmoji,
  addMediaFile,
  removeMediaFile,
  setAllTokens,
  setOpen,
  setSelectedToken,
  setVideoTitle,
  setYouTubeUrl,
  toggleAddMedia,
  toggleEmojis,
  toggleYoutube,
  updateFormField,
  validateBudget,
} from '@/Store/campaignSlice';

// Types
import { RootState } from '@/Store/store';
import { TokenBalances } from '@/types';
import { CreatedCampaignPreviewModal } from './components';

const CreateCampaign: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state
  const campaignState = useSelector((state: RootState) => state.campaign);

  // RTK Query hooks
  const { data: tokenBalances, isLoading: isLoadingTokens } =
    useGetTokenBalancesQuery();

  // Local state for file inputs
  const [fileInputKey, setFileInputKey] = useState(0);

  // Initialize tokens when data is loaded
  useEffect(() => {
    if (tokenBalances) {
      const formattedTokens = tokenBalances.map((token: TokenBalances) => ({
        value: token.token_id,
        token_symbol: token.token_symbol || '',
        tokenBalance: token.available_balance || 0,
      }));
      dispatch(setAllTokens(formattedTokens));
    }
  }, [tokenBalances, dispatch]);

  // Handlers
  const handleBack = () => {
    navigate('/app/dashboard');
  };

  const handleFormFieldChange =
    (field: keyof typeof campaignState.formData) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      dispatch(updateFormField({ field, value: event.target.value }));
    };

  const handleSelectChange =
    (field: keyof typeof campaignState.formData) =>
    (event: SelectChangeEvent) => {
      dispatch(updateFormField({ field, value: event.target.value }));
    };

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const fileType = file.type;

    dispatch(
      addMediaFile({
        file,
        type: fileType,
        url,
      })
    );

    // Reset file input to allow selecting the same file again
    setFileInputKey(prev => prev + 1);
  };

  const handleYouTubeUrlChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const url = event.target.value;
    dispatch(setYouTubeUrl(url));

    // Fetch YouTube title
    if (url.includes('youtube') || url.includes('youtu.be')) {
      let videoId = '';
      if (url.indexOf('youtube') !== -1) {
        const urlParts = url.split('?v=');
        videoId = urlParts?.[1]?.substring(0, 11) || '';
      } else if (url.indexOf('youtu.be') !== -1) {
        const urlParts = url.replace('//', '').split('/');
        videoId = urlParts[1]?.substring(0, 11) || '';
      }

      if (videoId) {
        const vidurl = `https://www.youtube.com/watch?v=${videoId}`;
        fetch(`https://noembed.com/embed?dataType=json&url=${vidurl}`)
          .then(res => res.json())
          .then(data => dispatch(setVideoTitle(data.title)))
          .catch(console.error);
      }
    }
  };

  const handleBudgetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const budget = event.target.value;
    // This would need user balance from context/store
    // For now, using a placeholder value
    const userBalance = 1000000000; // 10 HBAR in tiny hbar
    dispatch(validateBudget({ budget, userBalance }));
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    if (270 - campaignState.formData.tweet_text.length >= 2) {
      dispatch(addEmoji(emojiData.emoji));
    }
  };

  const handlePreview = () => {
    dispatch(setOpen(true));
  };

  const handleRemoveMedia = (index: number) => {
    dispatch(removeMediaFile(index));
  };

  const isFormValid = () => {
    return (
      campaignState.formData.name &&
      campaignState.formData.tweet_text &&
      campaignState.formData.campaign_budget &&
      !campaignState.buttonDisabled
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Stack direction='row' alignItems='center' spacing={2} sx={{ mb: 3 }}>
        <IconButton onClick={handleBack} size='large'>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant='h4' component='h1'>
          Create Campaign
        </Typography>
      </Stack>

      <Box sx={{ display: 'flex', gap: 4 }}>
        {/* Left Side - Form */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack spacing={3}>
            {/* Campaign Title */}
            <TextField
              label='Campaign Title'
              fullWidth
              value={campaignState.formData.name}
              onChange={handleFormFieldChange('name')}
              error={!!campaignState.errorNameMessage}
              helperText={campaignState.errorNameMessage}
              required
            />

            {/* Token Type Selection */}
            <FormControl fullWidth>
              <InputLabel>Token Type</InputLabel>
              <Select
                value={campaignState.formData.type}
                label='Token Type'
                onChange={handleSelectChange('type')}
              >
                <MenuItem value='HBAR'>HBAR</MenuItem>
                <MenuItem value='FUNGIBLE'>Fungible Token</MenuItem>
              </Select>
            </FormControl>

            {/* Token Selection (if Fungible) */}
            {campaignState.formData.type === 'FUNGIBLE' && (
              <FormControl fullWidth>
                <InputLabel>Select Token</InputLabel>
                <Select
                  value={campaignState.selectedToken}
                  label='Select Token'
                  onChange={e => dispatch(setSelectedToken(e.target.value))}
                  disabled={isLoadingTokens}
                >
                  <MenuItem value=''>Select a token</MenuItem>
                  {campaignState.allTokens.map(token => (
                    <MenuItem
                      key={token.value}
                      value={token.value}
                      disabled={token.tokenBalance <= 0}
                    >
                      {`${token.tokenBalance} - ${token.token_symbol} - ${token.value}`}
                    </MenuItem>
                  ))}
                </Select>
                {isLoadingTokens && <LinearProgress />}
              </FormControl>
            )}

            {/* Tweet Text */}
            <TextField
              label='Tweet Text'
              multiline
              rows={4}
              fullWidth
              value={campaignState.formData.tweet_text}
              onChange={handleFormFieldChange('tweet_text')}
              error={!!campaignState.errorTextMessage}
              helperText={campaignState.errorTextMessage}
              inputProps={{ maxLength: 270 }}
              required
            />

            {/* Character count and emoji button */}
            <Stack
              direction='row'
              alignItems='center'
              justifyContent='space-between'
            >
              <Button
                startIcon={<EmojiIcon />}
                onClick={() => dispatch(toggleEmojis())}
                size='small'
              >
                Emoji
              </Button>
              <Typography variant='caption' color='text.secondary'>
                {270 - campaignState.formData.tweet_text.length} characters
                remaining
              </Typography>
            </Stack>

            {/* Emoji Picker */}
            {campaignState.showEmojis && (
              <Box>
                <Picker onEmojiClick={handleEmojiClick} />
              </Box>
            )}

            {/* Hashtag Chips */}
            {campaignState.buttonTags.length > 0 && (
              <Stack direction='row' spacing={1} flexWrap='wrap'>
                {campaignState.buttonTags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag.replace('#', '')}
                    size='small'
                    color='primary'
                    variant='outlined'
                  />
                ))}
              </Stack>
            )}

            {/* Rewards Table */}
            <Card>
              <CardContent>
                <Typography variant='h6' gutterBottom>
                  Reward Settings
                </Typography>
                <TableContainer>
                  <Table size='small'>
                    <TableHead>
                      <TableRow>
                        <TableCell>Action</TableCell>
                        <TableCell align='right'>Reward Amount</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>Comment</TableCell>
                        <TableCell align='right'>
                          <TextField
                            type='number'
                            size='small'
                            value={campaignState.formData.comment_reward}
                            onChange={handleFormFieldChange('comment_reward')}
                            inputProps={{ min: 0, step: 0.1 }}
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Like</TableCell>
                        <TableCell align='right'>
                          <TextField
                            type='number'
                            size='small'
                            value={campaignState.formData.like_reward}
                            onChange={handleFormFieldChange('like_reward')}
                            inputProps={{ min: 0, step: 0.1 }}
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Retweet</TableCell>
                        <TableCell align='right'>
                          <TextField
                            type='number'
                            size='small'
                            value={campaignState.formData.retweet_reward}
                            onChange={handleFormFieldChange('retweet_reward')}
                            inputProps={{ min: 0, step: 0.1 }}
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Quote Tweet</TableCell>
                        <TableCell align='right'>
                          <TextField
                            type='number'
                            size='small'
                            value={campaignState.formData.quote_reward}
                            onChange={handleFormFieldChange('quote_reward')}
                            inputProps={{ min: 0, step: 0.1 }}
                          />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Stack>
        </Box>

        {/* Right Side - Preview and Settings */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack spacing={3}>
            {/* Budget Input */}
            <TextField
              label='Campaign Budget'
              type='number'
              fullWidth
              value={campaignState.formData.campaign_budget}
              onChange={handleBudgetChange}
              error={!!campaignState.budgetMessage}
              helperText={campaignState.budgetMessage}
              inputProps={{ min: 1, step: 0.1 }}
              required
            />

            {/* Media Options */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={campaignState.addMedia}
                  onChange={() => dispatch(toggleAddMedia())}
                />
              }
              label='Add media to campaign'
            />

            {/* Media Upload Section */}
            {campaignState.addMedia && (
              <Card>
                <CardContent>
                  <Typography variant='h6' gutterBottom>
                    Media Upload
                  </Typography>

                  <Stack direction='row' spacing={2} sx={{ mb: 2 }}>
                    <input
                      accept='image/png, image/gif, image/jpeg, image/jpg'
                      style={{ display: 'none' }}
                      id='file-upload'
                      type='file'
                      key={fileInputKey}
                      onChange={handleImageChange}
                    />
                    <label htmlFor='file-upload'>
                      <Button
                        variant='outlined'
                        component='span'
                        startIcon={<ImageIcon />}
                      >
                        Upload Image
                      </Button>
                    </label>

                    <Button
                      variant='outlined'
                      startIcon={<YouTubeIcon />}
                      onClick={() => dispatch(toggleYoutube())}
                    >
                      YouTube
                    </Button>
                  </Stack>

                  {/* YouTube URL Input */}
                  {campaignState.isYoutube && (
                    <TextField
                      label='YouTube URL'
                      fullWidth
                      placeholder='https://www.youtube.com/watch?v=...'
                      onChange={handleYouTubeUrlChange}
                      sx={{ mb: 2 }}
                    />
                  )}

                  {/* Media Preview */}
                  {campaignState.displayMedia.length > 0 && (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {campaignState.displayMedia.map((src, index) => (
                        <Box
                          key={index}
                          sx={{
                            width: 'calc(50% - 4px)',
                            position: 'relative',
                          }}
                        >
                          <Box position='relative'>
                            <img
                              src={src}
                              alt={`upload-${index}`}
                              style={{
                                width: '100%',
                                height: 'auto',
                                borderRadius: 8,
                              }}
                            />
                            <IconButton
                              size='small'
                              onClick={() => handleRemoveMedia(index)}
                              sx={{
                                position: 'absolute',
                                top: 4,
                                right: 4,
                                backgroundColor: 'rgba(0,0,0,0.5)',
                                color: 'white',
                                '&:hover': {
                                  backgroundColor: 'rgba(0,0,0,0.7)',
                                },
                              }}
                            >
                              <CloseIcon fontSize='small' />
                            </IconButton>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  )}

                  {/* YouTube Embed Preview */}
                  {campaignState.isYoutube &&
                    campaignState.srcLink &&
                    !campaignState.displayMedia.length && (
                      <Box>
                        {campaignState.videoTitle && (
                          <Typography variant='subtitle2' gutterBottom>
                            {campaignState.videoTitle}
                          </Typography>
                        )}
                        <iframe
                          src={campaignState.srcLink}
                          width='100%'
                          height='315'
                          frameBorder='0'
                          allow='autoplay; encrypted-media'
                          title='video preview'
                          style={{ borderRadius: 8 }}
                        />
                      </Box>
                    )}
                </CardContent>
              </Card>
            )}

            {/* Preview Card */}
            <Card>
              <CardContent>
                <Typography variant='h6' gutterBottom>
                  Tweet Preview
                </Typography>

                {campaignState.formData.name && (
                  <Typography
                    variant='subtitle1'
                    fontWeight='bold'
                    gutterBottom
                  >
                    {campaignState.formData.name}
                  </Typography>
                )}

                <Typography variant='body1' paragraph>
                  {campaignState.formData.tweet_text ||
                    'Start typing your tweet campaign...'}
                  {campaignState.formData.tweet_text && ' #hashbuzz'}
                </Typography>

                {campaignState.buttonTags.length > 0 && (
                  <Stack direction='row' spacing={1} flexWrap='wrap'>
                    {campaignState.buttonTags.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag.replace('#', '')}
                        size='small'
                        color='primary'
                      />
                    ))}
                  </Stack>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Button
              variant='contained'
              size='large'
              startIcon={<PreviewIcon />}
              onClick={handlePreview}
              disabled={!isFormValid()}
              fullWidth
            >
              Preview & Create Campaign
            </Button>
          </Stack>
        </Box>
      </Box>

      {/* Preview Modal */}
      <CreatedCampaignPreviewModal
        open={campaignState.open}
        onClose={() => dispatch(setOpen(false))}
        formData={{
          ...campaignState.formData,
          fungible_token_id: campaignState.selectedToken,
        }}
        displayMedia={campaignState.displayMedia}
        isYoutube={campaignState.isYoutube}
        videoTitle={campaignState.videoTitle}
        srcLink={campaignState.srcLink}
        buttonTags={campaignState.buttonTags}
      />
    </Box>
  );
};

export default CreateCampaign;
