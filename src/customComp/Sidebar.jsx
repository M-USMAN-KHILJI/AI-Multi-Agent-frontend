import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { colors, width, radius, fontSize, transitions } from '../Const/display'
import { Badge } from './Badge'
import {
  FiHome,
  FiMessageSquare,
  FiMic,
  FiImage,
  FiVideo,
  FiClock,
  FiSettings,
  FiActivity,
  FiChevronRight,
} from 'react-icons/fi'

/**
 * Sidebar Navigation Component
 */
export const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation()

  const mainNav = [
    {
      path: '/',
      label: 'Home & Supervisor',
      icon: FiHome,
      badge: 'Orchestrator',
      badgeVariant: 'supervisor',
      color: colors.supervisor,
    },
    {
      path: '/text',
      label: 'Text AI',
      icon: FiMessageSquare,
      badge: 'LangChain',
      badgeVariant: 'text',
      color: colors.textAgent,
    },
    {
      path: '/audio',
      label: 'Audio AI',
      icon: FiMic,
      badge: 'STT / TTS',
      badgeVariant: 'audio',
      color: colors.audioAgent,
    },
    {
      path: '/image',
      label: 'Image AI',
      icon: FiImage,
      badge: 'Vision / Gen',
      badgeVariant: 'image',
      color: colors.imageAgent,
    },
    {
      path: '/video',
      label: 'Video AI',
      icon: FiVideo,
      badge: 'Frames / Gen',
      badgeVariant: 'video',
      color: colors.videoAgent,
    },
  ]

  const secondaryNav = [
    {
      path: '/history',
      label: 'History & Logs',
      icon: FiClock,
    },
    {
      path: '/settings',
      label: 'Model Settings',
      icon: FiSettings,
    },
  ]

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
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col justify-between p-4 lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col gap-6">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between px-2 pt-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span
                style={{
                  color: colors.textSecondary,
                  fontSize: fontSize.caption,
                }}
                className="font-semibold tracking-wider uppercase"
              >
                LangGraph Multi-Agent
              </span>
            </div>
            <Badge variant="supervisor" size="sm">v1.0</Badge>
          </div>

          {/* Modality Agents Navigation Section */}
          <div className="flex flex-col gap-1">
            <span
              style={{
                color: colors.textMuted,
                fontSize: fontSize.tiny,
              }}
              className="px-3 uppercase tracking-wider font-bold mb-1"
            >
              Specialized Agents
            </span>

            {mainNav.map((item) => {
              const isActive = location.pathname === item.path
              const Icon = item.icon
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  style={{
                    borderRadius: radius.md,
                    backgroundColor: isActive
                      ? 'rgba(99, 102, 241, 0.12)'
                      : 'transparent',
                    border: `1px solid ${
                      isActive ? 'rgba(99, 102, 241, 0.3)' : 'transparent'
                    }`,
                    color: isActive ? colors.textPrimary : colors.textSecondary,
                    fontSize: fontSize.bodySm,
                  }}
                  className="flex items-center justify-between px-3.5 py-2.5 font-medium transition-all hover:bg-white/5 hover:text-white group"
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      style={{ color: item.color }}
                      className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110"
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <Badge variant={item.badgeVariant} size="sm" showDot={false}>
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              )
            })}
          </div>

          {/* System & History Links */}
          <div className="flex flex-col gap-1 pt-4 border-t border-white/5">
            <span
              style={{
                color: colors.textMuted,
                fontSize: fontSize.tiny,
              }}
              className="px-3 uppercase tracking-wider font-bold mb-1"
            >
              Management
            </span>

            {secondaryNav.map((item) => {
              const isActive = location.pathname === item.path
              const Icon = item.icon
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  style={{
                    borderRadius: radius.md,
                    backgroundColor: isActive
                      ? 'rgba(255, 255, 255, 0.08)'
                      : 'transparent',
                    color: isActive ? colors.textPrimary : colors.textSecondary,
                    fontSize: fontSize.bodySm,
                  }}
                  className="flex items-center gap-3 px-3.5 py-2.5 font-medium transition-all hover:bg-white/5 hover:text-white"
                >
                  <Icon className="w-4 h-4 shrink-0 text-gray-400" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Multi-Agent Architecture Live Widget */}
        <div
          style={{
            backgroundColor: colors.bgCard,
            border: `1px solid ${colors.borderGlass}`,
            borderRadius: radius.md,
            padding: '12px 14px',
          }}
          className="flex flex-col gap-2 mt-4"
        >
          <div className="flex items-center justify-between">
            <span
              style={{
                color: colors.textPrimary,
                fontSize: fontSize.caption,
              }}
              className="font-semibold flex items-center gap-1.5"
            >
              <FiActivity className="w-3.5 h-3.5 text-emerald-400" />
              State Machine
            </span>
            <span className="text-emerald-400 text-xs font-mono">IDLE</span>
          </div>
          <p
            style={{
              color: colors.textMuted,
              fontSize: fontSize.tiny,
            }}
            className="leading-snug text-left"
          >
            Supervisor routes requests through LangGraph conditional nodes.
          </p>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
