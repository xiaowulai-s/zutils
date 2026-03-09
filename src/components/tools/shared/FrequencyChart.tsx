interface FrequencyChartProps {
  data: Array<{ frequency: number; magnitude: number; phase: number }>
  type: 'magnitude' | 'phase'
}

export function FrequencyChart({ data, type }: FrequencyChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-48 flex items-center justify-center text-muted-foreground">
        暂无数据
      </div>
    )
  }
  
  const chartData = type === 'magnitude' 
    ? data.map(function(d) {
        return {
          x: Math.log10(Math.max(d.frequency, 1)),
          y: 20 * Math.log10(Math.max(d.magnitude, 0.0001)),
          label: d.frequency
        }
      })
    : data.map(function(d) {
        return {
          x: Math.log10(Math.max(d.frequency, 1)),
          y: d.phase,
          label: d.frequency
        }
      })
  
  const minY = Math.min.apply(chartData, function(d) { return d.y })
  const maxY = Math.max.apply(chartData, function(d) { return d.y })
  const rangeY = maxY - minY || 1
  
  const width = 400
  const height = 200
  const padding = { top: 20, right: 20, bottom: 40, left: 50 }
  const chartWidth = width - padding.left - padding.right
  const chartHeight = height - padding.top - padding.bottom
  
  const divisor = chartData.length > 1 ? chartData.length - 1 : 1
  
  const points: Array<{ x: number; y: number; label: number }> = []
  for (let i = 0; i < chartData.length; i++) {
    const d = chartData[i]
    points.push({
      x: padding.left + (i / divisor) * chartWidth,
      y: padding.top + chartHeight - ((d.y - minY) / rangeY) * chartHeight,
      label: d.label
    })
  }
  
  const pathD = points.map(function(p, i) {
    return (i === 0 ? 'M' : 'L') + ' ' + p.x + ' ' + p.y
  }).join(' ')
  
  return (
    <div className="w-full">
      <svg viewBox={'0 0 '.concat(width, ' ').concat(height')} className="w-full h-auto">
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
          stroke="var(--primary)"
          strokeWidth="2"
        />
        
        {points.map(function(p, i) {
          return (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r="4"
              fill="var(--primary)"
            />
          )
        })}
        
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
          transform={'rotate(-90, 15, '.concat(padding.top + chartHeight / 2, ')')}
          className="text-xs fill-muted-foreground"
        >
          {type === 'magnitude' ? '增益' : '相位 (°)'}
        </text>
      </svg>
      
      <div className="flex justify-between text-xs text-muted-foreground mt-2 px-12">
        {points.slice(0, 5).map(function(p, i) {
          return (
            <span key={i}>
              {p.label < 1000 ? ''.concat(Math.round(p.label), ' Hz') : ''.concat(Math.round(p.label / 1000), ' kHz')}
            </span>
          )
        })}
      </div>
    </div>
  )
}
