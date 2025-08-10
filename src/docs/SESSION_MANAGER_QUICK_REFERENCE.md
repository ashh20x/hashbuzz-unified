# 🚀 Session Manager Quick Reference Card

## **🎯 Quick Start**
```typescript
const sessionManager = useAppSessionManager();

// Basic splash screen control
if (sessionManager.shouldShowSplash) {
  return <SplashScreen />;
}
return <MainApp />;
```

## **📊 State Flags Reference**

| Flag | Type | Purpose | When True |
|------|------|---------|-----------|
| `shouldShowSplash` | `boolean` | **Primary UI control** | During initialization or wallet sync |
| `isAppReady` | `boolean` | **App fully ready** | All systems initialized and ready |
| `isLoading` | `boolean` | **Any loading operation** | During init OR token refresh |
| `hasInitialized` | `boolean` | **Session validated** | Initial server check complete |
| `isInitializing` | `boolean` | **Currently validating** | Validating session with server |
| `isRefreshing` | `boolean` | **Token refresh active** | Background token operations |
| `isUserAuthenticated` | `boolean` | **Wallet + Auth ready** | Both wallet connected AND authenticated |

## **🔄 State Flow Quick View**

```
App Start → isInitializing: true → Session Check → hasInitialized: true
    ↓
Wallet Check → isUserAuthenticated: true/false → Token Sync
    ↓
isAppReady: true → shouldShowSplash: false → App Ready! 🎉
```

## **🎨 Common UI Patterns**

### **Simple Splash**
```typescript
const { shouldShowSplash } = useAppSessionManager();
return shouldShowSplash ? <Splash /> : <App />;
```

### **Progressive Loading**
```typescript
const { hasInitialized, isUserAuthenticated, isAppReady } = useAppSessionManager();

if (!hasInitialized) return <div>Validating session...</div>;
if (!isUserAuthenticated) return <div>Connect wallet...</div>;
if (!isAppReady) return <div>Setting up...</div>;
return <App />;
```

### **Background Refresh Indicator**
```typescript
const { isRefreshing, shouldShowSplash } = useAppSessionManager();

return (
  <div>
    {shouldShowSplash ? <Splash /> : <App />}
    {isRefreshing && <div className="refresh-indicator">🔄 Refreshing...</div>}
  </div>
);
```

## **🔧 Configuration Options**

```typescript
useAppSessionManager({
  refreshEndpoint: '/auth/refresh-token',  // Default
  bufferSeconds: 60,                       // Refresh 1 min before expiry
  sessionExpireMinutes: 15,                // 15 min sessions
});
```

## **🚨 Error States**

| Error Type | Behavior | Recovery |
|------------|----------|----------|
| **Network Error** | Continue with cached state | Retry on next operation |
| **401/403 Auth** | Clear session, reset auth | User must re-authenticate |
| **Rate Limit** | Retry with exponential backoff | Automatic recovery |
| **Invalid Token** | Clear and reinitialize | Graceful degradation |

## **🔍 Debug Commands**

```typescript
// Development logging
localStorage.setItem('debug', 'session-manager:*');

// State inspection
const sm = useAppSessionManager();
console.table({
  shouldShowSplash: sm.shouldShowSplash,
  isAppReady: sm.isAppReady,
  hasInitialized: sm.hasInitialized,
  isUserAuthenticated: sm.isUserAuthenticated
});
```

## **⚡ Performance Tips**

- ✅ Use `shouldShowSplash` for main loading UI
- ✅ Use `isAppReady` for route protection
- ✅ Show subtle indicators during `isRefreshing`
- ❌ Don't create additional loading states
- ❌ Don't block UI during background operations

## **🔗 Module Architecture**

```
useAppSessionManager (Main)
├── useTokenManager (Token operations)
├── useWalletSync (Wallet connection)
├── useSessionValidator (Session validation)
├── useTokenAssociationSync (Token sync)
├── useCrossTabSync (Multi-tab sync)
└── useTabVisibilityManager (Performance)
```

## **📱 Mobile Considerations**

```typescript
const isMobile = useMediaQuery('(max-width: 768px)');

if (sessionManager.shouldShowSplash) {
  return (
    <SplashScreen 
      compact={isMobile}
      showProgress={!isMobile}
    />
  );
}
```

## **🎯 Key Benefits**

- 🔄 **Automatic token refresh** with cross-tab sync
- 🔗 **Wallet state management** with page reload recovery
- ⚡ **Performance optimized** with tab visibility handling
- 🛡️ **Secure cross-tab** token synchronization
- 🧩 **Modular architecture** for easy testing and maintenance
- 📱 **Mobile-friendly** with optimized loading states

---
**💡 Pro Tip:** Use the computed flags (`shouldShowSplash`, `isAppReady`, `isLoading`) for the cleanest, most maintainable code!
