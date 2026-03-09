export interface CalculatorInput<T> {
  values: T
  errors: Partial<Record<keyof T, string>>
}

export interface CalculatorResult<R> {
  data: R
  timestamp: number
}

export interface CalculatorConfig<I, R> {
  defaultValues: I
  validate: (input: I) => Partial<Record<keyof I, string>>
  calculate: (input: I) => R
}

export interface InputFieldConfig {
  key: string
  label: string
  unit?: string
  type?: 'number' | 'text' | 'select'
  options?: { value: string; label: string }[]
  min?: number
  max?: number
  step?: number
  placeholder?: string
}
