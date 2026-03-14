import ToolCard from '../components/ToolCard'

const tools = [
  {
    icon: '🌡️',
    title: 'Temperature Converter',
    description: 'Convert between Celsius, Fahrenheit, and Kelvin instantly with real-time results.',
    to: '/converter',
    color: '#f59e0b',
    badge: 'Utility',
  },
  {
    icon: '🔷',
    title: 'Pattern Generator',
    description: 'Generate and visualise ASCII patterns — triangles, diamonds, hollow squares and more.',
    to: '/patterns',
    color: '#6366f1',
    badge: 'Visual',
  },
  {
    icon: '✅',
    title: 'Task Manager',
    description: 'Add, complete, and delete tasks. Persisted in your browser — no account needed.',
    to: '/tasks',
    color: '#22c55e',
    badge: 'Productivity',
  },
  {
    icon: '🗂️',
    title: 'CRUD Dashboard',
    description: 'Create, update, and delete user records in a clean management table.',
    to: '/crud',
    color: '#3b82f6',
    badge: 'Data',
  },
  {
    icon: '🏚️',
    title: 'Mystery Village Game',
    description: 'A decision-based text adventure. Solve riddles and puzzles to escape the forest.',
    to: '/game',
    color: '#ec4899',
    badge: 'Game',
  },
  {
    icon: '🌐',
    title: 'Live Data Fetcher',
    description: 'Fetch live data from public APIs and explore structured results in real time.',
    to: '/data-fetch',
    color: '#14b8a6',
    badge: 'API',
  },
]

export default function Home() {
  return (
    <div className="page">
      <div className="hero">
        <div className="hero-badge">✦ Developer Utility Hub</div>
        <h1>
          Your all-in-one<br />
          <span>developer toolkit</span>
        </h1>
        <p>
          Six interactive tools built with React — from data management to live API
          exploration, all in one clean dashboard.
        </p>
      </div>

      <div className="tools-grid">
        {tools.map(tool => (
          <ToolCard key={tool.to} {...tool} />
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        Built with React + Vite · Deployable on Vercel
      </div>
    </div>
  )
}
