'use client'

import { useState } from 'react'
import { ToolShell } from '@/components/tools'
import { Code, Copy, Check, RotateCcw, Maximize2, Minimize2 } from 'lucide-react'

export default function HTMLFormatterPage() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [copySuccess, setCopySuccess] = useState(false)
  const [indent, setIndent] = useState(2)

  const formatHTML = () => {
    if (!input) {
      setOutput('')
      setError('')
      return
    }

    try {
      let html = input.trim()
      
      const selfClosing = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']
      
      html = html.replace(/>\s+</g, '><')
      
      const tags = html.match(/<\/?[^>]+>|[^<]+/g) || []
      let result = ''
      let level = 0
      const indentStr = ' '.repeat(indent)

      for (const tag of tags) {
        if (tag.startsWith('</')) {
          level--
          result += indentStr.repeat(level) + tag + '\n'
        } else if (tag.startsWith('<')) {
          const tagName = tag.match(/<(\w+)/)?.[1]?.toLowerCase() || ''
          result += indentStr.repeat(level) + tag + '\n'
          if (!tag.endsWith('/>') && !selfClosing.includes(tagName)) {
            level++
          }
        } else if (tag.trim()) {
          result += indentStr.repeat(level) + tag.trim() + '\n'
        }
      }

      setOutput(result.trim())
      setError('')
    } catch (e) {
      setError('格式化失败')
      setOutput('')
    }
  }

  const minifyHTML = () => {
    if (!input) return
    const minified = input
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/\s+/g, ' ')
      .replace(/>\s+</g, '><')
      .trim()
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
    setInput('<div class="container"><header><h1>标题</h1></header><main><p>段落内容</p><ul><li>项目1</li><li>项目2</li></ul></main></div>')
    setError('')
  }

  return (
    <ToolShell title="HTML 格式化" icon={<Code className="w-5 h-5" />}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-3 items-center">
          <button
            onClick={formatHTML}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
          >
            <Maximize2 className="w-4 h-4" />
            格式化
          </button>
          <button
            onClick={minifyHTML}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md"
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
              <span className="text-sm font-medium">输入 HTML</span>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="输入 HTML 代码..."
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
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="text-sm text-gray-500 dark:text-gray-400">
          <p><strong>HTML 格式化工具</strong> 可以美化或压缩 HTML 代码，自动处理缩进。</p>
        </div>
      </div>
    </ToolShell>
  )
}
