'use client'

import { useState } from 'react'
import { ToolShell } from '@/components/tools'
import { Database, Copy, Check, RotateCcw, Minimize2, Maximize2, AlertCircle } from 'lucide-react'

export default function SQLFormatterPage() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [copySuccess, setCopySuccess] = useState(false)
  const [indent, setIndent] = useState(2)

  const formatSQL = () => {
    if (!input) {
      setOutput('')
      setError('')
      return
    }

    try {
      let sql = input.trim()
      
      sql = sql.replace(/\s+/g, ' ')
      
      const keywords = [
        'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'NOT', 'IN', 'LIKE', 'BETWEEN',
        'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'OUTER JOIN', 'ON',
        'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'OFFSET',
        'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM',
        'CREATE TABLE', 'ALTER TABLE', 'DROP TABLE', 'INDEX',
        'UNION', 'UNION ALL', 'DISTINCT', 'AS',
        'CASE', 'WHEN', 'THEN', 'ELSE', 'END',
        'INNER', 'OUTER', 'LEFT', 'RIGHT', 'FULL', 'CROSS',
        'PRIMARY KEY', 'FOREIGN KEY', 'REFERENCES', 'CONSTRAINT',
        'NULL', 'NOT NULL', 'DEFAULT', 'AUTO_INCREMENT',
      ]

      const upperSql = sql.toUpperCase()
      
      keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi')
        sql = sql.replace(regex, keyword.toUpperCase())
      })

      const newlines = [
        'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'GROUP BY', 'ORDER BY', 'HAVING',
        'LIMIT', 'OFFSET', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN',
        'UNION', 'UNION ALL', 'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM',
      ]

      newlines.forEach(keyword => {
        const regex = new RegExp(`\\s+${keyword}\\b`, 'gi')
        sql = sql.replace(regex, `\n${keyword}`)
      })

      const indentStr = ' '.repeat(indent)
      const lines = sql.split('\n')
      let indentLevel = 0
      const formatted = lines.map(line => {
        const trimmed = line.trim()
        if (trimmed.toUpperCase().startsWith('FROM') || 
            trimmed.toUpperCase().startsWith('WHERE') ||
            trimmed.toUpperCase().startsWith('GROUP BY') ||
            trimmed.toUpperCase().startsWith('ORDER BY') ||
            trimmed.toUpperCase().startsWith('HAVING') ||
            trimmed.toUpperCase().startsWith('LIMIT')) {
          indentLevel = 0
        } else if (trimmed.toUpperCase().startsWith('AND') || 
                   trimmed.toUpperCase().startsWith('OR')) {
          indentLevel = 1
        } else if (trimmed.toUpperCase().startsWith('JOIN') ||
                   trimmed.toUpperCase().startsWith('LEFT JOIN') ||
                   trimmed.toUpperCase().startsWith('RIGHT JOIN') ||
                   trimmed.toUpperCase().startsWith('INNER JOIN')) {
          indentLevel = 0
        }
        return indentStr.repeat(indentLevel) + trimmed
      }).join('\n')

      setOutput(formatted)
      setError('')
    } catch (e) {
      setError('格式化失败')
      setOutput('')
    }
  }

  const minifySQL = () => {
    if (!input) return
    const minified = input.replace(/\s+/g, ' ').trim()
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
    setInput(`select id, name, email, created_at from users where status = 'active' and created_at > '2024-01-01' order by created_at desc limit 10`)
    setError('')
  }

  return (
    <ToolShell title="SQL 格式化" icon={<Database className="w-5 h-5" />}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-3 items-center">
          <button
            onClick={formatSQL}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
          >
            <Maximize2 className="w-4 h-4" />
            格式化
          </button>
          <button
            onClick={minifySQL}
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
              <span className="text-sm font-medium">输入 SQL</span>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="输入 SQL 语句..."
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
          <p><strong>SQL 格式化工具</strong> 可以美化或压缩 SQL 语句，关键字自动大写。</p>
        </div>
      </div>
    </ToolShell>
  )
}
