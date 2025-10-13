import React, { createContext, useContext } from 'react'

const SidebarCtx = createContext({})

export function SidebarProvider({ children }) {
  const value = {}
  return <SidebarCtx.Provider value={value}>{children}</SidebarCtx.Provider>
}

export function Sidebar({ children, className = '', ...props }) {
  return <aside className={className} {...props}>{children}</aside>
}
export function SidebarHeader({ children, className = '', ...props }) {
  return <div className={className} {...props}>{children}</div>
}
export function SidebarContent({ children, className = '', ...props }) {
  return <div className={className} {...props}>{children}</div>
}
export function SidebarFooter({ children, className = '', ...props }) {
  return <div className={className} {...props}>{children}</div>
}
export function SidebarGroup({ children }) { return <div>{children}</div> }
export function SidebarGroupLabel({ children, className = '', ...props }) { return <div className={className} {...props}>{children}</div> }
export function SidebarGroupContent({ children }) { return <div>{children}</div> }
export function SidebarMenu({ children }) { return <div>{children}</div> }
export function SidebarMenuItem({ children }) { return <div>{children}</div> }
export function SidebarMenuButton({ asChild = false, children, className = '', ...props }) {
  if (asChild && React.isValidElement(children)) {
    const existing = children.props?.className || ''
    const merged = [existing, className].filter(Boolean).join(' ')
    return React.cloneElement(children, { ...props, className: merged })
  }
  return <button className={className} {...props}>{children}</button>
}
export function SidebarTrigger({ asChild = false, children, ...props }) {
  return asChild ? children : <button {...props}>{children || '≡'}</button>
}

export default {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
}
