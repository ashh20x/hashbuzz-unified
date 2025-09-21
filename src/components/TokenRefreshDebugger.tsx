import { getCookieByName } from '@/comman/helpers';
import { AUTH_STORAGE_KEYS } from '@/hooks/session-manager/constants';
import React, { useEffect, useState } from 'react';

const TokenRefreshDebugger: React.FC = () => {
  const [tokenInfo, setTokenInfo] = useState<{
    hasAccessToken: boolean;
    tokenExpiry: string | null;
    timeUntilExpiry: number;
    lastRefresh: string | null;
  }>({
    hasAccessToken: false,
    tokenExpiry: null,
    timeUntilExpiry: 0,
    lastRefresh: null,
  });

  const updateTokenInfo = () => {
    const hasAccessToken = !!getCookieByName('access_token');
    const storedExpiry = localStorage.getItem(
      AUTH_STORAGE_KEYS.ACCESS_TOKEN_EXPIRY
    );
    const lastRefresh = localStorage.getItem(
      AUTH_STORAGE_KEYS.LAST_TOKEN_REFRESH
    );

    const expiry = storedExpiry ? Number(storedExpiry) : null;
    const timeUntilExpiry = expiry ? expiry - Date.now() : 0;

    setTokenInfo({
      hasAccessToken,
      tokenExpiry: expiry ? new Date(expiry).toLocaleString() : null,
      timeUntilExpiry: Math.max(0, Math.round(timeUntilExpiry / 1000)),
      lastRefresh: lastRefresh
        ? new Date(Number(lastRefresh)).toLocaleString()
        : null,
    });
  };

  useEffect(() => {
    updateTokenInfo();
    const interval = setInterval(updateTokenInfo, 1000);
    return () => clearInterval(interval);
  }, []);

  const forceRefresh = () => {
    // Access the session manager from window (if available in development)
    if (typeof window !== 'undefined' && (window as any).sessionManager) {
      console.log('Forcing token refresh via sessionManager');
      (window as any).sessionManager.forceRefresh();
    } else {
      console.log('sessionManager not available on window');
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 10,
        right: 10,
        background: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: 10,
        borderRadius: 5,
        fontSize: 12,
        zIndex: 9999,
        fontFamily: 'monospace',
      }}
    >
      <h4>Token Debug</h4>
      <div>Access Token: {tokenInfo.hasAccessToken ? '✅' : '❌'}</div>
      <div>Token Expiry: {tokenInfo.tokenExpiry || 'N/A'}</div>
      <div>Expires in: {tokenInfo.timeUntilExpiry}s</div>
      <div>Last Refresh: {tokenInfo.lastRefresh || 'Never'}</div>
      <button
        onClick={forceRefresh}
        style={{
          marginTop: 10,
          padding: 5,
          fontSize: 10,
          cursor: 'pointer',
        }}
      >
        Force Refresh
      </button>
    </div>
  );
};

export default TokenRefreshDebugger;
