# Session Manager Improvements

## Issues Fixed

### 1. **Background Token Refresh Not Working**

**Problem:** Session was only refreshing when tab visibility changed, not continuously in the background.

**Solution:**

- Added periodic activity check that runs every 30 seconds (`ACTIVITY_CHECK_INTERVAL`)
- Continuously monitors token expiry and refreshes automatically when needed
- Works independently of user interaction or tab visibility changes

### 2. **Token Expires Even When User Is Active**

**Problem:** Session would expire even when user was actively using the application.

**Solution:**

- Implemented comprehensive activity tracking
- Monitors user activity events: `mousedown`, `keydown`, `scroll`, `touchstart`, `click`
- Tracks `lastActivityTime` to determine if user is active
- Only refreshes token if:
  - Tab is visible
  - User is authenticated
  - User has been active (within last 5 minutes)
  - Token is expiring soon

### 3. **No Redirect After Session Expiry**

**Problem:** When session expired, user stayed on the page without being redirected to login.

**Solution:**

- Added automatic redirect to `/auth/login` when token refresh fails
- Redirects occur in two scenarios:
  1. When background refresh fails during periodic check
  2. When token refresh mutation fails (after 500ms delay for state cleanup)
- User-friendly error message: "Session expired - please login again"

## New Features

### Activity Monitoring

```typescript
const CONFIG = {
  ACTIVITY_EVENTS: ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'],
  INACTIVITY_THRESHOLD: 5 * 60 * 1000, // 5 minutes
  ACTIVITY_CHECK_INTERVAL: 30000, // 30 seconds
};
```

- Tracks all user interactions
- Prevents unnecessary token refreshes when user is inactive
- Saves server resources by not refreshing for inactive tabs

### Intelligent Refresh Strategy

1. **Periodic Check (Every 30 seconds)**
   - Runs only when authenticated
   - Checks if tab is visible
   - Verifies user activity
   - Refreshes token if expiring soon

2. **Visibility-Based Check**
   - Triggers when tab becomes visible
   - Updates last activity time
   - Performs immediate session check

3. **Scheduled Refresh**
   - Schedules next refresh based on token expiry
   - Runs 60 seconds before actual expiry
   - Ensures seamless user experience

### Enhanced Error Handling

```typescript
// On refresh failure
if (!success) {
  await logout();
  window.location.href = '/auth/login';
}
```

- Cleans up all timers and intervals
- Clears local storage
- Resets Redux state
- Broadcasts logout to other tabs
- Redirects to login page

## Configuration

### Tunable Parameters

```typescript
const CONFIG = {
  REFRESH_BUFFER_SECONDS: 60, // Refresh 1 min before expiry
  SESSION_EXPIRE_MINUTES: 15, // 15 min session duration
  ACTIVITY_CHECK_INTERVAL: 30000, // Check every 30 seconds
  INACTIVITY_THRESHOLD: 5 * 60 * 1000, // 5 min inactivity threshold
};
```

### Activity Events Tracked

- `mousedown` - Mouse clicks
- `keydown` - Keyboard input
- `scroll` - Page scrolling
- `touchstart` - Touch events (mobile)
- `click` - Click events

## Implementation Details

### New Refs Added

```typescript
const activityCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);
const lastActivityTimeRef = useRef<number>(Date.now());
const isTabVisibleRef = useRef<boolean>(!document.hidden);
```

### New Functions

1. **`updateLastActivity()`**
   - Updates timestamp when user interacts
   - Called by activity event listeners

2. **`isUserInactive()`**
   - Checks if user has been inactive for too long
   - Returns true if inactive > 5 minutes

3. **`checkAndRefreshIfNeeded()`**
   - Main periodic check function
   - Validates all conditions before refresh
   - Handles refresh failure with redirect

## Benefits

### User Experience

- ✅ Seamless session management
- ✅ No unexpected logouts during active use
- ✅ Automatic redirect to login when needed
- ✅ Works across multiple tabs

### Performance

- ✅ Efficient resource usage
- ✅ Only refreshes when necessary
- ✅ Stops refreshing for inactive users
- ✅ Prevents redundant API calls

### Reliability

- ✅ Comprehensive error handling
- ✅ Cross-tab synchronization
- ✅ Graceful degradation
- ✅ Proper cleanup on unmount

## Testing Scenarios

### Test Case 1: Active User

1. User is actively using the app
2. Session manager refreshes token every ~15 minutes
3. User never sees logout or redirect

### Test Case 2: Inactive User

1. User opens app but stops interacting
2. After 5 minutes of inactivity, refresh stops
3. Token eventually expires
4. User gets redirected to login on next interaction

### Test Case 3: Tab Switching

1. User switches to another tab
2. Periodic refresh continues if user was recently active
3. On return to tab, immediate session check occurs
4. Token refreshed if needed

### Test Case 4: Session Expiry

1. Token refresh fails on server
2. Session manager logs out user
3. User is redirected to `/auth/login`
4. Clear error message displayed

## Migration Notes

### Breaking Changes

None - All changes are backward compatible

### New Dependencies

None - Uses existing React hooks and browser APIs

### Environment Variables

No new environment variables required

## Monitoring

### Console Logs (Development Mode)

```
[SESSION MANAGER] Starting periodic session check every 30 seconds
[SESSION MANAGER] Token valid for 850s more
[SESSION MANAGER] Tab became visible, checking session...
[SESSION MANAGER] Token expiring soon, refreshing in background...
[SESSION MANAGER] Skipping refresh - user inactive for 320 seconds
```

### Cross-Tab Synchronization

- Refresh success/failure shared across tabs
- Logout broadcasts to all open tabs
- Prevents duplicate refresh calls

## Future Enhancements

1. **Configurable activity threshold per user preference**
2. **Session extension notification before expiry**
3. **Remember me functionality with longer sessions**
4. **Biometric re-authentication option**
5. **Session analytics and reporting**

## Support

For issues or questions, please check:

- Console logs for detailed session manager activity
- Browser DevTools > Application > Local Storage for session data
- Network tab for token refresh API calls
