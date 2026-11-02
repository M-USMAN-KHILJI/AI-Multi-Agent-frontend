import React from 'react'
import { colors, radius, fontSize, transitions } from '../Const/display'

/**
 * Reusable Auto-resizing Textarea Component
 */
export const Textarea = ({
  label,
  placeholder = '',
  value,
  onChange,
  rows = 3,
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

      <textarea
        rows={rows}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        style={{
          borderRadius: radius.md,
          backgroundColor: colors.bgDark,
          color: colors.textPrimary,
          border: `1px solid ${error ? colors.error : colors.borderGlass}`,
          padding: '12px 14px',
          fontSize: fontSize.bodySm,
          transition: transitions.default,
          resize: 'vertical',
          ...style,
        }}
        className="w-full outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-gray-500 leading-relaxed"
        {...props}
      />

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

export default Textarea
