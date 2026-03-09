'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { cn } from '@/lib/utils/cn'

interface HexViewerProps {
  data: Uint8Array | null
  bytesPerRow?: number
}

export function HexViewer({ data, bytesPerRow = 16 }: HexViewerProps) {
  const [scrollTop, setScrollTop] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const rowHeight = 24
  const visibleRows = 30
  
  const totalRows = data ? Math.ceil(data.length / bytesPerRow) : 0
  const startRow = Math.floor(scrollTop / rowHeight)
  const endRow = Math.min(startRow + visibleRows, totalRows)
  
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }, [])
  
  const formatHex = (byte: number) => byte.toString(16).padStart(2, '0').toUpperCase()
  const formatAscii = (byte: number) => (byte >= 32 && byte <= 126) ? String.fromCharCode(byte) : '.'
  
  if (!data) {
    return (
      <div className="flex items-center justify-center h-64 border rounded-lg bg-muted/30">
        <p className="text-muted-foreground">请上传文件以查看内容</p>
      </div>
    )
  }
  
  return (
    <div
      ref={containerRef}
      className="h-96 overflow-auto border rounded-lg bg-muted/30 font-mono text-sm"
      onScroll={handleScroll}
    >
      <div style={{ height: totalRows * rowHeight, position: 'relative' }}>
        {Array.from({ length: endRow - startRow }, (_, i) => {
          const rowIndex = startRow + i
          const offset = rowIndex * bytesPerRow
          const rowBytes = Array.from(data.slice(offset, offset + bytesPerRow))
          
          return (
            <div
              key={rowIndex}
              className="flex items-center px-4 hover:bg-muted/50"
              style={{
                position: 'absolute',
                top: rowIndex * rowHeight,
                height: rowHeight,
                width: '100%',
              }}
            >
              <span className="w-24 text-muted-foreground">
                {offset.toString(16).padStart(8, '0').toUpperCase()}
              </span>
              <span className="flex-1 tracking-wider">
                {rowBytes.map((byte, j) => (
                  <span key={j} className="inline-block w-6 text-center">
                    {formatHex(byte)}
                  </span>
                ))}
              </span>
              <span className="w-32 text-muted-foreground">
                {rowBytes.map(formatAscii).join('')}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
