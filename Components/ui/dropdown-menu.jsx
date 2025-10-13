import React, { createContext, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'

const Ctx = createContext(null)

export function DropdownMenu({ children }) {
  const [open, setOpen] = useState(false)
  const [anchorRect, setAnchorRect] = useState(null)
  return (
    <Ctx.Provider value={{ open, setOpen, anchorRect, setAnchorRect }}>
      <div style={{ position: 'relative', display: 'inline-block' }}>
        {children}
      </div>
    </Ctx.Provider>
  )
}

export function DropdownMenuTrigger({ asChild = false, children, ...props }) {
  const ctx = useContext(Ctx)
  const onClick = (e) => {
    if (props.onClick) props.onClick(e)
    try { ctx?.setAnchorRect?.(e.currentTarget.getBoundingClientRect()) } catch {}
    ctx?.setOpen(!ctx?.open)
  }
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, { ...props, onClick })
  }
  return <button {...props} onClick={onClick}>{children}</button>
}

export function DropdownMenuContent({ children, className = '', align = 'start', side = 'auto', ...props }) {
  const ctx = useContext(Ctx)
  const ref = useRef(null)
  const [pos, setPos] = useState(null)

  useEffect(() => {
    const onDoc = (e) => {
      if (!ref.current) return
      if (!ref.current.contains(e.target)) ctx?.setOpen(false)
    }
    if (ctx?.open) document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [ctx?.open])

  useLayoutEffect(() => {
    if (!ctx?.open) return
    const el = ref.current
    if (!el || !ctx.anchorRect) return
    // Measure content
    el.style.visibility = 'hidden'
    el.style.display = 'block'
    const contentW = el.offsetWidth || 224
    const contentH = el.offsetHeight || 200
    el.style.visibility = ''
    el.style.display = ''

    const ar = ctx.anchorRect
    const vw = window.innerWidth
    const vh = window.innerHeight

    // Decide vertical side
    const spaceBelow = vh - ar.bottom
    const spaceAbove = ar.top
    let useTop = false
    if (side === 'top') useTop = true
    else if (side === 'bottom') useTop = false
    else useTop = spaceBelow < contentH && spaceAbove > spaceBelow

    // Compute top/bottom
    let top = undefined, bottom = undefined
    if (useTop) {
      bottom = Math.max(vh - ar.top + 8, 8)
    } else {
      top = Math.min(ar.bottom + 8, vh - contentH - 8)
    }

    // Compute horizontal
    let left = align === 'end' ? ar.right - contentW : ar.left
    left = Math.min(Math.max(left, 8), vw - contentW - 8)

    setPos({ position: 'fixed', top, bottom, left, zIndex: 1000 })
  }, [ctx?.open, ctx?.anchorRect, align, side])

  if (!ctx?.open) return null
  const base = {
    maxHeight: '60vh',
    overflowY: 'auto',
    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)',
    background: 'white',
    borderRadius: 8,
    border: '1px solid rgba(0,0,0,0.08)'
  }
  return <div ref={ref} className={className} style={{ ...(pos || {}), ...base }} {...props}>{children}</div>
}

export function DropdownMenuItem({ children, ...props }) { return <div role="menuitem" {...props}>{children}</div> }
export function DropdownMenuLabel({ children, ...props }) { return <div {...props}>{children}</div> }
export function DropdownMenuSeparator() { return <hr /> }

export default {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
}
