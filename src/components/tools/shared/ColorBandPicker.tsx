import * as React from 'react'
import { cn } from '@/lib/utils/cn'
import { COLOR_BANDS } from '@/lib/calculations/resistor'

interface ColorBandPickerProps {
  value: string
  onChange: (color: string) => void
  label: string
  type: 'digit' | 'multiplier' | 'tolerance' | 'tempCoeff'
  excludeColors?: string[]
}

export function ColorBandPicker({
  value,
  onChange,
  label,
  type,
  excludeColors = [],
}: ColorBandPickerProps) {
  const availableColors = COLOR_BANDS.filter((band) => {
    if (excludeColors.includes(band.color)) return false
    
    if (type === 'digit' && band.value === null) return false
    if (type === 'multiplier' && band.multiplier === null) return false
    if (type === 'tolerance' && band.tolerance === null) return false
    if (type === 'tempCoeff' && band.tempCoeff === null) return false
    
    return true
  })
  
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-foreground">{label}</label>
      <div className="flex flex-wrap gap-2">
        {availableColors.map((band) => (
          <button
            key={band.color}
            type="button"
            onClick={() => onChange(band.color)}
            className={cn(
              'w-8 h-8 rounded-md border-2 transition-all',
              value === band.color
                ? 'border-primary ring-2 ring-primary ring-offset-2'
                : 'border-transparent hover:border-gray-300'
            )}
            style={{ backgroundColor: band.hex }}
            title={band.color}
          />
        ))}
      </div>
      {value && (
        <div className="flex items-center gap-2 mt-2">
          <div
            className="w-6 h-6 rounded border"
            style={{ backgroundColor: COLOR_BANDS.find(b => b.color === value)?.hex }}
          />
          <span className="text-sm text-muted-foreground">{value}</span>
        </div>
      )}
    </div>
  )
}
