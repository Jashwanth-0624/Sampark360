export function Input({ className = '', ...props }) {
  const base = 'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 disabled:cursor-not-allowed disabled:opacity-50'
  return <input className={`${base} ${className}`} {...props} />
}

export default Input
