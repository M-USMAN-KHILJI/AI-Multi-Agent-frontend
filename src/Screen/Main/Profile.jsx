import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiCheckCircle,
  FiAlertCircle,
  FiShield,
  FiKey,
  FiCalendar,
  FiArrowLeft,
} from 'react-icons/fi'
import { useAuthStore } from '../../store/authStore'
import { changeUserPassword, getUserDetails } from '../../Api/Api'
import '../../Style/Profile.css'

/**
 * Profile Screen - OmniAgent AI Platform
 * Built with UI/UX Pro Max Glassmorphism & Cyberpunk Bento Design.
 * Features:
 * - Displays user details: Avatar, Full Name, Email, Account Type, ID, Registration Date.
 * - Change Password feature: ONLY visible for Email/Password accounts.
 * - If user registered/logged in via Google, Change Password is hidden and replaced by a verified Google OAuth badge.
 */
export const Profile = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuthStore()

  // State for fetched details
  const [profileData, setProfileData] = useState(null)
  const [loadingProfile, setLoadingProfile] = useState(false)

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  // Feedback messages
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/login')
      return
    }

    const loadUserData = async () => {
      setLoadingProfile(true)
      try {
        if (user?.id) {
          const res = await getUserDetails(user.id)
          setProfileData(res)
        }
      } catch (err) {
        console.warn('Failed to fetch full backend profile, falling back to local session:', err)
      } finally {
        setLoadingProfile(false)
      }
    }

    loadUserData()
  }, [isAuthenticated, user, navigate])

  // Determine auth provider (Google vs Email)
  // Can come from profileData, user object, or email structure
  const authProvider =
    profileData?.auth_provider ||
    user?.authProvider ||
    (user?.avatar && user?.avatar.includes('googleusercontent.com') ? 'google' : 'email')
  const isGoogleAccount = authProvider === 'google'

  // Handle Password Change Submission
  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setStatusMsg({ type: '', text: '' })

    if (!currentPassword) {
      setStatusMsg({ type: 'error', text: 'Please enter your current password.' })
      return
    }

    if (!newPassword) {
      setStatusMsg({ type: 'error', text: 'Please enter your new password.' })
      return
    }

    if (newPassword.length < 6) {
      setStatusMsg({ type: 'error', text: 'New password must be at least 6 characters.' })
      return
    }

    if (newPassword !== confirmPassword) {
      setStatusMsg({ type: 'error', text: 'New password and confirmation do not match.' })
      return
    }

    if (currentPassword === newPassword) {
      setStatusMsg({
        type: 'error',
        text: 'New password cannot be the same as your current password.',
      })
      return
    }

    setIsSubmitting(true)
    try {
      await changeUserPassword(user.id, currentPassword, newPassword)
      setStatusMsg({
        type: 'success',
        text: 'Your password has been changed successfully!',
      })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setStatusMsg({
        type: 'error',
        text: err.message || 'Failed to change password. Please check your current password.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user) {
    return null
  }

  const avatarSrc =
    profileData?.avatar_url ||
    user?.avatar ||
    `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user.name || 'User')}`

  return (
    <div className="profile-page-container">
      {/* Top Left Navigation Back Button */}
      <div className="mb-4 flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all cursor-pointer flex items-center gap-2 text-xs font-medium"
        >
          <FiArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
      </div>

      {/* Top Header Card */}
      <div className="profile-header-banner">
        <img src={avatarSrc} alt={user.name} className="profile-avatar-large" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap mb-1.5">
            <h1 className="text-2xl font-bold text-white tracking-tight">{user.name}</h1>
            {isGoogleAccount ? (
              <span className="profile-badge-pill badge-google-auth">
                <FiShield className="w-3.5 h-3.5" />
                Google Verified
              </span>
            ) : (
              <span className="profile-badge-pill badge-email-auth">
                <FiMail className="w-3.5 h-3.5" />
                Email Account
              </span>
            )}
          </div>
          <p className="text-sm text-gray-400 truncate">{user.email}</p>
        </div>
      </div>

      <div className="profile-bento-grid">
        {/* Account Details Card */}
        <div className="profile-card">
          <h2 className="profile-card-title">
            <FiUser className="w-5 h-5 text-indigo-400" />
            <span>Account Details</span>
          </h2>

          <div className="profile-details-grid">
            <div className="profile-detail-item">
              <div className="profile-detail-label">Full Name</div>
              <div className="profile-detail-value">{user.name}</div>
            </div>

            <div className="profile-detail-item">
              <div className="profile-detail-label">Email Address</div>
              <div className="profile-detail-value">{user.email}</div>
            </div>

            <div className="profile-detail-item">
              <div className="profile-detail-label">Authentication Method</div>
              <div className="profile-detail-value capitalize">
                {isGoogleAccount ? 'Google OAuth 2.0' : 'Email & Password'}
              </div>
            </div>

            <div className="profile-detail-item">
              <div className="profile-detail-label">Account ID</div>
              <div className="profile-detail-value text-xs font-mono text-gray-400 truncate">
                {user.id || 'N/A'}
              </div>
            </div>

            {profileData?.created_at && (
              <div className="profile-detail-item">
                <div className="profile-detail-label">Member Since</div>
                <div className="profile-detail-value flex items-center gap-1.5">
                  <FiCalendar className="w-4 h-4 text-emerald-400" />
                  <span>{profileData.created_at}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Change Password Card - ONLY shown if NOT a Google user */}
        {!isGoogleAccount ? (
          <div className="profile-card">
            <h2 className="profile-card-title">
              <FiKey className="w-5 h-5 text-purple-400" />
              <span>Change Account Password</span>
            </h2>

            {statusMsg.text && (
              <div
                className={`profile-alert mb-4 ${
                  statusMsg.type === 'error' ? 'profile-alert-error' : 'profile-alert-success'
                }`}
              >
                {statusMsg.type === 'error' ? (
                  <FiAlertCircle className="w-4 h-4 shrink-0" />
                ) : (
                  <FiCheckCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{statusMsg.text}</span>
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="password-form">
              {/* Current Password */}
              <div className="password-input-group">
                <label className="password-input-label">Current Password</label>
                <div className="password-input-wrapper">
                  <FiLock className="password-icon-left w-4 h-4" />
                  <input
                    type={showCurrent ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter your current password"
                    className="password-input-field"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="password-toggle-btn"
                  >
                    {showCurrent ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="password-input-group">
                <label className="password-input-label">New Password</label>
                <div className="password-input-wrapper">
                  <FiKey className="password-icon-left w-4 h-4" />
                  <input
                    type={showNew ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="password-input-field"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="password-toggle-btn"
                  >
                    {showNew ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div className="password-input-group">
                <label className="password-input-label">Confirm New Password</label>
                <div className="password-input-wrapper">
                  <FiCheckCircle className="password-icon-left w-4 h-4" />
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your new password"
                    className="password-input-field"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="password-toggle-btn"
                  >
                    {showConfirm ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="password-submit-btn"
              >
                {isSubmitting ? 'Updating Password...' : 'Update Password'}
              </button>
            </form>
          </div>
        ) : (
          /* Google Connected Info Box */
          <div className="profile-card">
            <h2 className="profile-card-title">
              <FiShield className="w-5 h-5 text-emerald-400" />
              <span>Password & Security</span>
            </h2>
            <div className="google-connected-box">
              <FiCheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-white mb-1">
                  Single Sign-On Managed by Google
                </h4>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Your OmniAgent account is secured directly via Google OAuth authentication. You do not
                  require a separate password for OmniAgent. To modify your credentials or 2-factor
                  authentication, please visit your Google Account Security Settings.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile

