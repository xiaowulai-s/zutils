'use client'

import { useState, useCallback } from 'react'
import { Card, Button } from '@/components/ui'
import type { CalculatorConfig } from '@/types'

interface CalculatorShellProps<I, R> {
  title: string
  description: string
  config: CalculatorConfig<I, R>
  renderInput: (value: I, onChange: (v: I) => void, errors: Partial<Record<keyof I, string>>) => React.ReactNode
  renderResult: (result: R) => React.ReactNode
}

export function CalculatorShell<I extends object, R>({
  title,
  description,
  config,
  renderInput,
  renderResult,
}: CalculatorShellProps<I, R>) {
  const [input, setInput] = useState<I>(config.defaultValues)
  const [result, setResult] = useState<R | null>(null)
  const [errors, setErrors] = useState<Partial<Record<keyof I, string>>>({})
  
  const handleCompute = useCallback(() => {
    const validationErrors = config.validate(input)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setErrors({})
    try {
      const computedResult = config.calculate(input)
      setResult(computedResult)
    } catch (error) {
      console.error('Calculation error:', error)
    }
  }, [input, config])
  
  const handleReset = useCallback(() => {
    setInput(config.defaultValues)
    setResult(null)
    setErrors({})
  }, [config])
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        <p className="text-muted-foreground mt-1">{description}</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="输入参数">
          <div className="space-y-4">
            {renderInput(input, setInput, errors)}
            <div className="flex gap-3 pt-4">
              <Button onClick={handleCompute}>
                计算
              </Button>
              <Button variant="outline" onClick={handleReset}>
                重置
              </Button>
            </div>
          </div>
        </Card>
        
        {result && (
          <Card title="计算结果">
            {renderResult(result)}
          </Card>
        )}
      </div>
    </div>
  )
}
