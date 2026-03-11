'use client'

import { useState, useMemo } from 'react'
import { ToolShell } from '@/components/tools'
import { FileDiff, ArrowLeftRight, RotateCcw } from 'lucide-react'

function computeDiff(oldText: string, newText: string) {
  const oldLines = oldText.split('\n')
  const newLines = newText.split('\n')
  
  const result: Array<{ type: 'unchanged' | 'added' | 'removed', text: string }> = []
  const maxLength = Math.max(oldLines.length, newLines.length)
  
  for (let i = 0; i < maxLength; i++) {
    const oldLine = oldLines[i]
    const newLine = newLines[i]
    
    if (oldLine === undefined && newLine !== undefined) {
      result.push({ type: 'added', text: newLine })
    } else if (newLine === undefined && oldLine !== undefined) {
      result.push({ type: 'removed', text: oldLine })
    } else if (oldLine === newLine) {
      result.push({ type: 'unchanged', text: oldLine })
    } else {
      result.push({ type: 'removed', text: oldLine })
      result.push({ type: 'added', text: newLine })
    }
  }
  
  return result
}

export default function CodeDiffPage() {
  const [oldText, setOldText] = useState('')
  const [newText, setNewText] = useState('')
  
  const diff = useMemo(() => computeDiff(oldText, newText), [oldText, newText])

  const clearAll = () => {
    setOldText('')
    setNewText('')
  }

  const swapText = () => {
    const temp = oldText
    setOldText(newText)
    setNewText(temp)
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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-red-600">原始文本</span>
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
            </div>
            <textarea
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder="在此输入新文本..."
              className="w-full h-64 p-4 font-mono text-sm border rounded-lg bg-gray-50 dark:bg-gray-800 resize-none"
            />
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border-b">
            <span className="text-sm font-medium">对比结果</span>
          </div>
          <div className="max-h-96 overflow-y-auto">
            <table className="w-full text-sm font-mono">
              <tbody>
                {diff.map((line, index) => (
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
                    <td className="px-4 py-1 text-right text-gray-400 w-12 select-none">
                      {index + 1}
                    </td>
                    <td className="px-2 py-1 w-8 select-none">
                      {line.type === 'added' && <span className="text-green-600">+</span>}
                      {line.type === 'removed' && <span className="text-red-600">-</span>}
                      {line.type === 'unchanged' && <span className="text-gray-400"> </span>}
                    </td>
                    <td className="px-4 py-1 whitespace-pre">
                      {line.text}
                    </td>
                  </tr>
                ))}
                {diff.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-gray-500">
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
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">不变</span>
          </div>
        </div>

        <div className="text-sm text-gray-500 dark:text-gray-400">
          <p><strong>提示:</strong> 代码对比工具可快速查看两段文本的差异。绿色表示新增内容，红色表示删除内容。</p>
        </div>
      </div>
    </ToolShell>
  )
}
