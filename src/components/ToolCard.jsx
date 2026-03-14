import { Link } from 'react-router-dom'

/**
 * @param {{ icon: string, title: string, description: string, to: string, color: string, badge?: string }} props
 */
export default function ToolCard({ icon, title, description, to, color, badge }) {
  return (
    <Link to={to} className="tool-card">
      <div className="tool-card-icon" style={{ background: color + '22', color }}>
        {icon}
      </div>
      <div>
        <h3>{title}</h3>
        {badge && <span className="badge badge-accent" style={{ marginTop: '0.25rem', display: 'inline-block' }}>{badge}</span>}
      </div>
      <p>{description}</p>
      <div className="tool-card-footer">
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Open tool</span>
        <span className="tool-card-arrow">→</span>
      </div>
    </Link>
  )
}
