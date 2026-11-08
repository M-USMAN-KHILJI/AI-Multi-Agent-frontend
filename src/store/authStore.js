import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * Authentication Store for OmniAgent Platform
 * Handles user login status, token persistence, and profile data
 */
export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null, // { email: string, name: string, token: string }
      isAuthenticated: false,

      // Login method
      login: (userData) => {
        set({
          user: userData,
          isAuthenticated: true,
        })
      },

      // Logout method
      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        })
      },
    }),
    {
      name: 'omniagent_auth_session',
    }
  )
)

