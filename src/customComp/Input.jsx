import React from 'react'
import { colors, radius, height, fontSize, transitions } from '../Const/display'

/**
 * Reusable Input Field Component
 */
export const Input = ({
  label,
  placeholder = '',
  value,
  onChange,
  type = 'text',
  icon: Icon,
  error,
  helperText,
  disabled = false,
  fullWidth = true,
  className = '',
  style = {},
  ...props
}) => {
  return (
    <div
      style={{ width: fullWidth ? '100%' : 'auto' }}
      className={`flex flex-col gap-1.5 ${className}`}
    >
      {label && (
        <label
          style={{
            color: colors.textSecondary,
            fontSize: fontSize.bodySm,
          }}
          className="font-medium text-left select-none"
        >
          {label}
        </label>
      )}

      <div className="relative flex items-center w-full">
        {Icon && (
          <div
            style={{ color: colors.textMuted }}
            className="absolute left-3.5 pointer-events-none flex items-center justify-center"
          >
            <Icon className="w-4 h-4" />
          </div>
        )}

        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          style={{
            height: height.inputMd,
            borderRadius: radius.md,
            backgroundColor: colors.bgDark,
            color: colors.textPrimary,
            border: `1px solid ${error ? colors.error : colors.borderGlass}`,
            paddingLeft: Icon ? '40px' : '14px',
            paddingRight: '14px',
            fontSize: fontSize.bodySm,
            transition: transitions.default,
            ...style,
          }}
          className="w-full outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-gray-500"
          {...props}
        />
      </div>

      {error ? (
        <span
          style={{ color: colors.error, fontSize: fontSize.caption }}
          className="text-left mt-0.5"
        >
          {error}
        </span>
      ) : helperText ? (
        <span
          style={{ color: colors.textMuted, fontSize: fontSize.caption }}
          className="text-left mt-0.5"
        >
          {helperText}
        </span>
      ) : null}
    </div>
  )
}

export default Input
