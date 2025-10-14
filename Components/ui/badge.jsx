export function Badge({ children, className = '', variant = 'default', ...props }) {
  const styles = {
    // Use a light, high-contrast default so text is always readable unless explicitly overridden
    default: 'inline-flex items-center rounded-full border border-transparent bg-gray-100 text-gray-800 px-2.5 py-0.5 text-xs font-medium',
    secondary: 'inline-flex items-center rounded-full border border-transparent bg-gray-100 text-gray-800 px-2.5 py-0.5 text-xs font-medium',
    destructive: 'inline-flex items-center rounded-full border border-transparent bg-red-600 text-white px-2.5 py-0.5 text-xs font-semibold',
    outline: 'inline-flex items-center rounded-full border border-gray-300 text-gray-700 px-2.5 py-0.5 text-xs font-medium'
  }
  return <span className={`${styles[variant] || styles.default} ${className}`} {...props}>{children}</span>
}

export default Badge
