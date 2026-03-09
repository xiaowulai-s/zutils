export interface ResistorColorBand {
  color: string
  hex: string
  value: number | null
  multiplier: number | null
  tolerance: number | null
  tempCoeff: number | null
}

export const COLOR_BANDS: ResistorColorBand[] = [
  { color: '黑色', hex: '#000000', value: 0, multiplier: 1, tolerance: null, tempCoeff: null },
  { color: '棕色', hex: '#8B4513', value: 1, multiplier: 10, tolerance: 1, tempCoeff: 100 },
  { color: '红色', hex: '#FF0000', value: 2, multiplier: 100, tolerance: 2, tempCoeff: 50 },
  { color: '橙色', hex: '#FFA500', value: 3, multiplier: 1000, tolerance: null, tempCoeff: 15 },
  { color: '黄色', hex: '#FFFF00', value: 4, multiplier: 10000, tolerance: null, tempCoeff: 25 },
  { color: '绿色', hex: '#008000', value: 5, multiplier: 100000, tolerance: 0.5, tempCoeff: null },
  { color: '蓝色', hex: '#0000FF', value: 6, multiplier: 1000000, tolerance: 0.25, tempCoeff: 10 },
  { color: '紫色', hex: '#800080', value: 7, multiplier: 10000000, tolerance: 0.1, tempCoeff: 5 },
  { color: '灰色', hex: '#808080', value: 8, multiplier: 100000000, tolerance: 0.05, tempCoeff: null },
  { color: '白色', hex: '#FFFFFF', value: 9, multiplier: 1000000000, tolerance: null, tempCoeff: null },
  { color: '金色', hex: '#FFD700', value: null, multiplier: 0.1, tolerance: 5, tempCoeff: null },
  { color: '银色', hex: '#C0C0C0', value: null, multiplier: 0.01, tolerance: 10, tempCoeff: null },
]

export interface ColorCodeInput {
  band1: string
  band2: string
  band3?: string
  multiplier: string
  tolerance: string
  tempCoeff?: string
}

export interface ColorCodeResult {
  resistance: number
  tolerance: number
  tempCoeff: number | null
  resistanceRange: { min: number; max: number }
  formattedResistance: string
}

export function calculateResistorFromColors(input: ColorCodeInput): ColorCodeResult {
  const band1Color = COLOR_BANDS.find(c => c.color === input.band1)
  const band2Color = COLOR_BANDS.find(c => c.color === input.band2)
  const band3Color = input.band3 ? COLOR_BANDS.find(c => c.color === input.band3) : null
  const multiplierColor = COLOR_BANDS.find(c => c.color === input.multiplier)
  const toleranceColor = COLOR_BANDS.find(c => c.color === input.tolerance)
  const tempCoeffColor = input.tempCoeff ? COLOR_BANDS.find(c => c.color === input.tempCoeff) : null
  
  if (!band1Color || !band2Color || !multiplierColor || !toleranceColor) {
    throw new Error('Invalid color selection')
  }
  
  let value: number
  if (band3Color && band3Color.value !== null) {
    value = band1Color.value! * 100 + band2Color.value! * 10 + band3Color.value
  } else {
    value = band1Color.value! * 10 + band2Color.value!
  }
  
  const resistance = value * (multiplierColor.multiplier || 1)
  const tolerance = toleranceColor.tolerance || 5
  const tempCoeff = tempCoeffColor?.tempCoeff || null
  
  const toleranceValue = resistance * (tolerance / 100)
  const resistanceRange = {
    min: resistance - toleranceValue,
    max: resistance + toleranceValue
  }
  
  return {
    resistance,
    tolerance,
    tempCoeff,
    resistanceRange,
    formattedResistance: formatResistance(resistance)
  }
}

export function formatResistance(value: number): string {
  if (value >= 1e9) {
    return `${(value / 1e9).toFixed(2)} GΩ`
  } else if (value >= 1e6) {
    return `${(value / 1e6).toFixed(2)} MΩ`
  } else if (value >= 1e3) {
    return `${(value / 1e3).toFixed(2)} kΩ`
  } else if (value >= 1) {
    return `${value.toFixed(2)} Ω`
  } else if (value >= 1e-3) {
    return `${(value * 1e3).toFixed(2)} mΩ`
  } else {
    return `${value.toExponential(2)} Ω`
  }
}

export interface SMDInput {
  code: string
}

export interface SMDResult {
  resistance: number
  formattedResistance: string
  type: '3-digit' | '4-digit' | 'EIA-96'
}

export function decodeSMDResistor(input: SMDInput): SMDResult {
  const code = input.code.toUpperCase().trim()
  
  if (/^\d{3}$/.test(code)) {
    const digits = code.split('')
    const value = parseInt(digits[0] + digits[1])
    const multiplier = Math.pow(10, parseInt(digits[2]))
    const resistance = value * multiplier
    return {
      resistance,
      formattedResistance: formatResistance(resistance),
      type: '3-digit'
    }
  }
  
  if (/^\d{4}$/.test(code)) {
    const digits = code.split('')
    const value = parseInt(digits[0] + digits[1] + digits[2])
    const multiplier = Math.pow(10, parseInt(digits[3]))
    const resistance = value * multiplier
    return {
      resistance,
      formattedResistance: formatResistance(resistance),
      type: '4-digit'
    }
  }
  
  if (/^\d{2}[A-Z]$/.test(code)) {
    const eia96Values: Record<string, number> = {
      '01': 100, '02': 102, '03': 105, '04': 107, '05': 110, '06': 113,
      '07': 115, '08': 118, '09': 121, '10': 124, '11': 127, '12': 130,
      '13': 133, '14': 137, '15': 140, '16': 143, '17': 147, '18': 150,
      '19': 154, '20': 158, '21': 162, '22': 165, '23': 169, '24': 174,
      '25': 178, '26': 182, '27': 187, '28': 191, '29': 196, '30': 200,
      '31': 205, '32': 210, '33': 215, '34': 221, '35': 226, '36': 232,
      '37': 237, '38': 243, '39': 249, '40': 255, '41': 261, '42': 267,
      '43': 274, '44': 280, '45': 287, '46': 294, '47': 301, '48': 309,
      '49': 316, '50': 324, '51': 332, '52': 340, '53': 348, '54': 357,
      '55': 365, '56': 374, '57': 383, '58': 392, '59': 402, '60': 412,
      '61': 422, '62': 432, '63': 442, '64': 453, '65': 464, '66': 475,
      '67': 487, '68': 499, '69': 511, '70': 523, '71': 536, '72': 549,
      '73': 562, '74': 576, '75': 590, '76': 604, '77': 619, '78': 634,
      '79': 649, '80': 665, '81': 681, '82': 698, '83': 715, '84': 732,
      '85': 750, '86': 768, '87': 787, '88': 806, '89': 825, '90': 845,
      '91': 866, '92': 887, '93': 909, '94': 931, '95': 953, '96': 976
    }
    
    const multipliers: Record<string, number> = {
      'A': 1, 'B': 10, 'C': 100, 'D': 1000, 'E': 10000, 'F': 100000,
      'X': 0.1, 'Y': 0.01, 'Z': 0.001
    }
    
    const codeNum = code.substring(0, 2)
    const multiplierLetter = code.substring(2, 3)
    
    const baseValue = eia96Values[codeNum]
    const multiplier = multipliers[multiplierLetter]
    
    if (baseValue === undefined || multiplier === undefined) {
      throw new Error('Invalid EIA-96 code')
    }
    
    const resistance = baseValue * multiplier
    return {
      resistance,
      formattedResistance: formatResistance(resistance),
      type: 'EIA-96'
    }
  }
  
  throw new Error('Invalid SMD resistor code format')
}

export interface LEDResistorInput {
  supplyVoltage: number
  ledVoltage: number
  ledCurrent: number
  ledCount: number
  configuration: 'series' | 'parallel'
}

export interface LEDResistorResult {
  resistance: number
  power: number
  recommendedResistance: number
  recommendedPower: number
  actualCurrent: number
  e24Resistor: string
}

export const E24_VALUES = [
  10, 11, 12, 13, 15, 16, 18, 20, 22, 24, 27, 30, 33, 36, 39, 43, 47, 51, 56, 62, 68, 75, 82, 91
]

export function calculateLEDResistor(input: LEDResistorInput): LEDResistorResult {
  const { supplyVoltage, ledVoltage, ledCurrent, ledCount, configuration } = input
  
  let requiredResistance: number
  let totalLedVoltage: number
  let totalLedCurrent: number
  
  if (configuration === 'series') {
    totalLedVoltage = ledVoltage * ledCount
    totalLedCurrent = ledCurrent
    requiredResistance = (supplyVoltage - totalLedVoltage) / totalLedCurrent
  } else {
    totalLedVoltage = ledVoltage
    totalLedCurrent = ledCurrent * ledCount
    requiredResistance = (supplyVoltage - totalLedVoltage) / totalLedCurrent
  }
  
  const power = totalLedCurrent * totalLedCurrent * requiredResistance
  
  const recommendedResistance = findNearestE24(requiredResistance)
  const actualCurrent = (supplyVoltage - totalLedVoltage) / recommendedResistance
  const recommendedPower = actualCurrent * actualCurrent * recommendedResistance
  const e24Resistor = formatResistance(recommendedResistance)
  
  return {
    resistance: Math.round(requiredResistance * 100) / 100,
    power: Math.round(power * 1000) / 1000,
    recommendedResistance,
    recommendedPower: Math.round(recommendedPower * 1000) / 1000,
    actualCurrent: Math.round(actualCurrent * 1000) / 1000,
    e24Resistor
  }
}

function findNearestE24(value: number): number {
  const decade = Math.pow(10, Math.floor(Math.log10(value)))
  const normalized = value / decade
  
  let nearest = E24_VALUES[0]
  let minDiff = Math.abs(normalized - nearest)
  
  for (const e24 of E24_VALUES) {
    const diff = Math.abs(normalized - e24)
    if (diff < minDiff) {
      minDiff = diff
      nearest = e24
    }
  }
  
  return nearest * decade
}
