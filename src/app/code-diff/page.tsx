'use client'

import { useState, useMemo } from 'react'
import { ToolShell } from '@/components/tools'
import { FileDiff, Copy, Check, RotateCcw, ArrowLeftRight, ChevronDown, ChevronUp } from 'lucide-react'

interface DiffLine {
  type: 'unchanged' | 'added' | 'removed'
  oldNum?: number
  newNum?: number
  text: string
}

function diffLines(oldText: string, newText: string): DiffLine[] {
  const oldLines = oldText.split('\n')
  const newLines = newText.split('\n')
  const result: DiffLine[] = []
  
  const m = oldLines.length
  const n = newLines.length
  
  const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0))
  
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      if (oldLines[i] === newLines[j]) {
        dp[i][j] = dp[i + 1][j + 1] + 1
      } else {
        dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1])
      }
    }
  }
  
  let i = 0, j = 0
  let oldLineNum = 1, newLineNum = 1
  
  while (i < m || j < n) {
    if (i < m && j < n && oldLines[i] === newLines[j]) {
      result.push({ type: 'unchanged', oldNum: oldLineNum, newNum: newLineNum, text: oldLines[i] })
      i++; j++
      oldLineNum++; newLineNum++
    } else if (j < n && (i === m || dp[i][j + 1] >= dp[i + 1][j])) {
      result.push({ type: 'added', newNum: newLineNum, text: newLines[j] })
      j++
      newLineNum++
    } else if (i < m) {
      result.push({ type: 'removed', oldNum: oldLineNum, text: oldLines[i] })
      i++
      oldLineNum++
    }
  }
  
  return result
}

export default function CodeDiffPage() {
  const [oldText, setOldText] = useState('')
  const [newText, setNewText] = useState('')
  const [showUnchanged, setShowUnchanged] = useState(true)
  const [copySuccess, setCopySuccess] = useState(false)

  const diff = useMemo(() => diffLines(oldText, newText), [oldText, newText])
  
  const stats = useMemo(() => {
    const added = diff.filter(d => d.type === 'added').length
    const removed = diff.filter(d => d.type === 'removed').length
    const unchanged = diff.filter(d => d.type === 'unchanged').length
    return { added, removed, unchanged }
  }, [diff])

  const filteredDiff = useMemo(() => {
    if (showUnchanged) return diff
    return diff.filter(d => d.type !== 'unchanged')
  }, [diff, showUnchanged])

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
    const text = filteredDiff.map(d => {
      const prefix = d.type === 'added' ? '+' : d.type === 'removed' ? '-' : ' '
      return `${prefix} ${d.text}`
    }).join('\n')
    await navigator.clipboard.writeText(text)
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 2000)
  }

  return (
    <ToolShell title="代码对比" icon={<FileDiff className="w-5 h-5" />}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-3 items-center">
          <button
            onClick={swapText}
            className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ArrowLeftRight className="w-4 h-4" />
            交换
          </button>
          <button
            onClick={clearAll}
            className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <RotateCcw className="w-4 h-4" />
            清空
          </button>
          <label className="flex items-center gap-2 ml-auto">
            <input
              type="checkbox"
              checked={showUnchanged}
              onChange={(e) => setShowUnchanged(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm">显示未修改行</span>
          </label>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-red-600">原始文本</span>
              <span className="text-xs text-gray-400">{oldText.split('\n').length} 行</span>
            </div>
            <textarea
              value={oldText}
              onChange={(e) => setOldText(e.target.value)}
              placeholder="在此输入原始文本..."
              className="w-full h-64 p-4 font-mono text-sm border rounded-lg bg-gray-50 dark:bg-gray-800 resize-none"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-green-600">新文本</span>
              <span className="text-xs text-gray-400">{newText.split('\n').length} 行</span>
            </div>
            <textarea
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder="在此输入新文本..."
              className="w-full h-64 p-4 font-mono text-sm border rounded-lg bg-gray-50 dark:bg-gray-800 resize-none"
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
            <span className="text-sm font-medium">对比结果</span>
            <button
              onClick={copyDiff}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
            >
              {copySuccess ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              复制
            </button>
          </div>
          <div className="max-h-96 overflow-y-auto">
            <table className="w-full text-sm font-mono">
              <tbody>
                {filteredDiff.map((line, index) => (
                  <tr
                    key={index}
                    className={
                      line.type === 'added'
                        ? 'bg-green-50 dark:bg-green-900/30'
                        : line.type === 'removed'
                        ? 'bg-red-50 dark:bg-red-900/30'
                        : ''
                    }
                  >
                    <td className="px-2 py-0.5 text-right text-gray-400 w-10 select-none text-xs border-r border-gray-200 dark:border-gray-700">
                      {line.oldNum || ''}
                    </td>
                    <td className="px-2 py-0.5 text-right text-gray-400 w-10 select-none text-xs border-r border-gray-200 dark:border-gray-700">
                      {line.newNum || ''}
                    </td>
                    <td className="px-2 py-0.5 w-8 select-none">
                      {line.type === 'added' && <span className="text-green-600">+</span>}
                      {line.type === 'removed' && <span className="text-red-600">-</span>}
                      {line.type === 'unchanged' && <span className="text-gray-400"> </span>}
                    </td>
                    <td className="px-4 py-0.5 whitespace-pre">
                      {line.text}
                    </td>
                  </tr>
                ))}
                {filteredDiff.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                      输入文本以查看差异
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">新增</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">删除</span>
          </div>
        </div>
      </div>
    </ToolShell>
  )
}
