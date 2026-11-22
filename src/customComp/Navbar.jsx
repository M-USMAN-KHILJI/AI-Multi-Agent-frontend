import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Avatar from 'react-avatar'
import { colors, height, radius, fontSize } from '../Const/display'
import { getFirstAndLastInitials } from '../utils/avatarUtils'
import { useAuthStore } from '../store/authStore'
import {
  FiCpu,
  FiLayers,
  FiLogIn,
  FiLogOut,
  FiUser,
  FiChevronDown,
  FiMail,
} from 'react-icons/fi'

/**
 * Top Navbar Component
 * - Displays brand & Supervisor Telemetry
 * - Shows Guest Sign In button or User Avatar/Profile
 * - On Hover/Click over User Avatar, displays an elegant glassmorphism dropdown menu showing user profile & sign out button
 * - "New Chat" button and "Settings" icon are removed from the Navbar as requested
 */
export const Navbar = ({ onToggleSidebar }) => {
  const { user, isAuthenticated, logout } = useAuthStore()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  return (
    <header
      style={{
        height: height.navbar,
        background: 'rgba(11, 15, 25, 0.75)',
        borderBottom: `1px solid ${colors.borderGlass}`,
      }}
      className="sticky top-0 z-40 w-full px-4 sm:px-6 flex items-center justify-between backdrop-blur-xl"
    >
      {/* Left: Mobile Toggle & Brand / Supervisor Status */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          type="button"
          onClick={onToggleSidebar}
          style={{
            backgroundColor: colors.bgCard,
            borderColor: colors.borderGlass,
            borderRadius: radius.md,
          }}
          className="lg:hidden p-2 text-gray-300 hover:text-white border cursor-pointer"
          title="Toggle Navigation Menu"
        >
          <FiLayers className="w-5 h-5" />
        </button>

        <Link to="/" className="flex items-center gap-3">
          <div
            style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
              borderRadius: radius.md,
            }}
            className="w-9 h-9 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/25 shrink-0"
          >
            <FiCpu className="w-5 h-5" />
          </div>
          <div className="text-left hidden sm:block">
            <h1
              style={{
                color: colors.textPrimary,
                fontSize: fontSize.bodyLg,
              }}
              className="font-bold tracking-tight leading-none"
            >
              Omni<span className="text-indigo-400">Agent</span>
            </h1>
            <p
              style={{
                color: colors.textMuted,
                fontSize: fontSize.tiny,
              }}
              className="mt-0.5 tracking-wider uppercase font-semibold"
            >
              Multimodal Multi-Agent
            </p>
          </div>
        </Link>
      </div>

      {/* Center: System Telemetry Bar (Supervisor Online | 4 Agents) */}
      <div className="hidden md:flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-slate-900/60 border border-white/5 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">
            Supervisor Online
          </span>
        </div>
        <span className="text-gray-700">|</span>
        <span className="text-xs text-gray-300">
          Orchestrating <strong className="text-indigo-300">4 Specialized Agents</strong>
        </span>
      </div>

      {/* Right: Auth Profile Dropdown */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="hidden 2xl:flex items-center gap-2 text-xs text-gray-400 font-mono">
          <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/5 text-[11px]">
            LangGraph: <span className="text-emerald-400">Active</span>
          </span>
          <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/5 text-[11px]">
            LangChain: <span className="text-indigo-300">v1.4</span>
          </span>
        </div>

        {isAuthenticated && user ? (
          /* User Profile with Interactive Hover/Click Dropdown */
          <div
            ref={dropdownRef}
            className="relative"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-slate-750 border border-white/10 hover:border-indigo-500/40 transition-all cursor-pointer text-xs"
            >
              <div className="shrink-0 flex items-center justify-center">
                <Avatar
                  name={user.name || 'User'}
                  value={getFirstAndLastInitials(user.name)}
                  size="24"
                  round={true}
                  className="border border-indigo-400/50 object-cover"
                />
              </div>
              <span className="text-gray-200 font-medium hidden sm:inline max-w-[120px] truncate">
                {user.name}
              </span>
              <FiChevronDown
                className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${
                  dropdownOpen ? 'rotate-180 text-white' : ''
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div
                style={{
                  background: 'rgba(17, 24, 39, 0.95)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: radius.lg,
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.7), 0 0 25px rgba(99, 102, 241, 0.15)',
                }}
                className="absolute right-0 mt-2 w-64 p-3 backdrop-blur-2xl text-slate-100 z-50 animate-fadeIn"
              >
                {/* User Info Header */}
                <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                  <div className="shrink-0 flex items-center justify-center">
                    <Avatar
                      name={user.name || 'User'}
                      value={getFirstAndLastInitials(user.name)}
                      size="40"
                      round={true}
                      className="border-2 border-indigo-500/60 object-cover"
                    />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-bold text-white truncate">
                      {user.name}
                    </span>
                    <span className="text-xs text-gray-400 truncate flex items-center gap-1">
                      <FiMail className="w-3 h-3 shrink-0" />
                      <span className="truncate">{user.email}</span>
                    </span>
                  </div>
                </div>

                {/* Profile Badge */}
                <div className="my-2.5 px-2.5 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-between text-[11px]">
                  <span className="text-indigo-300 font-semibold">Account Status</span>
                  <span className="text-emerald-400 font-mono font-bold uppercase tracking-wider">
                    Verified
                  </span>
                </div>

                {/* Sign Out Button */}
                <button
                  type="button"
                  onClick={() => {
                    setDropdownOpen(false)
                    logout()
                  }}
                  className="w-full mt-1 flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-red-400 hover:text-white hover:bg-red-500/20 transition-all cursor-pointer text-left"
                >
                  <FiLogOut className="w-4 h-4 shrink-0" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Guest Sign In Link */
          <Link
            to="/login"
            style={{
              borderRadius: radius.md,
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-300 hover:text-white bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 transition-all cursor-pointer whitespace-nowrap"
          >
            <FiLogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </Link>
        )}
      </div>
    </header>
  )
}

export default Navbar
