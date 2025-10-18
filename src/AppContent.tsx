import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { useSessionManager } from './contexts';
import router from './Router';
import SplashScreen from './SplashScreen';
import StyledComponentTheme from './theme/Theme';

const AppContent: React.FC = () => {
  const sessionManager = useSessionManager();

  // Show loading screen while app is initializing
  if (sessionManager.shouldShowSplash || !sessionManager.isAppReady) {
    return (
      <StyledComponentTheme>
        <SplashScreen
          message='Preparing your experience...'
          showDebug={process.env.NODE_ENV === 'development'}
          debugInfo={{
            hasInitialized: sessionManager.hasInitialized,
            isRefreshing: sessionManager.isRefreshing,
            isAppReady: sessionManager.isAppReady,
          }}
        />
      </StyledComponentTheme>
    );
  }

  return (
    <StyledComponentTheme>
      <RouterProvider router={router} />
    </StyledComponentTheme>
  );
};

// Memoize to prevent unnecessary re-renders when parent re-renders
export default React.memo(AppContent);
