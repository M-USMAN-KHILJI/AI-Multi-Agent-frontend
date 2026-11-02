import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { colors, height, radius, fontSize } from '../Const/display'
import { Badge } from './Badge'
import { useChatStore } from '../store/chatStore'
import {
  FiCpu,
  FiPlus,
  FiSettings,
  FiLayers,
  FiHome,
  FiMessageSquare,
} from 'react-icons/fi'

/**
 * Top Navbar Component
 */
export const Navbar = ({ onToggleSidebar }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { createNewChat } = useChatStore()

  const handleNewChat = () => {
    const newChat = createNewChat()
    navigate(`/chat/${newChat.id}`)
  }

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
          className="lg:hidden p-2 text-gray-300 hover:text-white border cursor-pointer"
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

      {/* Center: Quick Breadcrumb / Navigation */}
      <nav className="hidden md:flex items-center gap-2">
        <Link
          to="/"
          style={{
            borderRadius: radius.md,
            backgroundColor: location.pathname === '/' ? 'rgba(255, 255, 255, 0.06)' : 'transparent',
            color: location.pathname === '/' ? colors.textPrimary : colors.textMuted,
            border: `1px solid ${location.pathname === '/' ? colors.borderGlassHover : 'transparent'}`,
            fontSize: fontSize.bodySm,
          }}
          className="flex items-center gap-2 px-3.5 py-1.5 font-medium transition-all hover:text-white hover:bg-white/5"
        >
          <FiHome className="w-4 h-4 text-indigo-400" />
          <span>Dashboard</span>
        </Link>

        {location.pathname.startsWith('/chat') && (
          <div
            style={{
              borderRadius: radius.md,
              backgroundColor: 'rgba(99, 102, 241, 0.1)',
              color: colors.primaryLight,
              border: '1px solid rgba(99, 102, 241, 0.25)',
              fontSize: fontSize.bodySm,
            }}
            className="flex items-center gap-2 px-3.5 py-1.5 font-medium"
          >
            <FiMessageSquare className="w-4 h-4 text-indigo-400" />
            <span>Active Conversation</span>
          </div>
        )}
      </nav>

      {/* Right: Supervisor Status & Actions */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleNewChat}
          style={{
            backgroundColor: colors.primary,
            borderRadius: radius.md,
          }}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:brightness-110 active:scale-95 transition-all cursor-pointer"
        >
          <FiPlus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>New Chat</span>
        </button>

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
