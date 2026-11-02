import React, { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Navbar, Sidebar, Footer } from '../customComp'
import { HomePage } from '../Screen/Main/homepage'
import { ChatScreen } from '../Screen/Main/ChatScreen'
import { colors } from '../Const/display'

/**
 * Inner Application Layout Shell
 * - Removes Navbar completely on chat page
 * - Fixes input field permanently by isolating scroll to chat messages
 * - Renders footer only at the end of the home page
 */
const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const isChatRoute = location.pathname.startsWith('/chat')

  return (
    <div
      style={{
        background: `
          radial-gradient(ellipse 80% 50% at 50% -10%, rgba(99, 102, 241, 0.18), transparent 70%),
          radial-gradient(ellipse 60% 40% at 85% 60%, rgba(168, 85, 247, 0.12), transparent 70%),
          radial-gradient(ellipse 50% 50% at 10% 40%, rgba(16, 185, 129, 0.08), transparent 60%),
          linear-gradient(180deg, #0b0f19 0%, #0d121f 50%, #080b12 100%)
        `,
      }}
      className="flex h-screen w-full text-slate-100 overflow-hidden font-sans"
    >
      {/* Responsive Fixed Left Navigation Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 h-screen min-w-0 overflow-hidden">
        {/* Top Navbar - Removed completely on chat page */}
        {!isChatRoute && <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />}

        {/* Dynamic Page Viewport:
            - On Home page: overflow-y-auto so the whole page scrolls smoothly down to the footer at the very end
            - On Chat page: overflow-hidden so the text input field stays completely fixed at bottom */}
        <main
          className={`flex-1 ${
            isChatRoute ? 'overflow-hidden flex flex-col justify-between' : 'overflow-y-auto overflow-x-hidden flex flex-col'
          }`}
        >
          <div className={`${isChatRoute ? 'flex-1 min-h-0 flex flex-col' : 'w-full shrink-0'}`}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/chat/:chatId" element={<ChatScreen />} />
              <Route path="/chat" element={<ChatScreen />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>

          {/* Footer is placed at the end of the home screen content and will only be seen after scrolling to the bottom */}
          {!isChatRoute && <Footer />}
        </main>
      </div>
    </div>
  )
}

/**
 * Main Navigation Entry Point
 */
export const Navigation = () => {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  )
}

export default Navigation
