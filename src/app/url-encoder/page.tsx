'use client'

import { useState } from 'react'
import { ToolShell } from '@/components/tools'
import { Link2, Copy, Check, RotateCcw, ArrowRightLeft } from 'lucide-react'

export default function URLEncoderPage() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [copySuccess, setCopySuccess] = useState(false)
  const [error, setError] = useState('')

  const convert = () => {
    if (!input) {
      setOutput('')
      setError('')
      return
    }

    try {
      if (mode === 'encode') {
        setOutput(encodeURIComponent(input))
        setError('')
      } else {
        setOutput(decodeURIComponent(input))
        setError('')
      }
    } catch (e) {
      setError('解码失败：输入不是有效的 URL 编码')
      setOutput('')
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
    setError('')
  }

  const swapMode = () => {
    setMode(mode === 'encode' ? 'decode' : 'encode')
    setInput(output)
    setOutput(input)
    setError('')
  }

  return (
    <ToolShell title="URL 编解码" icon={<Link2 className="w-5 h-5" />}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex border rounded-lg overflow-hidden">
            <button
              onClick={() => { setMode('encode'); setOutput(''); setError(''); }}
              className={`px-4 py-2 ${mode === 'encode' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
              编码
            </button>
            <button
              onClick={() => { setMode('decode'); setOutput(''); setError(''); }}
              className={`px-4 py-2 ${mode === 'decode' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
              解码
            </button>
          </div>
          <button
            onClick={swapMode}
            className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ArrowRightLeft className="w-4 h-4" />
            交换
          </button>
          <button
            onClick={convert}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors"
          >
            {mode === 'encode' ? '编码' : '解码'}
          </button>
          <button
            onClick={clearAll}
            className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <RotateCcw className="w-4 h-4" />
            清空
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">{mode === 'encode' ? '原始文本' : 'URL 编码'}</span>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onInput={convert}
              placeholder={mode === 'encode' ? '输入要编码的文本...' : '输入 URL 编码...'}
              className="w-full h-48 p-4 font-mono text-sm border rounded-lg bg-gray-50 dark:bg-gray-800 resize-none"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">{mode === 'encode' ? 'URL 编码' : '原始文本'}</span>
              {output && (
                <button
                  onClick={copyOutput}
                  className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
                >
                  {copySuccess ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  {copySuccess ? '已复制' : '复制'}
                </button>
              )}
            </div>
            <textarea
              value={output}
              readOnly
              placeholder="结果将显示在这里..."
              className="w-full h-48 p-4 font-mono text-sm border rounded-lg bg-gray-50 dark:bg-gray-800 resize-none"
            />
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="text-sm text-gray-500 dark:text-gray-400">
          <p><strong>URL 编码</strong>（也称为百分号编码）是一种将字符转换为可在 URL 中安全传输的格式的机制。</p>
          <p className="mt-1">特殊字符如空格、中文、符号等会被转换为 %XX 格式。</p>
        </div>
      </div>
    </ToolShell>
  )
}
