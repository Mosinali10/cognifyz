import { useState } from 'react'
import { loadRecords, saveRecords, createRecord, updateRecord, deleteRecord } from '../utils/crudUtils'
import Button from '../components/Button'
import Modal from '../components/Modal'
import InputField from '../components/InputField'

const ROLES   = ['Developer', 'Designer', 'Manager', 'Analyst', 'QA Engineer']
const STATUSES = ['Active', 'Inactive', 'Pending']

const EMPTY = { name: '', email: '', role: 'Developer', status: 'Active' }

function RecordForm({ values, onChange, onSubmit, onCancel, submitLabel }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
      <InputField label="Name"  placeholder="Full name"  value={values.name}
        onChange={e => onChange('name', e.target.value)} />
      <InputField label="Email" placeholder="email@example.com" type="email" value={values.email}
        onChange={e => onChange('email', e.target.value)} />
      <InputField label="Role" as="select" value={values.role}
        onChange={e => onChange('role', e.target.value)}>
        {ROLES.map(r => <option key={r}>{r}</option>)}
      </InputField>
      <InputField label="Status" as="select" value={values.status}
        onChange={e => onChange('status', e.target.value)}>
        {STATUSES.map(s => <option key={s}>{s}</option>)}
      </InputField>
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button onClick={onSubmit}>{submitLabel}</Button>
      </div>
    </div>
  )
}

export default function CrudDashboard() {
  const [records, setRecords] = useState(loadRecords)
  const [showAdd, setShowAdd] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form,    setForm]    = useState(EMPTY)
  const [search,  setSearch]  = useState('')

  const persist = (next) => { setRecords(next); saveRecords(next) }

  const handleAdd = () => {
    if (!form.name.trim() || !form.email.trim()) return
    persist([createRecord(form), ...records])
    setForm(EMPTY); setShowAdd(false)
  }

  const handleEdit = (r) => { setEditing(r); setForm({ name: r.name, email: r.email, role: r.role, status: r.status }) }

  const handleSaveEdit = () => {
    persist(updateRecord(records, editing.id, form))
    setEditing(null); setForm(EMPTY)
  }

  const handleDelete = (id) => persist(deleteRecord(records, id))

  const fieldChange = (key, val) => setForm(p => ({ ...p, [key]: val }))

  const filtered = records.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.email.toLowerCase().includes(search.toLowerCase()) ||
    r.role.toLowerCase().includes(search.toLowerCase())
  )

  const statusColor = { Active: 'success', Inactive: 'danger', Pending: 'warning' }

  return (
    <div className="page">
      <div className="page-header">
        <h1>🗂️ CRUD Dashboard</h1>
        <p>Manage user records — create, update, and delete. Persisted in your browser.</p>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-2" style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
        <input
          className="input"
          style={{ maxWidth: 280 }}
          placeholder="🔍 Search by name, email, role..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <Button onClick={() => { setForm(EMPTY); setShowAdd(true) }}>+ Add Record</Button>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="icon">🗃️</div>
          <p>{records.length === 0 ? 'No records yet. Add one to get started.' : 'No records match your search.'}</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr key={r.id}>
                  <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                  <td style={{ fontWeight: 600 }}>{r.name}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{r.email}</td>
                  <td><span className="badge badge-accent">{r.role}</span></td>
                  <td><span className={`badge badge-${statusColor[r.status] || 'accent'}`}>{r.status}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button className="btn-icon" onClick={() => handleEdit(r)} aria-label="Edit">✏️</button>
                      <button className="btn-icon" onClick={() => handleDelete(r.id)} aria-label="Delete"
                        style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}>🗑</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add modal */}
      {showAdd && (
        <Modal title="Add Record" onClose={() => setShowAdd(false)}>
          <RecordForm values={form} onChange={fieldChange} onSubmit={handleAdd}
            onCancel={() => setShowAdd(false)} submitLabel="Add Record" />
        </Modal>
      )}

      {/* Edit modal */}
      {editing && (
        <Modal title="Edit Record" onClose={() => setEditing(null)}>
          <RecordForm values={form} onChange={fieldChange} onSubmit={handleSaveEdit}
            onCancel={() => setEditing(null)} submitLabel="Save Changes" />
        </Modal>
      )}
    </div>
  )
}
