/**
 * @param {{ variant?: 'primary'|'secondary'|'danger'|'success', size?: 'sm', children: React.ReactNode }} props
 */
export default function Button({ variant = 'primary', size, children, ...rest }) {
  const cls = ['btn', `btn-${variant}`, size ? `btn-${size}` : ''].filter(Boolean).join(' ')
  return <button className={cls} {...rest}>{children}</button>
}
