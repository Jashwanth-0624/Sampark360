import React from 'react'

const variants = {
  default: 'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-orange-500 to-green-600 text-white hover:from-orange-600 hover:to-green-700 shadow',
  outline: 'inline-flex items-center justify-center whitespace-nowrap rounded-md border border-gray-300 bg-white text-gray-900 text-sm font-medium hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 disabled:pointer-events-none disabled:opacity-50',
  ghost: 'inline-flex items-center justify-center rounded-md text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50',
  secondary: 'inline-flex items-center justify-center rounded-md text-sm font-medium bg-gray-900 text-white hover:bg-gray-800',
  link: 'inline-flex items-center text-sm text-orange-600 underline-offset-4 hover:underline'
}
const sizes = {
  default: 'h-10 px-4 py-2',
  sm: 'h-8 px-3',
  lg: 'h-11 px-6',
  icon: 'h-10 w-10'
}

export function Button({ children, className = '', variant = 'default', size = 'default', ...props }) {
  const cls = `${variants[variant] || variants.default} ${sizes[size] || sizes.default} ${className}`
  return <button className={cls} {...props}>{children}</button>
}

export default Button
