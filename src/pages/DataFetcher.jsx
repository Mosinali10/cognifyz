import { useState } from 'react'
import { API_SOURCES, fetchFromSource } from '../utils/apiUtils'
import Button from '../components/Button'

export default function DataFetcher() {
  const [activeSource, setActiveSource] = useState(API_SOURCES[0])
  const [data,    setData]    = useState([])
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)
  const [fetched, setFetched] = useState(false)

  const handleFetch = async () => {
    setLoading(true)
    setError(null)
    setData([])
    try {
      const results = await fetchFromSource(activeSource)
      setData(results)
      setFetched(true)
    } catch (err) {
      setError(err.message || 'Failed to fetch data.')
    } finally {
      setLoading(false)
    }
  }

  const handleSourceChange = (source) => {
    setActiveSource(source)
    setData([])
    setFetched(false)
    setError(null)
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>🌐 Live Data Fetcher</h1>
        <p>Fetch real data from public APIs and explore structured results instantly.</p>
      </div>

      {/* Source tabs */}
      <div className="api-tabs">
        {API_SOURCES.map(src => (
          <button
            key={src.id}
            className={`api-tab${activeSource.id === src.id ? ' active' : ''}`}
            onClick={() => handleSourceChange(src)}
          >
            {src.label}
          </button>
        ))}
      </div>

      {/* Fetch button + info */}
      <div className="card mb-2" style={{ maxWidth: 560 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h3>{activeSource.label}</h3>
            <p style={{ fontSize: '0.82rem', marginTop: '0.25rem', wordBreak: 'break-all' }}>
              <code>{activeSource.url}</code>
            </p>
          </div>
          <Button onClick={handleFetch} disabled={loading}>
            {loading ? '⏳ Fetching...' : '⚡ Fetch Data'}
          </Button>
        </div>
      </div>

      {/* Loading */}
      {loading && <div className="spinner" />}

      {/* Error */}
      {error && (
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '1rem', color: 'var(--danger)', marginBottom: '1rem' }}>
          ❌ {error}
        </div>
      )}

      {/* Empty state before first fetch */}
      {!loading && !fetched && !error && (
        <div className="empty-state">
          <div className="icon">📡</div>
          <p>Select a source and click "Fetch Data" to load results.</p>
        </div>
      )}

      {/* Results */}
      {data.length > 0 && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <h3>Results</h3>
            <span className="badge badge-success">{data.length} items</span>
          </div>
          <div className="grid-3">
            {data.map(item => (
              <div key={item.id} className="api-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <h4>{item.title}</h4>
                  {item.tag && <span className="badge badge-accent" style={{ flexShrink: 0 }}>{item.tag}</span>}
                </div>
                <p>{item.body}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
