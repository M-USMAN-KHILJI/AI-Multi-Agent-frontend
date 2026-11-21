import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

/**
 * Custom Hook for Feature Gating & Authentication Verification
 * Checks if the current user is authenticated before executing sensitive tasks
 * (such as GPU-intensive Image Generation and Video Creation).
 */
export const useAuthGuard = (fromRoute = '/') => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [gatedFeatureName, setGatedFeatureName] = useState('Image & Video Generation')

  /**
   * Guards a feature. If authenticated, executes the callback.
   * If unauthenticated, displays the AuthRequiredModal.
   */
  const guardAction = useCallback(
    (actionCallback, featureName = 'Image & Video Generation') => {
      if (isAuthenticated) {
        if (typeof actionCallback === 'function') {
          return actionCallback()
        }
        return true
      }

      setGatedFeatureName(featureName)
      setShowAuthModal(true)
      return false
    },
    [isAuthenticated]
  )

  const closeAuthModal = useCallback(() => {
    setShowAuthModal(false)
  }, [])

  const navigateToLogin = useCallback(() => {
    setShowAuthModal(false)
    navigate('/login', {
      state: {
        reason: `Sign in required to access ${gatedFeatureName}.`,
        from: fromRoute,
      },
    })
  }, [navigate, gatedFeatureName, fromRoute])

  return {
    isAuthenticated,
    showAuthModal,
    gatedFeatureName,
    guardAction,
    closeAuthModal,
    navigateToLogin,
  }
}

