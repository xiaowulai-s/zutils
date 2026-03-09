'use client'

import { useState } from 'react'
import { Card, Button, Input, Select } from '@/components/ui'
import { FrequencyChart } from '@/components/tools'
import { calculateFilter, type FilterInput, type FilterResult } from '@/lib/calculations/filter'

export default function RcRlFilterPage() {
  const [input, setInput] = useState<FilterInput>({
    type: 'lowpass',
    circuit: 'RC',
    resistance: 1000,
    capacitance: 1e-6,
    inductance: 1e-3,
  })
  
  const [result, setResult] = useState<FilterResult | null>(null)
  const [errors, setErrors] = useState<Partial<Record<keyof FilterInput, string>>>({})
  
  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FilterInput, string>> = {}
    
    if (input.resistance <= 0) newErrors.resistance = '电阻必须大于0'
    
    if (input.circuit === 'RC') {
      if (!input.capacitance || input.capacitance <= 0) {
        newErrors.capacitance = '电容必须大于0'
      }
    } else {
      if (!input.inductance || input.inductance <= 0) {
        newErrors.inductance = '电感必须大于0'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleCalculate = () => {
    if (!validate()) return
    
    try {
      const res = calculateFilter(input)
      setResult(res)
    } catch (error) {
      console.error(error)
    }
  }
  
  const handleReset = () => {
    setInput({
      type: 'lowpass',
      circuit: 'RC',
      resistance: 1000,
      capacitance: 1e-6,
      inductance: 1e-3,
    })
    setResult(null)
    setErrors({})
  }
  
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">RC/RL 滤波器计算器</h1>
        <p className="text-muted-foreground mt-1">低通与高通滤波器计算，支持 RC 和 RL 电路模式</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="输入参数">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="滤波器类型"
                value={input.type}
                onChange={(e) => setInput({ ...input, type: e.target.value as 'lowpass' | 'highpass' })}
                options={[
                  { value: 'lowpass', label: '低通滤波器' },
                  { value: 'highpass', label: '高通滤波器' },
                ]}
              />
              <Select
                label="电路类型"
                value={input.circuit}
                onChange={(e) => setInput({ ...input, circuit: e.target.value as 'RC' | 'RL' })}
                options={[
                  { value: 'RC', label: 'RC 电路' },
                  { value: 'RL', label: 'RL 电路' },
                ]}
              />
            </div>
            
            <Input
              label="电阻值"
              unit="Ω"
              type="number"
              step="1"
              value={input.resistance}
              onChange={(e) => setInput({ ...input, resistance: parseFloat(e.target.value) || 0 })}
              error={errors.resistance}
            />
            
            {input.circuit === 'RC' ? (
              <Input
                label="电容值"
                unit="μF"
                type="number"
                step="0.1"
                value={(input.capacitance || 0) * 1e6}
                onChange={(e) => setInput({ ...input, capacitance: (parseFloat(e.target.value) || 0) * 1e-6 })}
                error={errors.capacitance}
              />
            ) : (
              <Input
                label="电感值"
                unit="mH"
                type="number"
                step="0.1"
                value={(input.inductance || 0) * 1e3}
                onChange={(e) => setInput({ ...input, inductance: (parseFloat(e.target.value) || 0) * 1e-3 })}
                error={errors.inductance}
              />
            )}
            
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
                <p className="text-sm text-muted-foreground mb-2">截止频率</p>
                <p className="text-3xl font-bold text-primary">{result.cutoffFrequency} Hz</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">角频率</p>
                  <p className="text-xl font-semibold">{result.angularFrequency} rad/s</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">时间常数</p>
                  <p className="text-xl font-semibold">{result.timeConstant} s</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">阻抗</p>
                  <p className="text-xl font-semibold">{result.impedance} Ω</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">相位偏移</p>
                  <p className="text-xl font-semibold">{result.phaseShift}°</p>
                </div>
              </div>
              
              <div className="pt-4">
                <h4 className="text-sm font-medium mb-3">幅频响应曲线</h4>
                <FrequencyChart
                  data={result.frequencyResponse}
                  type="magnitude"
                  cutoffFrequency={result.cutoffFrequency}
                />
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
