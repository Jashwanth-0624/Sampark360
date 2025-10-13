export function Progress({ value = 0, className = '', ...props }) {
  const clamped = Math.max(0, Math.min(100, Number(value) || 0))
  return (
    <div className={`h-2 w-full overflow-hidden rounded-full bg-gray-200 ${className}`} {...props}>
      <div className="h-full rounded-full bg-gradient-to-r from-orange-500 to-green-600 transition-all" style={{ width: `${clamped}%` }} />
    </div>
  )
}

export default Progress
