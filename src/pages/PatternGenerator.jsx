import { useState, useEffect, useRef, useCallback } from 'react'
import {
  PATTERN_CATEGORIES, getPatternMeta,
  generatePattern, generateMaze, randomLifeGrid, stepLife,
} from '../utils/patternUtils'

// ── Color palettes ────────────────────────────────────────────────────────
const PALETTES = [
  { id: 'indigo',   label: 'Indigo',   a: '#6366f1', b: '#8b5cf6' },
  { id: 'teal',     label: 'Teal',     a: '#14b8a6', b: '#06b6d4' },
  { id: 'rose',     label: 'Rose',     a: '#f43f5e', b: '#ec4899' },
  { id: 'amber',    label: 'Amber',    a: '#f59e0b', b: '#f97316' },
  { id: 'emerald',  label: 'Emerald',  a: '#22c55e', b: '#10b981' },
  { id: 'mono',     label: 'Mono',     a: '#1e293b', b: '#64748b' },
]

// ── Canvas: Sierpinski Triangle ───────────────────────────────────────────
function drawSierpinski(ctx, x1, y1, x2, y2, x3, y3, depth, color) {
  if (depth === 0) {
    ctx.beginPath()
    ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.lineTo(x3, y3)
    ctx.closePath(); ctx.fill()
    return
  }
  const mx1 = (x1+x2)/2, my1 = (y1+y2)/2
  const mx2 = (x2+x3)/2, my2 = (y2+y3)/2
  const mx3 = (x1+x3)/2, my3 = (y1+y3)/2
  drawSierpinski(ctx, x1, y1, mx1, my1, mx3, my3, depth-1, color)
  drawSierpinski(ctx, mx1, my1, x2, y2, mx2, my2, depth-1, color)
  drawSierpinski(ctx, mx3, my3, mx2, my2, x3, y3, depth-1, color)
}

// ── Canvas: Koch Snowflake ────────────────────────────────────────────────
function kochPoints(x1, y1, x2, y2, depth) {
  if (depth === 0) return [[x1,y1],[x2,y2]]
  const dx = x2-x1, dy = y2-y1
  const ax = x1+dx/3, ay = y1+dy/3
  const bx = x1+2*dx/3, by = y1+2*dy/3
  const angle = Math.atan2(dy, dx) - Math.PI/3
  const len = Math.sqrt(dx*dx+dy*dy)/3
  const px = ax + Math.cos(angle)*len, py = ay + Math.sin(angle)*len
  return [
    ...kochPoints(x1,y1,ax,ay,depth-1).slice(0,-1),
    ...kochPoints(ax,ay,px,py,depth-1).slice(0,-1),
    ...kochPoints(px,py,bx,by,depth-1).slice(0,-1),
    ...kochPoints(bx,by,x2,y2,depth-1),
  ]
}

// ── Canvas: Fractal Tree ──────────────────────────────────────────────────
function drawTree(ctx, x, y, angle, length, depth, colorA, colorB) {
  if (depth === 0 || length < 2) return
  const t = depth / 10
  ctx.strokeStyle = lerpColor(colorB, colorA, t)
  ctx.lineWidth = Math.max(1, depth * 0.8)
  ctx.beginPath()
  ctx.moveTo(x, y)
  const ex = x + Math.cos(angle) * length
  const ey = y + Math.sin(angle) * length
  ctx.lineTo(ex, ey)
  ctx.stroke()
  drawTree(ctx, ex, ey, angle - 0.4, length * 0.72, depth-1, colorA, colorB)
  drawTree(ctx, ex, ey, angle + 0.4, length * 0.72, depth-1, colorA, colorB)
}

function lerpColor(a, b, t) {
  const ah = a.replace('#',''), bh = b.replace('#','')
  const ar = parseInt(ah.slice(0,2),16), ag = parseInt(ah.slice(2,4),16), ab = parseInt(ah.slice(4,6),16)
  const br = parseInt(bh.slice(0,2),16), bg = parseInt(bh.slice(2,4),16), bb = parseInt(bh.slice(4,6),16)
  const r = Math.round(ar+(br-ar)*t), g = Math.round(ag+(bg-ag)*t), bv = Math.round(ab+(bb-ab)*t)
  return `rgb(${r},${g},${bv})`
}

// ── Canvas Renderer ───────────────────────────────────────────────────────
function CanvasPattern({ type, depth, palette, size }) {
  const canvasRef = useRef(null)
  const pal = PALETTES.find(p => p.id === palette) || PALETTES[0]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const W = canvas.width, H = canvas.height
    ctx.clearRect(0, 0, W, H)

    if (type === 'sierpinski') {
      const grad = ctx.createLinearGradient(0, 0, W, H)
      grad.addColorStop(0, pal.a); grad.addColorStop(1, pal.b)
      ctx.fillStyle = grad
      const pad = 20
      drawSierpinski(ctx, W/2, pad, pad, H-pad, W-pad, H-pad, Math.min(depth, 7), pal.a)
    }

    if (type === 'koch') {
      const pad = 40, cx = W/2, cy = H/2 - 20
      const r = Math.min(W, H)/2 - pad
      const pts = [
        [cx, cy - r],
        [cx + r*Math.sin(2*Math.PI/3), cy - r*Math.cos(2*Math.PI/3)],
        [cx + r*Math.sin(4*Math.PI/3), cy - r*Math.cos(4*Math.PI/3)],
      ]
      ctx.strokeStyle = pal.a; ctx.lineWidth = 1.5
      for (let i = 0; i < 3; i++) {
        const [x1,y1] = pts[i], [x2,y2] = pts[(i+1)%3]
        const points = kochPoints(x1,y1,x2,y2, Math.min(depth,5))
        ctx.beginPath()
        ctx.moveTo(points[0][0], points[0][1])
        for (const [px,py] of points.slice(1)) ctx.lineTo(px, py)
        ctx.stroke()
      }
    }

    if (type === 'tree') {
      ctx.clearRect(0, 0, W, H)
      drawTree(ctx, W/2, H-20, -Math.PI/2, H*0.28, Math.min(depth+4, 12), pal.a, pal.b)
    }
  }, [type, depth, palette, size])

  return (
    <canvas
      ref={canvasRef}
      width={560} height={420}
      style={{ width: '100%', height: 'auto', borderRadius: 8, display: 'block' }}
    />
  )
}

// ── Grid Renderer ─────────────────────────────────────────────────────────
function GridPattern({ grid, palette, animated, visibleCount }) {
  const pal = PALETTES.find(p => p.id === palette) || PALETTES[0]
  if (!grid || grid.length === 0) return null

  const maxCols = Math.max(...grid.map(r => r.length))
  const totalRows = grid.length
  // cell + gap must fit within ~460px in both dimensions
  const cellPx = Math.max(4, Math.min(20, Math.floor(460 / (Math.max(maxCols, totalRows) * 1.15))))
  const gap = Math.max(1, Math.round(cellPx * 0.12))

  let cellIdx = 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
      {grid.map((row, ri) => (
        <div key={ri} style={{ display: 'flex', justifyContent: 'center' }}>
          {row.map((filled, ci) => {
            const idx = cellIdx++
            const show = !animated || idx < visibleCount
            return (
              <div
                key={ci}
                style={{
                  width: cellPx,
                  height: cellPx,
                  margin: gap,
                  borderRadius: Math.max(2, cellPx * 0.2),
                  background: filled
                    ? `linear-gradient(135deg, ${pal.a}, ${pal.b})`
                    : 'transparent',
                  boxShadow: filled && show ? `0 0 ${cellPx * 0.5}px ${pal.a}44` : 'none',
                  opacity: filled ? (show ? 1 : 0) : 0,
                  transition: animated ? 'opacity 0.15s ease' : 'none',
                }}
              />
            )
          })}
        </div>
      ))}
    </div>
  )
}

// ── Maze Renderer ─────────────────────────────────────────────────────────
function MazePattern({ grid, palette }) {
  const pal = PALETTES.find(p => p.id === palette) || PALETTES[0]
  if (!grid || grid.length === 0) return null
  const cols = grid[0].length
  const cellPx = Math.max(4, Math.min(16, Math.floor(480 / cols)))
  return (
    <div style={{ display: 'inline-block', lineHeight: 0, borderRadius: 6, overflow: 'hidden' }}>
      {grid.map((row, ri) => (
        <div key={ri} style={{ display: 'flex' }}>
          {row.map((wall, ci) => (
            <div key={ci} style={{
              width: cellPx, height: cellPx,
              background: wall ? pal.a : '#ffffff',
            }} />
          ))}
        </div>
      ))}
    </div>
  )
}

// ── Life Renderer ─────────────────────────────────────────────────────────
function LifePattern({ grid, palette }) {
  const pal = PALETTES.find(p => p.id === palette) || PALETTES[0]
  if (!grid || grid.length === 0) return null
  const size = grid.length
  const cellPx = Math.max(6, Math.min(18, Math.floor(500 / size)))
  return (
    <div style={{ display: 'inline-block', lineHeight: 0 }}>
      {grid.map((row, ri) => (
        <div key={ri} style={{ display: 'flex' }}>
          {row.map((alive, ci) => (
            <div key={ci} style={{
              width: cellPx, height: cellPx,
              margin: 1,
              borderRadius: 2,
              background: alive ? `linear-gradient(135deg,${pal.a},${pal.b})` : 'transparent',
              transition: 'background 0.08s',
            }} />
          ))}
        </div>
      ))}
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────
export default function PatternGenerator() {
  const [type,     setType]     = useState('triangle')
  const [size,     setSize]     = useState(8)
  const [depth,    setDepth]    = useState(4)
  const [palette,  setPalette]  = useState('indigo')
  const [animated, setAnimated] = useState(true)
  const [speed,    setSpeed]    = useState(3)   // 1-5
  const [visibleCount, setVisibleCount] = useState(0)
  const [lifeGrid, setLifeGrid] = useState(() => randomLifeGrid(20))
  const [lifeRunning, setLifeRunning] = useState(false)
  const [lifeGen,  setLifeGen]  = useState(0)
  const [mazeGrid, setMazeGrid] = useState(() => generateMaze(10))

  const meta = getPatternMeta(type)
  const isCanvas   = meta.renderer === 'canvas'
  const isMaze     = meta.renderer === 'grid-maze'
  const isLife     = meta.renderer === 'life'
  const isGrid     = meta.renderer === 'grid'

  const grid = isGrid ? generatePattern(type, size) : null
  const totalCells = grid ? grid.flat().filter(Boolean).length : 0

  // ── Animation: reveal cells progressively ──
  useEffect(() => {
    if (!isGrid || !animated) { setVisibleCount(Infinity); return }
    setVisibleCount(0)
    if (totalCells === 0) return
    const msPerCell = Math.max(8, 80 - speed * 14)
    let count = 0
    const id = setInterval(() => {
      count += Math.max(1, Math.floor(speed * 1.5))
      setVisibleCount(count)
      if (count >= totalCells) clearInterval(id)
    }, msPerCell)
    return () => clearInterval(id)
  }, [type, size, animated, speed])

  // ── Conway's Game of Life loop ──
  useEffect(() => {
    if (!lifeRunning) return
    const ms = Math.max(60, 400 - speed * 60)
    const id = setInterval(() => {
      setLifeGrid(g => stepLife(g))
      setLifeGen(g => g + 1)
    }, ms)
    return () => clearInterval(id)
  }, [lifeRunning, speed])

  const resetLife = () => {
    setLifeGrid(randomLifeGrid(20))
    setLifeGen(0)
    setLifeRunning(false)
  }

  const regenerateMaze = () => setMazeGrid(generateMaze(size))

  const handleTypeChange = (id) => {
    setType(id)
    if (id === 'life') { resetLife() }
    if (id === 'maze') { setMazeGrid(generateMaze(size)) }
  }

  const sizeLabel = isCanvas ? `Depth: ${depth}` : `Size: ${size}`

  return (
    <div className="page" style={{ maxWidth: 1200 }}>
      <div className="page-header">
        <h1>🔷 Pattern & Algorithm Visualizer</h1>
        <p>Fractals, mathematical patterns, maze generation, and Conway's Game of Life — all interactive.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1.5rem', alignItems: 'start' }}>

        {/* ── Controls panel ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'sticky', top: 80 }}>

          {/* Category + pattern selector */}
          {PATTERN_CATEGORIES.map(cat => (
            <div key={cat.label} className="card" style={{ padding: '1rem' }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                {cat.label}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                {cat.patterns.map(p => (
                  <button
                    key={p.id}
                    onClick={() => handleTypeChange(p.id)}
                    style={{
                      padding: '0.3rem 0.65rem',
                      fontSize: '0.75rem', fontWeight: 600,
                      borderRadius: 999,
                      border: type === p.id ? 'none' : '1.5px solid var(--border)',
                      background: type === p.id
                        ? `linear-gradient(135deg, ${PALETTES.find(pl=>pl.id===palette)?.a||'#6366f1'}, ${PALETTES.find(pl=>pl.id===palette)?.b||'#8b5cf6'})`
                        : 'var(--card)',
                      color: type === p.id ? '#fff' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Size / Depth */}
          <div className="card" style={{ padding: '1rem' }}>
            <div className="field">
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                {sizeLabel}
              </label>
              <input
                type="range"
                min={isCanvas ? 1 : 2}
                max={isCanvas ? 7 : 30}
                value={isCanvas ? depth : size}
                onChange={e => isCanvas ? setDepth(Number(e.target.value)) : setSize(Number(e.target.value))}
                style={{ accentColor: 'var(--primary)', cursor: 'pointer', width: '100%', marginTop: '0.4rem' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                <span>{isCanvas ? 1 : 2}</span><span>{isCanvas ? 7 : 30}</span>
              </div>
            </div>

            {/* Color palette */}
            <div style={{ marginTop: '1rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Color</div>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {PALETTES.map(p => (
                  <button
                    key={p.id}
                    title={p.label}
                    onClick={() => setPalette(p.id)}
                    style={{
                      width: 26, height: 26, borderRadius: '50%',
                      background: `linear-gradient(135deg, ${p.a}, ${p.b})`,
                      border: palette === p.id ? '2.5px solid var(--text-primary)' : '2px solid transparent',
                      cursor: 'pointer', padding: 0,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Animation controls (grid only) */}
            {isGrid && (
              <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  <input type="checkbox" checked={animated} onChange={e => setAnimated(e.target.checked)}
                    style={{ accentColor: 'var(--primary)', width: 16, height: 16 }} />
                  Animate generation
                </label>
                {animated && (
                  <div className="field">
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Speed: {speed}</label>
                    <input type="range" min={1} max={5} value={speed}
                      onChange={e => setSpeed(Number(e.target.value))}
                      style={{ accentColor: 'var(--primary)', cursor: 'pointer', width: '100%' }} />
                  </div>
                )}
              </div>
            )}

            {/* Life controls */}
            {isLife && (
              <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Speed: {speed}</div>
                <input type="range" min={1} max={5} value={speed}
                  onChange={e => setSpeed(Number(e.target.value))}
                  style={{ accentColor: 'var(--primary)', cursor: 'pointer', width: '100%' }} />
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                  <button
                    onClick={() => setLifeRunning(r => !r)}
                    style={{ flex: 1, padding: '0.45rem', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.82rem',
                      background: lifeRunning ? 'var(--warning)' : 'var(--primary)', color: '#fff' }}>
                    {lifeRunning ? '⏸ Pause' : '▶ Play'}
                  </button>
                  <button onClick={resetLife}
                    style={{ flex: 1, padding: '0.45rem', borderRadius: 8, border: '1.5px solid var(--border)', cursor: 'pointer', fontWeight: 700, fontSize: '0.82rem', background: 'var(--card)', color: 'var(--text-secondary)' }}>
                    ↺ Reset
                  </button>
                </div>
              </div>
            )}

            {/* Maze regenerate */}
            {isMaze && (
              <button onClick={regenerateMaze}
                style={{ marginTop: '1rem', width: '100%', padding: '0.5rem', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.82rem', background: 'var(--primary)', color: '#fff' }}>
                🔀 New Maze
              </button>
            )}
          </div>
        </div>

        {/* ── Preview panel ── */}
        <div className="card" style={{ minHeight: 460 }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <h3 style={{ marginBottom: '0.15rem' }}>{getPatternMeta(type).label}</h3>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {isCanvas && `Depth ${depth}`}
                {isGrid && `${size} × ${size} · ${totalCells} cells`}
                {isMaze && `${size} × ${size} maze`}
                {isLife && `Generation ${lifeGen}`}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              {isGrid && animated && visibleCount < totalCells && (
                <span className="badge badge-warning">Animating…</span>
              )}
              {isLife && lifeRunning && (
                <span className="badge badge-success">Running</span>
              )}
              <span className="badge badge-primary">{meta.renderer}</span>
            </div>
          </div>

          {/* Canvas area */}
          <div style={{
            background: isCanvas ? '#0f172a' : 'var(--bg)',
            border: '1.5px solid var(--border)',
            borderRadius: 10,
            padding: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 380,
            overflow: 'hidden',
            width: '100%',
          }}>
            {isCanvas && <CanvasPattern type={type} depth={depth} palette={palette} size={size} />}
            {isGrid   && <GridPattern grid={grid} palette={palette} animated={animated} visibleCount={visibleCount} />}
            {isMaze   && <MazePattern grid={mazeGrid} palette={palette} />}
            {isLife   && <LifePattern grid={lifeGrid} palette={palette} />}
          </div>

          {/* Info footer */}
          <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: 'var(--bg)', borderRadius: 8, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {type === 'sierpinski' && '🔺 Sierpinski Triangle — recursive fractal. Each triangle is divided into 3 smaller ones, removing the center.'}
            {type === 'koch'       && '❄️ Koch Snowflake — each edge is replaced with 4 segments forming a bump, repeated recursively.'}
            {type === 'tree'       && '🌳 Fractal Tree — each branch splits into two at ±0.4 rad, shrinking by 72% each level.'}
            {type === 'pascal'     && "🔢 Pascal's Triangle — odd numbers highlighted (mod 2), revealing a Sierpinski-like fractal pattern."}
            {type === 'ulam'       && '🌀 Ulam Spiral — integers arranged in a spiral; prime numbers highlighted, revealing diagonal patterns.'}
            {type === 'wave'       && '〰️ Sine Wave — y = sin(x) rendered as a grid, showing how trigonometric functions create smooth curves.'}
            {type === 'hex'        && '⬡ Hexagonal Grid — offset rows simulate a hex tile layout using a rectangular grid.'}
            {type === 'maze'       && '🧩 Maze (DFS) — generated via recursive depth-first search backtracking. Every run produces a unique maze.'}
            {type === 'life'       && "🧬 Conway's Game of Life — cells live or die by neighbour count. Press Play to watch evolution unfold."}
            {!['sierpinski','koch','tree','pascal','ulam','wave','hex','maze','life'].includes(type) && `📐 ${getPatternMeta(type).label} — classic grid pattern.`}
          </div>
        </div>
      </div>
    </div>
  )
}
