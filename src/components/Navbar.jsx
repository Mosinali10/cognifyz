import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'

const links = [
  { to: '/',           label: 'Home' },
  { to: '/converter',  label: 'Converter' },
  { to: '/patterns',   label: 'Patterns' },
  { to: '/tasks',      label: 'Tasks' },
  { to: '/crud',       label: 'CRUD' },
  { to: '/game',       label: 'Game' },
  { to: '/data-fetch', label: 'Data' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <div className="logo">&lt;/&gt;</div>
        Dev Utility Hub
      </Link>

      <button className="navbar-menu-btn" onClick={() => setOpen(o => !o)} aria-label="Toggle menu">
        {open ? '✕' : '☰'}
      </button>

      <ul className={`navbar-links${open ? ' open' : ''}`} onClick={() => setOpen(false)}>
        {links.map(({ to, label }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={to === '/'}
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
