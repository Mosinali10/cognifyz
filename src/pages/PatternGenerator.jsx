import { useState } from 'react'
import { PATTERN_TYPES, generatePattern } from '../utils/patternUtils'
import InputField from '../components/InputField'

export default function PatternGenerator() {
  const [type, setType] = useState('triangle')
  const [size, setSize] = useState(6)

  const grid = generatePattern(type, size)

  return (
    <div className="page">
      <div className="page-header">
        <h1>🔷 Pattern Generator</h1>
        <p>Select a pattern type and size to generate a live visual preview.</p>
      </div>

      <div className="grid-2" style={{ maxWidth: 700 }}>
        <div className="card">
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

            <InputField
              label={`Size: ${size}`}
              type="range"
              min={2}
              max={16}
              value={size}
              onChange={e => setSize(Number(e.target.value))}
              style={{ accentColor: 'var(--accent)', cursor: 'pointer' }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '-0.75rem' }}>
              <span>2</span><span>16</span>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {PATTERN_TYPES.map(p => (
                <button
                  key={p.id}
                  className={`filter-tab${type === p.id ? ' active' : ''}`}
                  onClick={() => setType(p.id)}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <div style={{ marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Preview</h3>
            <span className="badge badge-accent">{size} × {size}</span>
          </div>
          <div className="pattern-display">
            <div>
              {grid.map((row, ri) => (
                <div key={ri} className="pattern-row">
                  {row.map((filled, ci) => (
                    <span key={ci} className={`pattern-cell ${filled ? 'filled' : 'empty'}`}>
                      {filled ? '█' : '·'}
                    </span>
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
