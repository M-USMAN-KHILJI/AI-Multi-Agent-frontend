import React from 'react'
import { colors, radius, fontSize } from '../Const/display'

/**
 * Reusable Badge Component for Agent Modalities & Status Indicators
 */
export const Badge = ({
  children,
  variant = 'primary', // 'supervisor' | 'text' | 'audio' | 'image' | 'video' | 'success' | 'warning' | 'error' | 'primary'
  showDot = true,
  size = 'md',
  className = '',
  style = {},
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'supervisor':
        return {
          bg: colors.supervisorBg,
          color: colors.supervisor,
          border: colors.supervisorBorder,
          dot: colors.supervisor,
        }
      case 'text':
        return {
          bg: colors.textAgentBg,
          color: colors.textAgent,
          border: colors.textAgentBorder,
          dot: colors.textAgent,
        }
      case 'audio':
        return {
          bg: colors.audioAgentBg,
          color: colors.audioAgent,
          border: colors.audioAgentBorder,
          dot: colors.audioAgent,
        }
      case 'image':
        return {
          bg: colors.imageAgentBg,
          color: colors.imageAgent,
          border: colors.imageAgentBorder,
          dot: colors.imageAgent,
        }
      case 'video':
        return {
          bg: colors.videoAgentBg,
          color: colors.videoAgent,
          border: colors.videoAgentBorder,
          dot: colors.videoAgent,
        }
      case 'success':
        return {
          bg: 'rgba(16, 185, 129, 0.1)',
          color: colors.success,
          border: 'rgba(16, 185, 129, 0.25)',
          dot: colors.success,
        }
      case 'warning':
        return {
          bg: 'rgba(245, 158, 11, 0.1)',
          color: colors.warning,
          border: 'rgba(245, 158, 11, 0.25)',
          dot: colors.warning,
        }
      case 'error':
        return {
          bg: 'rgba(239, 68, 68, 0.1)',
          color: colors.error,
          border: 'rgba(239, 68, 68, 0.25)',
          dot: colors.error,
        }
      case 'primary':
      default:
        return {
          bg: 'rgba(99, 102, 241, 0.1)',
          color: colors.primaryLight,
          border: 'rgba(99, 102, 241, 0.25)',
          dot: colors.primary,
        }
    }
  }

  const v = getVariantStyles()
  const isSm = size === 'sm'

  return (
    <span
      style={{
        backgroundColor: v.bg,
        color: v.color,
        border: `1px solid ${v.border}`,
        borderRadius: radius.full,
        fontSize: isSm ? fontSize.tiny : fontSize.caption,
        padding: isSm ? '2px 8px' : '4px 12px',
        ...style,
      }}
      className={`inline-flex items-center gap-1.5 font-medium tracking-wide shrink-0 ${className}`}
    >
      {showDot && (
        <span
          style={{ backgroundColor: v.dot }}
          className="w-1.5 h-1.5 rounded-full animate-pulse shrink-0"
        />
      )}
      <span>{children}</span>
    </span>
  )
}

export default Badge
