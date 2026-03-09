export function formatNumber(value: number, decimals: number = 2): string {
  return value.toFixed(decimals)
}

export function formatEngineering(value: number, unit: string = ''): string {
  const prefixes = [
    { factor: 1e12, prefix: 'T' },
    { factor: 1e9, prefix: 'G' },
    { factor: 1e6, prefix: 'M' },
    { factor: 1e3, prefix: 'k' },
    { factor: 1, prefix: '' },
    { factor: 1e-3, prefix: 'm' },
    { factor: 1e-6, prefix: 'μ' },
    { factor: 1e-9, prefix: 'n' },
    { factor: 1e-12, prefix: 'p' }
  ]
  
  for (const { factor, prefix } of prefixes) {
    if (Math.abs(value) >= factor) {
      const scaled = value / factor
      if (Math.abs(scaled) < 1000) {
        return `${scaled.toFixed(2)} ${prefix}${unit}`
      }
    }
  }
  
  return `${value.toExponential(2)} ${unit}`
}

export function parseNumberInput(value: string): number {
  const cleaned = value.replace(/[^\d.\-+eE]/g, '')
  const parsed = parseFloat(cleaned)
  return isNaN(parsed) ? 0 : parsed
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}
