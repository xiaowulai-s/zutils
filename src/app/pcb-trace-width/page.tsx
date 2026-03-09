'use client'

import { CalculatorShell } from '@/components/tools'
import { Input, Select } from '@/components/ui'
import { calculateTraceWidth, type TraceInput, type TraceResult } from '@/lib/calculations/ipc2152'
import type { CalculatorConfig } from '@/types'

interface ExtendedTraceInput extends TraceInput {
  copperWeight: number
}

const config: CalculatorConfig<ExtendedTraceInput, TraceResult> = {
  defaultValues: {
    current: 1,
    temperatureRise: 10,
    copperThickness: 0.035,
    copperWeight: 1,
  },
  validate: (input) => {
    const errors: Partial<Record<keyof ExtendedTraceInput, string>> = {}
    if (input.current <= 0) errors.current = '电流必须大于0'
    if (input.temperatureRise <= 0) errors.temperatureRise = '温升必须大于0'
    return errors
  },
  calculate: (input) => calculateTraceWidth({
    current: input.current,
    temperatureRise: input.temperatureRise,
    copperThickness: input.copperThickness,
  }),
}

const copperWeightOptions = [
  { value: '0.5', label: '0.5 oz (17.5μm)' },
  { value: '1', label: '1 oz (35μm)' },
  { value: '2', label: '2 oz (70μm)' },
  { value: '3', label: '3 oz (105μm)' },
]

export default function PcbTraceWidthPage() {
  return (
    <div className="container py-8">
      <CalculatorShell
        title="PCB 走线宽度计算器"
        description="基于 IPC-2152 标准，根据电流计算所需走线宽度"
        config={config}
        renderInput={(value, onChange, errors) => (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="电流"
                unit="A"
                type="number"
                step="0.1"
                value={value.current}
                onChange={(e) => onChange({ ...value, current: parseFloat(e.target.value) || 0 })}
                error={errors.current}
              />
              <Input
                label="允许温升"
                unit="°C"
                type="number"
                step="1"
                value={value.temperatureRise}
                onChange={(e) => onChange({ ...value, temperatureRise: parseFloat(e.target.value) || 0 })}
                error={errors.temperatureRise}
              />
            </div>
            <Select
              label="铜厚"
              value={value.copperWeight.toString()}
              onChange={(e) => {
                const weight = parseFloat(e.target.value)
                onChange({
                  ...value,
                  copperWeight: weight,
                  copperThickness: weight * 0.035,
                })
              }}
              options={copperWeightOptions}
            />
          </div>
        )}
        renderResult={(result) => (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">最小走线宽度</p>
                <p className="text-2xl font-bold text-primary">{result.minWidth} mm</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">最小截面积</p>
                <p className="text-2xl font-bold text-primary">{result.minArea} mm²</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">电阻 (100mm)</p>
                <p className="text-2xl font-bold text-primary">{result.resistance} mΩ</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">压降 (100mm)</p>
                <p className="text-2xl font-bold text-primary">{result.voltageDrop} mV</p>
              </div>
            </div>
          </div>
        )}
      />
    </div>
  )
}
