import React, { createContext, useContext, useEffect, useState } from 'react'

const Ctx = createContext(null)

export function Sheet({ children, open: controlledOpen, onOpenChange, ...props }) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false)
  const open = typeof controlledOpen === 'boolean' ? controlledOpen : uncontrolledOpen
  const setOpen = (v) => {
    if (typeof onOpenChange === 'function') onOpenChange(v)
    if (typeof controlledOpen !== 'boolean') setUncontrolledOpen(v)
  }
  return (
    <Ctx.Provider value={{ open, setOpen }}>
      <div {...props}>{children}</div>
    </Ctx.Provider>
  )
}

export function SheetTrigger({ asChild = false, children, ...props }) {
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

export function SheetContent({ children, className = '', ...props }) {
  const ctx = useContext(Ctx)
  if (!ctx?.open) return null
  const close = () => ctx?.setOpen(false)
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000 }}>
      <div onClick={close} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)' }} />
      <div className={className} {...props} style={{ position: 'absolute', right: 0, top: 0, height: '100%', width: '28rem', maxWidth: '100%', background: 'white', padding: '1rem', overflowY: 'auto' }}>
        {children}
      </div>
    </div>
  )
}

export function SheetHeader({ children, ...props }) { return <div {...props}>{children}</div> }
export function SheetTitle({ children, ...props }) { return <h3 {...props}>{children}</h3> }
export function SheetDescription({ children, ...props }) { return <p {...props}>{children}</p> }

export default {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
}
