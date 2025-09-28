/**
 * Hook to use the Session Manager Context
 *
 * This hook provides access to the shared session manager instance.
 */

import { useContext } from 'react';
import {
  SessionManagerContext,
  SessionManagerType,
} from './SessionManagerContext';

export const useSessionManager = (): SessionManagerType => {
  const context = useContext(SessionManagerContext);

  if (!context) {
    throw new Error(
      'useSessionManager must be used within a SessionManagerProvider'
    );
  }

  return context;
};
