import React from 'react'

export default function AgencyRegistry() {
  const src = 'https://sampark-360-copy-8d8e3371.base44.app/AgencyRegistry'
  return (
    <div className="p-0">
      <iframe
        title="Agency Registry"
        src={src}
        className="w-full border rounded-xl shadow-sm"
        style={{ height: 'calc(100vh - 140px)' }}
      />
      <noscript>
        You need to enable JavaScript to view the embedded Agency Registry.
      </noscript>
    </div>
  )
}
