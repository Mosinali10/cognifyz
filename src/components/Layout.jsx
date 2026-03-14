import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'

const PAGE_TITLES = {
  '/':           'Dashboard',
  '/converter':  'Temperature Converter',
  '/patterns':   'Pattern Generator',
  '/tasks':      'Task Manager',
  '/crud':       'CRUD Dashboard',
  '/game':       'Mystery Village Game',
  '/data-fetch': 'Web Scraping & Data Fetcher',
}

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const title = PAGE_TITLES[location.pathname] || 'Cognifyz'

  return (
    <div className="app-shell">
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="main-content">
        {/* Top bar */}
        <header className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              className="topbar-menu-btn"
              onClick={() => setSidebarOpen(o => !o)}
              aria-label="Toggle sidebar"
            >
              ☰
            </button>
            <span className="topbar-title">{title}</span>
          </div>
          <div className="topbar-right">
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Cognifyz Internship</span>
            <div className="topbar-avatar">M</div>
          </div>
        </header>

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
