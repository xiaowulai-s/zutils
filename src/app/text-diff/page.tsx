'use client'

import { useState, useMemo } from 'react'
import { ToolShell } from '@/components/tools'
import { TextCursor, Copy, Check, RotateCcw, ArrowRightLeft } from 'lucide-react'

interface DiffChar {
  char: string
  type: 'unchanged' | 'added' | 'removed'
}

export default function TextDiffPage() {
  const [oldText, setOldText] = useState('')
  const [newText, setNewText] = useState('')
  const [mode, setMode] = useState<'char' | 'word'>('char')
  const [copySuccess, setCopySuccess] = useState(false)

  const diff = useMemo(() => {
    if (!oldText && !newText) return []

    if (mode === 'char') {
      return computeCharDiff(oldText, newText)
    } else {
      return computeWordDiff(oldText, newText)
    }
  }, [oldText, newText, mode])

  function computeCharDiff(oldStr: string, newStr: string): DiffChar[] {
    const m = oldStr.length
    const n = newStr.length
    const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0))

    for (let i = m - 1; i >= 0; i--) {
      for (let j = n - 1; j >= 0; j--) {
        if (oldStr[i] === newStr[j]) {
          dp[i][j] = dp[i + 1][j + 1] + 1
        } else {
          dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1])
        }
      }
    }

    const result: DiffChar[] = []
    let i = 0, j = 0

    while (i < m || j < n) {
      if (i < m && j < n && oldStr[i] === newStr[j]) {
        result.push({ char: oldStr[i], type: 'unchanged' })
        i++; j++
      } else if (j < n && (i === m || dp[i][j + 1] >= dp[i + 1][j])) {
        result.push({ char: newStr[j], type: 'added' })
        j++
      } else if (i < m) {
        result.push({ char: oldStr[i], type: 'removed' })
        i++
      }
    }

    return result
  }

  function computeWordDiff(oldStr: string, newStr: string): DiffChar[] {
    const oldWords = oldStr.split(/(\s+)/)
    const newWords = newStr.split(/(\s+)/)
    
    const m = oldWords.length
    const n = newWords.length
    const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0))

    for (let i = m - 1; i >= 0; i--) {
      for (let j = n - 1; j >= 0; j--) {
        if (oldWords[i] === newWords[j]) {
          dp[i][j] = dp[i + 1][j + 1] + 1
        } else {
          dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1])
        }
      }
    }

    const result: DiffChar[] = []
    let i = 0, j = 0

    while (i < m || j < n) {
      if (i < m && j < n && oldWords[i] === newWords[j]) {
        oldWords[i].split('').forEach(c => result.push({ char: c, type: 'unchanged' }))
        i++; j++
      } else if (j < n && (i === m || dp[i][j + 1] >= dp[i + 1][j])) {
        newWords[j].split('').forEach(c => result.push({ char: c, type: 'added' }))
        j++
      } else if (i < m) {
        oldWords[i].split('').forEach(c => result.push({ char: c, type: 'removed' }))
        i++
      }
    }

    return result
  }

  const stats = useMemo(() => {
    const added = diff.filter(d => d.type === 'added').length
    const removed = diff.filter(d => d.type === 'removed').length
    const unchanged = diff.filter(d => d.type === 'unchanged').length
    return { added, removed, unchanged }
  }, [diff])

  const clearAll = () => {
    setOldText('')
    setNewText('')
  }

  const swapText = () => {
    const temp = oldText
    setOldText(newText)
    setNewText(temp)
  }

  const copyDiff = async () => {
    const text = diff.map(d => d.char).join('')
    await navigator.clipboard.writeText(text)
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 2000)
  }

  return (
    <ToolShell title="文本差异对比" icon={<TextCursor className="w-5 h-5" />}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex border rounded-lg overflow-hidden">
            <button
              onClick={() => setMode('char')}
              className={`px-4 py-2 ${mode === 'char' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
              字符级
            </button>
            <button
              onClick={() => setMode('word')}
              className={`px-4 py-2 ${mode === 'word' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
              单词级
            </button>
          </div>
          <button
            onClick={swapText}
            className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ArrowRightLeft className="w-4 h-4" />
            交换
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
              <span className="text-sm font-medium text-red-600">原始文本</span>
              <span className="text-xs text-gray-400">{oldText.length} 字符</span>
            </div>
            <textarea
              value={oldText}
              onChange={(e) => setOldText(e.target.value)}
              placeholder="输入原始文本..."
              className="w-full h-40 p-4 font-mono text-sm border rounded-lg bg-gray-50 dark:bg-gray-800 resize-none"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-green-600">新文本</span>
              <span className="text-xs text-gray-400">{newText.length} 字符</span>
            </div>
            <textarea
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder="输入新文本..."
              className="w-full h-40 p-4 font-mono text-sm border rounded-lg bg-gray-50 dark:bg-gray-800 resize-none"
            />
          </div>
        </div>

        {(stats.added > 0 || stats.removed > 0) && (
          <div className="flex gap-4 text-sm">
            <span className="text-green-600">+{stats.added} 添加</span>
            <span className="text-red-600">-{stats.removed} 删除</span>
            <span className="text-gray-500">{stats.unchanged} 未修改</span>
          </div>
        )}

        <div className="border rounded-lg overflow-hidden">
          <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border-b flex items-center justify-between">
            <span className="text-sm font-medium">差异结果</span>
            <button
              onClick={copyDiff}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
            >
              {copySuccess ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              复制
            </button>
          </div>
          <div className="p-4 min-h-32 max-h-64 overflow-y-auto bg-white dark:bg-gray-900">
            {diff.length === 0 ? (
              <span className="text-gray-400">输入文本以查看差异</span>
            ) : (
              <pre className="font-mono text-sm whitespace-pre-wrap break-all">
                {diff.map((d, i) => (
                  <span
                    key={i}
                    className={
                      d.type === 'added'
                        ? 'bg-green-200 dark:bg-green-800 text-green-900 dark:text-green-100'
                        : d.type === 'removed'
                        ? 'bg-red-200 dark:bg-red-800 text-red-900 dark:text-red-100 line-through'
                        : ''
                    }
                  >
                    {d.char}
                  </span>
                ))}
              </pre>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-200 dark:bg-green-800 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">新增</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-200 dark:bg-red-800 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">删除</span>
          </div>
        </div>
      </div>
    </ToolShell>
  )
}
