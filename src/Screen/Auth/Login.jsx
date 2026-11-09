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
import { loginUser } from '../../Api/Api'
import '../../Style/login.css'
import '../../Style/Sigin.css'

/**
 * Login Screen - OmniAgent AI Platform
 * Built with UI/UX Pro Max Glassmorphism & Cyberpunk Design Intelligence
 * Validates against PostgreSQL (modeldb) with field-level error feedback.
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

  // Granular Field-Specific Errors
  const [fieldErrors, setFieldErrors] = useState({
    email: '',
    password: '',
  })
  const [generalError, setGeneralError] = useState('')
  const [success, setSuccess] = useState('')

  // Check if redirected from a gated feature (e.g., Image/Video generation)
  const redirectReason = location.state?.reason || ''
  const returnTo = location.state?.from || '/'

  // Quick Demo Autofill
  const handleAutofillDemo = () => {
    setEmail('usman_test@gmail.com')
    setPassword('Password123!')
    setFieldErrors({ email: '', password: '' })
    setGeneralError('')
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
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(data.name)}`,
      })

      setSuccess('Authentication successful! Initializing your workspace...')

      setTimeout(() => {
        navigate(returnTo, { replace: true })
      }, 600)
    } catch (err) {
      // Backend returned field-level error (email incorrect or password incorrect)
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
                <strong>Authentication Required:</strong> {redirectReason}
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
                  onClick={(e) => {
                    e.preventDefault()
                    alert('Password reset instructions will be sent to your email.')
                  }}
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
              disabled={isLoading}
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

          {/* Social / Demo Divider */}
          <div className="auth-divider">
            <span>Quick Testing Access</span>
          </div>

          {/* Demo 1-Click Fill Card */}
          <div
            className="auth-quick-login-card"
            onClick={handleAutofillDemo}
            role="button"
            tabIndex={0}
            title="Click to auto-fill verified credentials"
          >
            <div className="flex items-center gap-2">
              <FiCheckCircle className="w-4 h-4 text-emerald-400" />
              <span className="auth-quick-text">Autofill Verified Test Account</span>
            </div>
            <span className="auth-quick-badge">1-Click</span>
          </div>

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
