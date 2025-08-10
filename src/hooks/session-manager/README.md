# Session Manager v3.0.0 - Modular Architecture

A comprehensive, modular session management solution for React applications with advanced features for token management, wallet synchronization, and cross-tab communication.

## 🏗️ Architecture Overview

The Session Manager is built with a modular architecture that separates concerns into focused, testable modules:

```
┌─────────────────────────────────────────────────────────────┐
│                 useAppSessionManager                        │
│                   (Orchestrator)                           │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ Token       │  │ Wallet      │  │ Session            │  │
│  │ Manager     │  │ Sync        │  │ Validator          │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ Token       │  │ Cross-Tab   │  │ Tab Visibility     │  │
│  │ Association │  │ Sync        │  │ Manager            │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## 📦 Modules

### Core Modules

#### `useTokenManager`
- Token expiry management
- Automatic refresh scheduling
- Cross-tab refresh locking
- Secure token validation

#### `useWalletSync`
- Wallet connection state monitoring
- Redux state synchronization
- Connection throttling
- Page reload recovery

#### `useSessionValidator`
- Session initialization
- Authentication validation
- Rate limiting handling
- Error recovery

### Support Modules

#### `useTokenAssociationSync`
- Contract-wallet token synchronization
- Token validation and association
- User configuration management

#### `useCrossTabSync`
- localStorage event handling
- Cross-tab token synchronization
- Distributed state management

#### `useTabVisibilityManager`
- Performance optimization
- Background/foreground state handling
- Token refresh suspension

## 🚀 Quick Start

### Basic Usage

```typescript
import { useAppSessionManager } from './hooks/use-appSession-manager';

const MyApp = () => {
  const sessionManager = useAppSessionManager({
    refreshEndpoint: '/auth/refresh-token',
    bufferSeconds: 60,
    sessionExpireMinutes: 15
  });

  if (sessionManager.isInitializing) {
    return <div>Initializing session...</div>;
  }

  return (
    <div>
      <p>Authenticated: {sessionManager.isUserAuthenticated ? 'Yes' : 'No'}</p>
      <p>Session Ready: {sessionManager.hasInitialized ? 'Yes' : 'No'}</p>
      <button onClick={() => sessionManager.refreshToken()}>
        Manual Refresh
      </button>
    </div>
  );
};
```

### Advanced Usage

```typescript
import { 
  useTokenManager,
  useWalletSync,
  SESSION_DEFAULTS 
} from './hooks/session-manager';

const AdvancedComponent = () => {
  // Use individual modules for fine-grained control
  const tokenManager = useTokenManager(
    SESSION_DEFAULTS.SESSION_EXPIRE_MINUTES,
    SESSION_DEFAULTS.BUFFER_SECONDS,
    '/custom/refresh'
  );

  const handleTokenRefresh = async () => {
    const success = await tokenManager.refreshToken();
    if (success) {
      console.log('Token refreshed successfully');
    }
  };

  return (
    <div>
      <p>Token expires: {new Date(tokenManager.getTokenExpiry() || 0).toLocaleString()}</p>
      <button onClick={handleTokenRefresh} disabled={tokenManager.isRefreshing}>
        {tokenManager.isRefreshing ? 'Refreshing...' : 'Refresh Token'}
      </button>
    </div>
  );
};
```

## 🔧 Configuration

### Default Configuration

```typescript
const SESSION_DEFAULTS = {
  REFRESH_ENDPOINT: "/auth/refresh-token",
  BUFFER_SECONDS: 60,                    // Refresh 1 min before expiry
  SESSION_EXPIRE_MINUTES: 15,            // 15 min sessions
  NAVIGATION_THROTTLE_MS: 1000,          // 1 sec throttling
  FETCH_TIMEOUT_MS: 10000,               // 10 sec request timeout
  INITIALIZATION_DELAY_MS: 1000,         // 1 sec init delay
  RETRY_DELAY_MS: 2000,                  // 2 sec retry delay
  MAX_FUTURE_TIME_HOURS: 24,             // Max 24 hour expiry
};
```

### Custom Configuration

```typescript
const sessionManager = useAppSessionManager({
  refreshEndpoint: '/api/v2/auth/refresh',
  bufferSeconds: 120,        // Refresh 2 minutes before expiry
  sessionExpireMinutes: 30,  // 30 minute sessions
});
```

## 📊 API Reference

### Main Hook: `useAppSessionManager`

```typescript
interface SessionManagerAPI {
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
}
```

### Props

```typescript
interface UseAppSessionManagerProps {
  refreshEndpoint?: string;        // API endpoint for token refresh
  bufferSeconds?: number;          // Seconds before expiry to refresh
  sessionExpireMinutes?: number;   // Session duration in minutes
}
```

## 🔍 Debugging

### Development Logging

In development mode, detailed logging is available:

```typescript
// Enable debug logging
localStorage.setItem('debug', 'session-manager:*');

// Module-specific logging
[useAppSessionManager] Session initialization
[TokenManager] Refreshing access token...
[WalletSync] Wallet status changed
```

### State Inspection

```typescript
const sessionManager = useAppSessionManager();

// Inspect current state
console.log({
  isAuthenticated: sessionManager.isUserAuthenticated,
  hasInitialized: sessionManager.hasInitialized,
  isRefreshing: sessionManager.isRefreshing,
  tokenExpiry: new Date(sessionManager.getTokenExpiry() || 0)
});
```

## 🧪 Testing

### Unit Testing Individual Modules

```typescript
import { renderHook, act } from '@testing-library/react-hooks';
import { useTokenManager } from './session-manager/useTokenManager';

describe('useTokenManager', () => {
  test('should handle token expiry correctly', () => {
    const { result } = renderHook(() => 
      useTokenManager(15, 60, '/auth/refresh')
    );
    
    act(() => {
      const expiry = result.current.setTokenExpiry();
      expect(expiry).toBeGreaterThan(Date.now());
    });
  });
});
```

### Integration Testing

```typescript
import { renderHook } from '@testing-library/react-hooks';
import { useAppSessionManager } from './use-appSession-manager';

describe('useAppSessionManager', () => {
  test('should initialize session correctly', async () => {
    const { result, waitForNextUpdate } = renderHook(() => 
      useAppSessionManager()
    );
    
    expect(result.current.isInitializing).toBe(true);
    
    await waitForNextUpdate();
    
    expect(result.current.hasInitialized).toBe(true);
  });
});
```

## 🔄 Migration from v2.x

The v3.0 API is 100% backward compatible. Simply update your import:

```typescript
// v2.x
import { useAppSessionManager } from './hooks/use-appSession-manager';

// v3.0 (drop-in replacement)
import { useAppSessionManager } from './hooks/use-appSession-manager';
```

See [MIGRATION.md](./MIGRATION.md) for detailed migration guide.

## 🤝 Contributing

1. Each module should have a single responsibility
2. All modules must be pure functions (no side effects in module scope)
3. Use TypeScript for type safety
4. Include comprehensive JSDoc comments
5. Add unit tests for new functionality

## 📄 License

This module is part of the HashBuzz project and follows the same licensing terms.
