import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { colors, height, radius, fontSize } from '../Const/display'
import { Badge } from './Badge'
import {
  FiCpu,
  FiMessageSquare,
  FiMic,
  FiImage,
  FiVideo,
  FiSettings,
  FiLayers,
} from 'react-icons/fi'

/**
 * Top Navbar Component
 */
export const Navbar = ({ onToggleSidebar }) => {
  const location = useLocation()

  const navLinks = [
    { path: '/text', label: 'Text AI', icon: FiMessageSquare, color: colors.textAgent },
    { path: '/audio', label: 'Audio AI', icon: FiMic, color: colors.audioAgent },
    { path: '/image', label: 'Image AI', icon: FiImage, color: colors.imageAgent },
    { path: '/video', label: 'Video AI', icon: FiVideo, color: colors.videoAgent },
  ]

  return (
    <header
      style={{
        height: height.navbar,
        backgroundColor: colors.bgDark,
        borderBottom: `1px solid ${colors.borderGlass}`,
      }}
      className="sticky top-0 z-40 w-full px-6 flex items-center justify-between backdrop-blur-md"
    >
      {/* Left: Mobile Toggle & Page Context */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onToggleSidebar}
          style={{
            backgroundColor: colors.bgCard,
            borderColor: colors.borderGlass,
            borderRadius: radius.md,
          }}
          className="lg:hidden p-2 text-gray-300 hover:text-white border"
        >
          <FiLayers className="w-5 h-5" />
        </button>

        <Link to="/" className="flex items-center gap-3">
          <div
            style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
              borderRadius: radius.md,
            }}
            className="w-10 h-10 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/25"
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

      {/* Center: Quick Modality Switcher (Hidden on mobile) */}
      <nav className="hidden md:flex items-center gap-2">
        {navLinks.map((item) => {
          const isActive = location.pathname === item.path
          const Icon = item.icon
          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                borderRadius: radius.md,
                backgroundColor: isActive ? 'rgba(255, 255, 255, 0.06)' : 'transparent',
                color: isActive ? colors.textPrimary : colors.textMuted,
                border: `1px solid ${isActive ? colors.borderGlassHover : 'transparent'}`,
                fontSize: fontSize.bodySm,
              }}
              className="flex items-center gap-2 px-3.5 py-1.5 font-medium transition-all hover:text-white hover:bg-white/5"
            >
              <Icon style={{ color: item.color }} className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Right: Supervisor Status & Settings */}
      <div className="flex items-center gap-3">
        <Badge variant="supervisor" size="sm" className="hidden sm:inline-flex">
          Supervisor Ready
        </Badge>

        <Link
          to="/settings"
          style={{
            backgroundColor: colors.bgCard,
            border: `1px solid ${colors.borderGlass}`,
            borderRadius: radius.md,
            color: colors.textSecondary,
          }}
          className="p-2.5 hover:text-white hover:border-indigo-500/40 transition-colors"
          title="Settings & API Configuration"
        >
          <FiSettings className="w-4 h-4" />
        </Link>
      </div>
    </header>
  )
}

export default Navbar
