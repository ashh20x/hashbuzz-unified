# 📋 Session Manager Hook - Comprehensive Usage Guide & Flow Charts

## 🏗️ **Architecture Overview**

The Session Manager Hook v3.0 is a modular, enterprise-grade solution for managing user sessions, wallet connections, and token authentication in React applications.

### **Core Architecture**

```
┌─────────────────────────────────────────────────────────────────┐
│                    useAppSessionManager                         │
│                     (Main Orchestrator)                        │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │  Token Manager  │  │  Wallet Sync    │  │ Session        │  │
│  │  - Token Expiry │  │  - Connection   │  │ Validator      │  │
│  │  - Auto Refresh │  │  - State Sync   │  │ - Auth Check   │  │
│  │  - Cross-tab    │  │  - Throttling   │  │ - Initialization│  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │ Token           │  │ Cross-Tab       │  │ Tab Visibility  │  │
│  │ Association     │  │ Sync            │  │ Manager         │  │
│  │ - Contract Sync │  │ - Storage Event │  │ - Performance   │  │
│  │ - User Tokens   │  │ - Distributed   │  │ - Background    │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 **Main Application Flow Chart**

```mermaid
graph TD
    A[App Starts] --> B[useAppSessionManager Hook Initialized]
    B --> C{Session Validator}
    
    C --> D[isInitializing: true]
    D --> E[Validate Session with Server]
    
    E --> F{Authentication Response}
    F -->|Success| G[hasInitialized: true]
    F -->|Rate Limited| H[Retry after delay]
    F -->|No Token| I[Clear expired data]
    F -->|Error| J[Log error & clear data]
    
    G --> K{Wallet State Check}
    H --> E
    I --> G
    J --> G
    
    K --> L[Initialize Wallet Sync]
    L --> M{Wallet Connected?}
    
    M -->|Yes| N[isPaired: true]
    M -->|No| O[isPaired: false]
    
    N --> P[Token Association Sync]
    O --> P
    
    P --> Q[isAppReady: true]
    Q --> R[shouldShowSplash: false]
    R --> S[🎉 App Ready for User]
    
    S --> T[Background Operations]
    T --> U[Token Refresh Timer]
    T --> V[Cross-tab Sync]
    T --> W[Visibility Management]
```

---

## 🎯 **Session Initialization Flow**

```mermaid
sequenceDiagram
    participant App as React App
    participant SM as Session Manager
    participant SV as Session Validator
    participant TM as Token Manager
    participant WS as Wallet Sync
    participant API as Backend API
    
    App->>SM: useAppSessionManager()
    SM->>SV: Initialize Session Validator
    SM->>TM: Initialize Token Manager
    SM->>WS: Initialize Wallet Sync
    
    Note over SM: shouldShowSplash: true
    Note over SM: isInitializing: true
    
    SV->>API: sessionCheckPing()
    
    alt Success Response
        API-->>SV: { isAuthenticated: true }
        SV->>TM: setTokenExpiry()
        SV->>SM: hasInitialized: true
        SM->>WS: Check wallet status
        
        alt Wallet Connected
            WS->>SM: dispatch(walletPaired)
            SM->>App: isUserAuthenticated: true
        else Wallet Not Connected
            SM->>App: isUserAuthenticated: false
        end
        
    else Error Response
        API-->>SV: Error or No Token
        SV->>TM: clearTokenExpiry()
        SV->>SM: hasInitialized: true
    end
    
    Note over SM: shouldShowSplash: false
    Note over SM: isAppReady: true
    
    App->>App: Render Main Content
```

---

## 🔐 **Token Management Flow**

```mermaid
graph TD
    A[Token Manager Initialized] --> B[Check Existing Token]
    B --> C{Token Exists?}
    
    C -->|Yes| D[Validate Expiry]
    C -->|No| E[Clear Storage]
    
    D --> F{Token Valid?}
    F -->|Yes| G[Schedule Refresh]
    F -->|Expiring Soon| H[Refresh Immediately]
    F -->|Expired| I[Clear & Reset Auth]
    
    G --> J[Set Refresh Timer]
    H --> K[Acquire Cross-tab Lock]
    
    K --> L{Lock Acquired?}
    L -->|Yes| M[Make Refresh Request]
    L -->|No| N[Another tab refreshing]
    
    M --> O{Refresh Success?}
    O -->|Yes| P[Update Token Expiry]
    O -->|No| Q[Handle Error]
    
    P --> R[Release Lock]
    P --> S[Schedule Next Refresh]
    Q --> T{Auth Error?}
    T -->|Yes| U[Reset Authentication]
    T -->|No| V[Log Error]
    
    R --> W[Cross-tab Notification]
    S --> X[Continue Monitoring]
    
    N --> Y[Listen for Cross-tab Updates]
    E --> Z[Session Ready]
    I --> U
    U --> Z
    V --> Z
    W --> X
    Y --> X
    X --> AA[🔄 Background Token Management]
```

---

## 🔗 **Wallet Synchronization Flow**

```mermaid
graph TD
    A[Wallet Sync Initialized] --> B[Get Current Wallet State]
    B --> C{First Mount?}
    
    C -->|Yes| D[Skip Throttling]
    C -->|No| E{Within Throttle Window?}
    
    E -->|Yes| F[Skip Update]
    E -->|No| G[Check State Changes]
    
    D --> G
    G --> H{Wallet State Changed?}
    
    H -->|Yes| I[Update Last Status]
    H -->|No| J[No Action Needed]
    
    I --> K{Wallet Connected & Ready?}
    K -->|Yes| L[Dispatch walletPaired]
    K -->|No| M{Previously Connected?}
    
    M -->|Yes| N[Wallet Disconnected]
    M -->|No| O[Log Initial State]
    
    L --> P[Update Redux State]
    N --> Q[Reset Auth State]
    N --> R[Clear Token Data]
    
    P --> S[Post-Init Check]
    Q --> S
    R --> S
    O --> S
    
    S --> T{App Initialized & Not Paired?}
    T -->|Yes| U[Delayed Wallet Sync]
    T -->|No| V[Continue Monitoring]
    
    U --> W[Check Connection After 500ms]
    W --> X{Still Not Paired?}
    X -->|Yes| Y[Force walletPaired Dispatch]
    X -->|No| Z[Already Synchronized]
    
    F --> V
    J --> V
    Y --> V
    Z --> V
    V --> AA[🔄 Continue Wallet Monitoring]
```

---

## 🖥️ **Cross-Tab Synchronization Flow**

```mermaid
graph TD
    A[Cross-Tab Sync Active] --> B[Listen to Storage Events]
    B --> C{Storage Event Type}
    
    C -->|last_token_refresh| D[Another Tab Refreshed]
    C -->|access_token_expiry| E[Token Expiry Updated]
    C -->|refresh_lock removed| F[Refresh Lock Released]
    C -->|Other| G[Ignore Event]
    
    D --> H[Get New Token Expiry]
    H --> I{Valid Expiry?}
    I -->|Yes| J[Clear Current Timer]
    I -->|No| K[Log Invalid Expiry]
    
    J --> L[Schedule New Refresh]
    L --> M[Log: Cross-tab refresh detected]
    
    E --> N[Get Updated Expiry]
    N --> O{Valid & Future?}
    O -->|Yes| P[Clear Current Timer]
    O -->|No| Q[Log Invalid Update]
    
    P --> R[Schedule New Refresh]
    R --> S[Log: Expiry updated in another tab]
    
    F --> T[Check Current Token Expiry]
    T --> U{Needs Immediate Refresh?}
    U -->|Yes| V[Attempt Token Refresh]
    U -->|No| W[Continue Normal Operation]
    
    K --> X[Continue Monitoring]
    M --> X
    Q --> X
    S --> X
    V --> X
    W --> X
    G --> X
    X --> Y[🔄 Continue Cross-tab Sync]
```

---

## 👁️ **Tab Visibility Management Flow**

```mermaid
graph TD
    A[Tab Visibility Manager Active] --> B[Listen to Visibility Changes]
    B --> C{Visibility State}
    
    C -->|Document Hidden| D[Tab Backgrounded]
    C -->|Document Visible| E[Tab Foregrounded]
    
    D --> F[Stop Token Refresh Timer]
    F --> G[Log: Tab hidden, stopping timer]
    G --> H[Optimize Performance]
    
    E --> I{User Authenticated & Initialized?}
    I -->|Yes| J[Check Token Status]
    I -->|No| K[No Action Needed]
    
    J --> L[Get Current Token Expiry]
    L --> M[Check Access Token Cookie]
    
    M --> N{Both Token & Cookie Exist?}
    N -->|Yes| O[Calculate Time Until Expiry]
    N -->|No| P[Clear Token State]
    
    O --> Q{Token Expires Soon?}
    Q -->|Yes| R[Refresh Immediately]
    Q -->|No| S{Token Still Valid?}
    
    S -->|Yes| T[Restart Refresh Timer]
    S -->|No| U[Token Expired]
    
    R --> V[Log: Refreshing after visibility change]
    T --> W[Log: Restarting refresh timer]
    U --> X[Handle Expired Token]
    P --> Y[Log: No token after visibility change]
    
    H --> Z[Continue Background Mode]
    K --> Z
    V --> AA[Continue Active Mode]
    W --> AA
    X --> AA
    Y --> AA
    Z --> BB[🔄 Continue Visibility Management]
    AA --> BB
```

---

## 📊 **State Management Flow Chart**

```mermaid
stateDiagram-v2
    [*] --> Initializing
    
    Initializing --> SessionValidation : Start validation
    SessionValidation --> SessionValidated : Success
    SessionValidation --> SessionFailed : Error/No token
    SessionValidation --> RateLimited : 429 Response
    
    RateLimited --> SessionValidation : Retry after delay
    
    SessionValidated --> WalletCheck : Check wallet state
    SessionFailed --> WalletCheck : Proceed without auth
    
    WalletCheck --> WalletConnected : Wallet ready
    WalletCheck --> WalletDisconnected : No wallet
    
    WalletConnected --> TokenAssociation : Sync tokens
    WalletDisconnected --> AppReady : Ready without wallet
    
    TokenAssociation --> AppReady : Tokens synced
    
    AppReady --> BackgroundOperations : Normal operation
    
    state BackgroundOperations {
        [*] --> TokenMonitoring
        TokenMonitoring --> TokenRefresh : Near expiry
        TokenRefresh --> TokenMonitoring : Success
        TokenRefresh --> AuthReset : Failure
        AuthReset --> TokenMonitoring : Reset complete
        
        TokenMonitoring --> CrossTabSync : Storage event
        CrossTabSync --> TokenMonitoring : Sync complete
        
        TokenMonitoring --> VisibilityChange : Tab visibility
        VisibilityChange --> TokenMonitoring : Handled
    }
    
    BackgroundOperations --> Cleanup : Component unmount
    Cleanup --> [*]
    
    note right of Initializing
        shouldShowSplash: true
        isInitializing: true
        hasInitialized: false
    end note
    
    note right of AppReady
        shouldShowSplash: false
        isAppReady: true
        hasInitialized: true
    end note
```

---

## 🎨 **UI State Flow for Splash Screen**

```mermaid
graph TD
    A[Component Mount] --> B[useAppSessionManager()]
    B --> C{shouldShowSplash?}
    
    C -->|true| D[Show Splash Screen]
    C -->|false| E[Show Main App]
    
    D --> F{isInitializing?}
    F -->|true| G[Show: "Validating session..."]
    F -->|false| H{isRefreshing?}
    
    H -->|true| I[Show: "Refreshing tokens..."]
    H -->|false| J[Show: "Starting application..."]
    
    G --> K[Display Loading Spinner]
    I --> K
    J --> K
    
    K --> L{hasInitialized becomes true?}
    L -->|Yes| M{isUserAuthenticated?}
    L -->|No| N[Continue Showing Splash]
    
    M -->|true| O[shouldShowSplash: false]
    M -->|false| P[Show Wallet Connection UI]
    
    O --> Q[Hide Splash Screen]
    Q --> R[Show Main Application]
    
    P --> S{Wallet Connected?}
    S -->|Yes| O
    S -->|No| T[Continue Wallet UI]
    
    N --> F
    T --> S
    
    R --> U[Background Token Management]
    U --> V{Token Refresh Needed?}
    V -->|Yes| W[Show Subtle Refresh Indicator]
    V -->|No| X[Normal Operation]
    
    W --> Y[Background Refresh Complete]
    Y --> X
    X --> Z[🎉 Full App Experience]
```

---

## 🔧 **Error Handling Flow**

```mermaid
graph TD
    A[Error Occurs] --> B{Error Type}
    
    B -->|Network Error| C[Log Network Error]
    B -->|Authentication Error| D[Clear Auth State]
    B -->|Rate Limit Error| E[Implement Retry Logic]
    B -->|Validation Error| F[Log Validation Error]
    B -->|Token Refresh Error| G[Handle Refresh Failure]
    
    C --> H[Continue with Cached State]
    D --> I[Reset to Unauthenticated]
    E --> J[Wait and Retry]
    F --> K[Clear Invalid Data]
    G --> L{Auth Error Code?}
    
    L -->|401/403| M[Clear Session Data]
    L -->|Other| N[Log and Continue]
    
    H --> O[Update UI State]
    I --> P[Show Login Flow]
    J --> Q[Resume Operation]
    K --> R[Reinitialize]
    M --> S[Reset Authentication]
    N --> T[Maintain Current State]
    
    O --> U[User Notification]
    P --> V[Redirect to Auth]
    Q --> W[Continue Normal Flow]
    R --> X[Restart Initialization]
    S --> Y[Show Unauthenticated UI]
    T --> Z[Log Error for Debugging]
    
    U --> AA[Error Recovery Complete]
    V --> AA
    W --> AA
    X --> AA
    Y --> AA
    Z --> AA
    
    AA --> BB[🔄 Resume Normal Operation]
```

---

## 📱 **Usage Patterns & Examples**

### **Basic Implementation**
```typescript
const App = () => {
  const sessionManager = useAppSessionManager();

  if (sessionManager.shouldShowSplash) {
    return <SplashScreen />;
  }

  return <MainApp />;
};
```

### **Advanced Implementation with Progress**
```typescript
const App = () => {
  const sessionManager = useAppSessionManager();

  if (!sessionManager.isAppReady) {
    return (
      <LoadingScreen>
        <ProgressIndicator
          steps={[
            { label: 'Session', completed: sessionManager.hasInitialized },
            { label: 'Wallet', completed: sessionManager.isUserAuthenticated },
            { label: 'Ready', completed: sessionManager.isAppReady }
          ]}
        />
      </LoadingScreen>
    );
  }

  return (
    <div>
      <MainApp />
      {sessionManager.isRefreshing && <TokenRefreshIndicator />}
    </div>
  );
};
```

### **Granular State Control**
```typescript
const AppStateManager = () => {
  const {
    hasInitialized,
    isInitializing,
    isUserAuthenticated,
    isRefreshing,
    shouldShowSplash,
    isAppReady
  } = useAppSessionManager();

  // Custom loading logic based on specific needs
  if (isInitializing) return <SessionValidationScreen />;
  if (hasInitialized && !isUserAuthenticated) return <WalletConnectionScreen />;
  if (shouldShowSplash) return <SplashScreen />;
  
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={
          isAppReady ? <Dashboard /> : <LoadingPage />
        } />
      </Routes>
      {isRefreshing && <BackgroundRefreshIndicator />}
    </Router>
  );
};
```

---

## 🎯 **Best Practices Summary**

### ✅ **DO:**
- Use `shouldShowSplash` for primary loading states
- Monitor `isAppReady` for full application readiness
- Show subtle indicators during `isRefreshing`
- Implement progressive loading with state flags
- Handle errors gracefully with fallback states

### ❌ **DON'T:**
- Create additional loading state management
- Block UI during background token operations
- Ignore cross-tab synchronization events
- Skip error handling for network failures
- Override the modular architecture

---

## 🔍 **Debugging Guide**

### **State Inspection**
```typescript
const sessionManager = useAppSessionManager();

console.log('Session Manager State:', {
  shouldShowSplash: sessionManager.shouldShowSplash,
  isAppReady: sessionManager.isAppReady,
  hasInitialized: sessionManager.hasInitialized,
  isInitializing: sessionManager.isInitializing,
  isRefreshing: sessionManager.isRefreshing,
  isUserAuthenticated: sessionManager.isUserAuthenticated
});
```

### **Development Logging**
The Session Manager provides detailed logging in development mode:
- `[useAppSessionManager]` - Main hook events
- `[TokenManager]` - Token operations
- `[WalletSync]` - Wallet state changes
- `[SessionValidator]` - Session validation
- `[CrossTabSync]` - Cross-tab events

---

This comprehensive guide covers all aspects of the Session Manager Hook with detailed flow charts for every major operation. Use this as your reference for implementation, debugging, and understanding the complete lifecycle of session management in your application.
