import {
  BugReport as BugReportIcon,
  ErrorOutline as ErrorIcon,
  ExpandMore as ExpandMoreIcon,
  Feedback as FeedbackIcon,
  Home as HomeIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
  errorReportingEnabled?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
  showFeedback: boolean;
  feedback: string;
  isSubmittingFeedback: boolean;
}

interface ErrorReport {
  errorId: string;
  timestamp: string;
  error: {
    message: string;
    stack?: string;
  };
  errorInfo: {
    componentStack?: string;
  };
  userAgent: string;
  url: string;
  userId?: string;
  sessionId?: string;
  buildVersion?: string;
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
      errorId: null,
      showFeedback: false,
      feedback: '',
      isSubmittingFeedback: false,
    };
  }

  /**
   * Generate unique error ID for tracking
   */
  private generateErrorId(): string {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get user session info from localStorage/store
   */
  private getUserSessionInfo(): { userId?: string; sessionId?: string } {
    try {
      // Try to get user info from localStorage or Redux store
      const userInfo = localStorage.getItem('userInfo');
      const sessionInfo = localStorage.getItem('sessionInfo');

      return {
        userId: userInfo ? JSON.parse(userInfo)?.id : undefined,
        sessionId: sessionInfo ? JSON.parse(sessionInfo)?.sessionId : undefined,
      };
    } catch {
      return {};
    }
  }

  /**
   * Log error to console with structured format
   */
  private logErrorToConsole(
    error: Error,
    errorInfo: ErrorInfo,
    errorId: string
  ): void {
    const errorReport: ErrorReport = {
      errorId,
      timestamp: new Date().toISOString(),
      error: {
        message: error.message,
        stack: error.stack,
      },
      errorInfo: {
        componentStack: errorInfo.componentStack || undefined,
      },
      userAgent: navigator.userAgent,
      url: window.location.href,
      buildVersion: import.meta.env.VITE_APP_VERSION || 'unknown',
      ...this.getUserSessionInfo(),
    };

    // Enhanced logging for development
    console.error('🚨 ErrorBoundary caught an error:', error);
    console.error('📍 Error ID:', errorId);
    console.error('🔍 Error Details:', errorReport);

    // Store error in localStorage for debugging
    try {
      const existingErrors = JSON.parse(
        localStorage.getItem('errorHistory') || '[]'
      );
      existingErrors.push(errorReport);
      // Keep only last 10 errors
      if (existingErrors.length > 10) {
        existingErrors.splice(0, existingErrors.length - 10);
      }
      localStorage.setItem('errorHistory', JSON.stringify(existingErrors));
    } catch (storageError) {
      console.warn('Failed to store error in localStorage:', storageError);
    }
  }

  /**
   * Report error to external service (placeholder)
   */
  private reportErrorToService(
    error: Error,
    _errorInfo: ErrorInfo,
    errorId: string
  ): void {
    // This is where you would integrate with services like Sentry, LogRocket, etc.
    // For now, we'll just log that the service would be called
    console.warn('Error reported to service:', {
      errorId,
      message: error.message,
    });

    // Example implementation:
    // if (window.Sentry) {
    //   window.Sentry.captureException(error, {
    //     tags: { errorBoundary: true, errorId },
    //     contexts: { react: { componentStack: errorInfo.componentStack } }
    //   });
    // }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Generate unique error ID for tracking
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorId,
      showFeedback: false,
      feedback: '',
      isSubmittingFeedback: false,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const errorId = this.state.errorId || this.generateErrorId();

    // Log error to console with enhanced details
    this.logErrorToConsole(error, errorInfo, errorId);

    // Update state with error details
    this.setState({
      error,
      errorInfo,
      errorId,
    });

    // Optional: Send error to external logging service
    if (this.props.errorReportingEnabled !== false) {
      this.reportErrorToService(error, errorInfo, errorId);
    }
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      showFeedback: false,
      feedback: '',
      isSubmittingFeedback: false,
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

  handleShowFeedback = (): void => {
    this.setState({ showFeedback: true });
  };

  handleFeedbackChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({ feedback: event.target.value });
  };

  handleSubmitFeedback = async (): Promise<void> => {
    const { feedback, errorId } = this.state;

    if (!feedback.trim()) return;

    this.setState({ isSubmittingFeedback: true });

    try {
      // Here you would send feedback to your backend
      console.warn('User feedback submitted:', { errorId, feedback });

      // Show success message and hide feedback form
      this.setState({
        showFeedback: false,
        feedback: '',
        isSubmittingFeedback: false,
      });

      // You could show a toast notification here
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      this.setState({ isSubmittingFeedback: false });
    }
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback UI provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      const {
        error,
        errorInfo,
        errorId: _errorId,
        showFeedback,
        feedback,
        isSubmittingFeedback,
      } = this.state;
      const isDevelopment = process.env.NODE_ENV === 'development';

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

            {/* User Feedback Section */}
            {!showFeedback ? (
              <Box sx={{ mt: 3 }}>
                <Button
                  variant='text'
                  color='secondary'
                  startIcon={<FeedbackIcon />}
                  onClick={this.handleShowFeedback}
                >
                  Report this error
                </Button>
              </Box>
            ) : (
              <Box sx={{ mt: 3 }}>
                <Alert severity='info' sx={{ mb: 2 }}>
                  Help us improve! Tell us what you were doing when this error
                  occurred.
                </Alert>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  value={feedback}
                  onChange={this.handleFeedbackChange}
                  placeholder='Describe what you were doing when this error occurred...'
                  variant='outlined'
                  sx={{ mb: 2 }}
                />
                <Box
                  sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}
                >
                  <Button
                    variant='text'
                    onClick={() => this.setState({ showFeedback: false })}
                    disabled={isSubmittingFeedback}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={this.handleSubmitFeedback}
                    disabled={!feedback.trim() || isSubmittingFeedback}
                    startIcon={
                      isSubmittingFeedback ? undefined : <BugReportIcon />
                    }
                  >
                    {isSubmittingFeedback ? 'Submitting...' : 'Submit Report'}
                  </Button>
                </Box>
              </Box>
            )}

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
