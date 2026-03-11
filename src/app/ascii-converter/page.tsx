'use client'

import { useState } from 'react'
import { ToolShell } from '@/components/tools'
import { Type, Copy, Check, RotateCcw } from 'lucide-react'

type ConversionMode = 'text-to-ascii' | 'ascii-to-text'

export default function AsciiConverterPage() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<ConversionMode>('text-to-ascii')
  const [format, setFormat] = useState<'dec' | 'hex' | 'oct' | 'bin'>('dec')
  const [separator, setSeparator] = useState(' ')
  const [copySuccess, setCopySuccess] = useState(false)

  const convert = () => {
    if (!input) {
      setOutput('')
      return
    }

    if (mode === 'text-to-ascii') {
      const chars = input.split('')
      const codes = chars.map(char => {
        const code = char.charCodeAt(0)
        if (format === 'dec') return code.toString()
        if (format === 'hex') return '0x' + code.toString(16).toUpperCase().padStart(2, '0')
        if (format === 'oct') return '0o' + code.toString(8)
        if (format === 'bin') return '0b' + code.toString(2).padStart(8, '0')
        return code.toString()
      })
      setOutput(codes.join(separator))
    } else {
      try {
        const parts = input.split(new RegExp(`[${separator}\\s,]+`)).filter(p => p.trim())
        const text = parts.map(part => {
          let code: number
          if (part.startsWith('0x') || part.startsWith('0X')) {
            code = parseInt(part.slice(2), 16)
          } else if (part.startsWith('0o') || part.startsWith('0O')) {
            code = parseInt(part.slice(2), 8)
          } else if (part.startsWith('0b') || part.startsWith('0B')) {
            code = parseInt(part.slice(2), 2)
          } else {
            code = parseInt(part, 10)
          }
          return String.fromCharCode(code)
        }).join('')
        setOutput(text)
      } catch (e) {
        setOutput('转换失败，请检查输入格式')
      }
    }
  }

  const copyOutput = async () => {
    if (!output) return
    try {
      await navigator.clipboard.writeText(output)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (e) {
      console.error('复制失败:', e)
    }
  }

  const clearAll = () => {
    setInput('')
    setOutput('')
  }

  const commonChars = [
    { char: 'NUL', code: 0 }, { char: 'SOH', code: 1 }, { char: 'STX', code: 2 }, { char: 'ETX', code: 3 },
    { char: 'EOT', code: 4 }, { char: 'ENQ', code: 5 }, { char: 'ACK', code: 6 }, { char: 'BEL', code: 7 },
    { char: 'BS', code: 8 }, { char: 'TAB', code: 9 }, { char: 'LF', code: 10 }, { char: 'VT', code: 11 },
    { char: 'FF', code: 12 }, { char: 'CR', code: 13 }, { char: 'SO', code: 14 }, { char: 'SI', code: 15 },
    { char: 'Space', code: 32 }, { char: '!', code: 33 }, { char: '"', code: 34 }, { char: '#', code: 35 },
    { char: '$', code: 36 }, { char: '%', code: 37 }, { char: '&', code: 38 }, { char: "'", code: 39 },
    { char: '(', code: 40 }, { char: ')', code: 41 }, { char: '*', code: 42 }, { char: '+', code: 43 },
    { char: ',', code: 44 }, { char: '-', code: 45 }, { char: '.', code: 46 }, { char: '/', code: 47 },
    { char: '0', code: 48 }, { char: '1', code: 49 }, { char: '2', code: 50 }, { char: '3', code: 51 },
    { char: '4', code: 52 }, { char: '5', code: 53 }, { char: '6', code: 54 }, { char: '7', code: 55 },
    { char: '8', code: 56 }, { char: '9', code: 57 }, { char: ':', code: 58 }, { char: ';', code: 59 },
    { char: '<', code: 60 }, { char: '=', code: 61 }, { char: '>', code: 62 }, { char: '?', code: 63 },
    { char: '@', code: 64 }, { char: 'A', code: 65 }, { char: 'B', code: 66 }, { char: 'C', code: 67 },
    { char: 'D', code: 68 }, { char: 'E', code: 69 }, { char: 'F', code: 70 }, { char: 'G', code: 71 },
    { char: 'H', code: 72 }, { char: 'I', code: 73 }, { char: 'J', code: 74 }, { char: 'K', code: 75 },
    { char: 'L', code: 76 }, { char: 'M', code: 77 }, { char: 'N', code: 78 }, { char: 'O', code: 79 },
    { char: 'P', code: 80 }, { char: 'Q', code: 81 }, { char: 'R', code: 82 }, { char: 'S', code: 83 },
    { char: 'T', code: 84 }, { char: 'U', code: 85 }, { char: 'V', code: 86 }, { char: 'W', code: 87 },
    { char: 'X', code: 88 }, { char: 'Y', code: 89 }, { char: 'Z', code: 90 }, { char: '[', code: 91 },
    { char: '\\', code: 92 }, { char: ']', code: 93 }, { char: '^', code: 94 }, { char: '_', code: 95 },
    { char: '`', code: 96 }, { char: 'a', code: 97 }, { char: 'b', code: 98 }, { char: 'c', code: 99 },
    { char: 'd', code: 100 }, { char: 'e', code: 101 }, { char: 'f', code: 102 }, { char: 'g', code: 103 },
    { char: 'h', code: 104 }, { char: 'i', code: 105 }, { char: 'j', code: 106 }, { char: 'k', code: 107 },
    { char: 'l', code: 108 }, { char: 'm', code: 109 }, { char: 'n', code: 110 }, { char: 'o', code: 111 },
    { char: 'p', code: 112 }, { char: 'q', code: 113 }, { char: 'r', code: 114 }, { char: 's', code: 115 },
    { char: 't', code: 116 }, { char: 'u', code: 117 }, { char: 'v', code: 118 }, { char: 'w', code: 119 },
    { char: 'x', code: 120 }, { char: 'y', code: 121 }, { char: 'z', code: 122 }, { char: '{', code: 123 },
    { char: '|', code: 124 }, { char: '}', code: 125 }, { char: '~', code: 126 },
  ]

  return (
    <ToolShell title="ASCII / 字符" icon={<Type className="w-5 h-5" />}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex border rounded-lg overflow-hidden">
            <button
              onClick={() => { setMode('text-to-ascii'); setOutput(''); }}
              className={`px-4 py-2 ${mode === 'text-to-ascii' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
              文本 → ASCII
            </button>
            <button
              onClick={() => { setMode('ascii-to-text'); setOutput(''); }}
              className={`px-4 py-2 ${mode === 'ascii-to-text' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
              ASCII → 文本
            </button>
          </div>
          {mode === 'text-to-ascii' && (
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as any)}
              className="px-4 py-2 border rounded-md bg-white dark:bg-gray-700"
            >
              <option value="dec">十进制</option>
              <option value="hex">十六进制</option>
              <option value="oct">八进制</option>
              <option value="bin">二进制</option>
            </select>
          )}
          <button
            onClick={convert}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors"
          >
            转换
          </button>
          <button
            onClick={clearAll}
            className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <RotateCcw className="w-4 h-4" />
            清空
          </button>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm">分隔符:</span>
          <input
            type="text"
            value={separator}
            onChange={(e) => setSeparator(e.target.value)}
            className="w-16 px-2 py-1 border rounded-md text-center bg-white dark:bg-gray-700"
          />
          {output && (
            <button
              onClick={copyOutput}
              className="flex items-center gap-2 px-3 py-1.5 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 ml-auto"
            >
              {copySuccess ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              <span className="text-sm">{copySuccess ? '已复制' : '复制'}</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">{mode === 'text-to-ascii' ? '输入文本' : '输入 ASCII 码'}</span>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onInput={convert}
              placeholder={mode === 'text-to-ascii' ? '输入要转换的文本...' : '输入 ASCII 码（用空格分隔）...'}
              className="w-full h-40 p-4 font-mono text-sm border rounded-lg bg-gray-50 dark:bg-gray-800 resize-none"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">{mode === 'text-to-ascii' ? 'ASCII 码' : '输出文本'}</span>
            </div>
            <textarea
              value={output}
              readOnly
              placeholder="结果将显示在这里..."
              className="w-full h-40 p-4 font-mono text-sm border rounded-lg bg-gray-50 dark:bg-gray-800 resize-none"
            />
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border-b">
            <span className="text-sm font-medium">常用 ASCII 字符表</span>
          </div>
          <div className="p-4 max-h-64 overflow-y-auto">
            <div className="grid grid-cols-4 sm:grid-cols-8 md:grid-cols-16 gap-2">
              {commonChars.map((item, index) => (
                <div
                  key={index}
                  onClick={() => {
                    if (mode === 'text-to-ascii') {
                      if (item.code >= 32 && item.code <= 126) {
                        setInput(prev => prev + (item.char === 'Space' ? ' ' : item.char))
                      }
                    } else {
                      setInput(prev => prev + (prev ? separator : '') + item.code)
                    }
                  }}
                  className="p-2 text-center border rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-xs"
                >
                  <div className="font-mono">{item.code}</div>
                  <div className="text-gray-600 dark:text-gray-400 truncate">
                    {item.code >= 32 && item.code <= 126
                      ? (item.char === 'Space' ? '␣' : item.char)
                      : item.char}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-500 dark:text-gray-400">
          <p><strong>提示:</strong> ASCII（美国信息交换标准代码）是一种字符编码标准。点击下方字符表可快速添加。</p>
        </div>
      </div>
    </ToolShell>
  )
}
