'use client'

import { useMemo } from 'react'
import type { FrequencyPoint } from '@/lib/calculations/filter'

interface FrequencyChartProps {
  data: FrequencyPoint[]
  type: 'magnitude' | 'phase'
  cutoffFrequency: number
}

export function FrequencyChart({ data, type, cutoffFrequency }: FrequencyChartProps) {
  const chartData = useMemo(() => {
    if (type === 'magnitude') {
      return data.map(d => ({
        x: Math.log10(d.frequency),
        y: 20 * Math.log10(d.magnitude),
        label: d.frequency
      }))
    }
    return data.map(d => ({
      x: Math.log10(d.frequency),
      y: d.phase,
      label: d.frequency
    }))
  }, [data, type])
  
  const minY = Math.min(...chartData.map(d => d.y))
  const maxY = Math.max(...chartData.map(d => d.y))
  const rangeY = maxY - minY || 1
  
  const width = 400
  const height = 200
  const padding = { top: 20, right: 20, bottom: 40, left: 50 }
  const chartWidth = width - padding.left - padding.right
  const chartHeight = height - padding.top - padding.bottom
  
  const points = chartData.map((d, i) => ({
    x: padding.left + (i / (chartData.length - 1)) * chartWidth,
    y: padding.top + chartHeight - ((d.y - minY) / rangeY) * chartHeight,
    ...d
  }))
  
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  
  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--primary)" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.5" />
          </linearGradient>
        </defs>
        
        <rect
          x={padding.left}
          y={padding.top}
          width={chartWidth}
          height={chartHeight}
          fill="var(--muted)"
          opacity="0.3"
        />
        
        <line
          x1={padding.left}
          y1={padding.top + chartHeight / 2}
          x2={padding.left + chartWidth}
          y2={padding.top + chartHeight / 2}
          stroke="var(--border)"
          strokeDasharray="4"
        />
        
        <path
          d={pathD}
          fill="none"
          stroke="url(#lineGradient)"
          strokeWidth="2"
        />
        
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="4"
            fill="var(--primary)"
          />
        ))}
        
        <text
          x={padding.left + chartWidth / 2}
          y={height - 5}
          textAnchor="middle"
          className="text-xs fill-muted-foreground"
        >
          频率
        </text>
        
        <text
          x={15}
          y={padding.top + chartHeight / 2}
          textAnchor="middle"
          transform={`rotate(-90, 15, ${padding.top + chartHeight / 2})`}
          className="text-xs fill-muted-foreground"
        >
          {type === 'magnitude' ? '增益' : '相位 (°)'}
        </text>
      </svg>
      
      <div className="flex justify-between text-xs text-muted-foreground mt-2 px-12">
        {chartData.slice(0, 5).map((d, i) => (
          <span key={i}>
            {d.label < 1000 ? `${d.label.toFixed(0)} Hz` : `${(d.label / 1000).toFixed(0)} kHz`}
          </span>
        ))}
      </div>
    </div>
  )
}
