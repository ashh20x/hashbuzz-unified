import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { SessionManagerProvider, useSessionManager } from './contexts';
import router from './Router.tsx';
import StyledComponentTheme from './theme/Theme';

const AppContent = () => {
  const sessionManager = useSessionManager();

  // Show loading screen while app is initializing
  if (sessionManager.shouldShowSplash || !sessionManager.isAppReady) {
    return (
      <StyledComponentTheme>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          <div>Loading...</div>
          {process.env.NODE_ENV === 'development' && (
            <div style={{ fontSize: '12px', opacity: 0.7 }}>
              hasInitialized: {sessionManager.hasInitialized ? '✅' : '❌'} |{' '}
              isRefreshing: {sessionManager.isRefreshing ? '⏳' : '✅'} |{' '}
              isAppReady: {sessionManager.isAppReady ? '✅' : '❌'}
            </div>
          )}
        </div>
      </StyledComponentTheme>
    );
  }

  return (
    <StyledComponentTheme>
      <RouterProvider router={router} />
    </StyledComponentTheme>
  );
};

const AppRouter = () => {
  return (
    <SessionManagerProvider>
      <AppContent />
    </SessionManagerProvider>
  );
};

export default React.memo(AppRouter);
