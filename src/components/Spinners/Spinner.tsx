import { Box, Fade, Typography } from '@mui/material';
import { Bars, Rings } from 'react-loader-spinner';

export const ConfirmSpinner = () => {
  return (
    <Fade in timeout={300}>
      <Box
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1300,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background:
            'linear-gradient(135deg, rgba(17, 24, 39, 0.95) 0%, rgba(31, 41, 55, 0.95) 50%, rgba(17, 24, 39, 0.95) 100%)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          transition: 'all 0.3s ease-in-out',
        }}
      >
        <Box
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            maxWidth: '800px',
            width: '100%',
            padding: '20px',
          }}
        >
          <Box
            style={{
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              marginBottom: '24px',
            }}
          >
            <Bars
              visible={true}
              height={150}
              width={150}
              color='#4F46E5'
              ariaLabel='bars-loading'
              wrapperStyle={{}}
              wrapperClass=''
            />
          </Box>

          <Box
            style={{
              textAlign: 'center',
              width: '100%',
            }}
          >
            <Typography
              variant='h4'
              component='h2'
              style={{
                fontWeight: 600,
                color: '#D1D5DB',
                marginBottom: '12px',
                fontSize: 'clamp(1.125rem, 2vw, 1.875rem)',
                fontFamily: 'system-ui, -apple-system, sans-serif',
              }}
            >
              Verifying your ID...
            </Typography>

            <Typography
              variant='body1'
              style={{
                color: '#9CA3AF',
                fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
                opacity: 0.9,
              }}
            >
              Please wait while we process your information.
            </Typography>
          </Box>
        </Box>

        <style>
          {`
            @keyframes pulse {
              0%, 100% {
                opacity: 1;
              }
              50% {
                opacity: 0.5;
              }
            }
          `}
        </style>
      </Box>
    </Fade>
  );
};

export const SubmitSpinner = () => {
  return (
    <Fade in timeout={300}>
      <Box
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1300,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background:
            'linear-gradient(135deg, rgba(17, 24, 39, 0.95) 0%, rgba(31, 41, 55, 0.95) 50%, rgba(17, 24, 39, 0.95) 100%)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          transition: 'all 0.3s ease-in-out',
        }}
      >
        <Box
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            maxWidth: '800px',
            width: '100%',
            padding: '20px',
          }}
        >
          <Box
            style={{
              animation: 'spin 2s linear infinite',
              marginBottom: '24px',
            }}
          >
            <Rings
              visible={true}
              height={150}
              width={150}
              color='#4F46E5'
              ariaLabel='rings-loading'
              wrapperStyle={{}}
              wrapperClass=''
            />
          </Box>

          <Box
            style={{
              textAlign: 'center',
              width: '100%',
            }}
          >
            <Typography
              variant='h4'
              component='h2'
              style={{
                fontWeight: 600,
                color: '#D1D5DB',
                marginBottom: '12px',
                fontSize: 'clamp(1.125rem, 2vw, 1.875rem)',
                fontFamily: 'system-ui, -apple-system, sans-serif',
              }}
            >
              Submitting your info...
            </Typography>

            <Typography
              variant='body1'
              style={{
                color: '#9CA3AF',
                fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
                opacity: 0.9,
              }}
            >
              This may take a few moments. Thank you for your patience.
            </Typography>
          </Box>
        </Box>

        <style>
          {`
            @keyframes spin {
              from {
                transform: rotate(0deg);
              }
              to {
                transform: rotate(360deg);
              }
            }
          `}
        </style>
      </Box>
    </Fade>
  );
};
