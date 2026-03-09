export function convertUnit(value: number, fromUnit: string, toUnit: string): number {
  const units: Record<string, number> = {
    'p': 1e-12,
    'n': 1e-9,
    'μ': 1e-6,
    'u': 1e-6,
    'm': 1e-3,
    '': 1,
    'k': 1e3,
    'K': 1e3,
    'M': 1e6,
    'G': 1e9,
    'T': 1e12
  }
  
  const fromFactor = units[fromUnit] || 1
  const toFactor = units[toUnit] || 1
  
  return value * fromFactor / toFactor
}

export function getBestUnit(value: number, baseUnit: string): { value: number; prefix: string } {
  const prefixes = ['p', 'n', 'μ', 'm', '', 'k', 'M', 'G', 'T']
  const factors = [1e12, 1e9, 1e6, 1e3, 1, 1e-3, 1e-6, 1e-9, 1e-12]
  
  for (let i = 0; i < prefixes.length; i++) {
    const scaled = value * factors[i]
    if (Math.abs(scaled) >= 1 && Math.abs(scaled) < 1000) {
      return { value: scaled, prefix: prefixes[i] }
    }
  }
  
  return { value, prefix: '' }
}
