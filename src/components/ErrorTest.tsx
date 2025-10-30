import { Box, Button, Typography } from '@mui/material';
import React, { useState } from 'react';

/**
 * ErrorTest Component - For testing ErrorBoundary functionality
 * Only shown in development mode
 *
 * Usage: Add this component anywhere in your development tree to test error boundaries
 */
const ErrorTest: React.FC = () => {
  const [shouldThrow, setShouldThrow] = useState(false);

  // This will be caught by the ErrorBoundary
  if (shouldThrow) {
    throw new Error(
      'Test error from ErrorTest component - This is expected in development!'
    );
  }

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <Box sx={{ p: 2, border: '2px dashed orange', borderRadius: 1, m: 2 }}>
      <Typography variant='h6' color='warning.main' gutterBottom>
        🧪 Development Error Test
      </Typography>
      <Typography variant='body2' color='text.secondary' paragraph>
        This component helps test the ErrorBoundary. Click the button below to
        trigger an error and see how the ErrorBoundary handles it.
      </Typography>
      <Button
        variant='contained'
        color='warning'
        onClick={() => setShouldThrow(true)}
        size='small'
      >
        Trigger Test Error
      </Button>
    </Box>
  );
};

export default ErrorTest;
