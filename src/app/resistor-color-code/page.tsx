'use client'

import { useState } from 'react'
import { Card, Button, Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui'
import { ColorBandPicker } from '@/components/tools'
import { calculateResistorFromColors, formatResistance, type ColorCodeResult } from '@/lib/calculations/resistor'

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
      
      const res = calculateResistorFromColors(input as any)
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
  
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">电阻色环阻值计算器</h1>
        <p className="text-muted-foreground mt-1">支持 4/5/6 环电阻的色环阻值、容差及温度系数计算</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="选择色环">
          <div className="space-y-6">
            <Tabs defaultValue="5" onValueChange={(v) => setBandCount(parseInt(v) as BandCount)}>
              <TabsList>
                <TabsTrigger value="4">4环</TabsTrigger>
                <TabsTrigger value="5">5环</TabsTrigger>
                <TabsTrigger value="6">6环</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="space-y-4">
              <ColorBandPicker
                label="第一环"
                type="digit"
                value={colors.band1}
                onChange={(color) => setColors({ ...colors, band1: color })}
                excludeColors={['黑色', '金色', '银色']}
              />
              
              <ColorBandPicker
                label="第二环"
                type="digit"
                value={colors.band2}
                onChange={(color) => setColors({ ...colors, band2: color })}
                excludeColors={['金色', '银色']}
              />
              
              {(bandCount === 5 || bandCount === 6) && (
                <ColorBandPicker
                  label="第三环"
                  type="digit"
                  value={colors.band3}
                  onChange={(color) => setColors({ ...colors, band3: color })}
                  excludeColors={['金色', '银色']}
                />
              )}
              
              <ColorBandPicker
                label="倍率环"
                type="multiplier"
                value={colors.multiplier}
                onChange={(color) => setColors({ ...colors, multiplier: color })}
              />
              
              <ColorBandPicker
                label="误差环"
                type="tolerance"
                value={colors.tolerance}
                onChange={(color) => setColors({ ...colors, tolerance: color })}
              />
              
              {bandCount === 6 && (
                <ColorBandPicker
                  label="温度系数环"
                  type="tempCoeff"
                  value={colors.tempCoeff}
                  onChange={(color) => setColors({ ...colors, tempCoeff: color })}
                />
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
