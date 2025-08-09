import React, { useCallback, useEffect } from 'react'
import { useTokenRefresh } from '../hooks/useTokenRefresh'
import { useAuthPingMutation } from '../Ver2Designs/Pages/AuthAndOnboard/api/auth'
import { useAppDispatch } from '../Store/store'
import { authenticated, connectXAccount } from '../Ver2Designs/Pages/AuthAndOnboard/authStoreSlice'

interface TokenRefreshProviderProps {
  children: React.ReactNode
}

/**
 * TokenRefreshProvider: Manages automatic token refresh and initial session check across the entire app
 * Should be placed high in the component tree (e.g., in App.tsx)
 */
export const TokenRefreshProvider: React.FC<TokenRefreshProviderProps> = ({ children }) => {
  const { startTokenRefreshTimer, stopTokenRefreshTimer } = useTokenRefresh()
  const [sessionCheckPing] = useAuthPingMutation()
  const dispatch = useAppDispatch()
  const [hasInitialized, setHasInitialized] = React.useState(false)

  const handleSessionValidation = useCallback(async () => {
    // Prevent multiple simultaneous session validations
    if (hasInitialized) return
    
    try {
      const response = await sessionCheckPing().unwrap()
      const { isAuthenticated, connectedXAccount } = response
      
      if (isAuthenticated) {
        dispatch(authenticated())
        // Only start token refresh if user is authenticated
        startTokenRefreshTimer()
      }
      
      if (connectedXAccount) {
        dispatch(connectXAccount(connectedXAccount))
      }
      
      setHasInitialized(true)
    } catch (error: any) {
      // Handle rate limiting gracefully
      if (error?.originalStatus === 429) {
        console.log('Rate limited - will retry session validation later')
        // Don't start refresh timer when rate limited
        setHasInitialized(true) // Still mark as initialized to prevent retries
        return
      }
      
      // Handle AUTH_TOKEN_NOT_PRESENT gracefully - new users need to auth manually
      if (error?.data?.error?.description === 'AUTH_TOKEN_NOT_PRESENT') {
        console.log('New user detected - no token present, waiting for manual authentication')
        // Don't start refresh timer for new users
        setHasInitialized(true)
        return
      }
      
      // Handle other errors
      console.error('Session validation failed:', error)
      setHasInitialized(true)
    }
  }, [dispatch, sessionCheckPing, startTokenRefreshTimer, hasInitialized])

  useEffect(() => {
    // Only run session validation once on mount
    if (!hasInitialized) {
      handleSessionValidation()
    }
  }, [hasInitialized]) // Only depend on hasInitialized

  useEffect(() => {
    // Handle page visibility changes (when user switches tabs)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab becomes hidden - stop aggressive refreshing
        console.log('App hidden, stopping token refresh timer')
        stopTokenRefreshTimer()
      } else {
        // Tab becomes visible - resume token refreshing
        console.log('App visible, starting token refresh timer')
        startTokenRefreshTimer()
      }
    }

    // Listen for tab visibility changes
    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Listen for window focus/blur events
    const handleFocus = () => {
      console.log('Window focused, ensuring token refresh is active')
      startTokenRefreshTimer()
    }

    const handleBlur = () => {
      console.log('Window blurred')
      // Note: We don't stop the timer on blur as user might just be in another window briefly
    }

    window.addEventListener('focus', handleFocus)
    window.addEventListener('blur', handleBlur)

    // Cleanup event listeners
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('blur', handleBlur)
      stopTokenRefreshTimer()
    }
  }, []) // Empty dependency array - these event listeners should only be set up once

  return <>{children}</>
}

export default TokenRefreshProvider
