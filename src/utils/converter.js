/** All temperature conversion formulas */

export const UNITS = ['Celsius', 'Fahrenheit', 'Kelvin']

export const SYMBOLS = { Celsius: '°C', Fahrenheit: '°F', Kelvin: 'K' }

/**
 * Convert a temperature value from one unit to another.
 * @param {number} value
 * @param {string} from  - 'Celsius' | 'Fahrenheit' | 'Kelvin'
 * @param {string} to    - 'Celsius' | 'Fahrenheit' | 'Kelvin'
 * @returns {number}
 */
export function convert(value, from, to) {
  if (from === to) return value

  // First convert to Celsius as the common base
  let celsius
  switch (from) {
    case 'Celsius':    celsius = value; break
    case 'Fahrenheit': celsius = (value - 32) * 5 / 9; break
    case 'Kelvin':     celsius = value - 273.15; break
    default: return NaN
  }

  // Then convert from Celsius to target
  switch (to) {
    case 'Celsius':    return celsius
    case 'Fahrenheit': return celsius * 9 / 5 + 32
    case 'Kelvin':     return celsius + 273.15
    default: return NaN
  }
}

/**
 * Returns all conversions for a given value and source unit.
 * @returns {{ unit: string, symbol: string, value: number }[]}
 */
export function convertAll(value, from) {
  return UNITS.map(unit => ({
    unit,
    symbol: SYMBOLS[unit],
    value: convert(value, from, unit),
  }))
}
