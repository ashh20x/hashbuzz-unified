import {
  ErrorOutline as ErrorIcon,
  ExpandMore as ExpandMoreIcon,
  Home as HomeIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Container,
  Paper,
  Typography,
} from '@mui/material';
import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * ErrorBoundary Component
 *
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI.
 *
 * Usage:
 * ```tsx
 * <ErrorBoundary>
 *   <YourApp />
 * </ErrorBoundary>
 * ```
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to console (can be sent to error reporting service)
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Update state with error details
    this.setState({
      error,
      errorInfo,
    });

    // Optional: Send error to logging service (e.g., Sentry, LogRocket)
    // logErrorToService(error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });

    // Call optional reset handler
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  handleReload = (): void => {
    window.location.reload();
  };

  handleGoHome = (): void => {
    window.location.href = '/';
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback UI provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      const { error, errorInfo } = this.state;
      const isDevelopment = import.meta.env.DEV;

      return (
        <Container maxWidth='md' sx={{ py: 8 }}>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              textAlign: 'center',
              borderTop: 4,
              borderColor: 'error.main',
            }}
          >
            <ErrorIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />

            <Typography variant='h4' gutterBottom fontWeight='bold'>
              Oops! Something went wrong
            </Typography>

            <Typography variant='body1' color='text.secondary' paragraph>
              We're sorry for the inconvenience. The application encountered an
              unexpected error.
            </Typography>

            {/* Action Buttons */}
            <Box
              sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3 }}
            >
              <Button
                variant='contained'
                color='primary'
                startIcon={<RefreshIcon />}
                onClick={this.handleReset}
              >
                Try Again
              </Button>
              <Button
                variant='outlined'
                color='primary'
                startIcon={<RefreshIcon />}
                onClick={this.handleReload}
              >
                Reload Page
              </Button>
              <Button
                variant='text'
                color='primary'
                startIcon={<HomeIcon />}
                onClick={this.handleGoHome}
              >
                Go Home
              </Button>
            </Box>

            {/* Error Details (Development Only) */}
            {isDevelopment && error && (
              <Box sx={{ mt: 4 }}>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant='subtitle1' fontWeight='bold'>
                      Error Details (Development Only)
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box sx={{ textAlign: 'left' }}>
                      <Typography
                        variant='subtitle2'
                        color='error'
                        fontWeight='bold'
                        gutterBottom
                      >
                        Error Message:
                      </Typography>
                      <Paper
                        variant='outlined'
                        sx={{
                          p: 2,
                          mb: 2,
                          bgcolor: 'error.lighter',
                          fontFamily: 'monospace',
                          fontSize: '0.875rem',
                          overflowX: 'auto',
                        }}
                      >
                        {error.toString()}
                      </Paper>

                      {error.stack && (
                        <>
                          <Typography
                            variant='subtitle2'
                            color='error'
                            fontWeight='bold'
                            gutterBottom
                          >
                            Stack Trace:
                          </Typography>
                          <Paper
                            variant='outlined'
                            sx={{
                              p: 2,
                              mb: 2,
                              bgcolor: 'grey.100',
                              fontFamily: 'monospace',
                              fontSize: '0.75rem',
                              overflowX: 'auto',
                              whiteSpace: 'pre-wrap',
                              wordBreak: 'break-all',
                            }}
                          >
                            {error.stack}
                          </Paper>
                        </>
                      )}

                      {errorInfo?.componentStack && (
                        <>
                          <Typography
                            variant='subtitle2'
                            color='error'
                            fontWeight='bold'
                            gutterBottom
                          >
                            Component Stack:
                          </Typography>
                          <Paper
                            variant='outlined'
                            sx={{
                              p: 2,
                              bgcolor: 'grey.100',
                              fontFamily: 'monospace',
                              fontSize: '0.75rem',
                              overflowX: 'auto',
                              whiteSpace: 'pre-wrap',
                              wordBreak: 'break-all',
                            }}
                          >
                            {errorInfo.componentStack}
                          </Paper>
                        </>
                      )}
                    </Box>
                  </AccordionDetails>
                </Accordion>
              </Box>
            )}

            {/* Production Message */}
            {!isDevelopment && (
              <Typography
                variant='caption'
                color='text.secondary'
                display='block'
                sx={{ mt: 3 }}
              >
                If this problem persists, please contact support.
              </Typography>
            )}
          </Paper>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
