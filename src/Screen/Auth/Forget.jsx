import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  FiCpu,
  FiMail,
  FiArrowRight,
  FiArrowLeft,
  FiAlertCircle,
  FiCheckCircle,
  FiShield,
} from 'react-icons/fi'
import { requestForgotPasswordOTP } from '../../Api/Api'
import '../../Style/login.css'
import '../../Style/Forget.css'

/**
 * Forget Password Screen - OmniAgent AI Platform
 * Step 1: User enters their email address to request a 6-digit verification code.
 */
export const Forget = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const trimmed = email.trim().toLowerCase()
    if (!trimmed) {
      setError('Please enter your email address.')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError('Please provide a valid email address.')
      return
    }

    setLoading(true)
    try {
      await requestForgotPasswordOTP(trimmed)
      navigate('/verify-code', { state: { email: trimmed } })
    } catch (err) {
      const msg = typeof err === 'string' ? err : err.message || 'Failed to dispatch verification code.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="forget-page-container">
      {/* Ambient background orbs */}
      <div className="auth-ambient-orb auth-orb-1" />
      <div className="auth-ambient-orb auth-orb-2" />
      <div className="auth-grid-overlay" />

      <div className="forget-glass-card">
        {/* Step Indicator */}
        <div className="step-indicator-bar">
          <div className="step-dot active" title="Step 1: Enter Email" />
          <div className="step-dot" title="Step 2: Enter OTP" />
          <div className="step-dot" title="Step 3: New Password" />
        </div>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 mb-3 shadow-lg shadow-indigo-500/20">
            <FiShield className="w-6 h-6 text-indigo-400" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mb-1">
            Forgot Password?
          </h1>
          <p className="text-xs text-gray-400 max-w-xs mx-auto">
            No worries! Enter your registered email address and we'll send a 6-digit verification code to reset your password.
          </p>
        </div>

        {/* Error notification */}
        {error && (
          <div className="auth-alert-banner alert-banner-error mb-4">
            <FiAlertCircle className="w-4 h-4 shrink-0" />
            <span className="text-xs">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-300">
              Email Address
            </label>
            <div className="relative flex items-center">
              <FiMail className="absolute left-3.5 text-gray-500 w-4 h-4 pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (error) setError('')
                }}
                placeholder="name@example.com"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-60"
          >
            {loading ? (
              <span>Sending Code...</span>
            ) : (
              <>
                <span>Next</span>
                <FiArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Back to Login Footer */}
        <div className="mt-6 pt-4 border-t border-white/5 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-white transition-colors"
          >
            <FiArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Forget

