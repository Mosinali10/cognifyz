import { useState } from 'react'
import { API_SOURCES, fetchFromSource } from '../utils/apiUtils'
import Button from '../components/Button'

// ── Web Scraper via allorigins proxy (bypasses CORS) ──────────────────────
async function scrapeUrl(url) {
  const proxy = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`
  const res = await fetch(proxy)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const json = await res.json()
  const html = json.contents

  // Parse with DOMParser
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')

  const title = doc.querySelector('title')?.textContent?.trim() || url

  // Extract headings + paragraphs
  const items = []
  doc.querySelectorAll('h1,h2,h3,p').forEach((el, i) => {
    const text = el.textContent.trim()
    if (text.length > 20) {
      items.push({
        id: i,
        tag: el.tagName.toLowerCase(),
        text,
      })
    }
  })

  return { title, items: items.slice(0, 40) }
}

const TAG_COLORS = {
  h1: { bg: 'rgba(99,102,241,0.12)', color: 'var(--accent)', label: 'H1' },
  h2: { bg: 'rgba(139,92,246,0.12)', color: '#a78bfa',       label: 'H2' },
  h3: { bg: 'rgba(20,184,166,0.12)', color: 'var(--success-dim, #2dd4bf)', label: 'H3' },
  p:  { bg: 'transparent',           color: 'var(--text-muted)', label: 'P' },
}

export default function DataFetcher() {
  // ── API Fetcher state ──
  const [activeSource, setActiveSource] = useState(API_SOURCES[0])
  const [apiData,    setApiData]    = useState([])
  const [apiLoading, setApiLoading] = useState(false)
  const [apiError,   setApiError]   = useState(null)
  const [apiFetched, setApiFetched] = useState(false)

  // ── Web Scraper state ──
  const [scrapeUrl_,  setScrapeUrl]  = useState('')
  const [scrapeData,  setScrapeData] = useState(null)
  const [scrapeLoading, setScrapeLoading] = useState(false)
  const [scrapeError,   setScrapeError]   = useState(null)

  // ── Tab ──
  const [tab, setTab] = useState('api') // 'api' | 'scraper'

  const handleApiFetch = async () => {
    setApiLoading(true); setApiError(null); setApiData([])
    try {
      setApiData(await fetchFromSource(activeSource))
      setApiFetched(true)
    } catch (err) {
      setApiError(err.message || 'Failed to fetch.')
    } finally {
      setApiLoading(false)
    }
  }

  const handleSourceChange = (src) => {
    setActiveSource(src); setApiData([]); setApiFetched(false); setApiError(null)
  }

  const handleScrape = async () => {
    if (!scrapeUrl_.trim()) return
    setScrapeLoading(true); setScrapeError(null); setScrapeData(null)
    try {
      const result = await scrapeUrl(scrapeUrl_.trim())
      setScrapeData(result)
    } catch (err) {
      setScrapeError('Could not scrape that URL. The site may block external requests.')
    } finally {
      setScrapeLoading(false)
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>🌐 Web Scraping & Data Fetcher</h1>
        <p>Scrape any website for content, or fetch structured data from public APIs.</p>
      </div>

      {/* Main tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0' }}>
        {[
          { id: 'scraper', label: '🕷️ Web Scraper', desc: 'Enter any URL' },
          { id: 'api',     label: '⚡ API Fetcher',  desc: 'Public APIs' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: '0.6rem 1.25rem',
              background: 'none',
              border: 'none',
              borderBottom: tab === t.id ? '2px solid var(--accent)' : '2px solid transparent',
              color: tab === t.id ? 'var(--text)' : 'var(--text-muted)',
              fontWeight: tab === t.id ? 700 : 500,
              fontSize: '0.95rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              marginBottom: '-1px',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Web Scraper Tab ── */}
      {tab === 'scraper' && (
        <div>
          <div className="card" style={{ maxWidth: 680, marginBottom: '1.5rem' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>🕷️ Scrape Any Website</h3>
            <p style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>
              Enter a public URL and extract all headings and paragraph content from the page.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <input
                className="input"
                style={{ flex: 1, minWidth: 200 }}
                placeholder="https://example.com"
                value={scrapeUrl_}
                onChange={e => setScrapeUrl(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleScrape()}
              />
              <Button onClick={handleScrape} disabled={scrapeLoading || !scrapeUrl_.trim()}>
                {scrapeLoading ? '⏳ Scraping...' : '🕷️ Scrape'}
              </Button>
            </div>

            {/* Quick example URLs */}
            <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Try:</span>
              {['https://example.com', 'https://quotes.toscrape.com', 'https://books.toscrape.com'].map(u => (
                <button
                  key={u}
                  onClick={() => setScrapeUrl(u)}
                  style={{ fontSize: '0.75rem', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 4, padding: '0.2rem 0.5rem', color: 'var(--accent)', cursor: 'pointer' }}
                >
                  {u.replace('https://', '')}
                </button>
              ))}
            </div>
          </div>

          {scrapeLoading && <div className="spinner" />}

          {scrapeError && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '1rem', color: 'var(--danger)', marginBottom: '1rem' }}>
              ❌ {scrapeError}
            </div>
          )}

          {scrapeData && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <h3>📄 {scrapeData.title}</h3>
                <span className="badge badge-success">{scrapeData.items.length} elements</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {scrapeData.items.map((item) => {
                  const style = TAG_COLORS[item.tag] || TAG_COLORS.p
                  return (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        gap: '0.75rem',
                        alignItems: 'flex-start',
                        background: style.bg || 'var(--bg-input)',
                        border: '1px solid var(--border)',
                        borderRadius: 8,
                        padding: '0.65rem 1rem',
                      }}
                    >
                      <span style={{
                        fontSize: '0.7rem', fontWeight: 700, color: style.color,
                        background: style.bg, border: `1px solid ${style.color}33`,
                        borderRadius: 4, padding: '0.1rem 0.4rem', flexShrink: 0, marginTop: '0.1rem',
                        fontFamily: 'monospace',
                      }}>
                        {style.label}
                      </span>
                      <span style={{ fontSize: '0.9rem', color: item.tag === 'p' ? 'var(--text-dim)' : 'var(--text)', lineHeight: 1.5 }}>
                        {item.text}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {!scrapeLoading && !scrapeData && !scrapeError && (
            <div className="empty-state">
              <div className="icon">🕷️</div>
              <p>Enter a URL above and click Scrape to extract page content.</p>
            </div>
          )}
        </div>
      )}

      {/* ── API Fetcher Tab ── */}
      {tab === 'api' && (
        <div>
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

          <div className="card mb-2" style={{ maxWidth: 560 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <h3>{activeSource.label}</h3>
                <p style={{ fontSize: '0.82rem', marginTop: '0.25rem', wordBreak: 'break-all' }}>
                  <code>{activeSource.url}</code>
                </p>
              </div>
              <Button onClick={handleApiFetch} disabled={apiLoading}>
                {apiLoading ? '⏳ Fetching...' : '⚡ Fetch Data'}
              </Button>
            </div>
          </div>

          {apiLoading && <div className="spinner" />}

          {apiError && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '1rem', color: 'var(--danger)', marginBottom: '1rem' }}>
              ❌ {apiError}
            </div>
          )}

          {!apiLoading && !apiFetched && !apiError && (
            <div className="empty-state">
              <div className="icon">📡</div>
              <p>Select a source and click "Fetch Data" to load results.</p>
            </div>
          )}

          {apiData.length > 0 && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <h3>Results</h3>
                <span className="badge badge-success">{apiData.length} items</span>
              </div>
              <div className="grid-3">
                {apiData.map(item => (
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
      )}
    </div>
  )
}
