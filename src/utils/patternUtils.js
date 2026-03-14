/**
 * Pattern generation utilities.
 * Each function returns a 2D boolean array: true = filled cell.
 */

export const PATTERN_TYPES = [
  { id: 'triangle',    label: 'Equilateral Triangle' },
  { id: 'pyramid',     label: 'Pyramid' },
  { id: 'square',      label: 'Square' },
  { id: 'diamond',     label: 'Diamond' },
  { id: 'right',       label: 'Right-Angle Triangle' },
  { id: 'hollow',      label: 'Hollow Square' },
  { id: 'cross',       label: 'Plus / Cross' },
  { id: 'xshape',      label: 'X Shape' },
  { id: 'checker',     label: 'Checkerboard' },
  { id: 'hollowdiamond', label: 'Hollow Diamond' },
  { id: 'hourglass',   label: 'Hourglass' },
  { id: 'arrow',       label: 'Arrow Up' },
  { id: 'zigzag',      label: 'Zigzag' },
  { id: 'stairs',      label: 'Staircase' },
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
    case 'cross': {
      const mid = Math.floor(s / 2)
      return Array.from({ length: s }, (_, i) =>
        Array.from({ length: s }, (_, j) => i === mid || j === mid)
      )
    }
    case 'xshape': {
      return Array.from({ length: s }, (_, i) =>
        Array.from({ length: s }, (_, j) => i === j || i + j === s - 1)
      )
    }
    case 'checker': {
      return Array.from({ length: s }, (_, i) =>
        Array.from({ length: s }, (_, j) => (i + j) % 2 === 0)
      )
    }
    case 'hollowdiamond': {
      const rows = []
      const w = 2 * s - 1
      for (let i = 1; i <= s; i++) {
        const start = s - i
        const end = s + i - 2
        rows.push(Array.from({ length: w }, (_, j) =>
          j === start || j === end || (i === 1 && j === start)
        ))
      }
      for (let i = s - 1; i >= 1; i--) {
        const start = s - i
        const end = s + i - 2
        rows.push(Array.from({ length: w }, (_, j) =>
          j === start || j === end || (i === 1 && j === start)
        ))
      }
      return rows
    }
    case 'hourglass': {
      return Array.from({ length: s }, (_, i) => {
        const half = Math.floor(s / 2)
        const dist = i <= half ? i : s - 1 - i
        return Array.from({ length: s }, (_, j) => j <= dist || j >= s - 1 - dist)
      })
    }
    case 'arrow': {
      const rows = []
      // arrowhead (top half)
      for (let i = 0; i < s; i++) {
        const w = 2 * s - 1
        const stars = 2 * i + 1
        const start = s - i - 1
        rows.push(Array.from({ length: w }, (_, j) => j >= start && j < start + stars))
      }
      // stem (bottom half)
      const stemW = 2 * s - 1
      const stemStart = s - 2
      const stemEnd = s
      for (let i = 1; i < Math.ceil(s / 2); i++) {
        rows.push(Array.from({ length: stemW }, (_, j) => j >= stemStart && j < stemEnd))
      }
      return rows
    }
    case 'zigzag': {
      return Array.from({ length: s }, (_, i) => {
        const pos = i % 2 === 0 ? i % s : s - 1 - (i % s)
        return Array.from({ length: s }, (_, j) => j === pos || j === pos - 1 || j === pos + 1)
      })
    }
    case 'stairs': {
      return Array.from({ length: s }, (_, i) =>
        Array.from({ length: s }, (_, j) => j <= i && j >= i - 1)
      )
    }
    default:
      return []
  }
}
