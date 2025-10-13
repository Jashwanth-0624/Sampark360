import React, { createContext, useContext, useState } from 'react'

const Ctx = createContext(null)

export function Tabs({ children, defaultValue }) {
  const [value, setValue] = useState(defaultValue)
  return <Ctx.Provider value={{ value, setValue }}>{children}</Ctx.Provider>
}

export function TabsList({ children, className = '' }) {
  return <div className={`inline-grid grid-cols-3 rounded-lg bg-gray-100 p-1 ${className}`}>{children}</div>
}

export function TabsTrigger({ children, value, className = '', ...props }) {
  const ctx = useContext(Ctx)
  const active = ctx?.value === value
  const base = active ? 'bg-white shadow text-gray-900' : 'text-gray-600'
  return (
    <button className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${base} ${className}`} onClick={() => ctx?.setValue(value)} {...props}>
      {children}
    </button>
  )
}

export function TabsContent({ children, value, className = '' }) {
  const ctx = useContext(Ctx)
  if (ctx?.value !== value) return null
  return <div className={className}>{children}</div>
}

export default { Tabs, TabsList, TabsTrigger, TabsContent }
