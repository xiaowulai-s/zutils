export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

export function validatePositive(value: number, fieldName: string): string | null {
  if (value <= 0) {
    return `${fieldName}必须大于0`
  }
  return null
}

export function validateRange(
  value: number,
  min: number,
  max: number,
  fieldName: string
): string | null {
  if (value < min || value > max) {
    return `${fieldName}必须在 ${min} 到 ${max} 之间`
  }
  return null
}

export function validateRequired(value: unknown, fieldName: string): string | null {
  if (value === null || value === undefined || value === '') {
    return `${fieldName}是必填项`
  }
  return null
}

export function combineValidators(
  ...validators: (() => string | null)[]
): ValidationResult {
  const errors = validators
    .map(v => v())
    .filter((e): e is string => e !== null)
  
  return {
    isValid: errors.length === 0,
    errors
  }
}
