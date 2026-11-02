import React from 'react'
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
} from 'react-icons/fi'

/**
 * Sidebar Navigation Component
 * Features:
 * - "+ New Chat" button opening a fresh conversation page
 * - "Previous Chats" history list with click-to-resume and delete
 * - Clean layout without individual modality links
 */
export const Sidebar = ({ isOpen, onClose }) => {
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
          width: width.sidebarExpanded,
          backgroundColor: colors.bgDark,
          borderRight: `1px solid ${colors.borderGlass}`,
          transition: transitions.smooth,
        }}
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col justify-between p-3.5 h-screen overflow-hidden lg:sticky lg:top-0 lg:translate-x-0 shrink-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col gap-4 min-h-0 flex-1">
          {/* Sidebar Header & Brand Telemetry */}
          <div className="flex items-center justify-between px-2 pt-1 pb-2 border-b border-white/5">
            <Link
              to="/"
              onClick={onClose}
              className="flex items-center gap-2 group"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span
                style={{
                  color: colors.textPrimary,
                  fontSize: fontSize.bodySm,
                }}
                className="font-bold tracking-tight group-hover:text-indigo-400 transition-colors"
              >
                OmniAgent AI
              </span>
            </Link>
            <Badge variant="supervisor" size="sm">
              Online
            </Badge>
          </div>

          {/* New Chat Primary Action Button */}
          <button
            type="button"
            onClick={handleNewChat}
            style={{
              backgroundColor: colors.primary,
              borderRadius: radius.lg,
              boxShadow: '0 4px 16px -2px rgba(99, 102, 241, 0.4)',
              transition: transitions.default,
            }}
            className="w-full py-2.5 px-4 flex items-center justify-center gap-2 text-white font-semibold text-sm hover:brightness-110 active:scale-98 cursor-pointer select-none border border-indigo-400/30"
          >
            <FiPlus className="w-4 h-4 stroke-[2.5]" />
            <span>New Chat</span>
          </button>

          {/* Home Link */}
          <Link
            to="/"
            onClick={onClose}
            style={{
              borderRadius: radius.md,
              backgroundColor:
                location.pathname === '/' ? 'rgba(99, 102, 241, 0.12)' : 'transparent',
              border: `1px solid ${
                location.pathname === '/' ? 'rgba(99, 102, 241, 0.3)' : 'transparent'
              }`,
              color: location.pathname === '/' ? colors.textPrimary : colors.textSecondary,
              fontSize: fontSize.bodySm,
            }}
            className="flex items-center gap-3 px-3.5 py-2 font-medium transition-all hover:bg-white/5 hover:text-white"
          >
            <FiHome className="w-4 h-4 shrink-0 text-indigo-400" />
            <span>Home Dashboard</span>
          </Link>

          {/* Previous Chats Section */}
          <div className="flex flex-col flex-1 min-h-0 pt-2 border-t border-white/5">
            <div className="flex items-center justify-between px-2 mb-2">
              <span
                style={{
                  color: colors.textMuted,
                  fontSize: fontSize.tiny,
                }}
                className="uppercase tracking-wider font-bold"
              >
                Previous Chats
              </span>
              <span className="text-[11px] text-gray-500 font-mono">
                {chats.length}
              </span>
            </div>

            {/* Scrollable Previous Chats List */}
            <div className="flex-1 overflow-y-auto flex flex-col gap-1 pr-1">
              {chats.length > 0 ? (
                chats.map((chat) => {
                  const isCurrentActive =
                    location.pathname === `/chat/${chat.id}` ||
                    (location.pathname.startsWith('/chat') && activeChatId === chat.id)

                  return (
                    <div
                      key={chat.id}
                      onClick={() => handleSelectChat(chat.id)}
                      style={{
                        borderRadius: radius.md,
                        backgroundColor: isCurrentActive
                          ? 'rgba(99, 102, 241, 0.15)'
                          : 'transparent',
                        border: `1px solid ${
                          isCurrentActive
                            ? 'rgba(99, 102, 241, 0.35)'
                            : 'transparent'
                        }`,
                        color: isCurrentActive ? colors.textPrimary : colors.textSecondary,
                        fontSize: fontSize.bodySm,
                      }}
                      className="group flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-white/5 hover:text-white transition-all select-none"
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <FiMessageSquare
                          className={`w-3.5 h-3.5 shrink-0 ${
                            isCurrentActive ? 'text-indigo-400' : 'text-gray-500'
                          }`}
                        />
                        <span className="truncate text-xs font-medium text-left">
                          {chat.title || 'Untitled Chat'}
                        </span>
                      </div>

                      {/* Delete Previous Chat on hover */}
                      <button
                        type="button"
                        onClick={(e) => deleteChat(chat.id, e)}
                        title="Delete chat"
                        className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 text-gray-500 rounded transition-opacity shrink-0 ml-1"
                      >
                        <FiTrash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )
                })
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center text-gray-500 text-xs px-2">
                  <FiClock className="w-6 h-6 mb-2 opacity-30" />
                  <span>No previous chats</span>
                  <span className="text-[10px] text-gray-600 mt-1">
                    Click "New Chat" to begin
                  </span>
                </div>
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
              className="flex items-center gap-3 px-3 py-2 font-medium transition-all hover:bg-white/5 hover:text-white"
            >
              <FiSettings className="w-4 h-4 shrink-0 text-gray-400" />
              <span className="text-xs">Model & API Settings</span>
            </Link>
          </div>
        </div>

        {/* Multi-Agent Architecture Live Widget */}
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
      </aside>
    </>
  )
}

export default Sidebar
