/**
 * Session Manager Context
 *
 * Context definition for sharing session manager instance.
 */

import { useAppSessionManager } from '@/hooks';
import { createContext } from 'react';

// Define the context type using the return type of the hook
export type SessionManagerType = ReturnType<typeof useAppSessionManager>;

// Create the context
export const SessionManagerContext = createContext<SessionManagerType | null>(
  null
);
