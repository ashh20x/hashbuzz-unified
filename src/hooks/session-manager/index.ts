/**
 * Session Manager Module Exports
 * @version 3.0.0
 */

// Main hook
export { default as useAppSessionManager } from '../use-appSession-manager-v3';

// Types
export type {
  SessionManagerAPI,
  SessionManagerState,
  SessionValidationResult,
  UseAppSessionManagerProps,
  WalletStatus,
} from './types';

// Constants
export { AUTH_STORAGE_KEYS, LOG_PREFIXES, SESSION_DEFAULTS } from './constants';

// Individual modules (for advanced usage)
// export { useWalletSync } from '../../comman/';
export { useCrossTabSync } from './useCrossTabSync';
export { useSessionValidator } from './useSessionValidator';
export { useTabVisibilityManager } from './useTabVisibilityManager';
export { useTokenAssociationSync } from './useTokenAssociationSync';
export { useTokenManager } from './useTokenManager';

// Utilities
export {
  delay,
  isValidFutureTimestamp,
  logDebug,
  logError,
  logInfo,
  safeJSONParse,
} from '../../comman/utils';
