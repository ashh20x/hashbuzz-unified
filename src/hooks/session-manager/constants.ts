/**
 * Session Manager Constants and Configuration
 * @version 3.0.0
 */

export const SESSION_DEFAULTS = {
  REFRESH_ENDPOINT: '/auth/refresh-token',
  BUFFER_SECONDS: 60,
  SESSION_EXPIRE_MINUTES: 15,
  NAVIGATION_THROTTLE_MS: 1000,
  FETCH_TIMEOUT_MS: 10000,
  INITIALIZATION_DELAY_MS: 1000,
  RETRY_DELAY_MS: 2000,
  MAX_FUTURE_TIME_HOURS: 24,
} as const;

export const AUTH_STORAGE_KEYS = {
  ACCESS_TOKEN_EXPIRY: 'access_token_expiry',
  LAST_TOKEN_REFRESH: 'last_token_refresh',
  REFRESH_LOCK: 'token_refresh_lock',
  DEVICE_ID: 'device_id',
  APP_CONFIG: 'app_config',
} as const;

export const LOG_PREFIXES = {
  SESSION_MANAGER: '[useAppSessionManager]',
  TOKEN_MANAGER: '[TokenManager]',
  WALLET_SYNC: '[WalletSync]',
} as const;
