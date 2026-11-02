import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { colors, width, radius, fontSize, transitions } from '../Const/display'
import { Badge } from './Badge'
import { useChatStore } from '../store/chatStore'
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
} from 'react-icons/fi'

/**
 * Sidebar Navigation Component
 * Features:
 * - Minimize & Maximize toggle button
 * - "+ New Chat" button opening a fresh conversation page
 * - "Previous Chats" history list with click-to-resume and delete
 * - Clean layout without individual modality links
 */
export const Sidebar = ({ isOpen, onClose }) => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { chats, activeChatId, setActiveChat, createNewChat, deleteChat } = useChatStore()

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

  const currentWidth = isCollapsed ? width.sidebarCollapsed : width.sidebarExpanded

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
          width: currentWidth,
          background: `
            radial-gradient(ellipse 130% 50% at 50% -5%, rgba(99, 102, 241, 0.32), transparent 70%),
            radial-gradient(ellipse 120% 60% at 50% 100%, rgba(168, 85, 247, 0.28), transparent 70%),
            linear-gradient(180deg, #161d2f 0%, #1a2238 50%, #131929 100%)
          `,
          borderRight: '1px solid rgba(255, 255, 255, 0.14)',
          boxShadow: '4px 0 28px rgba(0, 0, 0, 0.45)',
          transition: transitions.smooth,
        }}
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col justify-between p-3 h-screen overflow-hidden lg:sticky lg:top-0 lg:translate-x-0 shrink-0 select-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col gap-3 min-h-0 flex-1">
          {/* Sidebar Header & Minimize / Maximize Toggle */}
          <div className="flex items-center justify-between px-1 pt-1 pb-2 border-b border-white/10">
            {!isCollapsed ? (
              <>
                <Link
                  to="/"
                  onClick={onClose}
                  className="flex items-center gap-2 group truncate"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                  <span
                    style={{
                      color: colors.textPrimary,
                      fontSize: fontSize.bodySm,
                    }}
                    className="font-bold tracking-tight group-hover:text-indigo-400 transition-colors truncate"
                  >
                    OmniAgent AI
                  </span>
                </Link>

                <div className="flex items-center gap-1">
                  <Badge variant="supervisor" size="sm" className="hidden sm:inline-flex">
                    Online
                  </Badge>
                  {/* Minimize Button */}
                  <button
                    type="button"
                    onClick={() => setIsCollapsed(true)}
                    title="Minimize Sidebar"
                    className="p-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <FiChevronLeft className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              /* Collapsed Header State: Centered Maximize Button */
              <div className="w-full flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => setIsCollapsed(false)}
                  title="Maximize Sidebar"
                  className="p-2 rounded-lg text-gray-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <FiChevronRight className="w-5 h-5 text-indigo-400" />
                </button>
              </div>
            )}
          </div>

          {/* New Chat Action Button */}
          <button
            type="button"
            onClick={handleNewChat}
            style={{
              backgroundColor: colors.primary,
              borderRadius: radius.lg,
              boxShadow: '0 4px 16px -2px rgba(99, 102, 241, 0.4)',
              transition: transitions.default,
            }}
            className={`flex items-center text-white font-semibold hover:brightness-110 active:scale-98 cursor-pointer border border-indigo-400/30 ${
              isCollapsed
                ? 'w-10 h-10 mx-auto justify-center p-0'
                : 'w-full py-2.5 px-3.5 justify-center gap-2 text-sm'
            }`}
            title="New Chat"
          >
            <FiPlus className="w-4 h-4 stroke-[2.5] shrink-0" />
            {!isCollapsed && <span>New Chat</span>}
          </button>

          {/* Home Link */}
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
            className={`flex items-center font-medium transition-all hover:bg-white/5 hover:text-white ${
              isCollapsed
                ? 'w-10 h-10 mx-auto justify-center p-0'
                : 'px-3 py-2 gap-3'
            }`}
            title="Home Dashboard"
          >
            <FiHome className="w-4 h-4 shrink-0 text-indigo-400" />
            {!isCollapsed && <span className="truncate">Home Dashboard</span>}
          </Link>

          {/* Previous Chats Section */}
          <div className="flex flex-col flex-1 min-h-0 pt-2 border-t border-white/5">
            {!isCollapsed && (
              <div className="flex items-center justify-between px-2 mb-2">
                <span className="text-[11px] font-semibold text-gray-400 tracking-wider uppercase">
                  Previous Chats
                </span>
                <span className="text-[11px] font-mono text-gray-400 bg-white/5 px-1.5 py-0.5 rounded">
                  {chats.length}
                </span>
              </div>
            )}

            {/* Scrollable list of chats */}
            <div className="flex-1 overflow-y-auto flex flex-col gap-1 pr-1 custom-scroll">
              {chats.length > 0 ? (
                chats.map((chat) => {
                  const isActive = activeChatId === chat.id
                  return (
                    <div
                      key={chat.id}
                      className="group relative flex items-center justify-between rounded-lg transition-all"
                    >
                      <button
                        type="button"
                        onClick={() => handleSelectChat(chat.id)}
                        style={{
                          backgroundColor: isActive ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                          borderColor: isActive ? 'rgba(99, 102, 241, 0.4)' : 'transparent',
                          color: isActive ? '#ffffff' : colors.textSecondary,
                        }}
                        className={`border flex items-center rounded-lg hover:bg-white/5 hover:text-white transition-all text-left cursor-pointer ${
                          isCollapsed
                            ? 'w-10 h-10 mx-auto justify-center p-0'
                            : 'w-full px-2.5 py-2 pr-8 gap-2.5 text-xs'
                        }`}
                        title={chat.title || 'Conversation'}
                      >
                        <FiMessageSquare
                          className={`w-3.5 h-3.5 shrink-0 ${
                            isActive ? 'text-indigo-400' : 'text-gray-400'
                          }`}
                        />
                        {!isCollapsed && (
                          <span className="truncate flex-1 font-medium">
                            {chat.title || 'New Conversation'}
                          </span>
                        )}
                      </button>

                      {/* Delete chat action icon */}
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

          {/* Secondary Management Links */}
          <div className="flex flex-col gap-1 pt-2 border-t border-white/5">
            <Link
              to="/settings"
              onClick={onClose}
              style={{
                borderRadius: radius.md,
                backgroundColor:
                  location.pathname === '/settings'
                    ? 'rgba(255, 255, 255, 0.08)'
                    : 'transparent',
                color:
                  location.pathname === '/settings'
                    ? colors.textPrimary
                    : colors.textSecondary,
                fontSize: fontSize.bodySm,
              }}
              className={`flex items-center font-medium transition-all hover:bg-white/5 hover:text-white ${
                isCollapsed
                  ? 'w-10 h-10 mx-auto justify-center p-0'
                  : 'px-3 py-2 gap-3 text-xs'
              }`}
              title="Model & API Settings"
            >
              <FiSettings className="w-4 h-4 shrink-0 text-gray-400" />
              {!isCollapsed && <span className="truncate">Model & API Settings</span>}
            </Link>
          </div>
        </div>

        {/* Multi-Agent Architecture Live Widget */}
        {!isCollapsed ? (
          <div
            style={{
              backgroundColor: colors.bgCard,
              border: `1px solid ${colors.borderGlass}`,
              borderRadius: radius.md,
              padding: '10px 12px',
            }}
            className="flex flex-col gap-1.5 mt-3 shrink-0"
          >
            <div className="flex items-center justify-between">
              <span
                style={{
                  color: colors.textPrimary,
                  fontSize: fontSize.caption,
                }}
                className="font-semibold flex items-center gap-1.5 text-xs"
              >
                <FiActivity className="w-3.5 h-3.5 text-emerald-400" />
                Supervisor Agent
              </span>
              <span className="text-emerald-400 text-[10px] font-mono">READY</span>
            </div>
            <p
              style={{
                color: colors.textMuted,
                fontSize: fontSize.tiny,
              }}
              className="leading-snug text-left"
            >
              Routing text, audio, images, and videos via LangGraph state.
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-center pt-2">
            <div
              className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"
              title="Supervisor Online"
            />
          </div>
        )}
      </aside>
    </>
  )
}

export default Sidebar
