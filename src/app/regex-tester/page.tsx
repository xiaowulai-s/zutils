'use client'

import { useState, useMemo } from 'react'
import { ToolShell } from '@/components/tools'
import { Regex, Copy, Check, RotateCcw, AlertCircle, CheckCircle } from 'lucide-react'

export default function RegexTesterPage() {
  const [pattern, setPattern] = useState('')
  const [flags, setFlags] = useState('g')
  const [testString, setTestString] = useState('')
  const [error, setError] = useState('')
  const [copySuccess, setCopySuccess] = useState(false)

  const results = useMemo(() => {
    if (!pattern || !testString) {
      setError('')
      return { matches: [], highlighted: testString }
    }

    try {
      const regex = new RegExp(pattern, flags)
      const matches: RegExpMatchArray[] = []
      let match

      if (flags.includes('g')) {
        while ((match = regex.exec(testString)) !== null) {
          matches.push(match)
          if (match[0] === '') regex.lastIndex++
        }
      } else {
        match = testString.match(regex)
        if (match) matches.push(match as RegExpMatchArray)
      }

      let highlighted = testString
      const globalRegex = new RegExp(pattern, flags.includes('g') ? flags : flags + 'g')
      highlighted = testString.replace(globalRegex, '<mark class="bg-yellow-200 dark:bg-yellow-800 rounded px-0.5">$&</mark>')

      setError('')
      return { matches, highlighted }
    } catch (e) {
      setError(e instanceof Error ? e.message : '正则表达式错误')
      return { matches: [], highlighted: testString }
    }
  }, [pattern, flags, testString])

  const copyMatches = async () => {
    if (results.matches.length === 0) return
    try {
      await navigator.clipboard.writeText(results.matches.map(m => m[0]).join('\n'))
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (e) {
      console.error('复制失败:', e)
    }
  }

  const clearAll = () => {
    setPattern('')
    setTestString('')
    setError('')
  }

  const flagOptions = [
    { flag: 'g', name: '全局', desc: '匹配所有' },
    { flag: 'i', name: '忽略大小写', desc: '不区分大小写' },
    { flag: 'm', name: '多行', desc: '^$匹配行首尾' },
    { flag: 's', name: '点匹配换行', desc: '.匹配\n' },
  ]

  const toggleFlag = (flag: string) => {
    if (flags.includes(flag)) {
      setFlags(flags.replace(flag, ''))
    } else {
      setFlags(flags + flag)
    }
  }

  return (
    <ToolShell title="正则表达式测试" icon={<Regex className="w-5 h-5" />}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium mb-1">正则表达式</label>
            <div className="flex">
              <span className="px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-r-0 rounded-l-md text-gray-500">/</span>
              <input
                type="text"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                placeholder="输入正则表达式..."
                className="flex-1 px-3 py-2 border font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-l-0 rounded-r-md text-gray-500">/{flags}</span>
            </div>
          </div>
          <button
            onClick={clearAll}
            className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <RotateCcw className="w-4 h-4" />
            清空
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {flagOptions.map(opt => (
            <label
              key={opt.flag}
              className={`flex items-center gap-2 px-3 py-1.5 border rounded-md cursor-pointer transition-colors ${
                flags.includes(opt.flag)
                  ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
              title={opt.desc}
            >
              <input
                type="checkbox"
                checked={flags.includes(opt.flag)}
                onChange={() => toggleFlag(opt.flag)}
                className="rounded"
              />
              <span className="font-mono text-sm">{opt.flag}</span>
              <span className="text-xs text-gray-500">{opt.name}</span>
            </label>
          ))}
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-600 dark:text-red-400 text-sm">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">测试文本</span>
            </div>
            <textarea
              value={testString}
              onChange={(e) => setTestString(e.target.value)}
              placeholder="输入要测试的文本..."
              className="w-full h-48 p-4 font-mono text-sm border rounded-lg bg-gray-50 dark:bg-gray-800 resize-none"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">匹配结果</span>
              {results.matches.length > 0 && (
                <button
                  onClick={copyMatches}
                  className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
                >
                  {copySuccess ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  {copySuccess ? '已复制' : '复制匹配'}
                </button>
              )}
            </div>
            <div
              className="w-full h-48 p-4 font-mono text-sm border rounded-lg bg-gray-50 dark:bg-gray-800 overflow-auto whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: results.highlighted }}
            />
          </div>
        </div>

        {results.matches.length > 0 && (
          <div className="border rounded-lg overflow-hidden">
            <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border-b flex items-center justify-between">
              <span className="text-sm font-medium">匹配详情</span>
              <span className="text-sm text-gray-500">{results.matches.length} 个匹配</span>
            </div>
            <div className="max-h-48 overflow-y-auto">
              {results.matches.map((match, index) => (
                <div key={index} className="px-4 py-2 border-b last:border-b-0 flex items-center gap-4">
                  <span className="text-xs text-gray-400 w-8">#{index + 1}</span>
                  <code className="flex-1 px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 rounded text-sm">
                    {match[0]}
                  </code>
                  <span className="text-xs text-gray-500">
                    位置: {match.index}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-sm text-gray-500 dark:text-gray-400">
          <p><strong>正则表达式</strong> 是一种强大的文本匹配工具，广泛用于搜索、替换和验证。</p>
          <p className="mt-1">常用示例: <code className="px-1 bg-gray-100 dark:bg-gray-800 rounded">\d+</code> 匹配数字, <code className="px-1 bg-gray-100 dark:bg-gray-800 rounded">[a-zA-Z]+</code> 匹配字母</p>
        </div>
      </div>
    </ToolShell>
  )
}
