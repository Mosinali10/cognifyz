import { useState } from 'react'
import {
  loadTasks, saveTasks, createTask,
  toggleTask, updateTask, deleteTask, filterTasks
} from '../utils/taskUtils'
import Button from '../components/Button'
import Modal from '../components/Modal'
import InputField from '../components/InputField'

const FILTERS = ['all', 'active', 'completed']

export default function TaskManager() {
  const [tasks,  setTasks]  = useState(loadTasks)
  const [filter, setFilter] = useState('all')
  const [input,  setInput]  = useState('')
  const [note,   setNote]   = useState('')
  const [editing, setEditing] = useState(null) // { id, title, note }
  const [error,  setError]  = useState('')

  const persist = (next) => { setTasks(next); saveTasks(next) }

  const handleAdd = () => {
    if (!input.trim()) { setError('Task title is required.'); return }
    persist([createTask(input.trim(), note.trim()), ...tasks])
    setInput(''); setNote(''); setError('')
  }

  const handleToggle = (id) => persist(toggleTask(tasks, id))
  const handleDelete = (id) => persist(deleteTask(tasks, id))

  const handleSaveEdit = () => {
    if (!editing.title.trim()) return
    persist(updateTask(tasks, editing.id, { title: editing.title, note: editing.note }))
    setEditing(null)
  }

  const visible = filterTasks(tasks, filter)
  const doneCount = tasks.filter(t => t.done).length

  return (
    <div className="page">
      <div className="page-header">
        <h1>✅ Task Manager</h1>
        <p>Track your tasks. Data is saved in your browser automatically.</p>
      </div>

      {/* Add task */}
      <div className="card" style={{ maxWidth: 640 }}>
        <h3 style={{ marginBottom: '1rem' }}>Add a Task</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <InputField
            label="Title"
            placeholder="What needs to be done?"
            value={input}
            onChange={e => { setInput(e.target.value); setError('') }}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            error={error}
          />
          <InputField
            label="Note (optional)"
            as="textarea"
            placeholder="Any extra details..."
            value={note}
            onChange={e => setNote(e.target.value)}
            style={{ minHeight: 60 }}
          />
          <Button onClick={handleAdd}>+ Add Task</Button>
        </div>
      </div>

      {/* Filter + stats */}
      <div className="flex items-center justify-between mt-3 mb-1" style={{ maxWidth: 640, flexWrap: 'wrap', gap: '0.75rem' }}>
        <div className="filter-tabs">
          {FILTERS.map(f => (
            <button key={f} className={`filter-tab${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          {doneCount}/{tasks.length} completed
        </span>
      </div>

      {/* Task list */}
      <div style={{ maxWidth: 640, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {visible.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📭</div>
            <p>{filter === 'all' ? 'No tasks yet. Add one above.' : `No ${filter} tasks.`}</p>
          </div>
        ) : (
          visible.map(task => (
            <div key={task.id} className={`task-item${task.done ? ' done' : ''}`}>
              {/* Checkbox */}
              <div
                className={`task-checkbox${task.done ? ' checked' : ''}`}
                onClick={() => handleToggle(task.id)}
                role="checkbox"
                aria-checked={task.done}
                tabIndex={0}
                onKeyDown={e => e.key === ' ' && handleToggle(task.id)}
              >
                {task.done && <span style={{ color: '#fff', fontSize: '0.7rem' }}>✓</span>}
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="task-title">{task.title}</div>
                {task.note && <div className="task-meta">{task.note}</div>}
              </div>

              {/* Actions */}
              <button className="btn-icon" onClick={() => setEditing({ ...task })} aria-label="Edit task">✏️</button>
              <button className="btn-icon" onClick={() => handleDelete(task.id)} aria-label="Delete task"
                style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}>🗑</button>
            </div>
          ))
        )}
      </div>

      {/* Edit modal */}
      {editing && (
        <Modal title="Edit Task" onClose={() => setEditing(null)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            <InputField
              label="Title"
              value={editing.title}
              onChange={e => setEditing(p => ({ ...p, title: e.target.value }))}
            />
            <InputField
              label="Note"
              as="textarea"
              value={editing.note}
              onChange={e => setEditing(p => ({ ...p, note: e.target.value }))}
            />
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <Button variant="secondary" onClick={() => setEditing(null)}>Cancel</Button>
              <Button onClick={handleSaveEdit}>Save</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
