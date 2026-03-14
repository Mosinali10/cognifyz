const KEY = 'duh_records'

/** @returns {{ id: string, name: string, email: string, role: string, status: string, createdAt: number }[]} */
export function loadRecords() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || []
  } catch {
    return []
  }
}

export function saveRecords(records) {
  localStorage.setItem(KEY, JSON.stringify(records))
}

export function createRecord(fields) {
  return { id: crypto.randomUUID(), ...fields, createdAt: Date.now() }
}

export function updateRecord(records, id, fields) {
  return records.map(r => r.id === id ? { ...r, ...fields } : r)
}

export function deleteRecord(records, id) {
  return records.filter(r => r.id !== id)
}
