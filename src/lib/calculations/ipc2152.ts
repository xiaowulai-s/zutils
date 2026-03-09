export interface ViaInput {
  holeDiameter: number
  platingThickness: number
  temperatureRise: number
  ambientTemperature: number
}

export interface ViaResult {
  maxCurrent: number
  resistance: number
  voltageDrop: number
  powerDissipation: number
  crossSectionArea: number
  thermalResistance: number
}

export interface TraceInput {
  current: number
  temperatureRise: number
  copperThickness: number
}

export interface TraceResult {
  minWidth: number
  minArea: number
  resistance: number
  voltageDrop: number
  powerDissipation: number
}

const COPPER_RESISTIVITY = 1.72e-8
const COPPER_TEMP_COEFF = 0.00393
const THERMAL_CONDUCTIVITY = 401

export function calculateViaCurrent(input: ViaInput): ViaResult {
  const { holeDiameter, platingThickness, temperatureRise, ambientTemperature } = input
  
  const radius = holeDiameter / 2
  const innerRadius = radius - platingThickness
  const crossSectionArea = Math.PI * (radius * radius - innerRadius * innerRadius)
  
  const k = 0.048
  const b = 0.44
  const areaMm2 = crossSectionArea * 1e6
  const maxCurrent = k * Math.pow(areaMm2, b) * Math.pow(temperatureRise / 10, 0.5)
  
  const viaLength = 1.6
  const resistance = (COPPER_RESISTIVITY * viaLength) / crossSectionArea
  const adjustedResistance = resistance * (1 + COPPER_TEMP_COEFF * (ambientTemperature + temperatureRise - 25))
  
  const voltageDrop = maxCurrent * adjustedResistance
  const powerDissipation = maxCurrent * maxCurrent * adjustedResistance
  
  const thermalResistance = viaLength / (THERMAL_CONDUCTIVITY * crossSectionArea)
  
  return {
    maxCurrent: Math.round(maxCurrent * 100) / 100,
    resistance: Math.round(adjustedResistance * 1000) / 1000,
    voltageDrop: Math.round(voltageDrop * 1000) / 1000,
    powerDissipation: Math.round(powerDissipation * 1000) / 1000,
    crossSectionArea: Math.round(areaMm2 * 1000) / 1000,
    thermalResistance: Math.round(thermalResistance * 100) / 100
  }
}

export function calculateTraceWidth(input: TraceInput): TraceResult {
  const { current, temperatureRise, copperThickness } = input
  
  const k = 0.048
  const b = 0.44
  
  const areaMm2 = Math.pow(current / (k * Math.pow(temperatureRise / 10, 0.5)), 1 / b)
  const minWidth = areaMm2 / copperThickness
  
  const crossSectionArea = areaMm2 * 1e-6
  const traceLength = 100
  const resistance = (COPPER_RESISTIVITY * traceLength) / crossSectionArea
  const voltageDrop = current * resistance
  const powerDissipation = current * current * resistance
  
  return {
    minWidth: Math.round(minWidth * 100) / 100,
    minArea: Math.round(areaMm2 * 100) / 100,
    resistance: Math.round(resistance * 1000) / 1000,
    voltageDrop: Math.round(voltageDrop * 1000) / 1000,
    powerDissipation: Math.round(powerDissipation * 1000) / 1000
  }
}
