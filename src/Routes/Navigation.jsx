import React, { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Navbar, Sidebar, Footer } from '../customComp'
import { HomePage } from '../Screen/Main/homepage'
import { colors } from '../Const/display'

/**
 * Main Application Routing & Layout Shell
 */
export const Navigation = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <BrowserRouter>
      <div
        style={{ backgroundColor: colors.bgMain }}
        className="flex min-h-screen w-full text-slate-100 overflow-x-hidden font-sans"
      >
        {/* Responsive Left Navigation Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex flex-col flex-1 min-w-0">
          {/* Top Navbar */}
          <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

          {/* Dynamic Page Viewport */}
          <main className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Bottom Footer */}
          <Footer />
        </div>
      </div>
    </BrowserRouter>
  )
}

export default Navigation
