import React from 'react'
import { colors, radius, shadows, transitions } from '../Const/display'

/**
 * Reusable Glassmorphic Card Container
 */
export const Card = ({
  children,
  header,
  footer,
  hoverable = false,
  glowColor,
  className = '',
  style = {},
  onClick,
  ...props
}) => {
  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: colors.bgCard,
        border: `1px solid ${colors.borderGlass}`,
        borderRadius: radius.lg,
        boxShadow: shadows.card,
        transition: transitions.default,
        ...(glowColor ? { borderColor: glowColor } : {}),
        ...style,
      }}
      className={`overflow-hidden backdrop-blur-md ${
        hoverable
          ? 'cursor-pointer hover:border-indigo-500/40 hover:-translate-y-1 hover:shadow-xl'
          : ''
      } ${className}`}
      {...props}
    >
      {header && (
        <div
          style={{
            borderBottom: `1px solid ${colors.borderGlass}`,
            padding: '16px 20px',
          }}
          className="flex items-center justify-between"
        >
          {header}
        </div>
      )}

      <div className="p-5">{children}</div>

      {footer && (
        <div
          style={{
            borderTop: `1px solid ${colors.borderGlass}`,
            backgroundColor: 'rgba(0, 0, 0, 0.15)',
            padding: '12px 20px',
          }}
          className="flex items-center justify-between"
        >
          {footer}
        </div>
      )}
    </div>
  )
}

export default Card
