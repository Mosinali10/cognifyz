import { useState, useEffect, useRef } from 'react'
import {
  PATTERN_CATEGORIES, getPatternMeta,
  generatePattern, generateMaze, randomLifeGrid, stepLife,
} from '../utils/patternEngine'

// ── Palettes ──────────────────────────────────────────────────────────────
const PALETTES = [
  { id: 'indigo',  a: '#6366f1', b: '#8b5cf6', label: 'Indigo'  },
  { id: 'teal',    a: '#14b8a6', b: '#06b6d4', label: 'Teal'    },
  { id: 'rose',    a: '#f43f5e', b: '#ec4899', label: 'Rose'    },
  { id: 'amber',   a: '#f59e0b', b: '#f97316', label: 'Amber'   },
  { id: 'emerald', a: '#22c55e', b: '#10b981', label: 'Emerald' },
  { id: 'mono',    a: '#334155', b: '#64748b', label: 'Mono'    },
]

const INFO = {
  triangle:      '▲ Equilateral triangle — each row adds 2 cells, centered symmetrically.',
  pyramid:       '▲ Pyramid — same as equilateral triangle, apex at top.',
  square:        '■ Filled square — every cell is active.',
  hollow:        '□ Hollow square — only the border cells are filled.',
  diamond:       '◆ Diamond — two mirrored triangles sharing a base.',
  hollowdiamond: '◇ Hollow diamond — only the outline of the diamond.',
  right:         '◤ Right-angle triangle — grows diagonally from top-left.',
  hourglass:     '⧗ Hourglass — wide at top and bottom, narrow in the middle.',
  cross:         '+ Plus / Cross — center row and column filled.',
  xshape:        '✕ X Shape — both diagonals filled.',
  stairs:        '⌐ Staircase — one step per row.',
  arrow:         '↑ Arrow Up — triangle head with a centered stem.',
  zigzag:        '〰 Zigzag — alternating diagonal cells.',
  checker:       '⊞ Checkerboard — alternating filled/empty cells.',
  pascal:        "🔢 Pascal's Triangle — odd numbers highlighted, revealing a Sierpinski fractal.",
  wave:          '〰 Sine Wave — y = sin(x) sampled across the grid.',
  ulam:          '🌀 Ulam Spiral — integers in a spiral; prime positions highlighted.',
  hex:           '⬡ Hexagonal Grid — offset rows simulate a hex tile layout.',
  sierpinski:    '🔺 Sierpinski Triangle — recursive fractal, each triangle splits into 3.',
  koch:          '❄️ Koch Snowflake — each edge replaced with a bump, recursively.',
  tree:          '🌳 Fractal Tree — branches split at ±0.4 rad, shrinking 72% each level.',
  maze:          '🧩 Maze (DFS) — recursive backtracking. Every run is unique.',
  life:          "🧬 Conway's Game of Life — cells live/die by neighbour count. Press Play.",
}

// ── Canvas fractals ───────────────────────────────────────────────────────

function lerpColor(a, b, t) {
  const parse = h => [parseInt(h.slice(1,3),16), parseInt(h.slice(3,5),16), parseInt(h.slice(5,7),16)]
  const [ar,ag,ab] = parse(a), [br,bg,bb] = parse(b)
  return `rgb(${Math.round(ar+(br-ar)*t)},${Math.round(ag+(bg-ag)*t)},${Math.round(ab+(bb-ab)*t)})`
}

function sierpinski(ctx, x1,y1, x2,y2, x3,y3, depth) {
  if (depth === 0) {
    ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.lineTo(x3,y3)
    ctx.closePath(); ctx.fill(); return
  }
  const [mx1,my1] = [(x1+x2)/2,(y1+y2)/2]
  const [mx2,my2] = [(x2+x3)/2,(y2+y3)/2]
  const [mx3,my3] = [(x1+x3)/2,(y1+y3)/2]
  sierpinski(ctx, x1,y1, mx1,my1, mx3,my3, depth-1)
  sierpinski(ctx, mx1,my1, x2,y2, mx2,my2, depth-1)
  sierpinski(ctx, mx3,my3, mx2,my2, x3,y3, depth-1)
}

function kochSeg(x1,y1,x2,y2,depth) {
  if (depth===0) return [[x1,y1],[x2,y2]]
  const dx=x2-x1, dy=y2-y1
  const ax=x1+dx/3, ay=y1+dy/3
  const bx=x1+2*dx/3, by=y1+2*dy/3
  const angle=Math.atan2(dy,dx)-Math.PI/3
  const len=Math.sqrt(dx*dx+dy*dy)/3
  const px=ax+Math.cos(angle)*len, py=ay+Math.sin(angle)*len
  return [
    ...kochSeg(x1,y1,ax,ay,depth-1).slice(0,-1),
    ...kochSeg(ax,ay,px,py,depth-1).slice(0,-1),
    ...kochSeg(px,py,bx,by,depth-1).slice(0,-1),
    ...kochSeg(bx,by,x2,y2,depth-1),
  ]
}

function drawTree(ctx,x,y,angle,len,depth,ca,cb) {
  if (depth===0||len<2) return
  ctx.strokeStyle = lerpColor(cb,ca,depth/12)
  ctx.lineWidth = Math.max(0.5, depth*0.7)
  ctx.beginPath(); ctx.moveTo(x,y)
  const ex=x+Math.cos(angle)*len, ey=y+Math.sin(angle)*len
  ctx.lineTo(ex,ey); ctx.stroke()
  drawTree(ctx,ex,ey,angle-0.42,len*0.72,depth-1,ca,cb)
  drawTree(ctx,ex,ey,angle+0.42,len*0.72,depth-1,ca,cb)
}

function CanvasPattern({ type, depth, pal }) {
  const ref = useRef(null)
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return
    const ctx = canvas.getContext('2d')
    const W = canvas.width, H = canvas.height
    ctx.clearRect(0,0,W,H)
    const d = Math.min(depth, type==='koch' ? 5 : 7)

    if (type==='sierpinski') {
      const grad = ctx.createLinearGradient(0,0,W,H)
      grad.addColorStop(0,pal.a); grad.addColorStop(1,pal.b)
      ctx.fillStyle = grad
      sierpinski(ctx, W/2,20, 20,H-20, W-20,H-20, d)
    }
    if (type==='koch') {
      ctx.strokeStyle = pal.a; ctx.lineWidth = 1.5
      const cx=W/2, cy=H/2-10, r=Math.min(W,H)/2-40
      const pts = [[cx,cy-r],[cx+r*Math.sin(2*Math.PI/3),cy-r*Math.cos(2*Math.PI/3)],[cx+r*Math.sin(4*Math.PI/3),cy-r*Math.cos(4*Math.PI/3)]]
      for (let i=0;i<3;i++) {
        const [x1,y1]=pts[i],[x2,y2]=pts[(i+1)%3]
        const pts2=kochSeg(x1,y1,x2,y2,d)
        ctx.beginPath(); ctx.moveTo(pts2[0][0],pts2[0][1])
        pts2.slice(1).forEach(([px,py])=>ctx.lineTo(px,py)); ctx.stroke()
      }
    }
    if (type==='tree') {
      drawTree(ctx, W/2, H-10, -Math.PI/2, H*0.27, Math.min(d+4,12), pal.a, pal.b)
    }
  }, [type, depth, pal])

  return (
    <canvas ref={ref} width={580} height={440}
      style={{ width:'100%', height:'auto', display:'block', borderRadius:8 }} />
  )
}
// ── Grid renderer — renders from normalized matrix ────────────────────────
function GridRenderer({ matrix, pal, animated, visibleCount, showGrid, zoom }) {
  if (!matrix || matrix.length === 0) return null

  const rows = matrix.length
  const cols = matrix[0].length

  // Compute cell size to fit within 520px
  const maxDim = Math.max(rows, cols)
  const base = Math.max(6, Math.min(28, Math.floor(520 / maxDim)))

  const cell = Math.round(base * zoom)
  const gap  = Math.max(1, Math.round(cell * 0.1))

  let idx = 0

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:0 }}>
      {matrix.map((row, ri) => (
        <div key={ri} style={{ display:'flex' }}>
          {row.map((val, ci) => {
            const i = idx++
            const show = !animated || i < visibleCount
            const filled = val === 1

            return (
            <div key={ci} style={{
              width: cell,
    height: cell,
    margin: gap,
    borderRadius: Math.max(2, cell * 0.18),

    background: filled && show
      ? `linear-gradient(135deg,${pal.a},${pal.b})`
      : 'transparent',

    boxShadow: filled && show
      ? `0 0 ${cell * 0.6}px ${pal.a}66`
      : 'none',

    opacity: filled ? (show ? 1 : 0) : 0,

    transform: filled && show ? 'scale(1)' : 'scale(0.6)',

    outline: showGrid ? `1px solid ${pal.a}22` : 'none',

    transition: animated
      ? 'opacity 0.12s ease, transform 0.15s ease'
      : 'opacity 0.1s ease'
  }} />
)
          })}
        </div>
      ))}
    </div>
  )
}

// ── Maze renderer ─────────────────────────────────────────────────────────
function MazeRenderer({ matrix, pal }) {
  if (!matrix || matrix.length === 0) return null
  const cols = matrix[0].length
  const cell = Math.max(3, Math.min(14, Math.floor(520 / cols)))
  return (
    <div style={{ display:'flex', flexDirection:'column', lineHeight:0, borderRadius:6, overflow:'hidden' }}>
      {matrix.map((row, ri) => (
        <div key={ri} style={{ display:'flex' }}>
          {row.map((val, ci) => (
            <div key={ci} style={{
              width: cell, height: cell,
              background: val === 1 ? pal.a : '#ffffff',
            }} />
          ))}
        </div>
      ))}
    </div>
  )
}

// ── Life renderer ─────────────────────────────────────────────────────────
function LifeRenderer({ grid, pal }) {
  if (!grid || grid.length === 0) return null
  const size = grid.length
  const cell = Math.max(5, Math.min(16, Math.floor(520 / size)))
  return (
    <div style={{ display:'flex', flexDirection:'column', lineHeight:0 }}>
      {grid.map((row, ri) => (
        <div key={ri} style={{ display:'flex' }}>
          {row.map((val, ci) => (
            <div key={ci} style={{
              width: cell, height: cell,
              margin: 1,
              borderRadius: 2,
              background: val === 1 ? `linear-gradient(135deg,${pal.a},${pal.b})` : 'transparent',
              transition: 'background 0.06s',
            }} />
          ))}
        </div>
      ))}
    </div>
  )
}

// ── Sidebar controls ──────────────────────────────────────────────────────
function ControlPanel({
  type, size, depth, palette, animated, speed, showGrid, zoom,
  isCanvas, isMaze, isLife, isGrid,
  lifeRunning, lifeGen,
  onType, onSize, onDepth, onPalette, onAnimated, onSpeed, onShowGrid, onZoom,
  onLifeToggle, onLifeReset, onNewMaze,
}) {
  const pal = PALETTES.find(p => p.id === palette) || PALETTES[0]
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'0.85rem', position:'sticky', top:80 }}>
      {PATTERN_CATEGORIES.map(cat => (
        <div key={cat.label} className="card" style={{ padding:'0.9rem' }}>
          <div style={{ fontSize:'0.65rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', color:'var(--text-muted)', marginBottom:'0.5rem' }}>
            {cat.label}
          </div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:'0.3rem' }}>
            {cat.patterns.map(p => (
              <button key={p.id} onClick={() => onType(p.id)} style={{
                padding:'0.28rem 0.6rem', fontSize:'0.72rem', fontWeight:600,
                borderRadius:999, cursor:'pointer', transition:'all 0.15s',
                border: type===p.id ? 'none' : '1.5px solid var(--border)',
                background: type===p.id ? `linear-gradient(135deg,${pal.a},${pal.b})` : 'var(--card)',
                color: type===p.id ? '#fff' : 'var(--text-secondary)',
              }}>{p.label}</button>
            ))}
          </div>
        </div>
      ))}

      <div className="card" style={{ padding:'0.9rem', display:'flex', flexDirection:'column', gap:'0.85rem' }}>
        {/* Size / Depth */}
        <div>
          <div style={{ fontSize:'0.78rem', fontWeight:600, color:'var(--text-secondary)', marginBottom:'0.3rem' }}>
            {isCanvas ? `Depth: ${depth}` : `Size: ${size}`}
          </div>
          <input type="range" min={isCanvas?1:2} max={isCanvas?7:30}
            value={isCanvas?depth:size}
            onChange={e => isCanvas ? onDepth(+e.target.value) : onSize(+e.target.value)}
            style={{ width:'100%', accentColor:'var(--primary)', cursor:'pointer' }} />
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.68rem', color:'var(--text-muted)' }}>
            <span>{isCanvas?1:2}</span><span>{isCanvas?7:30}</span>
          </div>
        </div>

        {/* Zoom (grid only) */}
        {(isGrid||isMaze) && (
          <div>
            <div style={{ fontSize:'0.78rem', fontWeight:600, color:'var(--text-secondary)', marginBottom:'0.3rem' }}>Zoom: {zoom}×</div>
            <input type="range" min={1} max={3} step={0.25} value={zoom}
              onChange={e => onZoom(+e.target.value)}
              style={{ width:'100%', accentColor:'var(--primary)', cursor:'pointer' }} />
          </div>
        )}

        {/* Color */}
        <div>
          <div style={{ fontSize:'0.78rem', fontWeight:600, color:'var(--text-secondary)', marginBottom:'0.4rem' }}>Color</div>
          <div style={{ display:'flex', gap:'0.4rem' }}>
            {PALETTES.map(p => (
              <button key={p.id} title={p.label} onClick={() => onPalette(p.id)} style={{
                width:24, height:24, borderRadius:'50%', padding:0, cursor:'pointer',
                background:`linear-gradient(135deg,${p.a},${p.b})`,
                border: palette===p.id ? '2.5px solid var(--text-primary)' : '2px solid transparent',
              }} />
            ))}
          </div>
        </div>

        {/* Grid overlay */}
        {isGrid && (
          <label style={{ display:'flex', alignItems:'center', gap:'0.5rem', cursor:'pointer', fontSize:'0.78rem', fontWeight:600, color:'var(--text-secondary)' }}>
            <input type="checkbox" checked={showGrid} onChange={e=>onShowGrid(e.target.checked)}
              style={{ accentColor:'var(--primary)', width:14, height:14 }} />
            Grid overlay
          </label>
        )}

        {/* Animation */}
        {isGrid && (
          <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem' }}>
            <label style={{ display:'flex', alignItems:'center', gap:'0.5rem', cursor:'pointer', fontSize:'0.78rem', fontWeight:600, color:'var(--text-secondary)' }}>
              <input type="checkbox" checked={animated} onChange={e=>onAnimated(e.target.checked)}
                style={{ accentColor:'var(--primary)', width:14, height:14 }} />
              Animate generation
            </label>
            {animated && <>
              <div style={{ fontSize:'0.75rem', color:'var(--text-secondary)' }}>Speed: {speed}</div>
              <input type="range" min={1} max={5} value={speed} onChange={e=>onSpeed(+e.target.value)}
                style={{ width:'100%', accentColor:'var(--primary)', cursor:'pointer' }} />
            </>}
          </div>
        )}

        {/* Life controls */}
        {isLife && (
          <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem' }}>
            <div style={{ fontSize:'0.75rem', color:'var(--text-secondary)' }}>Speed: {speed} · Gen {lifeGen}</div>
            <input type="range" min={1} max={5} value={speed} onChange={e=>onSpeed(+e.target.value)}
              style={{ width:'100%', accentColor:'var(--primary)', cursor:'pointer' }} />
            <div style={{ display:'flex', gap:'0.5rem' }}>
              <button onClick={onLifeToggle} style={{ flex:1, padding:'0.4rem', borderRadius:7, border:'none', cursor:'pointer', fontWeight:700, fontSize:'0.78rem', background:lifeRunning?'var(--warning)':'var(--primary)', color:'#fff' }}>
                {lifeRunning ? '⏸ Pause' : '▶ Play'}
              </button>
              <button onClick={onLifeReset} style={{ flex:1, padding:'0.4rem', borderRadius:7, border:'1.5px solid var(--border)', cursor:'pointer', fontWeight:700, fontSize:'0.78rem', background:'var(--card)', color:'var(--text-secondary)' }}>
                ↺ Reset
              </button>
            </div>
          </div>
        )}

        {/* Maze controls */}
        {isMaze && (
          <button onClick={onNewMaze} style={{ width:'100%', padding:'0.45rem', borderRadius:7, border:'none', cursor:'pointer', fontWeight:700, fontSize:'0.78rem', background:'var(--primary)', color:'#fff' }}>
            🔀 New Maze
          </button>
        )}
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────
export default function PatternGenerator() {
  const [type,     setType]     = useState('triangle')
  const [size,     setSize]     = useState(8)
  const [depth,    setDepth]    = useState(4)
  const [palette,  setPalette]  = useState('indigo')
  const [animated, setAnimated] = useState(false)
  const [speed,    setSpeed]    = useState(3)
  const [showGrid, setShowGrid] = useState(false)
  const [zoom,     setZoom]     = useState(1)
  const [visible,  setVisible]  = useState(Infinity)
  const [lifeGrid, setLifeGrid] = useState(() => randomLifeGrid(24))
  const [lifeRun,  setLifeRun]  = useState(false)
  const [lifeGen,  setLifeGen]  = useState(0)
  const [mazeData, setMazeData] = useState(() => generateMaze(10))

  const meta    = getPatternMeta(type)
  const isCanvas = meta.renderer === 'canvas'
  const isMaze   = meta.renderer === 'maze'
  const isLife   = meta.renderer === 'life'
  const isGrid   = meta.renderer === 'grid'
  const pal      = PALETTES.find(p => p.id === palette) || PALETTES[0]

  // Generate normalized matrix for grid patterns
 const { matrix, width: mw, height: mh } = isGrid
  ? generatePattern(type, size)
  : { matrix: [], width: 0, height: 0 }

const totalFilled = matrix.flat().filter(v => v === 1).length

// ── Animation effect ──
useEffect(() => {
  if (!isGrid || !animated) {
    setVisible(Infinity)
    return
  }

  setVisible(0)

  if (totalFilled === 0) return

  const step = Math.max(1, Math.floor(speed * 2))
  const ms   = Math.max(10, 70 - speed * 12)

  let count = 0

  const id = setInterval(() => {
    count += step
    setVisible(prev => {
      const next = prev + step
      return next >= totalFilled ? totalFilled : next
    })

    if (count >= totalFilled) clearInterval(id)

  }, ms)

  return () => clearInterval(id)

}, [type, size, animated, speed, totalFilled, isGrid])
  // ── Life loop ──
 useEffect(() => {
  if (!isGrid || !animated) { 
    setVisible(Infinity)
    return
  }

  setVisible(0)

  if (totalFilled === 0) return

  const step = Math.max(1, Math.floor(speed * 2))
  const ms = Math.max(10, 70 - speed * 12)

  let count = 0

  const id = setInterval(() => {
    count += step

    setVisible(prev => Math.min(prev + step, totalFilled))

    if (count >= totalFilled) clearInterval(id)

  }, ms)

  return () => clearInterval(id)

}, [type, size, animated, speed, totalFilled])

  const handleType = (id) => {
    setType(id)
    if (id === 'life') { setLifeGrid(randomLifeGrid(24)); setLifeGen(0); setLifeRun(false) }
    if (id === 'maze') setMazeData(generateMaze(size))
  }

  const handleNewMaze = () => setMazeData(generateMaze(size))

  // Subtitle for preview header
  const subtitle = isCanvas ? `Depth ${depth}`
    : isGrid   ? `${mw} × ${mh} · ${totalFilled} filled cells`
    : isMaze   ? `${size} × ${size} cells`
    : `Generation ${lifeGen}`

  return (
    <div className="page" style={{ maxWidth: 1200 }}>
      <div className="page-header">
        <h1>🔷 Pattern & Algorithm Visualizer</h1>
        <p>Fractals, mathematical patterns, maze generation, and Conway's Game of Life.</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'270px 1fr', gap:'1.5rem', alignItems:'start' }}>

        <ControlPanel
          type={type} size={size} depth={depth} palette={palette}
          animated={animated} speed={speed} showGrid={showGrid} zoom={zoom}
          isCanvas={isCanvas} isMaze={isMaze} isLife={isLife} isGrid={isGrid}
          lifeRunning={lifeRun} lifeGen={lifeGen}
          onType={handleType} onSize={setSize} onDepth={setDepth}
          onPalette={setPalette} onAnimated={setAnimated} onSpeed={setSpeed}
          onShowGrid={setShowGrid} onZoom={setZoom}
          onLifeToggle={() => setLifeRun(r => !r)}
          onLifeReset={() => { setLifeGrid(randomLifeGrid(24)); setLifeGen(0); setLifeRun(false) }}
          onNewMaze={handleNewMaze}
        />

        {/* Preview card */}
        <div className="card" style={{ minHeight: 500 }}>
          {/* Header */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.25rem', flexWrap:'wrap', gap:'0.5rem' }}>
            <div>
              <h3 style={{ marginBottom:'0.15rem' }}>{meta.label}</h3>
              <div style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>{subtitle}</div>
            </div>
            <div style={{ display:'flex', gap:'0.4rem', alignItems:'center' }}>
              {isGrid && animated && visible < totalFilled && (
                <span className="badge badge-warning">Animating…</span>
              )}
              {isLife && lifeRun && <span className="badge badge-success">Running</span>}
              <span className="badge badge-primary">{meta.renderer}</span>
            </div>
          </div>

          {/* Canvas */}
          <div style={{
            background: isCanvas ? '#0f172a' : 'var(--bg)',
            border: '1.5px solid var(--border)',
            borderRadius: 10,
            padding: '1.5rem',
            minHeight: 400,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}>
            {isCanvas && <CanvasPattern type={type} depth={depth} pal={pal} />}
            {isGrid   && <GridRenderer matrix={matrix} pal={pal} animated={animated} visibleCount={visible} showGrid={showGrid} zoom={zoom} />}
            {isMaze   && <MazeRenderer matrix={mazeData.matrix} pal={pal} />}
            {isLife   && <LifeRenderer grid={lifeGrid} pal={pal} />}
          </div>

          {/* Info */}
          <div style={{ marginTop:'1rem', padding:'0.7rem 1rem', background:'var(--bg)', borderRadius:8, fontSize:'0.78rem', color:'var(--text-muted)', lineHeight:1.5 }}>
            {INFO[type] || `📐 ${meta.label}`}
          </div>
        </div>
      </div>
    </div>
  )
}
