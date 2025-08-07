import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState } from '../Store/store'
import { getCookieByName } from '../Utilities/helpers'

// Generate or retrieve a persistent device ID using crypto API for better randomness
function getOrCreateDeviceId(): string {
  let deviceId = localStorage.getItem('device_id')
  if (!deviceId) {
    // Use crypto API for UUID v4 generation
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      deviceId = crypto.randomUUID()
    } else {
      // Fallback to manual UUID v4 generation
      deviceId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = (Math.random() * 16) | 0
        const v = c === 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
      })
    }
    localStorage.setItem('device_id', deviceId)
  }
  return deviceId
}

/**
 * Base API slice for RTK Query.
 * Includes credentials, device ID, CSRF token, and auth header.
 */
export const apiBase = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: (import.meta as any).env.VITE_API_BASE_URL || '/',
    credentials: 'include',
    prepareHeaders: (headers, api) => {
      // Device ID header
      const deviceId = getOrCreateDeviceId()
      headers.set('X-Device-ID', deviceId)

      // CSRF token header
      const csrf = getCookieByName('XSRF-TOKEN')
      if (csrf) headers.set('X-XSRF-TOKEN', csrf)

      // Authorization header
      const state = api.getState() as RootState
      const token = state.app.auth?.ast
      if (token) headers.set('Authorization', `Bearer ${token}`)

      return headers
    },
  }),
  tagTypes: [],
  endpoints: () => ({}),
})

// Export hooks for usage in functional components, which are auto-generated
export const {} = apiBase
