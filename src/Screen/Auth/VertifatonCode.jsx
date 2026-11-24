import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import OtpInput from 'react-otp-input'
import {
  FiShield,
  FiArrowRight,
  FiArrowLeft,
  FiAlertCircle,
  FiCheckCircle,
  FiRotateCw,
  FiClock,
} from 'react-icons/fi'
import { verifyOTPCode, requestForgotPasswordOTP } from '../../Api/Api'
import '../../Style/login.css'
import '../../Style/Forget.css'
import '../../Style/VerficationCode.css'

/**
 * Verification Code (OTP) Screen - OmniAgent AI Platform
 * Step 2: User enters the 6-digit OTP code sent to their email.
 * Includes:
 * - 60-second countdown timer
 * - Resend OTP button appearing only after countdown reaches 0
 * - Real backend OTP verification
 */
export const VertifatonCode = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const userEmail = location.state?.email || ''

  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [resendStatus, setResendStatus] = useState('')

  // 60-second countdown timer
  const [timer, setTimer] = useState(60)

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [timer])

  // Redirect if no email state present
  useEffect(() => {
    if (!userEmail) {
      navigate('/forgot-password')
    }
  }, [userEmail, navigate])

  const handleVerify = async (e) => {
    e.preventDefault()
    setError('')

    if (otp.length < 6) {
      setError('Please enter all 6 digits of the verification code.')
      return
    }

    setLoading(true)
    try {
      await verifyOTPCode(userEmail, otp)
      // Navigate to step 3 passing email and verified OTP code
      navigate('/change-password', {
        state: { email: userEmail, code: otp },
      })
    } catch (err) {
      const msg = typeof err === 'string' ? err : err.message || 'Wrong verification code. Please enter the correct OTP.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setError('')
    setResending(true)
    try {
      await requestForgotPasswordOTP(userEmail)
      setOtp('')
      setTimer(60)
      setResendStatus('A fresh 6-digit verification code has been sent to your email!')
      setTimeout(() => setResendStatus(''), 5000)
    } catch (err) {
      const msg = typeof err === 'string' ? err : err.message || 'Failed to resend code.'
      setError(msg)
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="otp-page-container">
      {/* Ambient background orbs */}
      <div className="auth-ambient-orb auth-orb-1" />
      <div className="auth-ambient-orb auth-orb-2" />
      <div className="auth-grid-overlay" />

      <div className="otp-glass-card">
        {/* Step Indicator */}
        <div className="step-indicator-bar">
          <div className="step-dot" title="Step 1: Enter Email" />
          <div className="step-dot active" title="Step 2: Enter OTP" />
          <div className="step-dot" title="Step 3: New Password" />
        </div>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-indigo-500/20 border border-emerald-500/30 mb-3 shadow-lg shadow-emerald-500/20">
            <FiShield className="w-6 h-6 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mb-1">
            Verification Code
          </h1>
          <p className="text-xs text-gray-400 max-w-xs mx-auto">
            We sent a 6-digit code to{' '}
            <span className="text-indigo-300 font-semibold">{userEmail || 'your email'}</span>.
            Enter the code below to continue.
          </p>
        </div>

        {/* Error notification */}
        {error && (
          <div className="auth-alert-banner alert-banner-error mb-4">
            <FiAlertCircle className="w-4 h-4 shrink-0" />
            <span className="text-xs">{error}</span>
          </div>
        )}

        {/* Resend notice */}
        {resendStatus && (
          <div className="auth-alert-banner alert-banner-success mb-4">
            <FiCheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
            <span className="text-xs">{resendStatus}</span>
          </div>
        )}

        <form onSubmit={handleVerify} className="flex flex-col items-center">
          {/* React OTP Input Component (6 digits) */}
          <div className="w-full flex justify-center">
            <OtpInput
              value={otp}
              onChange={(code) => {
                // Ensure only digits are stored
                const numericOnly = code.replace(/\D/g, '')
                setOtp(numericOnly)
                if (error) setError('')
              }}
              numInputs={6}
              inputType="tel"
              shouldAutoFocus={true}
              containerStyle="otp-inputs-container"
              inputStyle="otp-single-box"
              renderInput={(props) => <input {...props} />}
            />
          </div>

          <button
            type="submit"
            disabled={loading || otp.length < 6}
            className="w-full mt-4 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
          >
            {loading ? (
              <span>Verifying...</span>
            ) : (
              <>
                <span>Next</span>
                <FiArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Resend Code Action with 1-Minute Countdown */}
        <div className="mt-5 flex flex-col items-center justify-center gap-2 text-xs">
          {timer > 0 ? (
            <div className="flex items-center gap-1.5 text-gray-400">
              <FiClock className="w-3.5 h-3.5 text-indigo-400" />
              <span>Resend code in <strong className="text-white font-mono">{timer}s</strong></span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-gray-400">
              <span>Didn't receive code?</span>
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer transition-colors flex items-center gap-1 disabled:opacity-50"
              >
                <FiRotateCw className={`w-3 h-3 ${resending ? 'animate-spin' : ''}`} />
                <span>{resending ? 'Sending...' : 'Resend OTP'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Back Link */}
        <div className="mt-6 pt-4 border-t border-white/5 text-center">
          <Link
            to="/forgot-password"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-white transition-colors"
          >
            <FiArrowLeft className="w-3.5 h-3.5" />
            <span>Change Email</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default VertifatonCode

