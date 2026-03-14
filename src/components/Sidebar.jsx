import { NavLink, Link } from 'react-router-dom'

const navItems = [
  { to: '/',           icon: '🏠', label: 'Dashboard' },
  { to: '/converter',  icon: '🌡️', label: 'Temp Converter',  badge: 'Utility' },
  { to: '/patterns',   icon: '🔷', label: 'Pattern Generator', badge: 'Visual' },
  { to: '/tasks',      icon: '✅', label: 'Task Manager',    badge: 'Productivity' },
  { to: '/crud',       icon: '🗂️', label: 'CRUD Dashboard',  badge: 'Data' },
  { to: '/game',       icon: '🏚️', label: 'Mystery Game',    badge: 'Game' },
  { to: '/data-fetch', icon: '🌐', label: 'Web Scraper',     badge: 'API' },
]

export default function Sidebar({ open, onClose }) {
  return (
    <aside className={`sidebar${open ? ' open' : ''}`}>
      <Link to="/" className="sidebar-brand" onClick={onClose}>
        <div className="sidebar-logo">C</div>
        <div className="sidebar-brand-text">
          <span className="sidebar-brand-main">Cognifyz</span>
          <span className="sidebar-brand-sub">Internship Projects</span>
        </div>
      </Link>

      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Navigation</div>
        {navItems.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
            onClick={onClose}
          >
            <span className="sidebar-link-icon">{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div style={{ fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>
          Mosin Ali
        </div>
        <div>Cognifyz Technologies · 2024</div>
      </div>
    </aside>
  )
}
