export function Label({ children, htmlFor, className = '', ...props }) {
  const base = 'block text-sm font-medium text-gray-700 mb-1'
  return <label htmlFor={htmlFor} className={`${base} ${className}`} {...props}>{children}</label>
}
export default Label
