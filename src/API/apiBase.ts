import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState } from '../Store/store'

/**
 * Base API slice for RTK Query.
 * Extend this in your feature APIs using `injectEndpoints`.
 */
export const apiBase = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: (import.meta as any).env.VITE_API_BASE_URL || '/',
    prepareHeaders: (headers, { getState }) => {
      // Include auth token from state.app if available
      const state = getState() as RootState
      const token = state.app.auth?.ast
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: [],
  endpoints: () => ({}),
})

// Export hooks for usage in functional components, which are auto-generated
export const {} = apiBase
