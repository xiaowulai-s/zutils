'use client'

import { useState } from 'react'
import { Card, Button, Input, Select } from '@/components/ui'
import { calculateBatteryLife, type BatteryInput, type BatteryResult } from '@/lib/calculations/battery'

export default function BatteryLifePage() {
  const [input, setInput] = useState<BatteryInput>({
    capacity: 2000,
    voltage: 3.7,
    loadCurrent: 100,
    mode: 'constant',
    activeHours: 8,
    sleepCurrent: 1,
  })
  
  const [result, setResult] = useState<BatteryResult | null>(null)
  const [errors, setErrors] = useState<Partial<Record<keyof BatteryInput, string>>>({})
  
  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof BatteryInput, string>> = {}
    
    if (input.capacity <= 0) newErrors.capacity = '容量必须大于0'
    if (input.voltage <= 0) newErrors.voltage = '电压必须大于0'
    if (input.loadCurrent <= 0) newErrors.loadCurrent = '负载电流必须大于0'
    
    if (input.mode === 'intermittent') {
      if (!input.activeHours || input.activeHours <= 0 || input.activeHours > 24) {
        newErrors.activeHours = '工作时间必须在1-24小时之间'
      }
      if (!input.sleepCurrent || input.sleepCurrent < 0) {
        newErrors.sleepCurrent = '休眠电流必须大于等于0'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleCalculate = () => {
    if (!validate()) return
    
    try {
      const res = calculateBatteryLife(input)
      setResult(res)
    } catch (error) {
      console.error(error)
    }
  }
  
  const handleReset = () => {
    setInput({
      capacity: 2000,
      voltage: 3.7,
      loadCurrent: 100,
      mode: 'constant',
      activeHours: 8,
      sleepCurrent: 1,
    })
    setResult(null)
    setErrors({})
  }
  
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">电池续航计算器</h1>
        <p className="text-muted-foreground mt-1">计算电池使用寿命，支持恒定功耗和间歇性功耗两种模式</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="输入参数">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="电池容量"
                unit="mAh"
                type="number"
                value={input.capacity}
                onChange={(e) => setInput({ ...input, capacity: parseFloat(e.target.value) || 0 })}
                error={errors.capacity}
              />
              <Input
                label="电池电压"
                unit="V"
                type="number"
                step="0.1"
                value={input.voltage}
                onChange={(e) => setInput({ ...input, voltage: parseFloat(e.target.value) || 0 })}
                error={errors.voltage}
              />
            </div>
            
            <Input
              label="负载电流"
              unit="mA"
              type="number"
              step="1"
              value={input.loadCurrent}
              onChange={(e) => setInput({ ...input, loadCurrent: parseFloat(e.target.value) || 0 })}
              error={errors.loadCurrent}
            />
            
            <Select
              label="工作模式"
              value={input.mode}
              onChange={(e) => setInput({ ...input, mode: e.target.value as 'constant' | 'intermittent' })}
              options={[
                { value: 'constant', label: '恒定功耗' },
                { value: 'intermittent', label: '间歇性功耗' },
              ]}
            />
            
            {input.mode === 'intermittent' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="每日工作时间"
                  unit="小时"
                  type="number"
                  step="1"
                  min="1"
                  max="24"
                  value={input.activeHours || 8}
                  onChange={(e) => setInput({ ...input, activeHours: parseFloat(e.target.value) || 0 })}
                  error={errors.activeHours}
                />
                <Input
                  label="休眠电流"
                  unit="mA"
                  type="number"
                  step="0.1"
                  value={input.sleepCurrent || 0}
                  onChange={(e) => setInput({ ...input, sleepCurrent: parseFloat(e.target.value) || 0 })}
                  error={errors.sleepCurrent}
                />
              </div>
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
                <p className="text-sm text-muted-foreground mb-2">预计续航时间</p>
                <p className="text-3xl font-bold text-primary">{result.runtimeFormatted}</p>
                <p className="text-sm text-muted-foreground mt-1">({result.runtime} 小时)</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">电池能量</p>
                  <p className="text-xl font-semibold">{result.energyCapacity} mWh</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">平均功耗</p>
                  <p className="text-xl font-semibold">{result.averagePower} mW</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">可充电次数</p>
                  <p className="text-xl font-semibold">{result.cycles} 次</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">效率</p>
                  <p className="text-xl font-semibold">{result.efficiency}%</p>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
