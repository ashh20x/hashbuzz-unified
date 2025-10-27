import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
  type QueryReturnValue,
} from '@reduxjs/toolkit/query/react';
import { getCookieByName } from '../comman/helpers';
import { AuthError } from '../types/auth';

// Generate or retrieve a persistent device ID using crypto API for better randomness
function getOrCreateDeviceId(): string {
  let deviceId = localStorage.getItem('device_id');
  if (!deviceId) {
    // Use crypto API for UUID v4 generation
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      deviceId = crypto.randomUUID();
    } else {
      // Fallback to manual UUID v4 generation
      deviceId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    }
    localStorage.setItem('device_id', deviceId);
  }
  return deviceId;
}

// Track refresh token requests to prevent multiple simultaneous refreshes
let isRefreshing = false;
let refreshPromise: Promise<
  QueryReturnValue<unknown, FetchBaseQueryError>
> | null = null;

// Enhanced base query with refresh token handling and auth error processing
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const AUTH_REQUIRED_ENDPOINTS = [
    '/api/users',
    '/api/campaign',
    '/api/admin',
    '/api/transaction',
    '/auth/logout',
    '/auth/refresh-token',
    '/auth/admin-login',
    '/api/V201/quest',
    '/api/V201/campaign',
  ];

  // Public endpoints that don't require authentication
  const PUBLIC_ENDPOINTS = [
    '/auth/challenge',
    '/auth/generate',
    '/auth/generate-v2',
    '/auth/twitter-return',
    '/auth/business-twitter-return',
    '/auth/csrf-token',
    '/auth/ping',
    '/api/health',
    '/logs',
  ];

  // Check if endpoint requires authentication
  const requiresAuth = (url: string): boolean => {
    // Check if it's a public endpoint
    if (PUBLIC_ENDPOINTS.some(endpoint => url.includes(endpoint))) {
      return false;
    }

    // Check if it's an auth-required endpoint
    return AUTH_REQUIRED_ENDPOINTS.some(endpoint => url.includes(endpoint));
  };

  const baseQuery = fetchBaseQuery({
    baseUrl:
      (import.meta as unknown as { env: Record<string, string> }).env
        .VITE_API_BASE_URL || '/',
    credentials: 'include', // Important for cookie-based auth
    prepareHeaders: headers => {
      // Device ID header
      const deviceId = getOrCreateDeviceId();
      headers.set('X-Device-ID', deviceId);

      // CSRF token header
      const csrf = getCookieByName('XSRF-TOKEN');
      if (csrf) headers.set('X-XSRF-TOKEN', csrf);

      return headers;
    },
  });

  // Execute the initial request
  let result = await baseQuery(args, api, extraOptions);

  // For public endpoints, return immediately without auth error handling
  const url = typeof args === 'string' ? args : args.url;
  if (!requiresAuth(url)) {
    return result;
  }

  // Check if we got a 401 Unauthorized error
  const is401Error = result.error?.status === 401;
  const errorData = result.error?.data as
    | { error?: { description?: string } }
    | undefined;
  const isTokenInvalid =
    errorData?.error?.description === AuthError.AUTH_TOKEN_INVALID ||
    errorData?.error?.description === AuthError.AUTH_TOKEN_NOT_PRESENT;

  // If token is invalid and it's not the refresh endpoint itself, try to refresh
  if (is401Error && isTokenInvalid && !url.includes('/auth/refresh-token')) {
    console.warn('[RTK Query] Token invalid, attempting refresh...');

    try {
      // If already refreshing, wait for the existing refresh to complete
      if (isRefreshing && refreshPromise) {
        console.warn('[RTK Query] Refresh already in progress, waiting...');
        await refreshPromise;
      } else {
        // Start a new refresh
        isRefreshing = true;
        refreshPromise = Promise.resolve(
          baseQuery(
            {
              url: '/auth/refresh-token',
              method: 'POST',
              body: {},
            },
            api,
            extraOptions
          )
        );

        const refreshResult = await refreshPromise;

        if (!refreshResult || refreshResult.error) {
          console.error(
            '[RTK Query] Token refresh failed:',
            refreshResult?.error
          );

          // Refresh failed - logout and reload
          console.warn('[RTK Query] Logging out user and reloading page...');

          // Clear cookies
          document.cookie =
            'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
          document.cookie =
            'refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

          // Clear localStorage
          localStorage.clear();

          // Reload the page to reset application state
          window.location.reload();

          return result; // Return original error
        }

        console.warn(
          '[RTK Query] Token refreshed successfully, retrying request...'
        );
      }

      // Token refreshed successfully, retry the original request
      result = await baseQuery(args, api, extraOptions);
    } catch (error) {
      console.error('[RTK Query] Error during token refresh:', error);

      // Refresh failed - logout and reload
      console.warn('[RTK Query] Logging out user and reloading page...');

      // Clear cookies
      document.cookie =
        'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie =
        'refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

      // Clear localStorage
      localStorage.clear();

      // Reload the page to reset application state
      window.location.reload();
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  }

  // Check for auth errors in the response and log them appropriately
  if (result.error) {
    const errorData = result.error.data as
      | { error?: { description?: string } }
      | undefined;

    // Handle server auth errors
    if (errorData?.error?.description) {
      const authErrorCode = errorData.error.description as string;

      switch (authErrorCode) {
        case AuthError.AUTH_TOKEN_INVALID:
          console.warn(
            'Auth error: Access token invalid after refresh attempt'
          );
          break;

        case AuthError.AUTH_TOKEN_NOT_PRESENT:
          console.warn(
            'Auth error: No token present - user needs to authenticate'
          );
          break;

        case AuthError.DEVICE_ID_REQUIRED:
          console.error('Auth error: Device ID required but not provided');
          break;

        case AuthError.ACCESS_DENIED:
          console.error('Auth error: Access denied for this resource');
          break;

        case AuthError.SIGNATURE_NOT_VERIFIED:
        case AuthError.INVALID_SIGNATURE_TOKEN:
        case AuthError.SIGNING_MESSAGE_EXPIRED:
          console.error('Auth error: Signature verification failed');
          // Only clear auth state for signature failures, don't redirect
          localStorage.removeItem('user');
          break;

        default:
          console.error('Auth error: Unknown error code -', authErrorCode);
      }
    }

    // Handle rate limiting specifically
    if (result.error.status === 429) {
      console.warn('Rate limited - too many requests');
    }
  }

  return result;
};

/**
 * Base API slice for RTK Query.
 * Includes credentials, device ID, CSRF token, and comprehensive error logging.
 * Token refresh is handled by TokenRefreshProvider at the app level.
 */
export const apiBase = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'CurrentUser',
    'UserData',
    'Campaign',
    'TokenBalance',
    'Transaction',
    'Quest',
  ],
  endpoints: () => ({}),
});

// Export hooks for usage in functional components, which are auto-generated
// Note: Specific API hooks are exported from their respective API files
