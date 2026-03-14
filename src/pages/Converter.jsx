import { useState } from 'react'
import { convert, convertAll, UNITS, SYMBOLS } from '../utils/converter'
import InputField from '../components/InputField'

export default function Converter() {
  const [value, setValue] = useState('')
  const [from, setFrom]   = useState('Celsius')

  const num     = parseFloat(value)
  const isValid = value !== '' && !isNaN(num)
  const results = isValid ? convertAll(num, from) : []

  // The primary "to" unit for the big display (first unit that isn't `from`)
  const primaryTo = UNITS.find(u => u !== from)
  const primaryResult = isValid ? convert(num, from, primaryTo) : null

  return (
    <div className="page">
      <div className="page-header">
        <h1>🌡️ Temperature Converter</h1>
        <p>Convert between Celsius, Fahrenheit, and Kelvin instantly.</p>
      </div>

      <div className="card" style={{ maxWidth: 560 }}>
        <div className="converter-grid">
          {/* Input */}
          <InputField
            label="Temperature"
            type="number"
            placeholder="e.g. 100"
            value={value}
            onChange={e => setValue(e.target.value)}
          />

          {/* Swap arrow */}
          <div className="converter-swap">
            <span style={{ fontSize: '1.5rem', color: 'var(--text-muted)' }}>⇄</span>
          </div>

          {/* Unit selector */}
          <InputField
            label="From unit"
            as="select"
            value={from}
            onChange={e => setFrom(e.target.value)}
          >
            {UNITS.map(u => <option key={u} value={u}>{u} ({SYMBOLS[u]})</option>)}
          </InputField>
        </div>

        {/* Big result */}
        {isValid && primaryResult !== null && (
          <div className="big-result mt-3">
            <div className="value">{primaryResult.toFixed(2)}</div>
            <div className="unit">{SYMBOLS[primaryTo]} · {primaryTo}</div>
          </div>
        )}

        {!isValid && value !== '' && (
          <p className="error-msg mt-2">Please enter a valid number.</p>
        )}
      </div>

      {/* All conversions table */}
      {isValid && (
        <div className="card mt-3" style={{ maxWidth: 560 }}>
          <h3 style={{ marginBottom: '1rem' }}>All Conversions</h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Unit</th>
                  <th>Symbol</th>
                  <th>Result</th>
                </tr>
              </thead>
              <tbody>
                {results.map(({ unit, symbol, value: v }) => (
                  <tr key={unit}>
                    <td>{unit}</td>
                    <td><code>{symbol}</code></td>
                    <td style={{ fontWeight: unit === from ? 400 : 700, color: unit === from ? 'var(--text-muted)' : 'var(--accent)' }}>
                      {v.toFixed(4)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
