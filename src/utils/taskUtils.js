const KEY = 'duh_tasks'

/** @returns {{ id: string, title: string, note: string, done: boolean, createdAt: number }[]} */
export function loadTasks() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || []
  } catch {
    return []
  }
}

export function saveTasks(tasks) {
  localStorage.setItem(KEY, JSON.stringify(tasks))
}

export function createTask(title, note = '') {
  return { id: crypto.randomUUID(), title, note, done: false, createdAt: Date.now() }
}

export function toggleTask(tasks, id) {
  return tasks.map(t => t.id === id ? { ...t, done: !t.done } : t)
}

export function updateTask(tasks, id, fields) {
  return tasks.map(t => t.id === id ? { ...t, ...fields } : t)
}

export function deleteTask(tasks, id) {
  return tasks.filter(t => t.id !== id)
}

export function filterTasks(tasks, filter) {
  if (filter === 'active')    return tasks.filter(t => !t.done)
  if (filter === 'completed') return tasks.filter(t => t.done)
  return tasks
}
