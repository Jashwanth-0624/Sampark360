import React, { createContext, useContext, useEffect, useRef, useState } from 'react'

const Ctx = createContext(null)

export function Popover({ children }) {
  const [open, setOpen] = useState(false)
  return (
    <Ctx.Provider value={{ open, setOpen }}>
      <div style={{ position: 'relative', display: 'inline-block' }}>{children}</div>
    </Ctx.Provider>
  )
}

export function PopoverTrigger({ asChild = false, children, ...props }) {
  const ctx = useContext(Ctx)
  const onClick = (e) => { if (props.onClick) props.onClick(e); ctx?.setOpen(!ctx?.open) }
  if (asChild && React.isValidElement(children)) return React.cloneElement(children, { ...props, onClick })
  return <button {...props} onClick={onClick}>{children}</button>
}

export function PopoverContent({ children, className = '', align = 'start', ...props }) {
  const ctx = useContext(Ctx)
  const ref = useRef(null)
  useEffect(() => {
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) ctx?.setOpen(false) }
    if (ctx?.open) document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [ctx?.open])
  if (!ctx?.open) return null
  const style = { position: 'absolute', top: '100%', marginTop: 8, zIndex: 60, right: align === 'end' ? 0 : 'auto', left: align === 'end' ? 'auto' : 0, background: 'white', borderRadius: 8, boxShadow: '0 10px 20px rgba(0,0,0,0.15)', padding: 8, minWidth: 200 }
  return <div ref={ref} className={className} style={style} {...props}>{children}</div>
}

export default { Popover, PopoverTrigger, PopoverContent }
