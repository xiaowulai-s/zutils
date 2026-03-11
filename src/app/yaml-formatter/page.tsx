'use client'

import { useState } from 'react'
import { ToolShell } from '@/components/tools'
import { FileCode, Copy, Check, RotateCcw, Maximize2, Minimize2, AlertCircle } from 'lucide-react'

export default function YAMLFormatterPage() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [copySuccess, setCopySuccess] = useState(false)

  const parseYAML = (yaml: string): unknown => {
    const lines = yaml.split('\n')
    const result: Record<string, unknown> = {}
    const stack: { obj: Record<string, unknown>; indent: number }[] = [{ obj: result, indent: -1 }]

    for (const line of lines) {
      if (!line.trim() || line.trim().startsWith('#')) continue

      const indent = line.search(/\S/)
      const content = line.trim()

      const colonIndex = content.indexOf(':')
      if (colonIndex === -1) continue

      const key = content.slice(0, colonIndex).trim()
      let value: unknown = content.slice(colonIndex + 1).trim()

      if (!value) {
        value = {}
      } else if (value === 'true') {
        value = true
      } else if (value === 'false') {
        value = false
      } else if (value === 'null' || value === '~') {
        value = null
      } else if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1)
      } else if (value.startsWith("'") && value.endsWith("'")) {
        value = value.slice(1, -1)
      } else if (!isNaN(Number(value))) {
        value = Number(value)
      }

      while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
        stack.pop()
      }

      const current = stack[stack.length - 1]
      current.obj[key] = value

      if (typeof value === 'object' && value !== null) {
        stack.push({ obj: value as Record<string, unknown>, indent })
      }
    }

    return result
  }

  const formatYAML = () => {
    if (!input) {
      setOutput('')
      setError('')
      return
    }

    try {
      const parsed = parseYAML(input)
      const formatted = toYAML(parsed, 0)
      setOutput(formatted)
      setError('')
    } catch (e) {
      setError(`解析错误: ${e instanceof Error ? e.message : '未知错误'}`)
      setOutput('')
    }
  }

  const toYAML = (obj: unknown, level: number): string => {
    const indent = '  '.repeat(level)
    
    if (obj === null) return 'null'
    if (typeof obj === 'boolean') return obj.toString()
    if (typeof obj === 'number') return obj.toString()
    if (typeof obj === 'string') {
      if (obj.includes('\n') || obj.includes(':') || obj.includes('#')) {
        return `"${obj.replace(/"/g, '\\"')}"`
      }
      return obj
    }
    
    if (Array.isArray(obj)) {
      return obj.map(item => `\n${indent}- ${toYAML(item, level + 1)}`).join('')
    }
    
    if (typeof obj === 'object') {
      const entries = Object.entries(obj)
      if (entries.length === 0) return '{}'
      return entries.map(([key, value]) => {
        const val = toYAML(value, level + 1)
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          return `\n${indent}${key}:${val}`
        }
        return `\n${indent}${key}: ${val}`
      }).join('')
    }
    
    return String(obj)
  }

  const minifyYAML = () => {
    if (!input) return
    const minified = input
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('#'))
      .join('\n')
    setOutput(minified)
    setError('')
  }

  const copyOutput = async () => {
    if (!output) return
    await navigator.clipboard.writeText(output)
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 2000)
  }

  const clearAll = () => {
    setInput('')
    setOutput('')
    setError('')
  }

  const loadSample = () => {
    setInput(`name: 开发工具箱
version: 1.0.0
description: 在线工具集
features:
  - PCB 计算
  - 电阻计算
  - 滤波器设计
author:
  name: 开发者
  email: dev@example.com
settings:
  darkMode: true
  language: zh-CN
  maxHistory: 10`)
    setError('')
  }

  return (
    <ToolShell title="YAML 格式化" icon={<FileCode className="w-5 h-5" />}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-3 items-center">
          <button
            onClick={formatYAML}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
          >
            <Maximize2 className="w-4 h-4" />
            格式化
          </button>
          <button
            onClick={minifyYAML}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md"
          >
            <Minimize2 className="w-4 h-4" />
            压缩
          </button>
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
              <span className="text-sm font-medium">输入 YAML</span>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="输入 YAML..."
              className="w-full h-64 p-4 font-mono text-sm border rounded-lg bg-gray-50 dark:bg-gray-800 resize-none"
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
              placeholder="格式化结果..."
              className="w-full h-64 p-4 font-mono text-sm border rounded-lg bg-gray-50 dark:bg-gray-800 resize-none"
            />
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-600 dark:text-red-400 text-sm">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <div className="text-sm text-gray-500 dark:text-gray-400">
          <p><strong>YAML 格式化工具</strong> 可以美化和校验 YAML 配置文件。</p>
        </div>
      </div>
    </ToolShell>
  )
}
