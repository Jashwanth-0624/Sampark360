import React, { createContext, useContext, useState, useRef, useEffect } from 'react'

const Ctx = createContext(null)

export function Select({ children, value: controlledValue, onValueChange }) {
  const [internalValue, setInternalValue] = useState('')
  const [label, setLabel] = useState('')
  const [open, setOpen] = useState(false)
  const value = controlledValue !== undefined ? controlledValue : internalValue
  const setValue = (v, lbl) => {
    if (onValueChange) onValueChange(v)
    if (controlledValue === undefined) setInternalValue(v)
    setLabel(lbl ?? '')
    setOpen(false)
  }
  return (
    <Ctx.Provider value={{ value, setValue, label, setLabel, open, setOpen }}>
      <div style={{ position: 'relative', display: 'inline-block', minWidth: 160 }}>
        {children}
      </div>
    </Ctx.Provider>
  )
}

export function SelectTrigger({ children, ...props }) {
  const ctx = useContext(Ctx)
  const onClick = (e) => {
    if (props.onClick) props.onClick(e)
    ctx?.setOpen(!ctx?.open)
  }
  return React.isValidElement(children)
    ? React.cloneElement(children, { ...props, onClick })
    : <button {...props} onClick={onClick}>{children}</button>
}

export function SelectValue({ placeholder = '', ...props }) {
  const ctx = useContext(Ctx)
  return <span {...props}>{ctx?.label || placeholder}</span>
}

export function SelectContent({ children, className = '', align = 'start', ...props }) {
  const ctx = useContext(Ctx)
  const ref = useRef(null)
  useEffect(() => {
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) ctx?.setOpen(false) }
    if (ctx?.open) document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [ctx?.open])
  if (!ctx?.open) return null
  const style = { position: 'absolute', top: '100%', marginTop: 8, zIndex: 60, right: align === 'end' ? 0 : 'auto', left: align === 'end' ? 'auto' : 0, background: 'white', borderRadius: 8, boxShadow: '0 10px 20px rgba(0,0,0,0.15)', padding: 4, maxHeight: 240, overflowY: 'auto' }
  return <div ref={ref} className={className} style={style} {...props}>{children}</div>
}

export function SelectItem({ value, children, ...props }) {
  const ctx = useContext(Ctx)
  const onClick = (e) => {
    if (props.onClick) props.onClick(e)
    ctx?.setValue(value ?? String(children), String(children))
  }
  return <div role="option" onClick={onClick} style={{ padding: '6px 8px', cursor: 'pointer' }} {...props}>{children}</div>
}

export default { Select, SelectTrigger, SelectValue, SelectContent, SelectItem }
