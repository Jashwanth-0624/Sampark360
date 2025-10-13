export function Alert({ children, className = '', ...props }) { return <div className={`relative w-full rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 ${className}`} {...props}>{children}</div> }
export function AlertDescription({ children, ...props }) { return <div {...props}>{children}</div> }

export default { Alert, AlertDescription }
