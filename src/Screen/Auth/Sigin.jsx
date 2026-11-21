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
import { signUpUser, authenticateWithGoogle } from '../../Api/Api'
import { signInWithGoogle, checkGoogleRedirectResult } from '../../firebase/firebaseConfig'
import '../../Style/Sigin.css'

/**
 * Sigin (Sign Up / Registration) Screen - OmniAgent AI Platform
 * Built with UI/UX Pro Max Glassmorphism & Cyberpunk Design Intelligence
 * Features:
 * - Real-time email format & password length validation
 * - "Continue with Google" placed directly under "Create OmniAgent Account"
 * - If email is already registered, displays error under email input and smoothly redirects to /login
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
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const returnTo = location.state?.from || '/'

  // Check if returning from a Google redirect flow
  React.useEffect(() => {
    const checkRedirect = async () => {
      try {
        const googleUser = await checkGoogleRedirectResult()
        if (googleUser) {
          setIsGoogleLoading(true)
          const data = await authenticateWithGoogle(googleUser, true)
          login({
            id: data.id,
            email: data.email,
            name: data.name,
            token: data.token,
            avatar: googleUser.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(data.name)}`,
            authProvider: 'google',
          })
          setSuccessMsg('Google registration successful! Taking you to OmniAgent...')
          setTimeout(() => navigate(returnTo, { replace: true }), 600)
        }
      } catch (err) {
        if (err.already_registered) {
          setFieldErrors((prev) => ({
            ...prev,
            email: 'This Google account is already registered. Redirecting to login...',
          }))
          setTimeout(() => {
            navigate('/login', {
              state: {
                email: err.email || '',
                reason: 'This account already exists. Please sign in here.',
                from: returnTo,
              },
            })
          }, 1500)
        } else {
          setGeneralError(err.message || 'Google signup could not be completed.')
        }
      } finally {
        setIsGoogleLoading(false)
      }
    }

    checkRedirect()
  }, [returnTo, navigate, login])

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

  // Handle Google Sign-In on Signup Page
  const handleGoogleSignIn = async () => {
    setGeneralError('')
    setSuccessMsg('')
    setIsGoogleLoading(true)

    try {
      const googleUser = await signInWithGoogle()
      if (!googleUser) {
        // Redirect flow was triggered
        return
      }

      // Pass is_signup = true to trigger duplicate check
      const data = await authenticateWithGoogle(googleUser, true)

      login({
        id: data.id,
        email: data.email,
        name: data.name,
        token: data.token,
        avatar: googleUser.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(data.name)}`,
      })

      setSuccessMsg('Google registration successful! Taking you to OmniAgent...')

      setTimeout(() => {
        navigate(returnTo, { replace: true })
      }, 600)
    } catch (err) {
      if (err.already_registered) {
        setFieldErrors((prev) => ({
          ...prev,
          email: 'This Google account is already registered. Redirecting to login...',
        }))
        setTimeout(() => {
          navigate('/login', {
            state: {
              email: err.email || '',
              reason: 'This account already exists. Please sign in here.',
              from: returnTo,
            },
          })
        }, 1500)
      } else if (err.code !== 'auth/popup-closed-by-user') {
        setGeneralError(err.message || 'Google signup could not be completed. Please try again.')
      }
    } finally {
      setIsGoogleLoading(false)
    }
  }

  // Submit Handler for Email/Password Registration
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
        avatar: data.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(data.name)}`,
        authProvider: 'email',
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

        // If user already registered, show message under email and navigate to login
        if (err.already_registered) {
          setTimeout(() => {
            navigate('/login', {
              state: {
                email: email.trim(),
                reason: 'This email is already registered. Please sign in with your password.',
                from: returnTo,
              },
            })
          }, 1500)
        }
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
              disabled={isLoading || isGoogleLoading}
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

          {/* Social Divider */}
          <div className="auth-divider">
            <span>Or register with</span>
          </div>

          {/* Continue with Google Button (Placed directly under Create Account) */}
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
