# ErrorBoundary Implementation Guide

## Overview

The HashBuzz frontend now includes a comprehensive **ErrorBoundary** component that catches JavaScript errors anywhere in the React component tree, logs them with detailed information, and displays a user-friendly fallback UI.

## Features

### ✅ **Error Catching & Logging**

- Catches all JavaScript errors in React components
- Generates unique error IDs for tracking
- Logs structured error data to console
- Stores error history in localStorage (last 10 errors)
- Extracts user session information when available

### ✅ **User-Friendly Fallback UI**

- Clean, professional error message
- Multiple recovery options (Try Again, Reload, Go Home)
- User feedback collection system
- Development-only error details expansion

### ✅ **Enhanced Error Reporting**

- Structured error reports with metadata
- User session tracking integration
- Ready for external service integration (Sentry, LogRocket)
- Build version tracking

### ✅ **Development Features**

- Detailed error stack traces in development
- Component stack information
- Error history persistence
- Test component for error simulation

## Implementation

### Basic Usage

The ErrorBoundary is already integrated at the application root level in `App.tsx`:

```tsx
import ErrorBoundary from './components/ErrorBoundary';

const App: React.FC = () => {
  return (
    <ErrorBoundary
      errorReportingEnabled={true}
      onReset={() => {
        // Optional: Clear application state on reset
      }}
    >
      <YourAppComponents />
    </ErrorBoundary>
  );
};
```

### Additional Boundary Placement

You can add additional ErrorBoundary instances around specific component trees:

```tsx
// Around critical features
<ErrorBoundary fallback={<CustomErrorUI />}>
  <CriticalFeatureComponent />
</ErrorBoundary>

// Around third-party components
<ErrorBoundary>
  <ThirdPartyWidget />
</ErrorBoundary>
```

### Props

| Prop                    | Type         | Default     | Description                     |
| ----------------------- | ------------ | ----------- | ------------------------------- |
| `children`              | `ReactNode`  | Required    | Components to wrap              |
| `fallback`              | `ReactNode`  | `undefined` | Custom fallback UI              |
| `onReset`               | `() => void` | `undefined` | Called when user resets error   |
| `errorReportingEnabled` | `boolean`    | `true`      | Enable external error reporting |

## Error Flow

### 1. **Error Occurs**

```
Component Error → ErrorBoundary.componentDidCatch()
```

### 2. **Error Processing**

```
Generate Error ID → Log to Console → Store in localStorage → Optional External Reporting
```

### 3. **UI Display**

```
Show Fallback UI → Provide Recovery Options → Allow User Feedback
```

### 4. **Recovery Options**

- **Try Again**: Reset error state and retry
- **Reload Page**: Full page refresh
- **Go Home**: Navigate to root path
- **Report Error**: Submit user feedback

## Error Data Structure

```typescript
interface ErrorReport {
  errorId: string; // Unique identifier
  timestamp: string; // ISO timestamp
  error: {
    message: string; // Error message
    stack?: string; // Stack trace
  };
  errorInfo: {
    componentStack?: string; // React component stack
  };
  userAgent: string; // Browser info
  url: string; // Current page URL
  userId?: string; // User ID if logged in
  sessionId?: string; // Session identifier
  buildVersion?: string; // App build version
}
```

## Development Testing

### Using ErrorTest Component

For development testing, use the included `ErrorTest` component:

```tsx
import ErrorTest from './components/ErrorTest';

// Add anywhere in your component tree during development
const DevelopmentPage: React.FC = () => {
  return (
    <div>
      <YourRegularContent />
      <ErrorTest /> {/* Only shows in development */}
    </div>
  );
};
```

### Manual Error Simulation

```tsx
// Trigger an error manually
const triggerError = () => {
  throw new Error('Manual test error');
};

// Or use setTimeout for async errors
const triggerAsyncError = () => {
  setTimeout(() => {
    throw new Error('Async test error');
  }, 1000);
};
```

## Integration with External Services

### Sentry Integration Example

```tsx
// In ErrorBoundary.tsx, update reportErrorToService method:
private reportErrorToService(error: Error, errorInfo: ErrorInfo, errorId: string): void {
  if (window.Sentry) {
    window.Sentry.captureException(error, {
      tags: {
        errorBoundary: true,
        errorId,
        feature: 'react-error-boundary'
      },
      contexts: {
        react: {
          componentStack: errorInfo.componentStack
        }
      },
      extra: {
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      }
    });
  }
}
```

### LogRocket Integration Example

```tsx
private reportErrorToService(error: Error, errorInfo: ErrorInfo, errorId: string): void {
  if (window.LogRocket) {
    window.LogRocket.captureException(error, {
      tags: { errorId, source: 'react-error-boundary' },
      extra: { componentStack: errorInfo.componentStack }
    });
  }
}
```

## Best Practices

### ✅ **Do**

- Place ErrorBoundary at strategic points in your component tree
- Provide meaningful fallback UIs for critical features
- Test error scenarios in development
- Monitor error patterns and fix common issues
- Use error IDs to track and correlate error reports

### ❌ **Don't**

- Wrap every single component (performance overhead)
- Ignore errors caught by boundaries
- Use ErrorBoundary for expected errors (use regular error handling)
- Rely solely on ErrorBoundary for error management

## Monitoring & Debugging

### Error History Access

```javascript
// In browser console, access stored error history:
const errorHistory = JSON.parse(localStorage.getItem('errorHistory') || '[]');
console.table(errorHistory);
```

### Error Pattern Analysis

Monitor these patterns:

- **Frequent error locations**: Component stacks that appear often
- **User session correlation**: Errors tied to specific user actions
- **Browser/device patterns**: UserAgent analysis
- **Timing patterns**: Error frequency over time

## Future Enhancements

- [ ] Error rate limiting to prevent spam
- [ ] Smart retry with exponential backoff
- [ ] Error categorization and grouping
- [ ] Performance monitoring integration
- [ ] A/B testing for error recovery strategies
- [ ] Integration with HashBuzz logging backend

## Troubleshooting

### ErrorBoundary Not Catching Errors

**Async Errors**: ErrorBoundary only catches errors in React lifecycle. For async errors:

```tsx
// Use error states instead
const [error, setError] = useState<Error | null>(null);

const handleAsyncOperation = async () => {
  try {
    await riskyOperation();
  } catch (err) {
    setError(err);
  }
};

if (error) throw error; // This will be caught by ErrorBoundary
```

### Missing Error Details

Ensure you have the latest error reporting configuration and check browser console for additional debug information.

---

**Implementation Status**: ✅ Complete and Ready for Production
**Test Coverage**: Manual testing with ErrorTest component
**Documentation**: Complete with examples and best practices
