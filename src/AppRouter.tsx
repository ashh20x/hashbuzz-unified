import React from 'react';
import AppContent from './AppContent';
import { SessionManagerProvider } from './contexts';

const AppRouter: React.FC = () => {
  return (
    <SessionManagerProvider>
      <AppContent />
    </SessionManagerProvider>
  );
};

export default React.memo(AppRouter);
