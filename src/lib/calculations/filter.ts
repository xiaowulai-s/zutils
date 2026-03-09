export interface FilterInput {
  type: 'lowpass' | 'highpass'
  circuit: 'RC' | 'RL'
  resistance: number
  capacitance?: number
  inductance?: number
}

export interface FilterResult {
  cutoffFrequency: number
  angularFrequency: number
  timeConstant: number
  impedance: number
  phaseShift: number
  frequencyResponse: FrequencyPoint[]
}

export interface FrequencyPoint {
  frequency: number
  magnitude: number
  phase: number
}

export function calculateFilter(input: FilterInput): FilterResult {
  const { type, circuit, resistance } = input
  
  let cutoffFrequency: number
  let angularFrequency: number
  let timeConstant: number
  let impedance: number
  
  if (circuit === 'RC' && input.capacitance) {
    const C = input.capacitance
    timeConstant = resistance * C
    angularFrequency = 1 / timeConstant
    cutoffFrequency = angularFrequency / (2 * Math.PI)
    impedance = 1 / (angularFrequency * C)
  } else if (circuit === 'RL' && input.inductance) {
    const L = input.inductance
    timeConstant = L / resistance
    angularFrequency = resistance / L
    cutoffFrequency = angularFrequency / (2 * Math.PI)
    impedance = angularFrequency * L
  } else {
    throw new Error('Invalid circuit configuration')
  }
  
  const phaseShift = type === 'lowpass' ? -45 : 45
  
  const frequencyResponse = generateFrequencyResponse(input, cutoffFrequency)
  
  return {
    cutoffFrequency: Math.round(cutoffFrequency * 100) / 100,
    angularFrequency: Math.round(angularFrequency * 100) / 100,
    timeConstant: Math.round(timeConstant * 1e6) / 1e6,
    impedance: Math.round(impedance * 100) / 100,
    phaseShift,
    frequencyResponse
  }
}

function generateFrequencyResponse(input: FilterInput, cutoffFreq: number): FrequencyPoint[] {
  const points: FrequencyPoint[] = []
  const decades = [-2, -1, 0, 1, 2]
  
  for (const decade of decades) {
    const freq = cutoffFreq * Math.pow(10, decade)
    const normalizedFreq = freq / cutoffFreq
    
    let magnitude: number
    let phase: number
    
    if (input.type === 'lowpass') {
      magnitude = 1 / Math.sqrt(1 + Math.pow(normalizedFreq, 2))
      phase = -Math.atan(normalizedFreq) * (180 / Math.PI)
    } else {
      magnitude = normalizedFreq / Math.sqrt(1 + Math.pow(normalizedFreq, 2))
      phase = 90 - Math.atan(normalizedFreq) * (180 / Math.PI)
    }
    
    points.push({
      frequency: Math.round(freq * 100) / 100,
      magnitude: Math.round(magnitude * 1000) / 1000,
      phase: Math.round(phase * 10) / 10
    })
  }
  
  return points
}
