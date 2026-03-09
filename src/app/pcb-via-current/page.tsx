'use client'

import { CalculatorShell } from '@/components/tools'
import { Input } from '@/components/ui'
import { calculateViaCurrent, type ViaInput, type ViaResult } from '@/lib/calculations/ipc2152'
import type { CalculatorConfig } from '@/types'

const config: CalculatorConfig<ViaInput, ViaResult> = {
  defaultValues: {
    holeDiameter: 0.3,
    platingThickness: 0.025,
    temperatureRise: 10,
    ambientTemperature: 25,
  },
  validate: (input) => {
    const errors: Partial<Record<keyof ViaInput, string>> = {}
    if (input.holeDiameter <= 0) errors.holeDiameter = '孔径必须大于0'
    if (input.platingThickness <= 0) errors.platingThickness = '镀层厚度必须大于0'
    if (input.temperatureRise <= 0) errors.temperatureRise = '温升必须大于0'
    if (input.ambientTemperature < -273) errors.ambientTemperature = '温度不能低于绝对零度'
    return errors
  },
  calculate: calculateViaCurrent,
}

export default function PcbViaCurrentPage() {
  return (
    <div className="container py-8">
      <CalculatorShell
        title="PCB 过孔电流计算器"
        description="基于 IPC-2152 标准，计算过孔最大电流、电阻、压降等参数"
        config={config}
        renderInput={(value, onChange, errors) => (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="孔径"
              unit="mm"
              type="number"
              step="0.01"
              value={value.holeDiameter}
              onChange={(e) => onChange({ ...value, holeDiameter: parseFloat(e.target.value) || 0 })}
              error={errors.holeDiameter}
            />
            <Input
              label="镀层厚度"
              unit="mm"
              type="number"
              step="0.001"
              value={value.platingThickness}
              onChange={(e) => onChange({ ...value, platingThickness: parseFloat(e.target.value) || 0 })}
              error={errors.platingThickness}
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
            <Input
              label="环境温度"
              unit="°C"
              type="number"
              step="1"
              value={value.ambientTemperature}
              onChange={(e) => onChange({ ...value, ambientTemperature: parseFloat(e.target.value) || 0 })}
              error={errors.ambientTemperature}
            />
          </div>
        )}
        renderResult={(result) => (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">最大电流</p>
                <p className="text-2xl font-bold text-primary">{result.maxCurrent} A</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">电阻</p>
                <p className="text-2xl font-bold text-primary">{result.resistance} mΩ</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">压降</p>
                <p className="text-2xl font-bold text-primary">{result.voltageDrop} mV</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">功耗</p>
                <p className="text-2xl font-bold text-primary">{result.powerDissipation} mW</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">截面积</p>
                <p className="text-2xl font-bold text-primary">{result.crossSectionArea} mm²</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">热阻</p>
                <p className="text-2xl font-bold text-primary">{result.thermalResistance} °C/W</p>
              </div>
            </div>
          </div>
        )}
      />
    </div>
  )
}
