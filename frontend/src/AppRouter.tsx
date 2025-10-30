import React from 'react';
import AppContent from './AppContent';
import { ErrorBoundary } from './components/ErrorBoundary';
import { SessionManagerProvider } from './contexts';

const AppRouter: React.FC = () => {
  return (
    <SessionManagerProvider>
      <ErrorBoundary
        errorReportingEnabled={true}
        onReset={() => {
          // Optional: Clear any application state on error reset
          // You could dispatch Redux actions here to reset state
        }}
      >
        <AppContent />
      </ErrorBoundary>
    </SessionManagerProvider>
  );
};

export default React.memo(AppRouter);
