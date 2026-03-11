'use client'

import { useState, useMemo } from 'react'
import { ToolShell } from '@/components/tools'
import { Binary, Copy, Check, RotateCcw, ArrowRightLeft } from 'lucide-react'

type Base = 'bin' | 'oct' | 'dec' | 'hex'

const baseConfig: Record<Base, { name: string; radix: number; prefix: string }> = {
  bin: { name: '二进制', radix: 2, prefix: '0b' },
  oct: { name: '八进制', radix: 8, prefix: '0o' },
  hex: { name: '十六进制', radix: 16, prefix: '0x' },
  dec: { name: '十进制', radix: 10, prefix: '' },
}

export default function NumberConverterPage() {
  const [input, setInput] = useState('')
  const [inputBase, setInputBase] = useState<Base>('dec')
  const [copySuccess, setCopySuccess] = useState<Base | null>(null)

  const results = useMemo(() => {
    if (!input.trim()) return null

    try {
      const cleanInput = input.trim().replace(/^0[bxo]?/i, '')
      const decimal = parseInt(cleanInput, baseConfig[inputBase].radix)
      
      if (isNaN(decimal)) return null

      return {
        bin: decimal.toString(2),
        oct: decimal.toString(8),
        dec: decimal.toString(10),
        hex: decimal.toString(16).toUpperCase(),
        decimal,
      }
    } catch {
      return null
    }
  }, [input, inputBase])

  const copyValue = async (base: Base, value: string) => {
    try {
      await navigator.clipboard.writeText(baseConfig[base].prefix + value)
      setCopySuccess(base)
      setTimeout(() => setCopySuccess(null), 2000)
    } catch (e) {
      console.error('复制失败:', e)
    }
  }

  const clearAll = () => {
    setInput('')
  }

  const bases: Base[] = ['bin', 'oct', 'dec', 'hex']

  return (
    <ToolShell title="进制转换器" icon={<Binary className="w-5 h-5" />}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-3 items-center">
          <span className="text-sm">输入进制:</span>
          <div className="flex border rounded-lg overflow-hidden">
            {bases.map(base => (
              <button
                key={base}
                onClick={() => setInputBase(base)}
                className={`px-4 py-2 ${inputBase === base ? 'bg-blue-500 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                {baseConfig[base].name}
              </button>
            ))}
          </div>
          <button
            onClick={clearAll}
            className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <RotateCcw className="w-4 h-4" />
            清空
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            输入 {baseConfig[inputBase].name} 数值
          </label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`输入${baseConfig[inputBase].name}数值...`}
            className="w-full px-4 py-3 font-mono text-lg border rounded-lg bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {results && (
          <div className="border rounded-lg overflow-hidden">
            <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border-b">
              <span className="text-sm font-medium">转换结果</span>
            </div>
            <div className="divide-y">
              {bases.map(base => (
                <div key={base} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium w-16">{baseConfig[base].name}</span>
                    <span className="text-xs text-gray-400 font-mono">({baseConfig[base].prefix || '无前缀'})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="font-mono text-lg px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                      {baseConfig[base].prefix}{results[base]}
                    </code>
                    <button
                      onClick={() => copyValue(base, results[base])}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      title="复制"
                    >
                      {copySuccess === base ? (
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

        {!results && input && (
          <div className="text-center py-4 text-red-500">
            无效的 {baseConfig[inputBase].name} 输入
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-gray-500 mb-1">二进制示例</div>
            <code className="font-mono">1010 = 10</code>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-gray-500 mb-1">八进制示例</div>
            <code className="font-mono">12 = 10</code>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-gray-500 mb-1">十进制示例</div>
            <code className="font-mono">10 = 10</code>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-gray-500 mb-1">十六进制示例</div>
            <code className="font-mono">A = 10</code>
          </div>
        </div>

        <div className="text-sm text-gray-500 dark:text-gray-400">
          <p><strong>进制转换器</strong> 支持二进制、八进制、十进制、十六进制之间的相互转换。</p>
          <p className="mt-1">输入时可以带前缀（如 0x、0b、0o），也可以不带。</p>
        </div>
      </div>
    </ToolShell>
  )
}
