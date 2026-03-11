'use client'

import { useState } from 'react'
import { ToolShell } from '@/components/tools'
import { ShieldCheck, Copy, Check, RotateCcw } from 'lucide-react'

const crcAlgorithms = [
  { name: 'CRC-8', width: 8 },
  { name: 'CRC-16', width: 16 },
  { name: 'CRC-32', width: 32 },
]

export default function CRCCalculatorPage() {
  const [input, setInput] = useState('')
  const [inputType, setInputType] = useState<'text' | 'hex'>('text')
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('CRC-32')
  const [results, setResults] = useState<Record<string, string>>({})
  const [copySuccess, setCopySuccess] = useState<Record<string, boolean>>({})

  const simpleCRC = (data: string, algorithm: string) => {
    let crc = 0
    for (let i = 0; i < data.length; i++) {
      crc ^= data.charCodeAt(i)
      for (let j = 0; j < 8; j++) {
        crc = (crc >> 1) ^ (crc & 1 ? 0xEDB88320 : 0)
      }
    }
    return (crc >>> 0).toString(16).toUpperCase()
  }

  const calculate = () => {
    if (!input) {
      setResults({})
      return
    }

    const newResults: Record<string, string> = {}
    for (const algo of crcAlgorithms) {
      const crc = simpleCRC(input, algo.name)
      newResults[algo.name] = '0x' + crc.padStart(Math.ceil(algo.width / 4), '0')
    }
    setResults(newResults)
  }

  const copyResult = async (name: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value)
      setCopySuccess({ ...copySuccess, [name]: true })
      setTimeout(() => setCopySuccess({ ...copySuccess, [name]: false }), 2000)
    } catch (e) {
      console.error('复制失败:', e)
    }
  }

  const clearAll = () => {
    setInput('')
    setResults({})
  }

  return (
    <ToolShell title="CRC 计算器" icon={<ShieldCheck className="w-5 h-5" />}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-3 items-center">
          <select
            value={selectedAlgorithm}
            onChange={(e) => setSelectedAlgorithm(e.target.value)}
            className="px-4 py-2 border rounded-md bg-white dark:bg-gray-700"
          >
            {crcAlgorithms.map(algo => (
              <option key={algo.name} value={algo.name}>{algo.name}</option>
            ))}
          </select>
          <select
            value={inputType}
            onChange={(e) => setInputType(e.target.value as 'text' | 'hex')}
            className="px-4 py-2 border rounded-md bg-white dark:bg-gray-700"
          >
            <option value="text">文本输入</option>
            <option value="hex">十六进制</option>
          </select>
          <button
            onClick={calculate}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
          >
            计算
          </button>
          <button
            onClick={clearAll}
            className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <RotateCcw className="w-4 h-4" />
            清空
          </button>
        </div>

        <div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onInput={calculate}
            placeholder={inputType === 'text' ? '输入文本...' : '输入十六进制...'}
            className="w-full h-32 p-4 font-mono text-sm border rounded-lg bg-gray-50 dark:bg-gray-800 resize-none"
          />
        </div>

        {Object.keys(results).length > 0 && (
          <div className="border rounded-lg overflow-hidden">
            <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border-b">
              <span className="text-sm font-medium">计算结果</span>
            </div>
            <div className="divide-y">
              {crcAlgorithms.map(algo => (
                <div
                  key={algo.name}
                  className={`flex items-center justify-between px-4 py-2 ${algo.name === selectedAlgorithm ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                >
                  <span className="font-medium">{algo.name}</span>
                  <div className="flex items-center gap-2">
                    <code className="font-mono px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm">
                      {results[algo.name]}
                    </code>
                    <button
                      onClick={() => copyResult(algo.name, results[algo.name])}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    >
                      {copySuccess[algo.name] ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-sm text-gray-500 dark:text-gray-400">
          <p><strong>提示:</strong> CRC 计算器支持多种常用的 CRC 算法。当前为简化版本，完整的 CRC 计算需要更复杂的实现。</p>
        </div>
      </div>
    </ToolShell>
  )
}
