import { getCookieByName } from '@/comman/helpers';
import { useSessionManager } from '@/contexts';
import { useAppSelector } from '@/Store/store';
import { useAuthPingMutation } from '@/Ver2Designs/Pages/AuthAndOnboard/api/auth';
import React, { useEffect, useState } from 'react';

interface SessionDebugInfo {
  cookies: {
    token: boolean;
    refreshToken: boolean;
  };
  sessionManager: {
    isAuthenticated: boolean;
    isLoading: boolean;
    hasInitialized: boolean;
    error: string | null;
    isUserAuthenticated: boolean;
  };
  reduxAuth: {
    walletPaired: boolean;
    authenticated: boolean;
    xAccountConnected: boolean;
    tokensAssociated: boolean;
    isFullyOnboarded: boolean;
  };
  lastPingResult?: unknown;
  lastPingError?: unknown;
}

const SessionDebugger: React.FC = () => {
  const sessionManager = useSessionManager();
  const [sessionCheckPing] = useAuthPingMutation();
  const [debugInfo, setDebugInfo] = useState<SessionDebugInfo | null>(null);
  const [isManualTesting, setIsManualTesting] = useState(false);

  // Get Redux auth state
  const { wallet, auth, xAccount, token } = useAppSelector(
    s => s.auth.userAuthAndOnBoardSteps
  );

  useEffect(() => {
    // Update debug info periodically
    const updateInfo = () => {
      const isFullyOnboarded =
        wallet.isPaired &&
        auth.isAuthenticated &&
        xAccount.isConnected &&
        token.allAssociated;

      const info: SessionDebugInfo = {
        cookies: {
          token: !!getCookieByName('token'),
          refreshToken: !!getCookieByName('refreshToken'),
        },
        sessionManager: {
          isAuthenticated: sessionManager.isAuthenticated,
          isLoading: sessionManager.isLoading,
          hasInitialized: sessionManager.hasInitialized,
          error: sessionManager.error,
          isUserAuthenticated: sessionManager.isUserAuthenticated,
        },
        reduxAuth: {
          walletPaired: wallet.isPaired,
          authenticated: auth.isAuthenticated,
          xAccountConnected: xAccount.isConnected,
          tokensAssociated: token.allAssociated,
          isFullyOnboarded,
        },
      };
      setDebugInfo(info);
    };

    updateInfo();
    const interval = setInterval(updateInfo, 2000);
    return () => clearInterval(interval);
  }, [
    sessionManager.isAuthenticated,
    sessionManager.isLoading,
    sessionManager.hasInitialized,
    sessionManager.error,
    sessionManager.isUserAuthenticated,
    wallet.isPaired,
    auth.isAuthenticated,
    xAccount.isConnected,
    token.allAssociated,
  ]);

  const testPingManually = async () => {
    setIsManualTesting(true);
    try {
      console.warn('[SESSION DEBUGGER] Manual ping test...');
      const result = await sessionCheckPing().unwrap();
      console.warn('[SESSION DEBUGGER] Manual ping result:', result);
      setDebugInfo(prev =>
        prev ? { ...prev, lastPingResult: result, lastPingError: null } : null
      );
    } catch (error) {
      console.error('[SESSION DEBUGGER] Manual ping error:', error);
      setDebugInfo(prev =>
        prev ? { ...prev, lastPingError: error, lastPingResult: null } : null
      );
    } finally {
      setIsManualTesting(false);
    }
  };

  const clearSession = () => {
    sessionManager.logout();
  };

  const retryInitialization = () => {
    sessionManager.retryInitialization();
  };

  if (!debugInfo) return <div>Loading debug info...</div>;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        background: 'rgba(0,0,0,0.9)',
        color: 'white',
        padding: '15px',
        borderRadius: '8px',
        fontSize: '12px',
        maxWidth: '400px',
        zIndex: 9999,
        fontFamily: 'monospace',
      }}
    >
      <h4 style={{ margin: '0 0 10px 0', color: '#00ff00' }}>
        🔍 Session Debug
      </h4>

      <div style={{ marginBottom: '10px' }}>
        <strong>Cookies:</strong>
        <div>• token: {debugInfo.cookies.token ? '✅' : '❌'}</div>
        <div>
          • refreshToken: {debugInfo.cookies.refreshToken ? '✅' : '❌'}
        </div>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <strong>Session Manager:</strong>
        <div>
          • isAuthenticated:{' '}
          {debugInfo.sessionManager.isAuthenticated ? '✅' : '❌'}
        </div>
        <div>
          • isLoading: {debugInfo.sessionManager.isLoading ? '⏳' : '✅'}
        </div>
        <div>
          • hasInitialized:{' '}
          {debugInfo.sessionManager.hasInitialized ? '✅' : '❌'}
        </div>
        <div>
          • isUserAuthenticated:{' '}
          {debugInfo.sessionManager.isUserAuthenticated ? '✅' : '❌'}
        </div>
        {debugInfo.sessionManager.error && (
          <div style={{ color: '#ff4444' }}>
            • error: {debugInfo.sessionManager.error}
          </div>
        )}
      </div>

      <div style={{ marginBottom: '10px' }}>
        <strong>Redux Auth State:</strong>
        <div>
          • walletPaired: {debugInfo.reduxAuth.walletPaired ? '✅' : '❌'}
        </div>
        <div>
          • authenticated: {debugInfo.reduxAuth.authenticated ? '✅' : '❌'}
        </div>
        <div>
          • xAccountConnected:{' '}
          {debugInfo.reduxAuth.xAccountConnected ? '✅' : '❌'}
        </div>
        <div>
          • tokensAssociated:{' '}
          {debugInfo.reduxAuth.tokensAssociated ? '✅' : '❌'}
        </div>
        <div
          style={{
            color: debugInfo.reduxAuth.isFullyOnboarded ? '#90EE90' : '#ff4444',
          }}
        >
          •{' '}
          <strong>
            isFullyOnboarded:{' '}
            {debugInfo.reduxAuth.isFullyOnboarded ? '✅' : '❌'}
          </strong>
        </div>
      </div>

      {debugInfo.lastPingResult ? (
        <div style={{ marginBottom: '10px' }}>
          <strong>Last Ping Result:</strong>
          <pre
            style={{
              fontSize: '10px',
              whiteSpace: 'pre-wrap',
              color: '#90EE90',
            }}
          >
            {JSON.stringify(debugInfo.lastPingResult, null, 2)}
          </pre>
        </div>
      ) : null}

      {debugInfo.lastPingError ? (
        <div style={{ marginBottom: '10px' }}>
          <strong>Last Ping Error:</strong>
          <pre
            style={{
              fontSize: '10px',
              whiteSpace: 'pre-wrap',
              color: '#ff4444',
            }}
          >
            {JSON.stringify(debugInfo.lastPingError, null, 2)}
          </pre>
        </div>
      ) : null}

      <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
        <button
          onClick={testPingManually}
          disabled={isManualTesting}
          style={{
            padding: '4px 8px',
            fontSize: '10px',
            background: '#007acc',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer',
          }}
        >
          {isManualTesting ? 'Testing...' : 'Test Ping'}
        </button>
        <button
          onClick={retryInitialization}
          style={{
            padding: '4px 8px',
            fontSize: '10px',
            background: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer',
          }}
        >
          Retry Init
        </button>
        <button
          onClick={clearSession}
          style={{
            padding: '4px 8px',
            fontSize: '10px',
            background: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer',
          }}
        >
          Clear Session
        </button>
      </div>
    </div>
  );
};

export default SessionDebugger;
