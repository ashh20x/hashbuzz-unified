import {
  Add as AddIcon,
  Close as CloseIcon,
  Edit as EditIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import { Alert, Box, IconButton, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import {
  BotException,
  CreateBotExceptionRequest,
  useAddBotExceptionMutation,
} from '../../../API/botExceptions';
import {
  CancelButton,
  FormField,
  ModalActions,
  ModalBody,
  ModalHeader,
  StyledDialog,
  SubmitButton,
} from './BotExceptions.styles';

interface AddBotExceptionModalProps {
  open: boolean;
  onClose: () => void;
  exception?: BotException | null;
  onSuccess: () => void;
}

interface FormData {
  twitter_user_id: string;
  twitter_username: string;
  reason: string;
  notes: string;
}

interface FormErrors {
  twitter_user_id?: string;
  reason?: string;
}

export const AddBotExceptionModal: React.FC<AddBotExceptionModalProps> = ({
  open,
  onClose,
  exception,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<FormData>({
    twitter_user_id: '',
    twitter_username: '',
    reason: '',
    notes: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string>('');

  const [addBotException, { isLoading }] = useAddBotExceptionMutation();

  const isEditing = !!exception;

  // Populate form when editing
  useEffect(() => {
    if (exception) {
      setFormData({
        twitter_user_id: exception.twitter_user_id,
        twitter_username: exception.twitter_username || '',
        reason: exception.reason,
        notes: exception.notes || '',
      });
    } else {
      setFormData({
        twitter_user_id: '',
        twitter_username: '',
        reason: '',
        notes: '',
      });
    }
    setErrors({});
    setSubmitError('');
  }, [exception, open]);

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.twitter_user_id.trim()) {
      newErrors.twitter_user_id = 'Twitter User ID is required';
    } else if (!/^\d+$/.test(formData.twitter_user_id.trim())) {
      newErrors.twitter_user_id = 'Twitter User ID must be numeric';
    }

    if (!formData.reason.trim()) {
      newErrors.reason = 'Reason is required';
    } else if (formData.reason.trim().length < 10) {
      newErrors.reason = 'Reason must be at least 10 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form input changes
  const handleInputChange =
    (field: keyof FormData) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setFormData(prev => ({ ...prev, [field]: value }));

      // Clear error when user starts typing
      if (errors[field as keyof FormErrors]) {
        setErrors(prev => ({ ...prev, [field]: undefined }));
      }
      setSubmitError('');
    };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (isEditing) {
      toast.info(
        'Editing exceptions is not supported. Please remove and add a new one.'
      );
      return;
    }

    try {
      const requestData: CreateBotExceptionRequest = {
        twitter_user_id: formData.twitter_user_id.trim(),
        twitter_username: formData.twitter_username.trim() || undefined,
        reason: formData.reason.trim(),
        notes: formData.notes.trim() || undefined,
      };

      const result = await addBotException(requestData).unwrap();

      if (result.status === 'success') {
        toast.success(result.message || 'Bot exception added successfully');
        onSuccess();
      } else {
        setSubmitError(result.message || 'Failed to add bot exception');
        if (result.errors && result.errors.length > 0) {
          const fieldErrors: FormErrors = {};
          result.errors.forEach(error => {
            if (error.path === 'twitter_user_id') {
              fieldErrors.twitter_user_id = error.msg;
            } else if (error.path === 'reason') {
              fieldErrors.reason = error.msg;
            }
          });
          setErrors(fieldErrors);
        }
      }
    } catch (error: unknown) {
      console.error('Add bot exception error:', error);
      setSubmitError('Failed to add bot exception. Please try again.');
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <StyledDialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
      <ModalHeader>
        <Typography variant='h6' component='h3'>
          {isEditing ? <EditIcon sx={{ mr: 1 }} /> : <AddIcon sx={{ mr: 1 }} />}
          {isEditing ? 'View Bot Exception' : 'Add Bot Exception'}
        </Typography>
        <IconButton
          onClick={handleClose}
          disabled={isLoading}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </ModalHeader>

      <form onSubmit={handleSubmit}>
        <ModalBody>
          {submitError && (
            <Alert severity='error' sx={{ mb: 2 }}>
              {submitError}
            </Alert>
          )}

          {isEditing && (
            <Alert severity='info' sx={{ mb: 2 }}>
              <SecurityIcon sx={{ mr: 1 }} />
              This exception is currently active and protecting this user from
              bot detection.
            </Alert>
          )}

          <FormField>
            <TextField
              label='Twitter User ID'
              value={formData.twitter_user_id}
              onChange={handleInputChange('twitter_user_id')}
              error={!!errors.twitter_user_id}
              helperText={
                errors.twitter_user_id ||
                'Numeric Twitter user ID (e.g., 123456789)'
              }
              placeholder='123456789'
              disabled={isEditing || isLoading}
              fullWidth
              required
            />
          </FormField>

          <FormField>
            <TextField
              label='Twitter Username (Optional)'
              value={formData.twitter_username}
              onChange={handleInputChange('twitter_username')}
              helperText='Username for reference (without @)'
              placeholder='johndoe'
              disabled={isEditing || isLoading}
              fullWidth
            />
          </FormField>

          <FormField>
            <TextField
              label='Reason'
              value={formData.reason}
              onChange={handleInputChange('reason')}
              error={!!errors.reason}
              helperText={
                errors.reason ||
                'Why is this user being excluded from bot detection?'
              }
              placeholder='Known legitimate user incorrectly flagged as bot'
              disabled={isEditing || isLoading}
              fullWidth
              required
              multiline
              rows={2}
            />
          </FormField>

          <FormField>
            <TextField
              label='Additional Notes (Optional)'
              value={formData.notes}
              onChange={handleInputChange('notes')}
              helperText='Any additional context or information'
              placeholder='Additional context about this exception...'
              disabled={isEditing || isLoading}
              fullWidth
              multiline
              rows={3}
            />
          </FormField>

          {isEditing && exception && (
            <Box sx={{ mt: 2, p: 2, background: '#f8fafc', borderRadius: 1 }}>
              <Typography
                variant='subtitle2'
                color='textSecondary'
                gutterBottom
              >
                Exception Details
              </Typography>
              <Typography variant='body2'>
                <strong>Added:</strong>{' '}
                {new Date(exception.created_at).toLocaleString()}
              </Typography>
              <Typography variant='body2'>
                <strong>Status:</strong>{' '}
                {exception.is_active ? 'Active' : 'Inactive'}
              </Typography>
              {exception.added_by_admin && (
                <Typography variant='body2'>
                  <strong>Added by:</strong> {exception.added_by_admin.name}
                </Typography>
              )}
            </Box>
          )}
        </ModalBody>

        <ModalActions>
          <CancelButton
            onClick={handleClose}
            disabled={isLoading}
            variant='outlined'
          >
            {isEditing ? 'Close' : 'Cancel'}
          </CancelButton>

          {!isEditing && (
            <SubmitButton
              type='submit'
              disabled={isLoading}
              variant='contained'
            >
              {isLoading ? 'Adding...' : 'Add Exception'}
            </SubmitButton>
          )}
        </ModalActions>
      </form>
    </StyledDialog>
  );
};
