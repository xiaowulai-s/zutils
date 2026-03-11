'use client'

import { useState } from 'react'
import { ToolShell } from '@/components/tools'
import { Braces, Copy, Check, RotateCcw, Minimize2, Maximize2, AlertCircle } from 'lucide-react'

export default function JSONFormatterPage() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [copySuccess, setCopySuccess] = useState(false)
  const [indent, setIndent] = useState(2)

  const formatJSON = () => {
    if (!input) {
      setOutput('')
      setError('')
      return
    }

    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed, null, indent))
      setError('')
    } catch (e) {
      setError(`JSON 解析错误: ${e instanceof Error ? e.message : '未知错误'}`)
      setOutput('')
    }
  }

  const minifyJSON = () => {
    if (!input) {
      setOutput('')
      setError('')
      return
    }

    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed))
      setError('')
    } catch (e) {
      setError(`JSON 解析错误: ${e instanceof Error ? e.message : '未知错误'}`)
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

  const loadSample = () => {
    const sample = {
      name: "开发工具箱",
      version: "1.0.0",
      features: ["PCB计算", "电阻计算", "滤波器设计"],
      author: {
        name: "开发者",
        email: "dev@example.com"
      },
      active: true
    }
    setInput(JSON.stringify(sample))
    setOutput(JSON.stringify(sample, null, indent))
    setError('')
  }

  return (
    <ToolShell title="JSON 格式化" icon={<Braces className="w-5 h-5" />}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-3 items-center">
          <button
            onClick={formatJSON}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
          >
            <Maximize2 className="w-4 h-4" />
            格式化
          </button>
          <button
            onClick={minifyJSON}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors"
          >
            <Minimize2 className="w-4 h-4" />
            压缩
          </button>
          <div className="flex items-center gap-2">
            <label className="text-sm">缩进:</label>
            <select
              value={indent}
              onChange={(e) => setIndent(Number(e.target.value))}
              className="px-3 py-1.5 border rounded-md bg-background"
            >
              <option value={2}>2 空格</option>
              <option value={4}>4 空格</option>
              <option value={1}>1 制表符</option>
            </select>
          </div>
          <button
            onClick={loadSample}
            className="px-4 py-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            示例
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
              <span className="text-sm font-medium">输入 JSON</span>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='{"key": "value"}'
              className="w-full h-80 p-4 font-mono text-sm border rounded-lg bg-gray-50 dark:bg-gray-800 resize-none"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">输出结果</span>
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
              placeholder="格式化结果将显示在这里..."
              className="w-full h-80 p-4 font-mono text-sm border rounded-lg bg-gray-50 dark:bg-gray-800 resize-none"
            />
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-600 dark:text-red-400 text-sm">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="text-sm text-gray-500 dark:text-gray-400">
          <p><strong>JSON 格式化工具</strong> 可以美化或压缩 JSON 数据，便于阅读和调试。</p>
          <p className="mt-1">支持语法错误检测，快速定位 JSON 格式问题。</p>
        </div>
      </div>
    </ToolShell>
  )
}
