/**
 * Pattern utilities — grid-based patterns (return 2D boolean arrays)
 * Canvas-based patterns are rendered directly in PatternGenerator.jsx
 */

export const PATTERN_CATEGORIES = [
  {
    label: 'Classic',
    patterns: [
      { id: 'triangle',      label: 'Equilateral Triangle', renderer: 'grid' },
      { id: 'pyramid',       label: 'Pyramid',              renderer: 'grid' },
      { id: 'square',        label: 'Filled Square',        renderer: 'grid' },
      { id: 'hollow',        label: 'Hollow Square',        renderer: 'grid' },
      { id: 'diamond',       label: 'Diamond',              renderer: 'grid' },
      { id: 'hollowdiamond', label: 'Hollow Diamond',       renderer: 'grid' },
      { id: 'right',         label: 'Right Triangle',       renderer: 'grid' },
      { id: 'hourglass',     label: 'Hourglass',            renderer: 'grid' },
      { id: 'cross',         label: 'Plus / Cross',         renderer: 'grid' },
      { id: 'xshape',        label: 'X Shape',              renderer: 'grid' },
      { id: 'stairs',        label: 'Staircase',            renderer: 'grid' },
      { id: 'arrow',         label: 'Arrow Up',             renderer: 'grid' },
      { id: 'zigzag',        label: 'Zigzag',               renderer: 'grid' },
      { id: 'checker',       label: 'Checkerboard',         renderer: 'grid' },
    ],
  },
  {
    label: 'Mathematical',
    patterns: [
      { id: 'pascal',  label: "Pascal's Triangle", renderer: 'grid' },
      { id: 'wave',    label: 'Sine Wave',          renderer: 'grid' },
      { id: 'ulam',    label: 'Ulam Spiral',        renderer: 'grid' },
      { id: 'hex',     label: 'Hexagonal Grid',     renderer: 'grid' },
    ],
  },
  {
    label: 'Fractals',
    patterns: [
      { id: 'sierpinski', label: 'Sierpinski Triangle', renderer: 'canvas' },
      { id: 'koch',       label: 'Koch Snowflake',      renderer: 'canvas' },
      { id: 'tree',       label: 'Fractal Tree',        renderer: 'canvas' },
    ],
  },
  {
    label: 'Algorithms',
    patterns: [
      { id: 'maze', label: 'Maze (DFS)',          renderer: 'grid-maze' },
      { id: 'life', label: "Conway's Game of Life", renderer: 'life' },
    ],
  },
]

// Flat list for easy lookup
export const PATTERN_TYPES = PATTERN_CATEGORIES.flatMap(c => c.patterns)

export function getPatternMeta(id) {
  return PATTERN_TYPES.find(p => p.id === id) || PATTERN_TYPES[0]
}

// ── Grid pattern generator ────────────────────────────────────────────────

export function generatePattern(type, size) {
  const s = Math.max(2, Math.min(size, 30))
  const w2 = 2 * s - 1

  switch (type) {
    case 'triangle':
    case 'pyramid':
      return Array.from({ length: s }, (_, i) => {
        const stars = 2 * i + 1, start = s - i - 1
        return Array.from({ length: w2 }, (_, j) => j >= start && j < start + stars)
      })

    case 'square':
      return Array.from({ length: s }, () => Array(s).fill(true))

    case 'hollow':
      return Array.from({ length: s }, (_, i) =>
        Array.from({ length: s }, (_, j) => i === 0 || i === s-1 || j === 0 || j === s-1)
      )

    case 'diamond': {
      const rows = []
      for (let i = 1; i <= s; i++) {
        const stars = 2*i-1, start = s-i
        rows.push(Array.from({ length: w2 }, (_, j) => j >= start && j < start+stars))
      }
      for (let i = s-1; i >= 1; i--) {
        const stars = 2*i-1, start = s-i
        rows.push(Array.from({ length: w2 }, (_, j) => j >= start && j < start+stars))
      }
      return rows
    }

    case 'hollowdiamond': {
      const rows = []
      for (let i = 1; i <= s; i++) {
        const start = s-i, end = s+i-2
        rows.push(Array.from({ length: w2 }, (_, j) =>
          j === start || j === end
        ))
      }
      for (let i = s-1; i >= 1; i--) {
        const start = s-i, end = s+i-2
        rows.push(Array.from({ length: w2 }, (_, j) =>
          j === start || j === end
        ))
      }
      return rows
    }

    case 'right':
      return Array.from({ length: s }, (_, i) =>
        Array.from({ length: s }, (_, j) => j <= i)
      )

    case 'hourglass':
      return Array.from({ length: s }, (_, i) => {
        const dist = i <= Math.floor(s/2) ? i : s-1-i
        return Array.from({ length: s }, (_, j) => j <= dist || j >= s-1-dist)
      })

    case 'cross': {
      const mid = Math.floor(s/2)
      return Array.from({ length: s }, (_, i) =>
        Array.from({ length: s }, (_, j) => i === mid || j === mid)
      )
    }

    case 'xshape':
      return Array.from({ length: s }, (_, i) =>
        Array.from({ length: s }, (_, j) => i === j || i+j === s-1)
      )

    case 'stairs':
      return Array.from({ length: s }, (_, i) =>
        Array.from({ length: s }, (_, j) => j <= i && j >= i-1)
      )

    case 'arrow': {
      const rows = []
      for (let i = 0; i < s; i++) {
        const stars = 2*i+1, start = s-i-1
        rows.push(Array.from({ length: w2 }, (_, j) => j >= start && j < start+stars))
      }
      const sc = s-2, se = s
      for (let i = 1; i < Math.ceil(s/2); i++)
        rows.push(Array.from({ length: w2 }, (_, j) => j >= sc && j < se))
      return rows
    }

    case 'zigzag':
      return Array.from({ length: s }, (_, i) => {
        const pos = i % 2 === 0 ? i % s : s-1-(i % s)
        return Array.from({ length: s }, (_, j) => Math.abs(j - pos) <= 1)
      })

    case 'checker':
      return Array.from({ length: s }, (_, i) =>
        Array.from({ length: s }, (_, j) => (i+j) % 2 === 0)
      )

    case 'pascal': {
      const rows = [[true]]
      let prev = [1]
      for (let i = 1; i < s; i++) {
        const cur = [1]
        for (let j = 1; j < i; j++) cur.push(prev[j-1] + prev[j])
        cur.push(1)
        prev = cur
        rows.push(cur.map(v => v % 2 !== 0)) // odd numbers filled (Sierpinski-like)
      }
      // Pad all rows to same width
      const maxW = rows[rows.length-1].length
      return rows.map(r => {
        const pad = Math.floor((maxW - r.length) / 2)
        return [...Array(pad).fill(false), ...r, ...Array(maxW - r.length - pad).fill(false)]
      })
    }

    case 'wave': {
      const cols = s * 3
      return Array.from({ length: s }, (_, i) =>
        Array.from({ length: cols }, (_, j) => {
          const y = Math.round((s/2) + (s/2-1) * Math.sin((j / cols) * Math.PI * 4 - (i * 0.3)))
          return Math.abs(i - y) <= 1
        })
      )
    }

    case 'ulam': {
      const n = s % 2 === 0 ? s+1 : s
      const grid = Array.from({ length: n }, () => Array(n).fill(false))
      // Fill with primes via sieve
      const total = n * n
      const sieve = Array(total+1).fill(true)
      sieve[0] = sieve[1] = false
      for (let i = 2; i <= Math.sqrt(total); i++)
        if (sieve[i]) for (let j = i*i; j <= total; j += i) sieve[j] = false

      // Spiral walk
      let x = Math.floor(n/2), y = Math.floor(n/2), num = 1
      const dirs = [[0,0],[1,0],[0,-1],[-1,0],[0,1]]
      let dx = 0, dy = 1, steps = 1, turned = 0
      grid[y][x] = sieve[num]
      num++
      while (num <= total) {
        for (let seg = 0; seg < 2 && num <= total; seg++) {
          for (let i = 0; i < steps && num <= total; i++) {
            x += dx; y += dy
            if (y >= 0 && y < n && x >= 0 && x < n) grid[y][x] = sieve[num]
            num++
          }
          // turn left
          ;[dx, dy] = [-dy, dx]
          turned++
          if (turned % 2 === 0) steps++
        }
      }
      return grid
    }

    case 'hex': {
      // Offset hex grid rendered as rectangular grid with stagger
      const rows = []
      for (let i = 0; i < s; i++) {
        const row = []
        for (let j = 0; j < s * 2; j++) {
          const offset = i % 2
          row.push((j + offset) % 3 !== 2)
        }
        rows.push(row)
      }
      return rows
    }

    default:
      return []
  }
}

// ── Maze generator (DFS) ─────────────────────────────────────────────────

export function generateMaze(size) {
  const s = Math.max(3, Math.min(size, 25))
  // Grid of cells, each cell has walls: N E S W
  const cols = s, rows = s
  const visited = Array.from({ length: rows }, () => Array(cols).fill(false))
  // wall grid: 2*rows+1 x 2*cols+1, true = wall
  const w = 2*cols+1, h = 2*rows+1
  const walls = Array.from({ length: h }, () => Array(w).fill(true))

  function carve(r, c) {
    visited[r][c] = true
    walls[r*2+1][c*2+1] = false // cell itself open
    const dirs = [[0,1],[0,-1],[1,0],[-1,0]].sort(() => Math.random()-0.5)
    for (const [dr, dc] of dirs) {
      const nr = r+dr, nc = c+dc
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !visited[nr][nc]) {
        walls[r*2+1+dr][c*2+1+dc] = false // remove wall between
        carve(nr, nc)
      }
    }
  }
  carve(0, 0)
  // Open entrance and exit
  walls[1][0] = false
  walls[h-2][w-1] = false
  return walls // boolean grid: true=wall, false=passage
}

// ── Conway's Game of Life ────────────────────────────────────────────────

export function randomLifeGrid(size) {
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () => Math.random() > 0.65)
  )
}

export function stepLife(grid) {
  const rows = grid.length, cols = grid[0].length
  return Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => {
      let n = 0
      for (let dr = -1; dr <= 1; dr++)
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue
          const nr = (r+dr+rows) % rows, nc = (c+dc+cols) % cols
          if (grid[nr][nc]) n++
        }
      return grid[r][c] ? n === 2 || n === 3 : n === 3
    })
  )
}
