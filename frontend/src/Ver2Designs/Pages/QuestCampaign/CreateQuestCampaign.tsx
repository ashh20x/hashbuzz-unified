import { useQuestCampaign } from '@/hooks/useQuestCampaign';
import {
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
  Publish as PublishIcon,
  RadioButtonChecked as RadioButtonCheckedIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  Save as SaveIcon,
  Upload as UploadIcon,
  OndemandVideo as VideoIcon,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Collapse,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import {
  BudgetValidationResult,
  useBudgetValidation,
} from '../../../hooks/useBudgetValidation';
import { useRemoteConfig } from '../../../hooks/useRemoteConfig';

interface CreateQuestCampaignProps {
  onBack?: () => void;
}

interface QuestionOption {
  id: string;
  text: string;
}

const CreateQuestCampaign: React.FC<CreateQuestCampaignProps> = ({
  onBack,
}) => {
  // Remote config to check if Quest feature is enabled
  const config = useRemoteConfig();
  const isQuestEnabled =
    config && typeof config === 'object' && 'quest_campaign' in config
      ? (config.quest_campaign as boolean)
      : false;

  // Campaign management hook
  const {
    formData,
    errors,
    isDraftLoading,
    isPublishLoading,
    isLoading,
    savedDraftId,
    handleFieldChange,
    saveDraft,
    publishCampaign,
    resetForm,
    getUserBalance,
    getMaxBudget,
  } = useQuestCampaign();

  // Budget validation hook
  const { validateBudget, getTokenOptions } = useBudgetValidation();

  // Local state for question options
  const [options, setOptions] = useState<QuestionOption[]>([
    { id: '1', text: '' },
    { id: '2', text: '' },
  ]);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState<number | null>(
    null
  );
  const [showInstructions, setShowInstructions] = useState(true);
  const [budgetValidation, setBudgetValidation] =
    useState<BudgetValidationResult | null>(null);

  // Media state
  const [mediaTab, setMediaTab] = useState<'image' | 'video'>('image');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]); // Preview URLs
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]); // Actual File objects
  const [youtubeUrl, setYoutubeUrl] = useState<string>('');
  const [youtubeEmbedUrl, setYoutubeEmbedUrl] = useState<string>('');

  // Handle adding new option
  const handleAddOption = () => {
    if (options.length >= 6) {
      return; // Maximum 6 options
    }
    const newId = String(options.length + 1);
    setOptions([...options, { id: newId, text: '' }]);
  };

  // Handle removing option
  const handleRemoveOption = (index: number) => {
    if (options.length <= 2) {
      return; // Minimum 2 options
    }
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);

    // Reset correct answer if it was the removed option
    if (correctAnswerIndex === index) {
      setCorrectAnswerIndex(null);
    } else if (correctAnswerIndex !== null && correctAnswerIndex > index) {
      setCorrectAnswerIndex(correctAnswerIndex - 1);
    }
  };

  // Handle option text change
  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index].text = value;
    setOptions(newOptions);
  };

  // Handle token type change
  const handleTokenTypeChange = (event: SelectChangeEvent) => {
    const newType = event.target.value as 'HBAR' | 'FUNGIBLE';
    handleFieldChange('type')(event);

    // Reset token selection when switching types
    if (newType === 'HBAR') {
      handleFieldChange('fungible_token_id')({ target: { value: '' } });
    }
  };

  // Handle budget change with validation
  const handleBudgetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const budget = Number(event.target.value) || 0;
    handleFieldChange('campaign_budget')(event);

    // Validate budget in real-time
    const validation = validateBudget(
      budget,
      formData.type,
      formData.fungible_token_id
    );
    setBudgetValidation(validation);
  };

  // Media handling functions
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    // Limit to 4 images
    if (uploadedImages.length + files.length > 4) {
      toast.error('Maximum 4 images allowed');
      return;
    }

    const fileArray = Array.from(files);
    const validFiles: File[] = [];

    // Convert files to data URLs for preview and collect valid files
    fileArray.forEach(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`);
        return;
      }

      validFiles.push(file);

      const reader = new FileReader();
      reader.onload = e => {
        const result = e.target?.result;
        if (result && typeof result === 'string') {
          setUploadedImages(prev => [...prev, result]);
        }
      };
      reader.readAsDataURL(file);
    });

    // Store actual File objects
    setUploadedFiles(prev => [...prev, ...validFiles]);
  };

  const handleRemoveImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const extractYouTubeId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
      /youtube\.com\/embed\/([^&\n?#]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    return null;
  };

  const handleYouTubeUrlChange = (value: string) => {
    setYoutubeUrl(value);

    if (value.trim()) {
      const videoId = extractYouTubeId(value);
      if (videoId) {
        setYoutubeEmbedUrl(`https://www.youtube.com/embed/${videoId}`);
      } else {
        setYoutubeEmbedUrl('');
        if (value.length > 10) {
          toast.error('Invalid YouTube URL');
        }
      }
    } else {
      setYoutubeEmbedUrl('');
    }
  };

  const handleMediaTabChange = (
    _event: React.SyntheticEvent,
    newValue: 'image' | 'video'
  ) => {
    setMediaTab(newValue);
    // Clear the other tab's data when switching
    if (newValue === 'image') {
      setYoutubeUrl('');
      setYoutubeEmbedUrl('');
    } else {
      setUploadedImages([]);
      setUploadedFiles([]);
    }
  };

  // Validate quest form
  const validateQuestForm = (): boolean => {
    // Check if all options have text
    const emptyOptions = options.some(opt => !opt.text.trim());
    if (emptyOptions) {
      toast.error('All options must have text');
      return false;
    }

    // Check if correct answer is selected
    if (correctAnswerIndex === null) {
      toast.error('Please select the correct answer');
      return false;
    }

    return true;
  };

  // Handle save draft
  const handleSaveDraft = async () => {
    if (!validateQuestForm()) return;

    // Prepare media data based on selected tab
    // For images: use File objects, for YouTube: send URL as string (will be handled separately)
    const mediaData: File[] | string[] =
      mediaTab === 'image'
        ? uploadedFiles
        : youtubeEmbedUrl
          ? [youtubeEmbedUrl]
          : [];

    await saveDraft({
      ...formData,
      question_options: options.map(opt => opt.text),
      correct_answer_index: correctAnswerIndex,
      media: mediaData,
    });
  };

  // Handle publish
  const handlePublish = async () => {
    if (!validateQuestForm()) return;

    // Prepare media data based on selected tab
    const mediaData: File[] | string[] =
      mediaTab === 'image'
        ? uploadedFiles
        : youtubeEmbedUrl
          ? [youtubeEmbedUrl]
          : [];

    await publishCampaign({
      ...formData,
      question_options: options.map(opt => opt.text),
      correct_answer_index: correctAnswerIndex,
      media: mediaData,
    });
  };

  // Get current balance and limits
  const userBalance = getUserBalance();
  const maxBudget = getMaxBudget();
  const tokenOptions = getTokenOptions();

  // Don't render if feature is disabled
  if (!isQuestEnabled) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 3, textAlign: 'center' }}>
        <Alert severity='info'>
          <Typography variant='h6'>
            Quest Campaign Feature Not Available
          </Typography>
          <Typography variant='body2' sx={{ mt: 1 }}>
            The Quest campaign feature is currently disabled. Please contact
            support if you need access.
          </Typography>
        </Alert>
        {onBack && (
          <Button
            variant='outlined'
            startIcon={<ArrowBackIcon />}
            onClick={onBack}
            sx={{ mt: 2 }}
          >
            Back
          </Button>
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Stack
        direction='row'
        alignItems='center'
        justifyContent='space-between'
        sx={{ mb: 3 }}
      >
        <Stack direction='row' alignItems='center' spacing={2}>
          {onBack && (
            <IconButton onClick={onBack} size='small'>
              <ArrowBackIcon />
            </IconButton>
          )}
          <Box>
            <Typography variant='h4' component='h1'>
              Create Quest Campaign
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Engage users with quiz-based reward campaigns
            </Typography>
          </Box>
        </Stack>

        <Stack direction='row' spacing={1}>
          <Button
            variant='text'
            size='small'
            onClick={() => setShowInstructions(!showInstructions)}
          >
            {showInstructions ? 'Hide' : 'Show'} Instructions
          </Button>
          <Button variant='outlined' onClick={resetForm} disabled={isLoading}>
            Reset Form
          </Button>
        </Stack>
      </Stack>

      {/* Loading Progress */}
      {isLoading && <LinearProgress sx={{ mb: 2 }} />}

      {/* Instructions */}
      <Collapse in={showInstructions}>
        <Alert severity='info' sx={{ mb: 3 }}>
          <Typography variant='subtitle2' gutterBottom>
            Quest Campaign Instructions
          </Typography>
          <Typography variant='body2' component='div'>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              <li>Create engaging questions with multiple choice answers</li>
              <li>Add 2-6 answer options for each question</li>
              <li>Select the correct answer from your options</li>
              <li>Set budget and expected participants</li>
              <li>
                Users who answer correctly will share the reward pool equally
              </li>
            </ul>
          </Typography>
          <Box
            sx={{
              mt: 2,
              p: 2,
              bgcolor: 'background.paper',
              borderRadius: 1,
            }}
          >
            <Typography variant='caption' display='block'>
              <strong>Your Balance:</strong> {userBalance.toLocaleString()}{' '}
              {formData.type === 'HBAR' ? 'HBAR' : 'tokens'}
            </Typography>
            <Typography variant='caption' display='block'>
              <strong>Recommended Budget:</strong> {maxBudget.toLocaleString()}{' '}
              {formData.type === 'HBAR' ? 'HBAR' : 'tokens'}
            </Typography>
          </Box>
        </Alert>
      </Collapse>

      {/* Draft Status */}
      {savedDraftId && (
        <Alert severity='success' sx={{ mb: 3 }}>
          <Stack direction='row' alignItems='center' spacing={1}>
            <CheckCircleIcon fontSize='small' />
            <Typography variant='body2'>
              Draft saved successfully! Draft ID: {savedDraftId}
            </Typography>
          </Stack>
        </Alert>
      )}

      {/* Main Form */}
      <Card>
        <CardContent sx={{ p: 4 }}>
          <Stack spacing={4}>
            {/* Campaign Name */}
            <TextField
              label='Quest Campaign Name'
              value={formData.name}
              onChange={handleFieldChange('name')}
              error={!!errors.name}
              helperText={
                errors.name ||
                `${formData.name.length}/50 characters. Make it catchy and descriptive.`
              }
              placeholder='e.g., HashBuzz Trivia Challenge'
              required
              fullWidth
              inputProps={{ maxLength: 50 }}
            />

            {/* Question Section */}
            <Paper elevation={0} sx={{ p: 3, bgcolor: 'grey.50' }}>
              <Typography variant='h6' gutterBottom>
                Quest Question
              </Typography>
              <TextField
                label='Your Question'
                value={formData.question}
                onChange={handleFieldChange('question')}
                error={!!errors.question}
                helperText={
                  errors.question ||
                  `${formData.question?.length || 0}/280 characters. Ask a clear, engaging question.`
                }
                placeholder='e.g., What year was HashBuzz founded?'
                required
                multiline
                rows={3}
                fullWidth
                inputProps={{ maxLength: 280 }}
                sx={{ mb: 3 }}
              />

              {/* Options List */}
              <Typography variant='subtitle2' gutterBottom sx={{ mt: 2 }}>
                Answer Options ({options.length}/6)
              </Typography>
              <List sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
                {options.map((option, index) => (
                  <ListItem
                    key={option.id}
                    sx={{
                      border: '1px solid',
                      borderColor:
                        correctAnswerIndex === index
                          ? 'success.main'
                          : 'divider',
                      borderRadius: 1,
                      mb: 1,
                      bgcolor:
                        correctAnswerIndex === index
                          ? 'success.lighter'
                          : 'background.paper',
                    }}
                  >
                    <ListItemIcon>
                      <IconButton
                        size='small'
                        onClick={() => setCorrectAnswerIndex(index)}
                        color={
                          correctAnswerIndex === index ? 'success' : 'default'
                        }
                      >
                        {correctAnswerIndex === index ? (
                          <RadioButtonCheckedIcon />
                        ) : (
                          <RadioButtonUncheckedIcon />
                        )}
                      </IconButton>
                    </ListItemIcon>
                    <TextField
                      value={option.text}
                      onChange={e => handleOptionChange(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      fullWidth
                      size='small'
                      variant='standard'
                      InputProps={{
                        disableUnderline: true,
                      }}
                    />
                    <ListItemSecondaryAction>
                      {options.length > 2 && (
                        <IconButton
                          edge='end'
                          size='small'
                          onClick={() => handleRemoveOption(index)}
                        >
                          <DeleteIcon fontSize='small' />
                        </IconButton>
                      )}
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>

              <Button
                startIcon={<AddIcon />}
                onClick={handleAddOption}
                disabled={options.length >= 6}
                sx={{ mt: 1 }}
                size='small'
              >
                Add Option
              </Button>

              {correctAnswerIndex !== null && (
                <Alert severity='success' sx={{ mt: 2 }}>
                  <Typography variant='body2'>
                    Correct Answer: Option {correctAnswerIndex + 1} -{' '}
                    {options[correctAnswerIndex].text}
                  </Typography>
                </Alert>
              )}
            </Paper>

            {/* Media Section (Optional) */}
            <Paper elevation={0} sx={{ p: 3, bgcolor: 'grey.50' }}>
              <Typography variant='h6' gutterBottom>
                Media (Optional)
              </Typography>
              <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
                Add images or a YouTube video to make your quest more engaging
              </Typography>

              <Tabs
                value={mediaTab}
                onChange={handleMediaTabChange}
                sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
              >
                <Tab
                  icon={<ImageIcon />}
                  iconPosition='start'
                  label='Upload Images'
                  value='image'
                />
                <Tab
                  icon={<VideoIcon />}
                  iconPosition='start'
                  label='YouTube Video'
                  value='video'
                />
              </Tabs>

              {/* Image Upload Tab */}
              {mediaTab === 'image' && (
                <Box>
                  <Button
                    variant='outlined'
                    component='label'
                    startIcon={<UploadIcon />}
                    disabled={uploadedImages.length >= 4}
                    sx={{ mb: 2 }}
                  >
                    Upload Image
                    <input
                      type='file'
                      hidden
                      accept='image/*'
                      multiple
                      onChange={handleImageUpload}
                    />
                  </Button>
                  <Typography
                    variant='caption'
                    display='block'
                    color='text.secondary'
                    sx={{ mb: 2 }}
                  >
                    Maximum 4 images allowed. Supported formats: JPG, PNG, GIF
                  </Typography>

                  {uploadedImages.length > 0 && (
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                          xs: '1fr',
                          sm: '1fr 1fr',
                          md: 'repeat(4, 1fr)',
                        },
                        gap: 2,
                      }}
                    >
                      {uploadedImages.map((image, index) => (
                        <Card key={index}>
                          <CardMedia
                            component='img'
                            height='140'
                            image={image}
                            alt={`Uploaded ${index + 1}`}
                            sx={{ objectFit: 'cover' }}
                          />
                          <Box sx={{ p: 1, textAlign: 'center' }}>
                            <IconButton
                              size='small'
                              color='error'
                              onClick={() => handleRemoveImage(index)}
                            >
                              <CloseIcon fontSize='small' />
                            </IconButton>
                          </Box>
                        </Card>
                      ))}
                    </Box>
                  )}

                  {uploadedImages.length === 0 && (
                    <Alert severity='info'>
                      <Typography variant='body2'>
                        No images uploaded yet. Click "Upload Image" to add
                        media.
                      </Typography>
                    </Alert>
                  )}
                </Box>
              )}

              {/* YouTube Video Tab */}
              {mediaTab === 'video' && (
                <Box>
                  <TextField
                    label='YouTube Video URL'
                    value={youtubeUrl}
                    onChange={e => handleYouTubeUrlChange(e.target.value)}
                    placeholder='https://www.youtube.com/watch?v=...'
                    fullWidth
                    helperText='Paste a YouTube video URL to embed it in your quest'
                    sx={{ mb: 2 }}
                  />

                  {youtubeEmbedUrl && (
                    <Paper elevation={2} sx={{ p: 2, bgcolor: 'black' }}>
                      <Box
                        sx={{
                          position: 'relative',
                          paddingBottom: '56.25%', // 16:9 aspect ratio
                          height: 0,
                          overflow: 'hidden',
                        }}
                      >
                        <iframe
                          src={youtubeEmbedUrl}
                          title='YouTube video preview'
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            border: 'none',
                          }}
                          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                          allowFullScreen
                        />
                      </Box>
                      <Stack
                        direction='row'
                        justifyContent='space-between'
                        alignItems='center'
                        sx={{ mt: 2 }}
                      >
                        <Typography variant='caption' color='white'>
                          Preview
                        </Typography>
                        <Button
                          size='small'
                          color='error'
                          variant='outlined'
                          onClick={() => handleYouTubeUrlChange('')}
                        >
                          Remove Video
                        </Button>
                      </Stack>
                    </Paper>
                  )}

                  {!youtubeEmbedUrl && youtubeUrl && (
                    <Alert severity='warning'>
                      <Typography variant='body2'>
                        Invalid YouTube URL. Please enter a valid YouTube video
                        link.
                      </Typography>
                    </Alert>
                  )}

                  {!youtubeUrl && (
                    <Alert severity='info'>
                      <Typography variant='body2'>
                        Enter a YouTube URL above to preview the video
                      </Typography>
                    </Alert>
                  )}
                </Box>
              )}
            </Paper>

            {/* Budget Section */}
            <Paper elevation={0} sx={{ p: 3, bgcolor: 'grey.50' }}>
              <Typography variant='h6' gutterBottom>
                Reward Configuration
              </Typography>

              <Stack spacing={3}>
                {/* Campaign Type */}
                <FormControl fullWidth required>
                  <InputLabel>Reward Type</InputLabel>
                  <Select
                    value={formData.type}
                    label='Reward Type'
                    onChange={handleTokenTypeChange}
                  >
                    <MenuItem value='HBAR'>HBAR (Native Hedera Token)</MenuItem>
                    <MenuItem value='FUNGIBLE'>Fungible Token (HTS)</MenuItem>
                  </Select>
                  <FormHelperText>
                    Choose whether to reward users with HBAR or a specific
                    fungible token.
                  </FormHelperText>
                </FormControl>

                {/* Fungible Token Selection */}
                {formData.type === 'FUNGIBLE' && (
                  <FormControl
                    fullWidth
                    required
                    error={!!errors.fungible_token_id}
                  >
                    <InputLabel>Select Token</InputLabel>
                    <Select
                      value={formData.fungible_token_id || ''}
                      label='Select Token'
                      onChange={handleFieldChange('fungible_token_id')}
                    >
                      {tokenOptions.length === 0 ? (
                        <MenuItem value='' disabled>
                          <em>No tokens available</em>
                        </MenuItem>
                      ) : (
                        tokenOptions.map(token => (
                          <MenuItem key={token.id} value={token.id}>
                            <Box
                              sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                width: '100%',
                              }}
                            >
                              <Box>
                                {token.name} ({token.symbol})
                              </Box>
                              <Chip
                                label={`Balance: ${token.balance.toLocaleString()}`}
                                size='small'
                                variant='outlined'
                              />
                            </Box>
                          </MenuItem>
                        ))
                      )}
                    </Select>
                    <FormHelperText>
                      {errors.fungible_token_id ||
                        'Select which fungible token to use for rewards.'}
                    </FormHelperText>
                  </FormControl>
                )}

                {/* Campaign Budget */}
                <TextField
                  label={`Campaign Budget${formData.type === 'HBAR' ? ' (in HBAR)' : ''}`}
                  type='number'
                  value={formData.campaign_budget}
                  onChange={handleBudgetChange}
                  error={
                    !!errors.campaign_budget ||
                    budgetValidation?.isValid === false
                  }
                  helperText={
                    errors.campaign_budget ||
                    budgetValidation?.errorMessage ||
                    `Available: ${userBalance.toLocaleString()} ${formData.type === 'HBAR' ? 'HBAR' : 'tokens'}. This will be shared equally among correct answers.`
                  }
                  placeholder='100'
                  required
                  fullWidth
                  inputProps={{
                    min: 0.01,
                    max: maxBudget,
                    step: formData.type === 'HBAR' ? 0.01 : 1,
                  }}
                />

                {/* Expected Engaged Users */}
                <TextField
                  label='Expected Participants'
                  type='number'
                  value={formData.expected_engaged_users}
                  onChange={handleFieldChange('expected_engaged_users')}
                  error={!!errors.expected_engaged_users}
                  helperText={
                    errors.expected_engaged_users ||
                    'Estimate how many users will participate and answer correctly.'
                  }
                  placeholder='50'
                  required
                  fullWidth
                  inputProps={{ min: 1, max: 1000000, step: 1 }}
                />

                {/* Reward Per User Estimate */}
                {formData.campaign_budget > 0 &&
                  formData.expected_engaged_users > 0 && (
                    <Alert severity='info'>
                      <Typography variant='body2'>
                        <strong>Estimated Reward Per Correct Answer:</strong>{' '}
                        {(
                          formData.campaign_budget /
                          formData.expected_engaged_users
                        ).toFixed(4)}{' '}
                        {formData.type === 'HBAR' ? 'HBAR' : 'tokens'}
                      </Typography>
                    </Alert>
                  )}
              </Stack>
            </Paper>
          </Stack>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Stack
        direction='row'
        spacing={2}
        justifyContent='flex-end'
        sx={{ mt: 3 }}
      >
        <Button
          variant='outlined'
          startIcon={<SaveIcon />}
          onClick={handleSaveDraft}
          disabled={isLoading || !formData.name || !formData.question}
        >
          {isDraftLoading ? 'Saving...' : 'Save Draft'}
        </Button>
        <Button
          variant='contained'
          startIcon={<PublishIcon />}
          onClick={handlePublish}
          disabled={
            isLoading ||
            !formData.name ||
            !formData.question ||
            correctAnswerIndex === null ||
            options.some(opt => !opt.text.trim()) ||
            formData.campaign_budget <= 0 ||
            formData.expected_engaged_users <= 0
          }
        >
          {isPublishLoading ? 'Publishing...' : 'Publish Quest'}
        </Button>
      </Stack>
    </Box>
  );
};

export default CreateQuestCampaign;
