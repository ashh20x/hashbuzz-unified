# Session Manager Hook - Quick Guide

## 🚀 **Basic Usage**

```typescript
import { useAppSessionManager } from '@/hooks/use-appSession-manager';

const App = () => {
  const sessionManager = useAppSessionManager();
  
  if (sessionManager.shouldShowSplash) {
    return <SplashScreen />;
  }
  
  return <MainApp />;
};
```

## 🔄 **Key States**

| State | Description |
|-------|-------------|
| `shouldShowSplash` | Show loading screen during initialization |
| `isUserAuthenticated` | User is fully authenticated (wallet + session) |
| `hasInitialized` | Session validation completed |
| `isRefreshing` | Token refresh in progress |

## ⚙️ **Configuration**

```typescript
const sessionManager = useAppSessionManager({
  refreshEndpoint: "/auth/refresh-token",  // API endpoint
  bufferSeconds: 60,                       // Refresh before expiry
  sessionExpireMinutes: 15                 // Session duration
});
```

## 🔧 **Methods**

```typescript
// Manual token refresh
sessionManager.refreshToken();

// Force refresh (testing)
sessionManager.forceRefresh();

// Check token expiry
const expiry = sessionManager.getTokenExpiry();
```

## 📱 **Loading States**

```typescript
// Simple loading
if (sessionManager.shouldShowSplash) {
  return <SplashScreen />;
}

// Detailed loading
const { isInitializing, isRefreshing, isAppReady } = sessionManager;

if (isInitializing) return <InitializingScreen />;
if (!isAppReady) return <LoadingScreen />;
if (isRefreshing) return <TokenRefreshIndicator />;
```

## 🐛 **Debug Logs**

Development mode shows logs with prefixes:
- `[SESSION MANAGER]` - Main events
- `[TOKEN REFRESH]` - Token operations  
- `[WALLET SYNC]` - Wallet changes
- `[SESSION VALIDATOR]` - Auth validation

## ⚡ **Quick Tips**

- **Always check `shouldShowSplash`** before rendering main app
- **Use `isUserAuthenticated`** for protected routes
- **Session validation runs automatically** on app mount
- **Token refresh happens automatically** before expiry
- **Cross-tab sync** prevents duplicate refreshes
