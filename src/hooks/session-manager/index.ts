/**
 * Session Manager Module Exports
 * @version 3.0.0
 */

// Main hook
export { default as useAppSessionManager } from '../use-appSession-manager-v3';

// Types
export type {
  UseAppSessionManagerProps,
  WalletStatus,
  SessionValidationResult,
  SessionManagerState,
  SessionManagerAPI,
} from './types';

// Constants
export {
  SESSION_DEFAULTS,
  AUTH_STORAGE_KEYS,
  LOG_PREFIXES,
} from './constants';

// Individual modules (for advanced usage)
export { useTokenManager } from './useTokenManager';
export { useWalletSync } from './useWalletSync';
export { useSessionValidator } from './useSessionValidator';
export { useTokenAssociationSync } from './useTokenAssociationSync';
export { useCrossTabSync } from './useCrossTabSync';
export { useTabVisibilityManager } from './useTabVisibilityManager';

// Utilities
export {
  logError,
  logDebug,
  logInfo,
  delay,
  isValidFutureTimestamp,
  safeJSONParse,
} from './utils';
