/**
 * Pattern generation utilities.
 * Each function returns a 2D boolean array: true = filled cell.
 */

export const PATTERN_TYPES = [
  { id: 'triangle',  label: 'Equilateral Triangle' },
  { id: 'pyramid',   label: 'Pyramid' },
  { id: 'square',    label: 'Square' },
  { id: 'diamond',   label: 'Diamond' },
  { id: 'right',     label: 'Right-Angle Triangle' },
  { id: 'hollow',    label: 'Hollow Square' },
]

/** Build a row of `total` cells where indices in `filled` are true */
function row(total, filled) {
  return Array.from({ length: total }, (_, i) => filled.includes(i))
}

export function generatePattern(type, size) {
  const s = Math.max(1, Math.min(size, 20)) // clamp 1-20
  const width = type === 'diamond' || type === 'triangle' || type === 'pyramid'
    ? 2 * s - 1
    : s

  switch (type) {
    case 'triangle':
    case 'pyramid': {
      return Array.from({ length: s }, (_, i) => {
        const stars = 2 * i + 1
        const start = s - i - 1
        return Array.from({ length: width }, (_, j) => j >= start && j < start + stars)
      })
    }
    case 'square': {
      return Array.from({ length: s }, () => Array(s).fill(true))
    }
    case 'diamond': {
      const rows = []
      for (let i = 1; i <= s; i++) {
        const stars = 2 * i - 1
        const start = s - i
        rows.push(Array.from({ length: width }, (_, j) => j >= start && j < start + stars))
      }
      for (let i = s - 1; i >= 1; i--) {
        const stars = 2 * i - 1
        const start = s - i
        rows.push(Array.from({ length: width }, (_, j) => j >= start && j < start + stars))
      }
      return rows
    }
    case 'right': {
      return Array.from({ length: s }, (_, i) =>
        Array.from({ length: s }, (_, j) => j <= i)
      )
    }
    case 'hollow': {
      return Array.from({ length: s }, (_, i) =>
        Array.from({ length: s }, (_, j) =>
          i === 0 || i === s - 1 || j === 0 || j === s - 1
        )
      )
    }
    default:
      return []
  }
}
