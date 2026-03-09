'use client'

import { useState } from 'react'
import { Card, Button, Input } from '@/components/ui'
import { decodeSMDResistor, type SMDResult } from '@/lib/calculations/resistor'

export default function SmdResistorPage() {
  const [code, setCode] = useState('')
  const [result, setResult] = useState<SMDResult | null>(null)
  const [error, setError] = useState('')
  
  const handleDecode = () => {
    if (!code.trim()) {
      setError('请输入丝印代码')
      return
    }
    
    try {
      const res = decodeSMDResistor({ code: code.trim() })
      setResult(res)
      setError('')
    } catch (e) {
      setError('无效的丝印代码格式')
      setResult(null)
    }
  }
  
  const handleReset = () => {
    setCode('')
    setResult(null)
    setError('')
  }
  
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">SMD 电阻丝印助手</h1>
        <p className="text-muted-foreground mt-1">解析三位、四位及 EIA-96 编码的贴片电阻丝印代码</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="输入丝印代码">
          <div className="space-y-4">
            <Input
              label="丝印代码"
              placeholder="例如: 103, 4702, 01C"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              error={error}
            />
            
            <div className="text-sm text-muted-foreground space-y-2">
              <p>支持的格式：</p>
              <ul className="list-disc list-inside space-y-1">
                <li>三位代码 (如 103 = 10kΩ)</li>
                <li>四位代码 (如 4702 = 47kΩ)</li>
                <li>EIA-96 代码 (如 01C = 100Ω)</li>
              </ul>
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button onClick={handleDecode}>解析</Button>
              <Button variant="outline" onClick={handleReset}>重置</Button>
            </div>
          </div>
        </Card>
        
        {result && (
          <Card title="解析结果">
            <div className="space-y-4">
              <div className="p-6 rounded-lg bg-primary/10 text-center">
                <p className="text-sm text-muted-foreground mb-2">电阻值</p>
                <p className="text-4xl font-bold text-primary">{result.formattedResistance}</p>
              </div>
              
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">编码类型</p>
                <p className="text-lg font-semibold">{result.type}</p>
              </div>
              
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">原始值</p>
                <p className="text-lg font-semibold">{result.resistance} Ω</p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
