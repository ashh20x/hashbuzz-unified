/**
 * Session Manager Types and Interfaces
 * @version 3.0.0
 */

export interface UseAppSessionManagerProps {
  /** API endpoint for token refresh (default: "/auth/refresh-token") */
  refreshEndpoint?: string;
  /** Seconds before expiry to trigger refresh (default: 60) */
  bufferSeconds?: number;
  /** Session duration in minutes (default: 15) */
  sessionExpireMinutes?: number;
}

export interface WalletStatus {
  isConnected: boolean;
  extensionReady: boolean;
  accountID?: string;
}

export interface SessionValidationResult {
  isAuthenticated: boolean;
  connectedXAccount?: string;
}

export interface SessionManagerState {
  hasInitialized: boolean;
  isInitializing: boolean;
  isRefreshing: boolean;
  isUserAuthenticated: boolean;
}

export interface SessionManagerAPI {
  // Token management
  refreshToken: () => Promise<boolean>;
  setTokenExpiry: (expiryTimestamp?: number) => number;
  clearTokenExpiry: () => void;
  getTokenExpiry: () => number | null;

  // State information
  isRefreshing: boolean;
  hasInitialized: boolean;
  isInitializing: boolean;
  isUserAuthenticated: boolean;

  // Computed states for UI
  readonly isLoading: boolean; // Combined loading state for splash screen
  readonly isAppReady: boolean; // App is fully ready to use
  readonly shouldShowSplash: boolean; // Whether to show splash screen

  // Debug/Test functions (development only)
  forceRefresh: () => void;
}
