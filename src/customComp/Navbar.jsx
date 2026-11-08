import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { colors, height, radius, fontSize } from '../Const/display'
import { useChatStore } from '../store/chatStore'
import { useAuthStore } from '../store/authStore'
import {
  FiCpu,
  FiPlus,
  FiSettings,
  FiLayers,
  FiLogIn,
  FiLogOut,
  FiUser,
} from 'react-icons/fi'

/**
 * Top Navbar Component
 * Houses the Telemetry, Supervisor Status, LangGraph/LangChain badges, New Chat, and Auth Status
 */
export const Navbar = ({ onToggleSidebar }) => {
  const navigate = useNavigate()
  const { createNewChat } = useChatStore()
  const { user, isAuthenticated, logout } = useAuthStore()

  const handleNewChat = () => {
    const newChat = createNewChat()
    navigate(`/chat/${newChat.id}`)
  }

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

      {/* Right: Auth Status + New Chat Button + Settings */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        <div className="hidden xl:flex items-center gap-2 text-xs text-gray-400 font-mono">
          <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/5 text-[11px]">
            LangGraph: <span className="text-emerald-400">Active</span>
          </span>
          <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/5 text-[11px]">
            LangChain: <span className="text-indigo-300">v1.4</span>
          </span>
        </div>

        {/* User Auth Avatar / Login Pill */}
        {isAuthenticated && user ? (
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-800/80 border border-white/10 text-xs">
            <img
              src={user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.name}`}
              alt={user.name}
              className="w-5 h-5 rounded-full border border-indigo-400/50"
            />
            <span className="text-gray-200 font-medium hidden sm:inline max-w-[100px] truncate">
              {user.name}
            </span>
            <button
              onClick={() => logout()}
              title="Sign Out"
              className="text-gray-400 hover:text-red-400 p-0.5 transition-colors cursor-pointer"
            >
              <FiLogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            style={{
              borderRadius: radius.md,
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-300 hover:text-white bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 transition-all cursor-pointer"
          >
            <FiLogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </Link>
        )}

        <button
          type="button"
          onClick={handleNewChat}
          style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            borderRadius: radius.md,
            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)',
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white hover:brightness-110 active:scale-95 transition-all cursor-pointer"
        >
          <FiPlus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span className="hidden sm:inline">Open New Chat</span>
          <span className="sm:hidden">New</span>
        </button>

        <Link
          to="/settings"
          style={{
            backgroundColor: colors.bgCard,
            border: `1px solid ${colors.borderGlass}`,
            borderRadius: radius.md,
            color: colors.textSecondary,
          }}
          className="p-2 hover:text-white hover:border-indigo-500/40 transition-colors"
          title="Settings & API Configuration"
        >
          <FiSettings className="w-4 h-4" />
        </Link>
      </div>
    </header>
  )
}

export default Navbar
