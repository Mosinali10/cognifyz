import { Link } from 'react-router-dom'

export default function ToolCard({ icon, title, description, to, color, badge }) {
  return (
    <Link to={to} className="tool-card">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div className="tool-card-icon" style={{ background: color + '18', color }}>
          {icon}
        </div>
        {badge && (
          <span className="badge badge-gray">{badge}</span>
        )}
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      <div className="tool-card-footer">
        <span className="tool-card-cta">Open tool</span>
        <span className="tool-card-arrow">→</span>
      </div>
    </Link>
  )
}
