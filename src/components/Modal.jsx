import { useEffect } from 'react'

/**
 * Simple accessible modal overlay.
 */
export default function Modal({ title, onClose, children }) {
  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        className="card"
        style={{ width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto' }}
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="flex items-center justify-between mb-2">
          <h3>{title}</h3>
          <button className="btn-icon" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <hr className="divider" />
        {children}
      </div>
    </div>
  )
}
