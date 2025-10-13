import React, { createContext, useContext, useState } from 'react'

const Ctx = createContext(null)

export function Dialog({ children, open: controlledOpen, onOpenChange }) {
  const [internalOpen, setInternalOpen] = useState(false)
  const open = typeof controlledOpen === 'boolean' ? controlledOpen : internalOpen
  const setOpen = (v) => {
    if (typeof onOpenChange === 'function') onOpenChange(v)
    if (typeof controlledOpen !== 'boolean') setInternalOpen(v)
  }
  return (
    <Ctx.Provider value={{ open, setOpen }}>
      {children}
    </Ctx.Provider>
  )
}

export function DialogTrigger({ asChild = false, children, ...props }) {
  const ctx = useContext(Ctx)
  const onClick = (e) => {
    if (props.onClick) props.onClick(e)
    ctx?.setOpen(true)
  }
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, { ...props, onClick })
  }
  return <button {...props} onClick={onClick}>{children}</button>
}

export function DialogContent({ children, className = '', ...props }) {
  const ctx = useContext(Ctx)
  if (!ctx?.open) return null
  const close = () => ctx?.setOpen(false)
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 70 }}>
      <div onClick={close} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)' }} />
      <div className={className} {...props} style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', background: 'white', padding: '1rem', borderRadius: '0.5rem', maxHeight: '80vh', overflowY: 'auto', width: 'min(48rem, 90vw)' }}>
        {children}
      </div>
    </div>
  )
}
export function DialogHeader({ children, ...props }) { return <div {...props}>{children}</div> }
export function DialogTitle({ children, ...props }) { return <h3 {...props}>{children}</h3> }
export function DialogDescription({ children, ...props }) { return <p {...props}>{children}</p> }
export function DialogFooter({ children, ...props }) { return <div {...props}>{children}</div> }

export default { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter }
