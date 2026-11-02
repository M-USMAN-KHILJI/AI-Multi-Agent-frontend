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
      style={{ backgroundColor: colors.bgMain }}
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
            - On Home page: overflow-y-auto so page scrolls down to footer
            - On Chat page: overflow-hidden so the text input field stays completely fixed at bottom */}
        <main
          className={`flex-1 flex flex-col justify-between ${
            isChatRoute ? 'overflow-hidden' : 'overflow-y-auto overflow-x-hidden'
          }`}
        >
          <div className="flex-1 min-h-0 flex flex-col">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/chat/:chatId" element={<ChatScreen />} />
              <Route path="/chat" element={<ChatScreen />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>

          {/* Footer is placed at the end of the scrollable page and removed entirely in chat */}
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
