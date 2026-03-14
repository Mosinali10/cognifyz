/**
 * Reusable labelled input / select / textarea.
 * @param {{ label: string, type?: string, as?: 'input'|'select'|'textarea', error?: string, children?: React.ReactNode }} props
 */
export default function InputField({ label, as = 'input', error, children, ...rest }) {
  const Tag = as
  return (
    <div className="field">
      {label && <label>{label}</label>}
      <Tag className={as} {...rest}>
        {children}
      </Tag>
      {error && <span className="error-msg">{error}</span>}
    </div>
  )
}
