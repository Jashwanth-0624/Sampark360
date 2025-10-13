export function Avatar({ children, className = '', ...props }) { return <div className={className} {...props}>{children}</div> }
export function AvatarFallback({ children, ...props }) { return <div {...props}>{children}</div> }

export default { Avatar, AvatarFallback }
