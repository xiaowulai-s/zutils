'use client'

import React from 'react'

interface ToolShellProps {
  title: string
  icon?: React.ReactNode
  children: React.ReactNode
}

export function ToolShell({ title, icon, children }: ToolShellProps) {
  return (
    <div className="container py-8">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          {icon && <div className="text-blue-500">{icon}</div>}
          <h1 className="text-2xl font-bold">{title}</h1>
        </div>
      </div>
      {children}
    </div>
  )
}
