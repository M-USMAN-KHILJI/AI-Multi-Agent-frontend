import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  FiCpu,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiAlertCircle,
  FiCheckCircle,
  FiArrowLeft,
  FiZap,
} from 'react-icons/fi'
import { useAuthStore } from '../../store/authStore'
import { loginUser, authenticateWithGoogle } from '../../Api/Api'
import { signInWithGoogle, checkGoogleRedirectResult } from '../../firebase/firebaseConfig'
import '../../Style/login.css'
import '../../Style/Sigin.css'

/**
 * Login Screen - OmniAgent AI Platform
 * Built with UI/UX Pro Max Glassmorphism & Cyberpunk Design Intelligence
 * Features:
 * - Email & Password Authentication against PostgreSQL (modeldb)
 * - "Continue with Google" placed directly beneath "Sign In to OmniAgent"
 * - Clean layout without demo autofill cards
 */
export const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuthStore()

  // State
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  // Granular Field-Specific Errors
  const [fieldErrors, setFieldErrors] = useState({
    email: '',
    password: '',
  })
  const [generalError, setGeneralError] = useState('')
  const [success, setSuccess] = useState('')

  // Check if redirected from a gated feature or signup redirect
  const redirectReason = location.state?.reason || ''
  const initialEmail = location.state?.email || ''
  const returnTo = location.state?.from || '/'

  // Auto-populate email if redirected from signup or handle Google redirect result
  React.useEffect(() => {
    if (initialEmail && !email) {
      setEmail(initialEmail)
    }

    const checkRedirect = async () => {
      try {
        const googleUser = await checkGoogleRedirectResult()
        if (googleUser) {
          setIsGoogleLoading(true)
          const data = await authenticateWithGoogle(googleUser, false)
          login({
            id: data.id,
            email: data.email,
            name: data.name,
            token: data.token,
            avatar: googleUser.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(data.name)}`,
            authProvider: 'google',
          })
          setSuccess('Google authentication successful! Initializing workspace...')
          setTimeout(() => navigate(returnTo, { replace: true }), 600)
        }
      } catch (err) {
        setGeneralError(err.message || 'Google sign-in could not be completed.')
      } finally {
        setIsGoogleLoading(false)
      }
    }

    checkRedirect()
  }, [initialEmail, returnTo, navigate, login])

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    setGeneralError('')
    setSuccess('')
    setIsGoogleLoading(true)

    try {
      // 1. Authenticate with Google via Firebase Popup (auto-falls back to redirect if popup is blocked)
      const googleUser = await signInWithGoogle()
      if (!googleUser) {
        // Redirect flow was triggered
        return
      }

      // 2. Sync / authenticate in backend PostgreSQL (modeldb)
      const data = await authenticateWithGoogle(googleUser, false)

      // 3. Store in persistent Zustand auth store
      login({
        id: data.id,
        email: data.email,
        name: data.name,
        token: data.token,
        avatar: googleUser.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(data.name)}`,
        authProvider: 'google',
      })

      setSuccess('Google authentication successful! Initializing workspace...')

      setTimeout(() => {
        navigate(returnTo, { replace: true })
      }, 600)
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setGeneralError(err.message || 'Google sign-in could not be completed. Please try again.')
      }
    } finally {
      setIsGoogleLoading(false)
    }
  }

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setFieldErrors({ email: '', password: '' })
    setGeneralError('')
    setSuccess('')

    let hasClientError = false
    const newFieldErrors = { email: '', password: '' }

    // 1. Client-Side Checks
    if (!email.trim()) {
      newFieldErrors.email = 'Please provide your email address.'
      hasClientError = true
    } else {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      if (!emailPattern.test(email.trim())) {
        newFieldErrors.email = 'Please enter a valid email address (e.g. name@gmail.com).'
        hasClientError = true
      }
    }

    if (!password) {
      newFieldErrors.password = 'Please enter your password.'
      hasClientError = true
    } else if (password.length < 6) {
      newFieldErrors.password = 'Password must be at least 6 characters long.'
      hasClientError = true
    }

    if (hasClientError) {
      setFieldErrors(newFieldErrors)
      return
    }

    // 2. Authenticate Against Backend & PostgreSQL (modeldb)
    setIsLoading(true)
    try {
      const data = await loginUser(email.trim(), password)

      // Store in persistent Zustand auth store
      login({
        id: data.id,
        email: data.email,
        name: data.name,
        token: data.token,
        avatar: data.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(data.name)}`,
        authProvider: data.auth_provider || 'email',
      })

      setSuccess('Authentication successful! Initializing your workspace...')

      setTimeout(() => {
        navigate(returnTo, { replace: true })
      }, 600)
    } catch (err) {
      if (err.field && err.message) {
        setFieldErrors((prev) => ({
          ...prev,
          [err.field]: err.message,
        }))
      } else {
        setGeneralError(err.message || 'Unable to authenticate at this time. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-page-container">
      {/* Dynamic Ambient Background Elements */}
      <div className="auth-ambient-orb auth-orb-1" />
      <div className="auth-ambient-orb auth-orb-2" />
      <div className="auth-grid-overlay" />

      {/* Main Glassmorphic Login Card */}
      <div className="auth-card-wrapper">
        <div className="auth-glass-card">
          {/* Header & Logo */}
          <div className="auth-header">
            <Link to="/" className="inline-block" title="Back to OmniAgent Home">
              <div className="auth-brand-badge">
                <FiCpu className="w-6 h-6" />
              </div>
            </Link>
            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-subtitle">
              Sign in to unlock all multimodal AI agents: Vision, Video, and Voice.
            </p>
          </div>

          {/* Gated Feature Redirect Notice */}
          {redirectReason && (
            <div className="auth-alert auth-alert-info">
              <FiZap className="w-4 h-4 shrink-0 text-indigo-400 mt-0.5" />
              <div>
                <strong>Notice:</strong> {redirectReason}
              </div>
            </div>
          )}

          {/* General Error Alert */}
          {generalError && (
            <div className="auth-alert auth-alert-error">
              <FiAlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>{generalError}</div>
            </div>
          )}

          {/* Success Alert */}
          {success && (
            <div className="auth-alert auth-alert-success">
              <FiCheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>{success}</div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            {/* Email Field */}
            <div className="auth-field-group">
              <label htmlFor="login-email" className="auth-label">
                <span>Email Address</span>
                <span className="text-[11px] text-gray-500 font-normal">e.g. @gmail.com</span>
              </label>
              <div className="auth-input-container">
                <FiMail className="auth-input-icon w-4 h-4" />
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  placeholder="name@gmail.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: '' }))
                  }}
                  className={`auth-input ${fieldErrors.email ? 'auth-input-error' : ''}`}
                  required
                />
              </div>
              {fieldErrors.email && (
                <div className="auth-field-error-msg">
                  <FiAlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{fieldErrors.email}</span>
                </div>
              )}
            </div>

            {/* Password Field */}
            <div className="auth-field-group">
              <div className="auth-label">
                <label htmlFor="login-password">Password</label>
                <Link
                  to="/forgot-password"
                  className="auth-link text-xs"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="auth-input-container">
                <FiLock className="auth-input-icon w-4 h-4" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: '' }))
                  }}
                  className={`auth-input ${fieldErrors.password ? 'auth-input-error' : ''}`}
                  required
                />
                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <FiEyeOff className="w-4 h-4" />
                  ) : (
                    <FiEye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {fieldErrors.password && (
                <div className="auth-field-error-msg">
                  <FiAlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{fieldErrors.password}</span>
                </div>
              )}
            </div>

            {/* Options Row */}
            <div className="auth-options-row">
              <label className="auth-checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="auth-checkbox"
                />
                <span>Remember me on this browser</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || isGoogleLoading}
              className="auth-submit-btn"
            >
              {isLoading ? (
                <>
                  <div className="auth-spinner" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to OmniAgent</span>
                  <FiArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Social Divider */}
          <div className="auth-divider">
            <span>Or continue with</span>
          </div>

          {/* Continue with Google Button (Placed directly under Sign In) */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading || isLoading}
            className="auth-google-btn"
          >
            {isGoogleLoading ? (
              <>
                <div className="auth-spinner" />
                <span>Connecting to Google...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </button>

          {/* Card Footer */}
          <div className="auth-card-footer">
            <span>Don't have an account? </span>
            <Link to="/signin" className="auth-link font-semibold">
              Create an account
            </Link>
            <div>
              <Link to="/" className="auth-back-home">
                <FiArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Home Dashboard</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
