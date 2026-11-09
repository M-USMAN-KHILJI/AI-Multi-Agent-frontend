import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  FiCpu,
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiAlertCircle,
  FiCheckCircle,
  FiArrowLeft,
  FiCheck,
} from 'react-icons/fi'
import { useAuthStore } from '../../store/authStore'
import { signUpUser } from '../../Api/Api'
import '../../Style/Sigin.css'

/**
 * Sigin (Sign Up / Registration) Screen - OmniAgent AI Platform
 * Built with UI/UX Pro Max Glassmorphism & Cyberpunk Design Intelligence
 * Features real-time granular email & password validation and PostgreSQL persistence.
 */
export const Sigin = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuthStore()

  // Form Fields
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // Granular Field-Specific Validation Errors
  const [fieldErrors, setFieldErrors] = useState({
    name: '',
    email: '',
    password: '',
  })

  // Global State
  const [generalError, setGeneralError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const returnTo = location.state?.from || '/'

  // Calculate Password Strength for UI Feedback
  const getPasswordStrength = () => {
    if (!password) return { level: 0, text: '' }
    let score = 0
    if (password.length >= 6) score += 1
    if (password.length >= 8) score += 1
    if (/[A-Z]/.test(password) && /[0-9]/.test(password)) score += 1
    if (/[^A-Za-z0-9]/.test(password)) score += 1

    if (score <= 1) return { level: 1, text: 'Weak', class: 'weak' }
    if (score <= 2) return { level: 2, text: 'Medium', class: 'medium' }
    return { level: 3, text: 'Strong', class: 'strong' }
  }

  const strength = getPasswordStrength()

  // Real-time Email Validator
  const validateEmail = (val) => {
    const trimmed = val.trim()
    if (!trimmed) {
      return 'Email address is required.'
    }
    // Strict pattern matching domain names (e.g. @gmail.com, @outlook.com, etc.)
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailPattern.test(trimmed)) {
      return 'Please enter a valid email address (e.g. name@gmail.com).'
    }
    return ''
  }

  // Real-time Password Validator
  const validatePassword = (val) => {
    if (!val) {
      return 'Password is required.'
    }
    if (val.length < 6) {
      return 'Password must be at least 6 characters long.'
    }
    return ''
  }

  // Real-time Name Validator
  const validateName = (val) => {
    if (!val.trim()) {
      return 'Full name is required.'
    }
    if (val.trim().length < 2) {
      return 'Username must be at least 2 characters.'
    }
    return ''
  }

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault()
    setGeneralError('')
    setSuccessMsg('')

    // 1. Run All Validations
    const nameErr = validateName(name)
    const emailErr = validateEmail(email)
    const passwordErr = validatePassword(password)

    if (nameErr || emailErr || passwordErr) {
      setFieldErrors({
        name: nameErr,
        email: emailErr,
        password: passwordErr,
      })
      return
    }

    setIsLoading(true)

    try {
      // 2. Call Backend API to save to PostgreSQL (modeldb)
      const data = await signUpUser(name.trim(), email.trim(), password)

      // 3. Save to Auth Store
      login({
        id: data.id,
        name: data.name,
        email: data.email,
        token: data.token,
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(data.name)}`,
      })

      setSuccessMsg('Account created successfully! Taking you to OmniAgent...')

      setTimeout(() => {
        navigate(returnTo, { replace: true })
      }, 700)
    } catch (err) {
      if (err.field && err.message) {
        setFieldErrors((prev) => ({
          ...prev,
          [err.field]: err.message,
        }))
      } else {
        setGeneralError(err.message || 'Failed to create account. Please check your connection.')
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

      {/* Main Glassmorphic Signup Card */}
      <div className="auth-card-wrapper">
        <div className="auth-glass-card">
          {/* Header & Logo */}
          <div className="auth-header">
            <Link to="/" className="inline-block" title="Back to OmniAgent Home">
              <div className="auth-brand-badge">
                <FiCpu className="w-6 h-6" />
              </div>
            </Link>
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">
              Join OmniAgent AI to access multimodal vision, video, and audio intelligence.
            </p>
          </div>

          {/* General Error Alert */}
          {generalError && (
            <div className="auth-alert auth-alert-error">
              <FiAlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>{generalError}</div>
            </div>
          )}

          {/* Success Alert */}
          {successMsg && (
            <div className="auth-alert auth-alert-success">
              <FiCheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>{successMsg}</div>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            {/* Username Field */}
            <div className="auth-field-group">
              <label htmlFor="signup-name" className="auth-label">
                <span>Full Name / Username</span>
                <span className="text-[11px] text-gray-500 font-normal">Required</span>
              </label>
              <div className="auth-input-container">
                <FiUser className="auth-input-icon w-4 h-4" />
                <input
                  id="signup-name"
                  type="text"
                  autoComplete="name"
                  placeholder="e.g. Usman Khilji"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    if (fieldErrors.name) {
                      setFieldErrors((prev) => ({ ...prev, name: '' }))
                    }
                  }}
                  className={`auth-input ${fieldErrors.name ? 'auth-input-error' : ''}`}
                  required
                />
              </div>
              {fieldErrors.name && (
                <div className="auth-field-error-msg">
                  <FiAlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{fieldErrors.name}</span>
                </div>
              )}
            </div>

            {/* Email Field with Strict @gmail.com & Domain Validation */}
            <div className="auth-field-group">
              <label htmlFor="signup-email" className="auth-label">
                <span>Email Address</span>
                <span className="text-[11px] text-gray-500 font-normal">e.g. @gmail.com</span>
              </label>
              <div className="auth-input-container">
                <FiMail className="auth-input-icon w-4 h-4" />
                <input
                  id="signup-email"
                  type="email"
                  autoComplete="email"
                  placeholder="yourname@gmail.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (fieldErrors.email) {
                      setFieldErrors((prev) => ({ ...prev, email: '' }))
                    }
                  }}
                  onBlur={() => {
                    const err = validateEmail(email)
                    if (err) setFieldErrors((prev) => ({ ...prev, email: err }))
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

            {/* Password Field with Validation & Strength Meter */}
            <div className="auth-field-group">
              <label htmlFor="signup-password" className="auth-label">
                <span>Create Password</span>
                <span className="text-[11px] text-gray-500 font-normal">Min. 6 chars</span>
              </label>
              <div className="auth-input-container">
                <FiLock className="auth-input-icon w-4 h-4" />
                <input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (fieldErrors.password) {
                      setFieldErrors((prev) => ({ ...prev, password: '' }))
                    }
                  }}
                  onBlur={() => {
                    const err = validatePassword(password)
                    if (err) setFieldErrors((prev) => ({ ...prev, password: err }))
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

              {/* Password Strength Indicator */}
              {password && (
                <div className="auth-strength-meter">
                  <div className={`auth-strength-bar ${strength.level >= 1 ? strength.class : ''}`} />
                  <div className={`auth-strength-bar ${strength.level >= 2 ? strength.class : ''}`} />
                  <div className={`auth-strength-bar ${strength.level >= 3 ? strength.class : ''}`} />
                  <span className="auth-strength-label">{strength.text}</span>
                </div>
              )}

              {fieldErrors.password && (
                <div className="auth-field-error-msg">
                  <FiAlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{fieldErrors.password}</span>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="auth-submit-btn mt-2"
            >
              {isLoading ? (
                <>
                  <div className="auth-spinner" />
                  <span>Creating Your Account...</span>
                </>
              ) : (
                <>
                  <span>Create OmniAgent Account</span>
                  <FiArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Card Footer */}
          <div className="auth-card-footer">
            <span>Already have an account? </span>
            <Link to="/login" className="auth-link font-semibold">
              Sign In
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

export default Sigin

