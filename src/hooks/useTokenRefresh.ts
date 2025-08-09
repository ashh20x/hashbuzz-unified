import { useCallback, useEffect, useRef } from 'react'
import { getCookieByName } from '../Utilities/helpers'

/**
 * Custom hook for automatic token refresh management
 * Proactively refreshes access tokens before they expire (15 minutes)
 */
export const useTokenRefresh = () => {
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const isRefreshingRef = useRef(false)

  /**
   * Proactively refresh the access token before it expires
   */
  const refreshToken = useCallback(async (): Promise<boolean> => {
    if (isRefreshingRef.current) {
      console.log('Token refresh already in progress')
      return false
    }

    try {
      isRefreshingRef.current = true
      console.log('Proactively refreshing access token...')

      const response = await fetch(`${(import.meta as any).env.VITE_API_BASE_URL}/api/auth/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Device-ID': localStorage.getItem('device_id') || '',
        },
        credentials: 'include', // Send httpOnly cookies
        body: JSON.stringify({}),
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Access token refreshed successfully:', data.message)
        return true
      } else {
        console.log('Token refresh failed, user might need to re-authenticate')
        return false
      }
    } catch (error) {
      console.error('Error during proactive token refresh:', error)
      return false
    } finally {
      isRefreshingRef.current = false
    }
  }, [])

  /**
   * Start the token refresh timer
   * Refreshes token every 14 minutes (1 minute before expiry)
   */
  const startTokenRefreshTimer = useCallback(() => {
    // Don't start if timer is already running
    if (refreshIntervalRef.current) {
      console.log('Token refresh timer already running')
      return
    }

    // Check if user has access token cookie (indicating they're authenticated)
    const hasAccessToken = getCookieByName('access_token')
    
    if (hasAccessToken) {
      // Set interval to refresh every 14 minutes (before 15-minute expiry)
      refreshIntervalRef.current = setInterval(() => {
        refreshToken()
      }, 14 * 60 * 1000) // 14 minutes

      console.log('Token refresh timer started (14-minute interval)')
    }
  }, [refreshToken])

  /**
   * Stop the token refresh timer
   */
  const stopTokenRefreshTimer = useCallback(() => {
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current)
      refreshIntervalRef.current = null
      console.log('Token refresh timer stopped')
    }
  }, [])

  /**
   * Check authentication status and start/stop timer accordingly
   */
  const checkAuthAndManageTimer = useCallback(() => {
    const hasAccessToken = getCookieByName('access_token')
    
    if (hasAccessToken && !refreshIntervalRef.current) {
      // Only start if not already running
      startTokenRefreshTimer()
    } else if (!hasAccessToken && refreshIntervalRef.current) {
      // Only stop if currently running
      stopTokenRefreshTimer()
    }
  }, [startTokenRefreshTimer, stopTokenRefreshTimer])

  // Setup effect to manage timer based on auth status
  useEffect(() => {
    // Initial check
    checkAuthAndManageTimer()

    // Listen for cookie changes (when user logs in/out)
    // Increased interval to reduce frequency of checks
    const interval = setInterval(checkAuthAndManageTimer, 30000) // Check every 30 seconds

    // Cleanup on unmount
    return () => {
      clearInterval(interval)
      stopTokenRefreshTimer()
    }
  }, [checkAuthAndManageTimer, stopTokenRefreshTimer])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTokenRefreshTimer()
    }
  }, [stopTokenRefreshTimer])

  /**
   * Check if timer is currently running
   */
  const isTimerRunning = useCallback(() => {
    return refreshIntervalRef.current !== null
  }, [])

  return {
    refreshToken,
    startTokenRefreshTimer,
    stopTokenRefreshTimer,
    isTimerRunning,
  }
}
