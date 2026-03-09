'use client'

import { CalculatorShell } from '@/components/tools'
import { Input, Select } from '@/components/ui'
import { calculateLEDResistor, type LEDResistorInput, type LEDResistorResult } from '@/lib/calculations/resistor'
import type { CalculatorConfig } from '@/types'

const config: CalculatorConfig<LEDResistorInput, LEDResistorResult> = {
  defaultValues: {
    supplyVoltage: 5,
    ledVoltage: 2,
    ledCurrent: 20,
    ledCount: 1,
    configuration: 'series',
  },
  validate: (input) => {
    const errors: Partial<Record<keyof LEDResistorInput, string>> = {}
    if (input.supplyVoltage <= 0) errors.supplyVoltage = '电源电压必须大于0'
    if (input.ledVoltage <= 0) errors.ledVoltage = 'LED电压必须大于0'
    if (input.ledCurrent <= 0) errors.ledCurrent = 'LED电流必须大于0'
    if (input.ledCount <= 0) errors.ledCount = 'LED数量必须大于0'
    
    if (input.configuration === 'series' && input.ledVoltage * input.ledCount >= input.supplyVoltage) {
      errors.ledCount = '串联LED总电压不能超过电源电压'
    }
    
    return errors
  },
  calculate: calculateLEDResistor,
}

const ledVoltageOptions = [
  { value: '1.8', label: '红色 LED (1.8V)' },
  { value: '2', label: '橙色/黄色 LED (2V)' },
  { value: '2.2', label: '绿色 LED (2.2V)' },
  { value: '3.2', label: '蓝色/白色 LED (3.2V)' },
  { value: '3.4', label: '高亮白色 LED (3.4V)' },
]

export default function LedResistorPage() {
  return (
    <div className="container py-8">
      <CalculatorShell
        title="LED 限流电阻计算器"
        description="计算 LED 限流电阻值，支持串并联配置，E24 标准电阻推荐"
        config={config}
        renderInput={(value, onChange, errors) => (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="电源电压"
                unit="V"
                type="number"
                step="0.1"
                value={value.supplyVoltage}
                onChange={(e) => onChange({ ...value, supplyVoltage: parseFloat(e.target.value) || 0 })}
                error={errors.supplyVoltage}
              />
              <Input
                label="LED 电流"
                unit="mA"
                type="number"
                step="1"
                value={value.ledCurrent}
                onChange={(e) => onChange({ ...value, ledCurrent: parseFloat(e.target.value) || 0 })}
                error={errors.ledCurrent}
              />
            </div>
            
            <Select
              label="LED 电压"
              value={value.ledVoltage.toString()}
              onChange={(e) => onChange({ ...value, ledVoltage: parseFloat(e.target.value) })}
              options={ledVoltageOptions}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="LED 数量"
                unit="个"
                type="number"
                step="1"
                min="1"
                value={value.ledCount}
                onChange={(e) => onChange({ ...value, ledCount: parseInt(e.target.value) || 1 })}
                error={errors.ledCount}
              />
              <Select
                label="连接方式"
                value={value.configuration}
                onChange={(e) => onChange({ ...value, configuration: e.target.value as 'series' | 'parallel' })}
                options={[
                  { value: 'series', label: '串联' },
                  { value: 'parallel', label: '并联' },
                ]}
              />
            </div>
          </div>
        )}
        renderResult={(result) => (
          <div className="space-y-4">
            <div className="p-6 rounded-lg bg-primary/10 text-center">
              <p className="text-sm text-muted-foreground mb-2">推荐电阻 (E24)</p>
              <p className="text-4xl font-bold text-primary">{result.e24Resistor}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">计算电阻值</p>
                <p className="text-xl font-semibold">{result.resistance} Ω</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">电阻功率</p>
                <p className="text-xl font-semibold">{result.power} mW</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">推荐功率</p>
                <p className="text-xl font-semibold">{result.recommendedPower} mW</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">实际电流</p>
                <p className="text-xl font-semibold">{result.actualCurrent} mA</p>
              </div>
            </div>
          </div>
        )}
      />
    </div>
  )
}
