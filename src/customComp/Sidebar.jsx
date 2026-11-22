import React, { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Avatar from 'react-avatar'
import { colors, radius, fontSize } from '../Const/display'
import { getFirstAndLastInitials } from '../utils/avatarUtils'
import { Badge } from './Badge'
import { useChatStore } from '../store/chatStore'
import { useAuthStore } from '../store/authStore'
import {
  FiHome,
  FiPlus,
  FiMessageSquare,
  FiTrash2,
  FiSettings,
  FiActivity,
  FiClock,
  FiChevronLeft,
  FiChevronRight,
  FiLogOut,
  FiLogIn,
  FiUser,
  FiHelpCircle,
  FiChevronUp,
} from 'react-icons/fi'

/**
 * Sidebar Navigation Component
 * Optimized for butter-smooth minimize/maximize transitions:
 * - Hardware-accelerated width animation (willChange: 'width')
 * - Fixed internal layout geometry preventing reflow/popping
 * - Smooth opacity & max-width transitions for labels
 * - "+ New Chat" button opening a fresh conversation
 * - "Previous Chats" history list with delete action
 */
export const Sidebar = ({ isOpen, onClose }) => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const profileMenuRef = useRef(null)
  const location = useLocation()
  const navigate = useNavigate()
  const { chats, activeChatId, setActiveChat, createNewChat, deleteChat } = useChatStore()
  const { user, isAuthenticated, logout } = useAuthStore()

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setProfileMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  // Handler for New Chat button
  const handleNewChat = () => {
    const newChat = createNewChat()
    navigate(`/chat/${newChat.id}`)
    if (onClose) onClose()
  }

  // Handler for selecting a previous chat
  const handleSelectChat = (chatId) => {
    setActiveChat(chatId)
    navigate(`/chat/${chatId}`)
    if (onClose) onClose()
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      <aside
        style={{
          width: isCollapsed ? '72px' : '260px',
          minWidth: isCollapsed ? '72px' : '260px',
          maxWidth: isCollapsed ? '72px' : '260px',
          transition: 'width 0.32s cubic-bezier(0.2, 0, 0, 1), min-width 0.32s cubic-bezier(0.2, 0, 0, 1), max-width 0.32s cubic-bezier(0.2, 0, 0, 1), transform 0.32s cubic-bezier(0.2, 0, 0, 1)',
          willChange: 'width',
          background: `
            radial-gradient(ellipse 130% 50% at 50% -5%, rgba(99, 102, 241, 0.32), transparent 70%),
            radial-gradient(ellipse 120% 60% at 50% 100%, rgba(168, 85, 247, 0.28), transparent 70%),
            linear-gradient(180deg, #161d2f 0%, #1a2238 50%, #131929 100%)
          `,
          borderRight: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '4px 0 28px rgba(0, 0, 0, 0.45)',
        }}
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col justify-between p-3 h-screen overflow-hidden lg:sticky lg:top-0 lg:translate-x-0 shrink-0 select-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col gap-3 min-h-0 flex-1 overflow-hidden">
          {/* Sidebar Header & Smooth Minimize / Maximize Toggle */}
          <div className="flex items-center justify-between h-9 px-1 pb-2 border-b border-white/10 overflow-hidden">
            <Link
              to="/"
              onClick={onClose}
              className={`flex items-center gap-2 group transition-all duration-300 overflow-hidden ${
                isCollapsed ? 'opacity-0 max-w-0 pointer-events-none' : 'opacity-100 max-w-[170px]'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span
                style={{
                  color: colors.textPrimary,
                  fontSize: fontSize.bodySm,
                }}
                className="font-bold tracking-tight group-hover:text-indigo-400 transition-colors whitespace-nowrap"
              >
                OmniAgent AI
              </span>
            </Link>

            <button
              type="button"
              onClick={() => setIsCollapsed(!isCollapsed)}
              title={isCollapsed ? 'Expand Sidebar' : 'Minimize Sidebar'}
              className={`p-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0 ${
                isCollapsed ? 'mx-auto' : ''
              }`}
            >
              {isCollapsed ? (
                <FiChevronRight className="w-4 h-4 text-indigo-400" />
              ) : (
                <FiChevronLeft className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* New Chat Action Button - Stays dimensionally solid without snapping */}
          <button
            type="button"
            onClick={handleNewChat}
            style={{
              backgroundColor: colors.primary,
              borderRadius: radius.lg,
              boxShadow: '0 4px 16px -2px rgba(99, 102, 241, 0.4)',
            }}
            className={`w-full h-10 flex items-center rounded-xl text-white font-semibold hover:brightness-110 active:scale-98 cursor-pointer border border-indigo-400/30 overflow-hidden transition-colors ${
              isCollapsed ? 'justify-center px-0' : 'px-3 gap-2.5 text-sm justify-start'
            }`}
            title="New Chat"
          >
            <div className="w-5 h-5 flex items-center justify-center shrink-0">
              <FiPlus className="w-4 h-4 stroke-[2.5]" />
            </div>
            <span
              className={`whitespace-nowrap font-medium text-sm transition-all duration-200 overflow-hidden ${
                isCollapsed ? 'opacity-0 max-w-0 pointer-events-none' : 'opacity-100 max-w-[160px]'
              }`}
            >
              New Chat
            </span>
          </button>

          {/* Home Dashboard Link */}
          <Link
            to="/"
            onClick={onClose}
            style={{
              borderRadius: radius.md,
              backgroundColor:
                location.pathname === '/' ? 'rgba(99, 102, 241, 0.16)' : 'transparent',
              border: `1px solid ${
                location.pathname === '/' ? 'rgba(99, 102, 241, 0.35)' : 'transparent'
              }`,
              color: location.pathname === '/' ? colors.textPrimary : colors.textSecondary,
              fontSize: fontSize.bodySm,
            }}
            className={`w-full h-10 flex items-center font-medium hover:bg-white/5 hover:text-white transition-colors overflow-hidden ${
              isCollapsed ? 'justify-center px-0' : 'px-3 gap-2.5 text-xs justify-start'
            }`}
            title="Home Dashboard"
          >
            <div className="w-5 h-5 flex items-center justify-center shrink-0">
              <FiHome className="w-4 h-4 text-indigo-400" />
            </div>
            <span
              className={`whitespace-nowrap transition-all duration-200 overflow-hidden truncate ${
                isCollapsed ? 'opacity-0 max-w-0 pointer-events-none' : 'opacity-100 max-w-[160px]'
              }`}
            >
              Home Dashboard
            </span>
          </Link>

          {/* Previous Chats Section */}
          <div className="flex flex-col flex-1 min-h-0 pt-2 border-t border-white/5 overflow-hidden">
            <div
              className={`flex items-center justify-between px-2 mb-2 overflow-hidden transition-all duration-200 ${
                isCollapsed ? 'opacity-0 max-h-0 pointer-events-none mb-0' : 'opacity-100 max-h-6'
              }`}
            >
              <span className="text-[11px] font-semibold text-gray-400 tracking-wider uppercase whitespace-nowrap">
                Previous Chats
              </span>
              <span className="text-[11px] font-mono text-gray-400 bg-white/5 px-1.5 py-0.5 rounded">
                {chats.length}
              </span>
            </div>

            {/* Scrollable list of chats */}
            <div className="flex-1 overflow-y-auto flex flex-col gap-1 pr-1 custom-scroll overflow-x-hidden">
              {chats.length > 0 ? (
                chats.map((chat) => {
                  const isActive = activeChatId === chat.id
                  return (
                    <div
                      key={chat.id}
                      className="group relative flex items-center w-full rounded-lg"
                    >
                      <button
                        type="button"
                        onClick={() => handleSelectChat(chat.id)}
                        style={{
                          backgroundColor: isActive ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                          borderColor: isActive ? 'rgba(99, 102, 241, 0.4)' : 'transparent',
                          color: isActive ? '#ffffff' : colors.textSecondary,
                        }}
                        className={`w-full h-9 border flex items-center rounded-lg hover:bg-white/5 hover:text-white transition-colors cursor-pointer overflow-hidden ${
                          isCollapsed ? 'justify-center px-0' : 'px-2.5 pr-8 gap-2.5 text-xs justify-start'
                        }`}
                        title={chat.title || 'Conversation'}
                      >
                        <div className="w-4 h-4 flex items-center justify-center shrink-0">
                          <FiMessageSquare
                            className={`w-3.5 h-3.5 shrink-0 ${
                              isActive ? 'text-indigo-400' : 'text-gray-400'
                            }`}
                          />
                        </div>
                        <span
                          className={`whitespace-nowrap truncate font-medium transition-all duration-200 overflow-hidden ${
                            isCollapsed ? 'opacity-0 max-w-0 pointer-events-none' : 'opacity-100 max-w-[150px]'
                          }`}
                        >
                          {chat.title || 'New Conversation'}
                        </span>
                      </button>

                      {!isCollapsed && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteChat(chat.id)
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1.5 hover:text-red-400 text-gray-400 rounded transition-all absolute right-1 cursor-pointer"
                          title="Delete conversation"
                        >
                          <FiTrash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  )
                })
              ) : (
                !isCollapsed && (
                  <div className="flex flex-col items-center justify-center py-8 text-center text-gray-500 text-xs px-2">
                    <FiClock className="w-6 h-6 mb-2 opacity-30" />
                    <span>No previous chats</span>
                    <span className="text-[10px] text-gray-600 mt-1">
                      Click "New Chat" to begin
                    </span>
                  </div>
                )
              )}
            </div>
          </div>

        </div>

        {/* Footer Widget: Authenticated User Profile with Upward Dropdown Menu */}
        {isAuthenticated && user ? (
          <div ref={profileMenuRef} className="relative mt-3 shrink-0">
            {/* Upward Glassmorphic Popover Dropdown Menu */}
            {profileMenuOpen && (
              <div
                style={{
                  backgroundColor: 'rgba(15, 20, 32, 0.95)',
                  border: `1px solid ${colors.borderGlassHover}`,
                  borderRadius: radius.lg,
                  boxShadow: '0 -12px 36px rgba(0, 0, 0, 0.65), 0 0 20px rgba(99, 102, 241, 0.2)',
                }}
                className={`absolute bottom-full mb-2 z-50 p-2 flex flex-col gap-1 backdrop-blur-2xl transition-all duration-200 ${
                  isCollapsed ? 'left-0 w-60' : 'left-0 right-0'
                }`}
              >
                {/* Header in Dropdown: User Avatar + Name + Email */}
                <div className="flex items-center gap-3 p-2 border-b border-white/5 mb-1">
                  <div className="shrink-0 flex items-center justify-center">
                    <Avatar
                      name={user.name || 'User'}
                      value={getFirstAndLastInitials(user.name)}
                      size="40"
                      round="12px"
                      className="border border-indigo-400/50 object-cover"
                    />
                  </div>
                  <div className="flex flex-col min-w-0 overflow-hidden">
                    <span className="text-sm font-semibold text-white truncate">{user.name}</span>
                    <span className="text-xs text-gray-400 truncate">{user.email}</span>
                  </div>
                </div>

                {/* 1. Profile Option Button */}
                <button
                  type="button"
                  onClick={() => {
                    setProfileMenuOpen(false)
                    navigate('/profile')
                    if (onClose) onClose()
                  }}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-gray-200 hover:text-white hover:bg-white/10 transition-all cursor-pointer w-full text-left"
                >
                  <FiUser className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>View Profile</span>
                </button>

                {/* 2. Settings Option Button */}
                <button
                  type="button"
                  onClick={() => {
                    setProfileMenuOpen(false)
                    navigate('/settings')
                    if (onClose) onClose()
                  }}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-gray-200 hover:text-white hover:bg-white/10 transition-all cursor-pointer w-full text-left"
                >
                  <FiSettings className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>Settings</span>
                </button>

                {/* 3. Help Option Button */}
                <button
                  type="button"
                  onClick={() => {
                    setProfileMenuOpen(false)
                    navigate('/help')
                    if (onClose) onClose()
                  }}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-gray-200 hover:text-white hover:bg-white/10 transition-all cursor-pointer w-full text-left"
                >
                  <FiHelpCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Help & Docs</span>
                </button>

                <div className="h-px bg-white/5 my-0.5" />

                {/* 4. Logout Option Button */}
                <button
                  type="button"
                  onClick={() => {
                    setProfileMenuOpen(false)
                    logout()
                  }}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all cursor-pointer w-full text-left"
                >
                  <FiLogOut className="w-4 h-4 shrink-0" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}

            {/* Profile Bar Button that triggers the upward dropdown */}
            <button
              type="button"
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              style={{
                backgroundColor: profileMenuOpen ? 'rgba(30, 41, 59, 0.95)' : 'rgba(19, 25, 38, 0.85)',
                border: `1px solid ${profileMenuOpen ? colors.primary : colors.borderGlass}`,
                borderRadius: radius.lg,
                boxShadow: profileMenuOpen
                  ? '0 0 16px rgba(99, 102, 241, 0.35)'
                  : '0 8px 24px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
              }}
              className={`flex items-center w-full overflow-hidden transition-all duration-200 backdrop-blur-xl cursor-pointer hover:border-indigo-500/50 ${
                isCollapsed ? 'p-2 justify-center' : 'p-2.5 justify-between gap-2.5'
              }`}
              title="User Profile Menu"
            >
              {/* User Avatar + Name Info */}
              <div className="flex items-center gap-2.5 min-w-0 text-left">
                <div className="relative shrink-0 flex items-center justify-center">
                  <Avatar
                    name={user.name || 'User'}
                    value={getFirstAndLastInitials(user.name)}
                    size="36"
                    round="12px"
                    className="border border-indigo-500/50 object-cover shadow-md shadow-indigo-500/20"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-900 animate-pulse" />
                </div>

                {!isCollapsed && (
                  <div className="flex flex-col min-w-0 overflow-hidden">
                    <span
                      style={{
                        color: colors.textPrimary,
                        fontSize: fontSize.bodySm,
                      }}
                      className="font-semibold truncate leading-tight text-white"
                    >
                      {user.name}
                    </span>
                    <span
                      style={{
                        color: colors.textMuted,
                        fontSize: fontSize.tiny,
                      }}
                      className="truncate text-gray-400 leading-tight mt-0.5"
                    >
                      {user.email}
                    </span>
                  </div>
                )}
              </div>

              {!isCollapsed && (
                <FiChevronUp
                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 shrink-0 ${
                    profileMenuOpen ? 'rotate-180 text-indigo-400' : ''
                  }`}
                />
              )}
            </button>
          </div>
        ) : (
          <div
            style={{
              backgroundColor: colors.bgCard,
              border: `1px solid ${colors.borderGlass}`,
              borderRadius: radius.md,
            }}
            className={`flex flex-col mt-3 shrink-0 overflow-hidden transition-all duration-300 ${
              isCollapsed ? 'p-2 items-center justify-center' : 'p-2.5 gap-1.5'
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-1.5">
                <FiActivity className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span
                  style={{
                    color: colors.textPrimary,
                    fontSize: fontSize.caption,
                  }}
                  className={`font-semibold text-xs whitespace-nowrap transition-all duration-200 overflow-hidden ${
                    isCollapsed ? 'opacity-0 max-w-0 pointer-events-none' : 'opacity-100 max-w-[120px]'
                  }`}
                >
                  Supervisor Agent
                </span>
              </div>
              <span
                className={`text-emerald-400 text-[10px] font-mono transition-all duration-200 overflow-hidden ${
                  isCollapsed ? 'opacity-0 max-w-0 pointer-events-none' : 'opacity-100 max-w-[40px]'
                }`}
              >
                READY
              </span>
            </div>
            <p
              style={{
                color: colors.textMuted,
                fontSize: fontSize.tiny,
              }}
              className={`leading-snug text-left transition-all duration-200 overflow-hidden ${
                isCollapsed ? 'opacity-0 max-h-0 pointer-events-none' : 'opacity-100 max-h-12'
              }`}
            >
              Routing text, audio, images, and videos via LangGraph state.
            </p>
          </div>
        )}
      </aside>
    </>
  )
}

export default Sidebar
