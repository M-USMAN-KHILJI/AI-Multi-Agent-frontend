import React from 'react'
import {
  FiLock,
  FiX,
  FiArrowRight,
  FiImage,
  FiVideo,
  FiZap,
  FiCheckCircle,
} from 'react-icons/fi'
import { colors, radius } from '../Const/display'

/**
 * AuthRequiredModal
 * Triggered when an unauthenticated user attempts to generate Images or Videos.
 * Follows UI/UX Pro Max modal accessibility and glassmorphism standards.
 */
export const AuthRequiredModal = ({ isOpen, onClose, onLogin, featureName = 'Image & Video Generation' }) => {
  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Blurred Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity"
      />

      {/* Modal Dialog Card */}
      <div
        style={{
          background: 'rgba(19, 25, 38, 0.88)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: radius.xl,
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.75), 0 0 40px rgba(99, 102, 241, 0.25)',
        }}
        className="relative z-10 w-full max-w-md p-6 sm:p-7 backdrop-blur-2xl text-slate-100 overflow-hidden"
      >
        {/* Glow Accent */}
        <div
          style={{
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.35), transparent 70%)',
          }}
          className="absolute -top-16 -right-16 w-48 h-48 rounded-full pointer-events-none filter blur-2xl"
        />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <FiX className="w-5 h-5" />
        </button>

        {/* Modal Icon */}
        <div className="flex items-center gap-3 mb-4">
          <div
            style={{
              background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)',
              borderRadius: radius.md,
            }}
            className="w-12 h-12 flex items-center justify-center text-white shadow-lg shadow-purple-500/30"
          >
            <FiLock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-semibold tracking-wider uppercase text-purple-400">
              Access Restricted
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Sign In Required
            </h2>
          </div>
        </div>

        {/* Body Text */}
        <p className="text-sm text-gray-300 leading-relaxed mb-5">
          You are exploring in guest mode. <strong>Text Chat</strong> is unlimited, but generating GPU-accelerated <span className="text-purple-300 font-semibold">{featureName}</span> requires an authenticated account.
        </p>

        {/* Features Unlocked List */}
        <div className="space-y-2.5 p-3.5 rounded-xl bg-slate-950/60 border border-white/5 mb-6 text-xs text-gray-300">
          <div className="flex items-center gap-2">
            <FiCheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Generate high-resolution AI images with FLUX 3 & SDXL</span>
          </div>
          <div className="flex items-center gap-2">
            <FiCheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Create AI videos and extract keyframes with OpenCV</span>
          </div>
          <div className="flex items-center gap-2">
            <FiCheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Persistent chat history synced across all devices</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto flex-1 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-750 text-gray-300 hover:text-white border border-white/10 text-xs font-semibold transition-all cursor-pointer text-center"
          >
            Continue as Guest
          </button>

          <button
            type="button"
            onClick={onLogin}
            style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
              boxShadow: '0 4px 16px rgba(99, 102, 241, 0.4)',
            }}
            className="w-full sm:w-auto flex-1 px-5 py-2.5 rounded-xl text-white text-xs font-semibold inline-flex items-center justify-center gap-1.5 hover:brightness-110 active:scale-98 transition-all cursor-pointer"
          >
            <span>Log In Now</span>
            <FiArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default AuthRequiredModal

