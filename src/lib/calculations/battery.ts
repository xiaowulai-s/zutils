export interface BatteryInput {
  capacity: number
  voltage: number
  loadCurrent: number
  mode: 'constant' | 'intermittent'
  activeHours?: number
  sleepCurrent?: number
}

export interface BatteryResult {
  runtime: number
  runtimeFormatted: string
  energyCapacity: number
  averagePower: number
  cycles: number
  efficiency: number
}

export function calculateBatteryLife(input: BatteryInput): BatteryResult {
  const { capacity, voltage, loadCurrent, mode, activeHours, sleepCurrent } = input
  
  let effectiveCurrent: number
  let runtime: number
  
  if (mode === 'constant') {
    effectiveCurrent = loadCurrent
    runtime = capacity / loadCurrent
  } else {
    if (activeHours === undefined || sleepCurrent === undefined) {
      throw new Error('Intermittent mode requires activeHours and sleepCurrent')
    }
    
    const sleepHours = 24 - activeHours
    const dailyConsumption = (loadCurrent * activeHours) + (sleepCurrent * sleepHours)
    effectiveCurrent = dailyConsumption / 24
    runtime = (capacity * 24) / dailyConsumption
  }
  
  const hours = Math.floor(runtime)
  const minutes = Math.round((runtime - hours) * 60)
  const runtimeFormatted = `${hours}小时 ${minutes}分钟`
  
  const energyCapacity = capacity * voltage
  const averagePower = effectiveCurrent * voltage
  const cycles = Math.floor(runtime / 24)
  const efficiency = (loadCurrent / effectiveCurrent) * 100
  
  return {
    runtime: Math.round(runtime * 100) / 100,
    runtimeFormatted,
    energyCapacity: Math.round(energyCapacity * 100) / 100,
    averagePower: Math.round(averagePower * 1000) / 1000,
    cycles,
    efficiency: Math.round(efficiency * 10) / 10
  }
}
