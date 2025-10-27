/**
 * TokenRefreshManager
 *
 * Manages automatic token refresh based on backend-provided expiry times.
 * Synchronizes frontend refresh timing with backend cookie expiration.
 */

type RefreshCallback = () => Promise<void>;

class TokenRefreshManager {
  private refreshTimer: NodeJS.Timeout | null = null;
  private tokenExpiresAt: number | null = null;
  private refreshCallback: RefreshCallback | null = null;
  private isRefreshing = false;

  /**
   * Set the token expiration time and schedule automatic refresh
   * @param expiresAt - Token expiration timestamp in milliseconds (from backend)
   * @param refreshCallback - Function to call when refresh is needed
   */
  setTokenExpiry(expiresAt: number, refreshCallback: RefreshCallback): void {
    this.tokenExpiresAt = expiresAt;
    this.refreshCallback = refreshCallback;

    // Clear any existing timer
    this.clearRefreshTimer();

    // Calculate when to refresh (with buffer)
    const now = Date.now();
    const timeUntilExpiry = expiresAt - now;

    // Get buffer from env or use default 30 seconds
    const bufferMs =
      Number((import.meta as any).env.VITE_TOKEN_EXPIRY_BUFFER) || 30000;

    // Schedule refresh before token expires (with buffer)
    const refreshIn = Math.max(timeUntilExpiry - bufferMs, 1000); // At least 1 second

    if ((import.meta as any).env.VITE_ENABLE_DEBUG_LOGS === 'true') {
      // eslint-disable-next-line no-console
      console.log('[TokenRefreshManager] Token expiry scheduled:', {
        expiresAt: new Date(expiresAt).toISOString(),
        timeUntilExpiry: `${Math.floor(timeUntilExpiry / 1000)}s`,
        refreshIn: `${Math.floor(refreshIn / 1000)}s`,
        bufferMs: `${bufferMs / 1000}s`,
      });
    }

    this.refreshTimer = setTimeout(() => {
      this.executeRefresh();
    }, refreshIn);
  }

  /**
   * Execute token refresh
   */
  private async executeRefresh(): Promise<void> {
    if (this.isRefreshing) {
      console.warn(
        '[TokenRefreshManager] Refresh already in progress, skipping'
      );
      return;
    }

    if (!this.refreshCallback) {
      console.error('[TokenRefreshManager] No refresh callback set');
      return;
    }

    try {
      this.isRefreshing = true;

      if ((import.meta as any).env.VITE_ENABLE_DEBUG_LOGS === 'true') {
        // eslint-disable-next-line no-console
        console.log('[TokenRefreshManager] Executing token refresh...');
      }

      await this.refreshCallback();

      if ((import.meta as any).env.VITE_ENABLE_DEBUG_LOGS === 'true') {
        // eslint-disable-next-line no-console
        console.log('[TokenRefreshManager] Token refresh successful');
      }
    } catch (error) {
      console.error('[TokenRefreshManager] Token refresh failed:', error);

      // If refresh fails, clear token and redirect to login
      this.clear();

      // Dispatch a custom event that the app can listen to
      window.dispatchEvent(
        new CustomEvent('token-refresh-failed', { detail: error })
      );
    } finally {
      this.isRefreshing = false;
    }
  }

  /**
   * Force an immediate token refresh
   */
  async forceRefresh(): Promise<void> {
    if (this.refreshCallback) {
      await this.executeRefresh();
    }
  }

  /**
   * Clear the refresh timer and reset state
   */
  clear(): void {
    this.clearRefreshTimer();
    this.tokenExpiresAt = null;
    this.refreshCallback = null;
    this.isRefreshing = false;

    if ((import.meta as any).env.VITE_ENABLE_DEBUG_LOGS === 'true') {
      // eslint-disable-next-line no-console
      console.log('[TokenRefreshManager] Cleared token refresh timer');
    }
  }

  /**
   * Clear only the timer without resetting callback
   */
  private clearRefreshTimer(): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  /**
   * Get remaining time until token expires
   */
  getTimeUntilExpiry(): number | null {
    if (!this.tokenExpiresAt) return null;
    return Math.max(this.tokenExpiresAt - Date.now(), 0);
  }

  /**
   * Check if token is expired
   */
  isExpired(): boolean {
    if (!this.tokenExpiresAt) return false;
    return Date.now() >= this.tokenExpiresAt;
  }
}

// Export singleton instance
export const tokenRefreshManager = new TokenRefreshManager();
