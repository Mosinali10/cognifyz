import { useState } from 'react'
import { PATTERN_TYPES, generatePattern } from '../utils/patternUtils'
import InputField from '../components/InputField'

export default function PatternGenerator() {
  const [type, setType] = useState('triangle')
  const [size, setSize] = useState(6)

  const grid = generatePattern(type, size)

  // Compute max cols in the grid to scale cell size
  const maxCols = grid.length > 0 ? Math.max(...grid.map(r => r.length)) : size

  // Cell size scales down as pattern grows so it always fits
  const cellPx = Math.max(10, Math.min(28, Math.floor(380 / maxCols)))

  return (
    <div className="page" style={{ maxWidth: 1100 }}>
      <div className="page-header">
        <h1>🔷 Pattern Generator</h1>
        <p>Select a pattern type and size to generate a live visual preview.</p>
      </div>

      {/* Full-width two-column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1.5rem', alignItems: 'start' }}>

        {/* Controls */}
        <div className="card" style={{ position: 'sticky', top: '80px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <InputField
              label="Pattern Type"
              as="select"
              value={type}
              onChange={e => setType(e.target.value)}
            >
              {PATTERN_TYPES.map(p => (
                <option key={p.id} value={p.id}>{p.label}</option>
              ))}
            </InputField>

            <div className="field">
              <label>Size: {size}</label>
              <input
                type="range"
                min={2}
                max={20}
                value={size}
                onChange={e => setSize(Number(e.target.value))}
                style={{ accentColor: 'var(--accent)', cursor: 'pointer', width: '100%' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                <span>2</span><span>20</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {PATTERN_TYPES.map(p => (
                <button
                  key={p.id}
                  className={`filter-tab${type === p.id ? ' active' : ''}`}
                  onClick={() => setType(p.id)}
                  style={{ fontSize: '0.75rem' }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Preview — takes all remaining space */}
        <div className="card" style={{ minHeight: 400 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3>Preview</h3>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span className="badge badge-accent">{size} × {size}</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>cell: {cellPx}px</span>
            </div>
          </div>

          <div style={{
            background: 'var(--bg-input)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            padding: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 320,
            overflow: 'auto',
          }}>
            <div>
              {grid.map((row, ri) => (
                <div key={ri} style={{ display: 'flex', justifyContent: 'center' }}>
                  {row.map((filled, ci) => (
                    <div
                      key={ci}
                      style={{
                        width: cellPx,
                        height: cellPx,
                        borderRadius: Math.max(2, cellPx * 0.15),
                        margin: Math.max(1, cellPx * 0.06),
                        background: filled
                          ? 'linear-gradient(135deg, var(--accent), var(--accent-2))'
                          : 'transparent',
                        boxShadow: filled ? `0 0 ${cellPx * 0.5}px rgba(99,102,241,0.3)` : 'none',
                        transition: 'all 0.15s ease',
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
