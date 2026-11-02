import React from 'react'
import { colors, height, fontSize } from '../Const/display'
import { FiCheckCircle, FiGitBranch, FiCpu } from 'react-icons/fi'

/**
 * Footer Component
 */
export const Footer = () => {
  return (
    <footer
      style={{
        height: height.footer,
        backgroundColor: colors.bgDark,
        borderTop: `1px solid ${colors.borderGlass}`,
        color: colors.textMuted,
        fontSize: fontSize.caption,
      }}
      className="w-full px-6 flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0 select-none"
    >
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
          <FiCheckCircle className="w-3.5 h-3.5" />
          5/5 Agents Ready
        </span>
        <span className="hidden sm:inline text-gray-700">|</span>
        <span className="hidden sm:inline flex items-center gap-1">
          <FiGitBranch className="w-3.5 h-3.5" />
          Supervisor Graph v1.0
        </span>
      </div>

      <div className="flex items-center gap-3">
        <span>LangChain + LangGraph</span>
        <span className="text-gray-700">•</span>
        <span>FastAPI</span>
        <span className="text-gray-700">•</span>
        <span>React 19</span>
      </div>
    </footer>
  )
}

export default Footer
