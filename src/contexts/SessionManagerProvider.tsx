/**
 * Session Manager Provider Component
 *
 * Provides a shared session manager instance across the entire app
 * to prevent multiple initialization and API calls.
 */

import { useAppSessionManager } from '@/hooks';
import React from 'react';
import {
  SessionManagerContext,
  SessionManagerType,
} from './SessionManagerContext';

// Provider component
export const SessionManagerProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  // Create a single instance of the session manager
  const sessionManager = useAppSessionManager();

  // Expose to window for debugging (development only)
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    (window as { sessionManager?: SessionManagerType }).sessionManager =
      sessionManager;
  }

  return (
    <SessionManagerContext.Provider value={sessionManager}>
      {children}
    </SessionManagerContext.Provider>
  );
};
