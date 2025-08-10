# 🎨 Splash Screen Management Guide

## **✅ Recommendation: Use Existing Flags**

You **DO NOT** need a separate loading boolean! The Session Manager already provides all the flags you need for effective splash screen management.

## 🎯 **Simple Approach (Recommended)**

Use the computed `shouldShowSplash` flag for the cleanest implementation:

```typescript
import { useAppSessionManager } from './hooks/use-appSession-manager';

const App = () => {
  const sessionManager = useAppSessionManager();

  // ✅ SIMPLE: Use the computed flag
  if (sessionManager.shouldShowSplash) {
    return <SplashScreen />;
  }

  return <MainApp />;
};
```

## 🔧 **Available Flags for Loading States**

### Primary Flags
```typescript
const sessionManager = useAppSessionManager();

// Computed states (NEW in v3.0)
sessionManager.shouldShowSplash   // true when app is still loading
sessionManager.isAppReady         // true when app is fully ready
sessionManager.isLoading          // true during any loading operation

// Individual state flags
sessionManager.hasInitialized     // Session validation complete
sessionManager.isInitializing     // Currently validating session
sessionManager.isRefreshing       // Currently refreshing tokens
sessionManager.isUserAuthenticated // Wallet connected & authenticated
```

## 🎨 **Splash Screen Patterns**

### Pattern 1: Basic Splash Screen
```typescript
const App = () => {
  const { shouldShowSplash, isInitializing, isRefreshing } = useAppSessionManager();

  if (shouldShowSplash) {
    return (
      <div className="splash-screen">
        <Logo />
        <Spinner />
        <p>
          {isInitializing ? 'Validating session...' : 
           isRefreshing ? 'Refreshing tokens...' : 
           'Starting HashBuzz...'}
        </p>
      </div>
    );
  }

  return <MainApp />;
};
```

### Pattern 2: Progressive Loading with Steps
```typescript
const App = () => {
  const sessionManager = useAppSessionManager();

  if (!sessionManager.isAppReady) {
    const steps = [
      { label: 'Session Validation', completed: sessionManager.hasInitialized },
      { label: 'Wallet Connection', completed: sessionManager.isUserAuthenticated },
      { label: 'Ready to Use', completed: sessionManager.isAppReady }
    ];

    return (
      <div className="loading-screen">
        <Logo />
        <ProgressSteps steps={steps} />
        <LoadingMessage sessionManager={sessionManager} />
      </div>
    );
  }

  return <MainApp />;
};
```

### Pattern 3: Background Loading with Overlay
```typescript
const App = () => {
  const sessionManager = useAppSessionManager();

  return (
    <div className="app">
      <MainApp />
      
      {/* Show overlay during token refresh */}
      {sessionManager.isRefreshing && (
        <div className="refresh-overlay">
          <div className="refresh-indicator">
            🔄 Refreshing session...
          </div>
        </div>
      )}
      
      {/* Show full splash during initialization */}
      {sessionManager.shouldShowSplash && (
        <div className="splash-overlay">
          <SplashScreen />
        </div>
      )}
    </div>
  );
};
```

## 📊 **State Flow Diagram**

```
App Start
    ↓
shouldShowSplash: true
isInitializing: true
    ↓
Session Validation Complete
    ↓
hasInitialized: true
isInitializing: false
    ↓
Wallet Sync Check
    ↓
isUserAuthenticated: true/false
    ↓
shouldShowSplash: false
isAppReady: true
    ↓
App Ready! 🎉
```

## 🎯 **Best Practices**

### ✅ DO:
- Use `shouldShowSplash` for simple splash screen logic
- Use `isAppReady` to determine when to show main content
- Show different messages based on `isInitializing` vs `isRefreshing`
- Use `isUserAuthenticated` for wallet-specific UI states

### ❌ DON'T:
- Create additional loading booleans
- Manually track initialization state
- Show splash during token refresh (use subtle indicator instead)
- Block UI during background token operations

## 🛠️ **Implementation Examples**

### Minimal Implementation
```typescript
const App = () => {
  const { shouldShowSplash } = useAppSessionManager();
  
  return shouldShowSplash ? <SplashScreen /> : <MainApp />;
};
```

### Detailed Implementation
```typescript
const App = () => {
  const sessionManager = useAppSessionManager();
  
  // Show splash during initial load
  if (sessionManager.shouldShowSplash) {
    return (
      <SplashScreen 
        isValidating={sessionManager.isInitializing}
        message={getLoadingMessage(sessionManager)}
      />
    );
  }
  
  return (
    <div>
      <MainApp />
      {/* Subtle indicator for background operations */}
      {sessionManager.isRefreshing && <TokenRefreshIndicator />}
    </div>
  );
};

const getLoadingMessage = (sessionManager) => {
  if (sessionManager.isInitializing) return 'Validating your session...';
  if (!sessionManager.hasInitialized) return 'Setting up HashBuzz...';
  return 'Almost ready...';
};
```

## 📱 **Mobile Considerations**

```typescript
const App = () => {
  const sessionManager = useAppSessionManager();
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  if (sessionManager.shouldShowSplash) {
    return (
      <SplashScreen 
        compact={isMobile}
        showProgress={!isMobile}
        sessionManager={sessionManager}
      />
    );
  }
  
  return <MainApp />;
};
```

## 🔍 **Debugging Loading States**

Add this temporary debug component during development:

```typescript
const LoadingDebugger = () => {
  const sessionManager = useAppSessionManager();
  
  if (process.env.NODE_ENV !== 'development') return null;
  
  return (
    <div className="debug-panel">
      <h4>Session Manager Debug</h4>
      <ul>
        <li>shouldShowSplash: {String(sessionManager.shouldShowSplash)}</li>
        <li>isAppReady: {String(sessionManager.isAppReady)}</li>
        <li>hasInitialized: {String(sessionManager.hasInitialized)}</li>
        <li>isInitializing: {String(sessionManager.isInitializing)}</li>
        <li>isRefreshing: {String(sessionManager.isRefreshing)}</li>
        <li>isUserAuthenticated: {String(sessionManager.isUserAuthenticated)}</li>
      </ul>
    </div>
  );
};
```

## 🎉 **Summary**

**Use existing flags - no separate boolean needed!**

The Session Manager v3.0 provides:
- ✅ `shouldShowSplash` - Perfect for basic splash screen logic
- ✅ `isAppReady` - Indicates when app is fully ready
- ✅ `isLoading` - Combined loading state
- ✅ Individual flags for granular control

Choose the pattern that best fits your UI/UX requirements!
