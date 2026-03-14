import ToolCard from '../components/ToolCard'

const stats = [
  { icon: '🛠️', label: 'Total Tools',     value: '6',    color: '#6366f1', bg: '#eef2ff' },
  { icon: '🐍', label: 'Python Projects', value: '6',    color: '#f59e0b', bg: '#fffbeb' },
  { icon: '⚛️', label: 'React Pages',     value: '7',    color: '#3b82f6', bg: '#eff6ff' },
  { icon: '🎓', label: 'Internship',       value: '2024', color: '#22c55e', bg: '#f0fdf4' },
]

const tools = [
  {
    icon: '🌡️', title: 'Temperature Converter',
    description: 'Convert between Celsius, Fahrenheit, and Kelvin with real-time results and a full conversion table.',
    to: '/converter', color: '#f59e0b', badge: 'Utility',
  },
  {
    icon: '🔷', title: 'Pattern Generator',
    description: 'Generate and visualise 6 ASCII patterns — triangles, diamonds, hollow squares and more.',
    to: '/patterns', color: '#6366f1', badge: 'Visual',
  },
  {
    icon: '✅', title: 'Task Manager',
    description: 'Add, complete, edit, and delete tasks. Persisted in your browser with filter support.',
    to: '/tasks', color: '#22c55e', badge: 'Productivity',
  },
  {
    icon: '🗂️', title: 'CRUD Dashboard',
    description: 'Create, update, and delete user records in a searchable management table.',
    to: '/crud', color: '#3b82f6', badge: 'Data',
  },
  {
    icon: '🏚️', title: 'Mystery Village Game',
    description: 'A decision-based text adventure. Solve riddles and puzzles to escape the forest.',
    to: '/game', color: '#ec4899', badge: 'Game',
  },
  {
    icon: '🌐', title: 'Web Scraper & API',
    description: 'Scrape any website for content, or fetch live data from public APIs instantly.',
    to: '/data-fetch', color: '#14b8a6', badge: 'API',
  },
]

export default function Home() {
  return (
    <div className="page">
      {/* Hero */}
      <div className="hero" style={{ paddingTop: '2rem' }}>
        <div className="hero-badge">🎓 Cognifyz Technologies Internship</div>
        <h1>
          All internship projects<br />
          <span>in one place</span>
        </h1>
        <p>
          Six Python CLI projects rebuilt as interactive web tools — showcasing
          real-world skills from CRUD to web scraping and game logic.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid-4" style={{ marginBottom: '2rem' }}>
        {stats.map(s => (
          <div className="stat-card" key={s.label}>
            <div className="stat-icon" style={{ background: s.bg, color: s.color }}>
              {s.icon}
            </div>
            <div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Section heading */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>Available Tools</h2>
          <p style={{ fontSize: '0.85rem' }}>Click any card to open the tool</p>
        </div>
        <span className="badge badge-primary">{tools.length} tools</span>
      </div>

      {/* Tool cards */}
      <div className="tools-grid">
        {tools.map(tool => (
          <ToolCard key={tool.to} {...tool} />
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: '3.5rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
        Cognifyz Technologies Internship · Built with React + Vite · Deployable on Vercel
      </div>
    </div>
  )
}
