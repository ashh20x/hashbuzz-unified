import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Configuration options for the online status hook
 */
export interface OnlineStatusConfig {
  /** URL to ping for connectivity check (default: Google DNS) */
  pingUrl?: string;
  /** Interval in milliseconds to check connectivity (default: 30000ms) */
  checkInterval?: number;
  /** Timeout for ping requests in milliseconds (default: 5000ms) */
  pingTimeout?: number;
  /** Enable periodic connectivity checks (default: true) */
  enablePeriodicCheck?: boolean;
  /** Enable detailed connectivity info (default: false) */
  enableDetailedInfo?: boolean;
}

/**
 * Detailed connectivity information
 */
export interface ConnectivityInfo {
  /** Browser's navigator.onLine status */
  browserOnline: boolean;
  /** Result of actual network ping */
  networkReachable: boolean;
  /** Last successful ping timestamp */
  lastSuccessfulPing: Date | null;
  /** Last failed ping timestamp */
  lastFailedPing: Date | null;
  /** Current round trip time in milliseconds */
  rtt: number | null;
  /** Connection type (if available) */
  connectionType: string | null;
  /** Effective connection type (if available) */
  effectiveType: string | null;
  /** Is currently checking connectivity */
  isChecking: boolean;
}

/**
 * Return type for the useOnlineStatus hook
 */
export interface OnlineStatusReturn {
  /** Overall online status */
  isOnline: boolean;
  /** Detailed connectivity information */
  connectivityInfo: ConnectivityInfo;
  /** Manually trigger a connectivity check */
  checkConnectivity: () => Promise<boolean>;
  /** Force refresh the connection status */
  refresh: () => void;
}

const DEFAULT_CONFIG: Required<OnlineStatusConfig> = {
  pingUrl: 'https://dns.google/resolve?name=google.com&type=A',
  checkInterval: 30000, // 30 seconds
  pingTimeout: 5000, // 5 seconds
  enablePeriodicCheck: true,
  enableDetailedInfo: false,
};

/**
 * Custom hook to detect internet connectivity and online status
 *
 * Features:
 * - Browser online/offline detection
 * - Real network connectivity testing via ping
 * - Periodic connectivity checks
 * - Connection quality information
 * - Manual connectivity testing
 *
 * @param config Configuration options for the hook
 * @returns Object containing online status and connectivity methods
 *
 * @example
 * ```tsx
 * function App() {
 *   const { isOnline, connectivityInfo, checkConnectivity } = useOnlineStatus({
 *     checkInterval: 15000,
 *     enableDetailedInfo: true
 *   });
 *
 *   if (!isOnline) {
 *     return <div>You are offline. Please check your internet connection.</div>;
 *   }
 *
 *   return <div>App content here...</div>;
 * }
 * ```
 */
export function useOnlineStatus(
  config: OnlineStatusConfig = {}
): OnlineStatusReturn {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  // Browser's navigator.onLine status
  const [browserOnline, setBrowserOnline] = useState(navigator.onLine);

  // Actual network connectivity status
  const [networkReachable, setNetworkReachable] = useState(true);

  // Detailed connectivity information
  const [connectivityInfo, setConnectivityInfo] = useState<ConnectivityInfo>({
    browserOnline: navigator.onLine,
    networkReachable: true,
    lastSuccessfulPing: null,
    lastFailedPing: null,
    rtt: null,
    connectionType: null,
    effectiveType: null,
    isChecking: false,
  });

  // Refs for cleanup
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * Get connection information from Navigator API
   */
  const getConnectionInfo = useCallback(() => {
    // Type-safe access to navigator connection API
    interface NavigatorWithConnection extends Navigator {
      connection?: {
        type?: string;
        effectiveType?: string;
        rtt?: number;
      };
      mozConnection?: {
        type?: string;
        effectiveType?: string;
        rtt?: number;
      };
      webkitConnection?: {
        type?: string;
        effectiveType?: string;
        rtt?: number;
      };
    }

    const nav = navigator as NavigatorWithConnection;
    const connection =
      nav.connection || nav.mozConnection || nav.webkitConnection;

    if (connection) {
      return {
        connectionType: connection.type || null,
        effectiveType: connection.effectiveType || null,
        rtt: connection.rtt || null,
      };
    }

    return {
      connectionType: null,
      effectiveType: null,
      rtt: null,
    };
  }, []);

  /**
   * Perform actual network connectivity test
   */
  const checkConnectivity = useCallback(async (): Promise<boolean> => {
    // Cancel previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    setConnectivityInfo(prev => ({ ...prev, isChecking: true }));

    try {
      const startTime = Date.now();

      const response = await fetch(finalConfig.pingUrl, {
        method: 'GET',
        cache: 'no-cache',
        mode: 'cors',
        signal: abortControllerRef.current.signal,
        headers: {
          'Cache-Control': 'no-cache',
        },
      });

      const endTime = Date.now();
      const roundTripTime = endTime - startTime;

      if (response.ok || response.status === 0) {
        const connectionInfo = getConnectionInfo();
        const now = new Date();

        setNetworkReachable(true);
        setConnectivityInfo(prev => ({
          ...prev,
          networkReachable: true,
          lastSuccessfulPing: now,
          isChecking: false,
          ...connectionInfo,
          rtt: connectionInfo.rtt || roundTripTime,
        }));

        return true;
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      // Don't treat aborted requests as failures
      if (error instanceof Error && error.name === 'AbortError') {
        return networkReachable;
      }

      const connectionInfo = getConnectionInfo();
      const now = new Date();

      setNetworkReachable(false);
      setConnectivityInfo(prev => ({
        ...prev,
        networkReachable: false,
        lastFailedPing: now,
        isChecking: false,
        ...connectionInfo,
      }));

      return false;
    }
  }, [finalConfig.pingUrl, networkReachable, getConnectionInfo]);

  /**
   * Handle browser online/offline events
   */
  const handleOnline = useCallback(() => {
    setBrowserOnline(true);
    setConnectivityInfo(prev => ({ ...prev, browserOnline: true }));
    // Immediately check actual connectivity when browser comes online
    checkConnectivity();
  }, [checkConnectivity]);

  const handleOffline = useCallback(() => {
    setBrowserOnline(false);
    setNetworkReachable(false);
    setConnectivityInfo(prev => ({
      ...prev,
      browserOnline: false,
      networkReachable: false,
    }));
  }, []);

  /**
   * Force refresh the connection status
   */
  const refresh = useCallback(() => {
    setBrowserOnline(navigator.onLine);
    setConnectivityInfo(prev => ({ ...prev, browserOnline: navigator.onLine }));
    checkConnectivity();
  }, [checkConnectivity]);

  // Set up event listeners and periodic checks
  useEffect(() => {
    // Add browser online/offline event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial connectivity check
    checkConnectivity();

    // Set up periodic connectivity checks
    if (finalConfig.enablePeriodicCheck) {
      intervalRef.current = setInterval(() => {
        // Only check if browser thinks we're online
        if (navigator.onLine) {
          checkConnectivity();
        }
      }, finalConfig.checkInterval);
    }

    // Cleanup function
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [
    finalConfig.enablePeriodicCheck,
    finalConfig.checkInterval,
    handleOnline,
    handleOffline,
    checkConnectivity,
  ]);

  // Calculate overall online status
  const isOnline = browserOnline && networkReachable;

  return {
    isOnline,
    connectivityInfo: {
      ...connectivityInfo,
      browserOnline,
      networkReachable,
    },
    checkConnectivity,
    refresh,
  };
}

/**
 * Simplified hook that returns just the online status
 *
 * @param checkInterval Optional interval for periodic checks (default: 30000ms)
 * @returns Boolean indicating if the app is online
 *
 * @example
 * ```tsx
 * function SimpleComponent() {
 *   const isOnline = useSimpleOnlineStatus();
 *
 *   return (
 *     <div>
 *       Status: {isOnline ? 'Online' : 'Offline'}
 *     </div>
 *   );
 * }
 * ```
 */
export function useSimpleOnlineStatus(checkInterval?: number): boolean {
  const { isOnline } = useOnlineStatus({
    checkInterval,
    enableDetailedInfo: false,
    enablePeriodicCheck: true,
  });

  return isOnline;
}

/**
 * Hook for getting detailed connectivity information
 *
 * @param config Configuration options
 * @returns Detailed connectivity information
 *
 * @example
 * ```tsx
 * function NetworkInfo() {
 *   const info = useDetailedConnectivity({
 *     enableDetailedInfo: true,
 *     checkInterval: 10000
 *   });
 *
 *   return (
 *     <div>
 *       <p>Browser Online: {info.browserOnline ? 'Yes' : 'No'}</p>
 *       <p>Network Reachable: {info.networkReachable ? 'Yes' : 'No'}</p>
 *       <p>Connection Type: {info.connectionType || 'Unknown'}</p>
 *       <p>RTT: {info.rtt ? `${info.rtt}ms` : 'Unknown'}</p>
 *     </div>
 *   );
 * }
 * ```
 */
export function useDetailedConnectivity(
  config: OnlineStatusConfig = {}
): ConnectivityInfo {
  const { connectivityInfo } = useOnlineStatus({
    ...config,
    enableDetailedInfo: true,
  });

  return connectivityInfo;
}

export default useOnlineStatus;
