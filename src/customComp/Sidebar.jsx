import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { colors, radius, fontSize } from '../Const/display'
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
 * Optimized for butter-smooth minimize/maximize transitions:
 * - Hardware-accelerated width animation (willChange: 'width')
 * - Fixed internal layout geometry preventing reflow/popping
 * - Smooth opacity & max-width transitions for labels
 * - "+ New Chat" button opening a fresh conversation
 * - "Previous Chats" history list with delete action
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

          {/* Secondary Management Links */}
          <div className="flex flex-col gap-1 pt-2 border-t border-white/5 shrink-0">
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
              className={`w-full h-10 flex items-center font-medium hover:bg-white/5 hover:text-white transition-colors overflow-hidden ${
                isCollapsed ? 'justify-center px-0' : 'px-3 gap-2.5 text-xs justify-start'
              }`}
              title="Model & API Settings"
            >
              <div className="w-5 h-5 flex items-center justify-center shrink-0">
                <FiSettings className="w-4 h-4 text-gray-400" />
              </div>
              <span
                className={`whitespace-nowrap transition-all duration-200 overflow-hidden truncate ${
                  isCollapsed ? 'opacity-0 max-w-0 pointer-events-none' : 'opacity-100 max-w-[160px]'
                }`}
              >
                Model & API Settings
              </span>
            </Link>
          </div>
        </div>

        {/* Multi-Agent Architecture Status Widget */}
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
      </aside>
    </>
  )
}

export default Sidebar
