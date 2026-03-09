'use client'

import { useState } from 'react'
import { Card, Button } from '@/components/ui'
import { calculateResistorFromColors, formatResistance, COLOR_BANDS, type ColorCodeResult } from '@/lib/calculations/resistor'
import { cn } from '@/lib/utils/cn'

type BandCount = 4 | 5 | 6

export default function ResistorColorCodePage() {
  const [bandCount, setBandCount] = useState<BandCount>(5)
  const [colors, setColors] = useState({
    band1: '棕色',
    band2: '黑色',
    band3: '红色',
    multiplier: '红色',
    tolerance: '金色',
    tempCoeff: '棕色',
  })
  const [result, setResult] = useState<ColorCodeResult | null>(null)
  
  const handleCalculate = () => {
    try {
      const input = bandCount === 4
        ? { band1: colors.band1, band2: colors.band2, multiplier: colors.multiplier, tolerance: colors.tolerance }
        : bandCount === 5
        ? { band1: colors.band1, band2: colors.band2, band3: colors.band3, multiplier: colors.multiplier, tolerance: colors.tolerance }
        : { ...colors }
      
      const res = calculateResistorFromColors(input as Parameters<typeof calculateResistorFromColors>[0])
      setResult(res)
    } catch (error) {
      console.error(error)
    }
  }
  
  const handleReset = () => {
    setColors({
      band1: '棕色',
      band2: '黑色',
      band3: '红色',
      multiplier: '红色',
      tolerance: '金色',
      tempCoeff: '棕色',
    })
    setResult(null)
  }
  
  const getColorPicker = (
    label: string,
    value: string,
    onChange: (color: string) => void,
    type: 'digit' | 'multiplier' | 'tolerance' | 'tempCoeff',
    excludeColors: string[] = []
  ) => {
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
  
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">电阻色环阻值计算器</h1>
        <p className="text-muted-foreground mt-1">支持 4/5/6 环电阻的色环阻值、容差及温度系数计算</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="选择色环">
          <div className="space-y-6">
            <div className="flex gap-2">
              {([4, 5, 6] as BandCount[]).map((count) => (
                <button
                  key={count}
                  onClick={() => setBandCount(count)}
                  className={cn(
                    'px-4 py-2 text-sm font-medium rounded-md transition-colors',
                    bandCount === count
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  )}
                >
                  {count}环
                </button>
              ))}
            </div>
            
            <div className="space-y-4">
              {getColorPicker(
                '第一环',
                colors.band1,
                (color) => setColors({ ...colors, band1: color }),
                'digit',
                ['黑色', '金色', '银色']
              )}
              
              {getColorPicker(
                '第二环',
                colors.band2,
                (color) => setColors({ ...colors, band2: color }),
                'digit',
                ['金色', '银色']
              )}
              
              {(bandCount === 5 || bandCount === 6) && getColorPicker(
                '第三环',
                colors.band3,
                (color) => setColors({ ...colors, band3: color }),
                'digit',
                ['金色', '银色']
              )}
              
              {getColorPicker(
                '倍率环',
                colors.multiplier,
                (color) => setColors({ ...colors, multiplier: color }),
                'multiplier'
              )}
              
              {getColorPicker(
                '误差环',
                colors.tolerance,
                (color) => setColors({ ...colors, tolerance: color }),
                'tolerance'
              )}
              
              {bandCount === 6 && getColorPicker(
                '温度系数环',
                colors.tempCoeff,
                (color) => setColors({ ...colors, tempCoeff: color }),
                'tempCoeff'
              )}
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button onClick={handleCalculate}>计算</Button>
              <Button variant="outline" onClick={handleReset}>重置</Button>
            </div>
          </div>
        </Card>
        
        {result && (
          <Card title="计算结果">
            <div className="space-y-4">
              <div className="p-6 rounded-lg bg-primary/10 text-center">
                <p className="text-sm text-muted-foreground mb-2">电阻值</p>
                <p className="text-4xl font-bold text-primary">{result.formattedResistance}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">容差</p>
                  <p className="text-xl font-semibold">±{result.tolerance}%</p>
                </div>
                {result.tempCoeff && (
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground">温度系数</p>
                    <p className="text-xl font-semibold">{result.tempCoeff} ppm/°C</p>
                  </div>
                )}
              </div>
              
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground mb-2">阻值范围</p>
                <p className="text-lg">
                  {formatResistance(result.resistanceRange.min)} ~ {formatResistance(result.resistanceRange.max)}
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
