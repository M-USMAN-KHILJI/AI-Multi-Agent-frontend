import React from 'react'
import { colors, radius, height, fontSize, transitions } from '../Const/display'

/**
 * Reusable Button Component
 * Supports variants: primary, secondary, outline, ghost, supervisor, text, audio, image, video
 * Supports sizes: sm, md, lg
 */
export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  isLoading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  type = 'button',
  className = '',
  style = {},
  ...props
}) => {
  // Variant styles mapped to display constants & Tailwind
  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return {
          backgroundColor: colors.bgCardHover,
          color: colors.textPrimary,
          border: `1px solid ${colors.borderGlass}`,
        }
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: colors.primaryLight,
          border: `1px solid ${colors.primary}`,
        }
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: colors.textSecondary,
          border: '1px solid transparent',
        }
      case 'supervisor':
        return {
          backgroundColor: colors.supervisorBg,
          color: colors.supervisor,
          border: `1px solid ${colors.supervisorBorder}`,
        }
      case 'text':
        return {
          backgroundColor: colors.textAgentBg,
          color: colors.textAgent,
          border: `1px solid ${colors.textAgentBorder}`,
        }
      case 'audio':
        return {
          backgroundColor: colors.audioAgentBg,
          color: colors.audioAgent,
          border: `1px solid ${colors.audioAgentBorder}`,
        }
      case 'image':
        return {
          backgroundColor: colors.imageAgentBg,
          color: colors.imageAgent,
          border: `1px solid ${colors.imageAgentBorder}`,
        }
      case 'video':
        return {
          backgroundColor: colors.videoAgentBg,
          color: colors.videoAgent,
          border: `1px solid ${colors.videoAgentBorder}`,
        }
      case 'primary':
      default:
        return {
          backgroundColor: colors.primary,
          color: colors.textWhite,
          border: '1px solid transparent',
        }
    }
  }

  // Size configurations from display constants
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          height: height.buttonSm,
          padding: '0 12px',
          fontSize: fontSize.caption,
        }
      case 'lg':
        return {
          height: height.buttonLg,
          padding: '0 24px',
          fontSize: fontSize.bodyLg,
        }
      case 'md':
      default:
        return {
          height: height.buttonMd,
          padding: '0 18px',
          fontSize: fontSize.bodySm,
        }
    }
  }

  const combinedStyles = {
    borderRadius: radius.md,
    transition: transitions.default,
    width: fullWidth ? '100%' : 'auto',
    ...getVariantStyles(),
    ...getSizeStyles(),
    ...style,
  }

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      style={combinedStyles}
      className={`inline-flex items-center justify-center gap-2 font-medium cursor-pointer select-none transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 hover:brightness-110 shadow-sm ${className}`}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : null}

      {!isLoading && Icon && iconPosition === 'left' && (
        <Icon className="w-4 h-4 shrink-0" />
      )}
      <span>{children}</span>
      {!isLoading && Icon && iconPosition === 'right' && (
        <Icon className="w-4 h-4 shrink-0" />
      )}
    </button>
  )
}

export default Button
