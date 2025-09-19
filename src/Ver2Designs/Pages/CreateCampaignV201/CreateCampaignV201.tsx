import {
  ArrowBack as ArrowBackIcon,
  Delete as DeleteIcon,
  Publish as PublishIcon,
  Save as SaveIcon,
  CheckCircle as SuccessIcon,
  CloudUpload as UploadIcon,
  VideoFile as VideoFileIcon,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Collapse,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import React, { useState } from 'react';
import {
  BudgetValidationResult,
  useBudgetValidation,
} from '../../../hooks/useBudgetValidation';
import { useRemoteConfig } from '../../../hooks/useRemoteConfig';
import { useV201Campaign } from '../../../hooks/useV201Campaign';
import V201Instructions from './components/V201Instructions';

interface CreateCampaignV201Props {
  onBack?: () => void;
}

const CreateCampaignV201: React.FC<CreateCampaignV201Props> = ({ onBack }) => {
  // Remote config to check if V201 is enabled
  const config = useRemoteConfig();
  const isV201Enabled =
    config && typeof config === 'object' && 'campaign_v201' in config
      ? (config.campaign_v201 as boolean)
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
    handleMediaUpload,
    removeMediaFile,
    saveDraft,
    publishCampaign,
    resetForm,
    getUserBalance,
    getMaxBudget,
  } = useV201Campaign();

  // Budget validation hook
  const { validateBudget, getTokenOptions } = useBudgetValidation();

  // Local state
  const [showInstructions, setShowInstructions] = useState(true);
  const [budgetValidation, setBudgetValidation] =
    useState<BudgetValidationResult | null>(null);

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

  // Get current balance and limits
  const userBalance = getUserBalance();
  const maxBudget = getMaxBudget();
  const tokenOptions = getTokenOptions();

  // Don't render if feature is disabled
  if (!isV201Enabled) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 3, textAlign: 'center' }}>
        <Alert severity='info'>
          <Typography variant='h6'>
            V201 Campaign Creation Not Available
          </Typography>
          <Typography variant='body2' sx={{ mt: 1 }}>
            The V201 campaign feature is currently disabled. Please contact
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
              Create V201 Campaign
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Simplified engagement-based rewards system
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
        <V201Instructions
          userBalance={userBalance}
          recommendedBudget={maxBudget}
          tokenType={formData.type}
          tokenSymbol={
            formData.type === 'FUNGIBLE' && formData.fungible_token_id
              ? tokenOptions.find(t => t.id === formData.fungible_token_id)
                  ?.symbol
              : 'HBAR'
          }
        />
      </Collapse>

      {/* Draft Status */}
      {savedDraftId && (
        <Alert severity='success' sx={{ mb: 3 }}>
          <Stack direction='row' alignItems='center' spacing={1}>
            <SuccessIcon fontSize='small' />
            <Typography variant='body2'>
              Draft saved successfully! Draft ID: {savedDraftId}
            </Typography>
          </Stack>
        </Alert>
      )}

      {/* Main Form */}
      <Card>
        <CardContent sx={{ p: 4 }}>
          <Stack spacing={3}>
            {/* Campaign Name */}
            <TextField
              label='Campaign Name'
              value={formData.name}
              onChange={handleFieldChange('name')}
              error={!!errors.name}
              helperText={
                errors.name ||
                `${formData.name.length}/50 characters. Make it descriptive and engaging.`
              }
              placeholder='e.g., Follow @HashBuzz Spring Promotion'
              required
              fullWidth
              inputProps={{ maxLength: 50 }}
            />

            {/* Tweet Text */}
            <TextField
              label='Tweet Instructions'
              value={formData.tweet_text}
              onChange={handleFieldChange('tweet_text')}
              error={!!errors.tweet_text}
              helperText={
                errors.tweet_text ||
                `${formData.tweet_text.length}/280 characters. Clearly describe what users need to do to earn rewards.`
              }
              placeholder='Follow @HashBuzz, retweet this post, and tag 3 friends to earn HBAR rewards!'
              required
              multiline
              rows={4}
              fullWidth
              inputProps={{ maxLength: 280 }}
            />

            {/* Expected Engaged Users */}
            <TextField
              label='Expected Engaged Users'
              type='number'
              value={formData.expected_engaged_users}
              onChange={handleFieldChange('expected_engaged_users')}
              error={!!errors.expected_engaged_users}
              helperText={
                errors.expected_engaged_users ||
                'Estimate how many users will participate. This helps calculate fair reward distribution.'
              }
              placeholder='100'
              required
              fullWidth
              inputProps={{ min: 1, max: 1000000, step: 1 }}
            />

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
                Choose whether to reward users with HBAR or a specific fungible
                token.
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
            <Box>
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
                  `Available: ${userBalance.toLocaleString()} ${formData.type === 'HBAR' ? 'HBAR' : 'tokens'}`
                }
                placeholder='50'
                required
                fullWidth
                inputProps={{
                  min: 0.01,
                  max: maxBudget,
                  step: formData.type === 'HBAR' ? 0.01 : 1,
                }}
              />

              {/* Budget Validation Alert */}
              {budgetValidation && (
                <Alert
                  severity={budgetValidation.isValid ? 'success' : 'warning'}
                  sx={{ mt: 1 }}
                >
                  <Typography variant='body2'>
                    {budgetValidation.isValid
                      ? `Budget looks good! This will provide approximately ${Math.floor(formData.campaign_budget / formData.expected_engaged_users)} ${formData.type === 'HBAR' ? 'HBAR' : 'tokens'} per user.`
                      : budgetValidation.errorMessage}
                  </Typography>
                </Alert>
              )}
            </Box>

            {/* Media Upload */}
            <Box>
              <Typography variant='subtitle1' gutterBottom>
                Media Files (Optional)
              </Typography>
              <Box
                sx={{
                  border: '2px dashed',
                  borderColor: 'grey.300',
                  borderRadius: 1,
                  p: 3,
                  textAlign: 'center',
                  bgcolor: 'grey.50',
                  display: 'block',
                  width: '100%',
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                  '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: 'primary.50',
                  },
                }}
                component='label'
              >
                <input
                  type='file'
                  multiple
                  accept='image/*,video/*'
                  onChange={handleMediaUpload}
                  style={{ display: 'none' }}
                />
                <UploadIcon sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
                <Typography variant='body1' color='text.primary'>
                  Click to upload media files
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  Images and videos up to 10MB each. Maximum 5 files.
                </Typography>
              </Box>

              {/* Display selected files */}
              {formData.media.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant='subtitle2' gutterBottom>
                    Selected Files ({formData.media.length}/5):
                  </Typography>
                  <Grid container spacing={2}>
                    {formData.media.map((file, index) => (
                      <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                        <Paper
                          elevation={1}
                          sx={{
                            p: 2,
                            position: 'relative',
                            '&:hover .remove-button': {
                              opacity: 1,
                            },
                          }}
                        >
                          {/* File Preview */}
                          <Box sx={{ mb: 1, textAlign: 'center' }}>
                            {file.type.startsWith('image/') ? (
                              <Box
                                component='img'
                                src={URL.createObjectURL(file)}
                                alt={file.name}
                                sx={{
                                  width: '100%',
                                  height: 120,
                                  objectFit: 'cover',
                                  borderRadius: 1,
                                  border: '1px solid',
                                  borderColor: 'divider',
                                }}
                              />
                            ) : (
                              <Box
                                sx={{
                                  width: '100%',
                                  height: 120,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  bgcolor: 'grey.100',
                                  borderRadius: 1,
                                  border: '1px solid',
                                  borderColor: 'divider',
                                }}
                              >
                                <VideoFileIcon
                                  sx={{ fontSize: 40, color: 'primary.main' }}
                                />
                              </Box>
                            )}
                          </Box>

                          {/* File Info */}
                          <Typography
                            variant='body2'
                            noWrap
                            sx={{ fontWeight: 500, mb: 0.5 }}
                            title={file.name}
                          >
                            {file.name}
                          </Typography>
                          <Typography variant='caption' color='text.secondary'>
                            {(file.size / (1024 * 1024)).toFixed(2)} MB
                          </Typography>

                          {/* Remove Button */}
                          <IconButton
                            className='remove-button'
                            size='small'
                            onClick={() => removeMediaFile(index)}
                            sx={{
                              position: 'absolute',
                              top: 8,
                              right: 8,
                              bgcolor: 'error.main',
                              color: 'white',
                              opacity: 0,
                              transition: 'opacity 0.2s',
                              '&:hover': {
                                bgcolor: 'error.dark',
                              },
                            }}
                          >
                            <DeleteIcon fontSize='small' />
                          </IconButton>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              {errors.media && (
                <FormHelperText error sx={{ mt: 1 }}>
                  {errors.media}
                </FormHelperText>
              )}
            </Box>

            {/* Form Actions */}
            <Box sx={{ pt: 2, borderTop: 1, borderColor: 'divider' }}>
              <Stack direction='row' spacing={2}>
                <Button
                  variant='outlined'
                  startIcon={<SaveIcon />}
                  onClick={saveDraft}
                  disabled={isLoading}
                  fullWidth
                >
                  {isDraftLoading ? 'Saving...' : 'Save Draft'}
                </Button>
                <Button
                  variant='contained'
                  startIcon={<PublishIcon />}
                  onClick={publishCampaign}
                  disabled={isLoading || !savedDraftId}
                  fullWidth
                >
                  {isPublishLoading ? 'Publishing...' : 'Publish Campaign'}
                </Button>
              </Stack>

              <Typography
                variant='caption'
                color='text.secondary'
                sx={{ mt: 1, display: 'block' }}
              >
                Save as draft first to review everything. Once published, your
                campaign will go live immediately.
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Development Debug Info */}
      {process.env.NODE_ENV === 'development' && (
        <Card sx={{ mt: 3, bgcolor: 'grey.100' }}>
          <CardContent>
            <Typography variant='h6' gutterBottom>
              Debug Information
            </Typography>
            <pre
              style={{ fontSize: '11px', overflow: 'auto', maxHeight: '200px' }}
            >
              {JSON.stringify(
                {
                  formData,
                  errors,
                  isV201Enabled,
                  userBalance,
                  maxBudget,
                  savedDraftId,
                  budgetValidation,
                  tokenOptionsCount: tokenOptions.length,
                },
                null,
                2
              )}
            </pre>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default CreateCampaignV201;
