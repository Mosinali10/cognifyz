/**
 * patternEngine.js
 * All patterns return { matrix: number[][], width, height }
 * matrix[r][c] === 1 means filled, 0 means empty.
 * Every row is guaranteed to have the same length (normalized).
 */

// ── Helpers ───────────────────────────────────────────────────────────────

/** Pad every row to the same width with zeros, centered */
function normalize(rows) {
  if (rows.length === 0) return { matrix: [], width: 0, height: 0 }
  const width = Math.max(...rows.map(r => r.length))
  const matrix = rows.map(r => {
    const pad = width - r.length
    const left  = Math.floor(pad / 2)
    const right = pad - left
    return [...Array(left).fill(0), ...r, ...Array(right).fill(0)]
  })
  return { matrix, width, height: matrix.length }
}

/** Make an empty row of given width */
const emptyRow = (w) => Array(w).fill(0)

// ── Pattern registry ──────────────────────────────────────────────────────

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
      { id: 'pascal', label: "Pascal's Triangle", renderer: 'grid' },
      { id: 'wave',   label: 'Sine Wave',          renderer: 'grid' },
      { id: 'ulam',   label: 'Ulam Spiral',        renderer: 'grid' },
      { id: 'hex',    label: 'Hexagonal Grid',     renderer: 'grid' },
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
      { id: 'maze', label: 'Maze (DFS)',             renderer: 'maze' },
      { id: 'life', label: "Conway's Game of Life",  renderer: 'life' },
    ],
  },
]

export const PATTERN_TYPES = PATTERN_CATEGORIES.flatMap(c => c.patterns)
export const getPatternMeta = (id) => PATTERN_TYPES.find(p => p.id === id) || PATTERN_TYPES[0]

// ── Main generator ────────────────────────────────────────────────────────

export function generatePattern(type, size) {
  const s = Math.max(2, Math.min(size, 30))

  switch (type) {

    // ── Equilateral triangle (apex at top, base at bottom) ──
    case 'triangle':
    case 'pyramid': {
      const w = 2 * s - 1
      const rows = Array.from({ length: s }, (_, i) => {
        const filled = 2 * i + 1
        const row = emptyRow(w)
        const start = Math.floor((w - filled) / 2)
        for (let j = start; j < start + filled; j++) row[j] = 1
        return row
      })
      return normalize(rows)
    }

    // ── Filled square ──
    case 'square': {
      const rows = Array.from({ length: s }, () => Array(s).fill(1))
      return normalize(rows)
    }

    // ── Hollow square (border only) ──
    case 'hollow': {
      const rows = Array.from({ length: s }, (_, i) =>
        Array.from({ length: s }, (_, j) =>
          (i === 0 || i === s - 1 || j === 0 || j === s - 1) ? 1 : 0
        )
      )
      return normalize(rows)
    }

    // ── Diamond (filled) ──
    case 'diamond': {
      const w = 2 * s - 1
      const rows = []
      for (let i = 1; i <= s; i++) {
        const filled = 2 * i - 1
        const row = emptyRow(w)
        const start = Math.floor((w - filled) / 2)
        for (let j = start; j < start + filled; j++) row[j] = 1
        rows.push(row)
      }
      for (let i = s - 1; i >= 1; i--) {
        const filled = 2 * i - 1
        const row = emptyRow(w)
        const start = Math.floor((w - filled) / 2)
        for (let j = start; j < start + filled; j++) row[j] = 1
        rows.push(row)
      }
      return normalize(rows)
    }

    // ── Hollow diamond (outline only) ──
    case 'hollowdiamond': {
      const w = 2 * s - 1
      const rows = []
      for (let i = 1; i <= s; i++) {
        const row = emptyRow(w)
        const left  = s - i
        const right = s + i - 2
        row[left] = 1
        if (right !== left) row[right] = 1
        rows.push(row)
      }
      for (let i = s - 1; i >= 1; i--) {
        const row = emptyRow(w)
        const left  = s - i
        const right = s + i - 2
        row[left] = 1
        if (right !== left) row[right] = 1
        rows.push(row)
      }
      return normalize(rows)
    }

    // ── Right-angle triangle (grows left→right, top→bottom) ──
    case 'right': {
      const rows = Array.from({ length: s }, (_, i) => {
        const row = emptyRow(s)
        for (let j = 0; j <= i; j++) row[j] = 1
        return row
      })
      return normalize(rows)
    }

    // ── Hourglass ──
    case 'hourglass': {
      const rows = Array.from({ length: s }, (_, i) => {
        const half = Math.floor(s / 2)
        const indent = i <= half ? i : s - 1 - i
        const row = emptyRow(s)
        for (let j = 0; j <= indent; j++) row[j] = 1
        for (let j = s - 1 - indent; j < s; j++) row[j] = 1
        return row
      })
      return normalize(rows)
    }

    // ── Plus / Cross ──
    case 'cross': {
      const mid = Math.floor(s / 2)
      const rows = Array.from({ length: s }, (_, i) =>
        Array.from({ length: s }, (_, j) => (i === mid || j === mid) ? 1 : 0)
      )
      return normalize(rows)
    }

    // ── X shape ──
    case 'xshape': {
      const rows = Array.from({ length: s }, (_, i) =>
        Array.from({ length: s }, (_, j) => (i === j || i + j === s - 1) ? 1 : 0)
      )
      return normalize(rows)
    }

    // ── Staircase ──
    case 'stairs': {
      const rows = Array.from({ length: s }, (_, i) => {
        const row = emptyRow(s)
        row[i] = 1
        if (i > 0) row[i - 1] = 1
        return row
      })
      return normalize(rows)
    }

    // ── Arrow up (triangle head + stem) ──
    case 'arrow': {
      const w = 2 * s - 1
      const rows = []
      // Head
      for (let i = 0; i < s; i++) {
        const filled = 2 * i + 1
        const row = emptyRow(w)
        const start = Math.floor((w - filled) / 2)
        for (let j = start; j < start + filled; j++) row[j] = 1
        rows.push(row)
      }
      // Stem (2 cells wide, centered)
      const stemW = Math.max(2, Math.floor(s / 3) * 2)
      const stemStart = Math.floor((w - stemW) / 2)
      for (let i = 0; i < Math.ceil(s / 2); i++) {
        const row = emptyRow(w)
        for (let j = stemStart; j < stemStart + stemW; j++) row[j] = 1
        rows.push(row)
      }
      return normalize(rows)
    }

    // ── Zigzag ──
    case 'zigzag': {
      const rows = []
      for (let i = 0; i < s; i++) {
        const row = emptyRow(s)
        // Diagonal going right on even rows, left on odd rows
        const pos = i % 2 === 0
          ? (i % s)
          : s - 1 - (i % s)
        const clamped = Math.max(0, Math.min(s - 1, pos))
        row[clamped] = 1
        rows.push(row)
      }
      return normalize(rows)
    }

    // ── Checkerboard ──
    case 'checker': {
      const rows = Array.from({ length: s }, (_, i) =>
        Array.from({ length: s }, (_, j) => (i + j) % 2 === 0 ? 1 : 0)
      )
      return normalize(rows)
    }

    // ── Pascal's Triangle (odd numbers highlighted) ──
    case 'pascal': {
      const pascalRows = [[1]]
      for (let i = 1; i < s; i++) {
        const prev = pascalRows[i - 1]
        const cur = [1]
        for (let j = 1; j < prev.length; j++) cur.push(prev[j - 1] + prev[j])
        cur.push(1)
        pascalRows.push(cur)
      }
      const w = pascalRows[pascalRows.length - 1].length
      const rows = pascalRows.map(r => {
        const row = emptyRow(w)
        const offset = Math.floor((w - r.length) / 2)
        r.forEach((v, j) => { row[offset + j] = v % 2 !== 0 ? 1 : 0 })
        return row
      })
      return normalize(rows)
    }

    // ── Sine Wave ──
    case 'wave': {
      const cols = s * 4
      const rows = Array.from({ length: s }, (_, i) => {
        const row = emptyRow(cols)
        for (let j = 0; j < cols; j++) {
          const y = Math.round((s / 2) + ((s / 2) - 1) * Math.sin((j / cols) * Math.PI * 6))
          if (Math.abs(i - y) <= 1) row[j] = 1
        }
        return row
      })
      return normalize(rows)
    }

    // ── Ulam Spiral (primes highlighted) ──
    case 'ulam': {
      const n = s % 2 === 0 ? s + 1 : s
      const total = n * n
      // Sieve of Eratosthenes
      const sieve = Array(total + 1).fill(true)
      sieve[0] = sieve[1] = false
      for (let i = 2; i * i <= total; i++)
        if (sieve[i]) for (let j = i * i; j <= total; j += i) sieve[j] = false

      // Build flat spiral mapping: number → (row, col)
      const grid = Array.from({ length: n }, () => Array(n).fill(0))
      let x = Math.floor(n / 2), y = Math.floor(n / 2)
      let dx = 1, dy = 0, steps = 1, turns = 0, num = 1
      grid[y][x] = sieve[num] ? 1 : 0
      num++
      while (num <= total) {
        for (let seg = 0; seg < 2 && num <= total; seg++) {
          for (let i = 0; i < steps && num <= total; i++) {
            x += dx; y += dy
            if (y >= 0 && y < n && x >= 0 && x < n)
              grid[y][x] = sieve[num] ? 1 : 0
            num++
          }
          ;[dx, dy] = [-dy, dx] // turn left
          turns++
        }
        steps++
      }
      return normalize(grid)
    }

    // ── Hexagonal Grid ──
    case 'hex': {
      const rows = []
      for (let i = 0; i < s; i++) {
        const row = []
        const offset = i % 2
        for (let j = 0; j < s * 2; j++) {
          row.push((j + offset) % 3 !== 2 ? 1 : 0)
        }
        rows.push(row)
      }
      return normalize(rows)
    }

    default:
      return normalize([])
  }
}

// ── Maze generator (DFS recursive backtracking) ───────────────────────────

export function generateMaze(size) {
  const s = Math.max(3, Math.min(size, 20))
  const rows = s, cols = s
  // Wall grid is (2*rows+1) × (2*cols+1): odd indices = cells, even = walls
  const h = 2 * rows + 1, w = 2 * cols + 1
  const grid = Array.from({ length: h }, () => Array(w).fill(1))
  const visited = Array.from({ length: rows }, () => Array(cols).fill(false))

  function carve(r, c) {
    visited[r][c] = true
    grid[r * 2 + 1][c * 2 + 1] = 0 // open cell
    const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]].sort(() => Math.random() - 0.5)
    for (const [dr, dc] of dirs) {
      const nr = r + dr, nc = c + dc
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !visited[nr][nc]) {
        grid[r * 2 + 1 + dr][c * 2 + 1 + dc] = 0 // remove wall between cells
        carve(nr, nc)
      }
    }
  }

  carve(0, 0)
  grid[1][0] = 0           // entrance
  grid[h - 2][w - 1] = 0  // exit
  // matrix: 1=wall, 0=passage
  return { matrix: grid, width: w, height: h }
}

// ── Conway's Game of Life ─────────────────────────────────────────────────

export function randomLifeGrid(size) {
  const s = Math.max(10, Math.min(size, 40))
  return Array.from({ length: s }, () =>
    Array.from({ length: s }, () => (Math.random() > 0.65 ? 1 : 0))
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
          n += grid[(r + dr + rows) % rows][(c + dc + cols) % cols]
        }
      return grid[r][c] === 1 ? (n === 2 || n === 3 ? 1 : 0) : (n === 3 ? 1 : 0)
    })
  )
}
