export function HoverCard({ children }) { return <div>{children}</div> }
export function HoverCardTrigger({ children, ...props }) { return <div {...props}>{children}</div> }
export function HoverCardContent({ children, className = '', ...props }) { return <div className={className} {...props}>{children}</div> }

export default { HoverCard, HoverCardTrigger, HoverCardContent }
