'use client'

import { useState, useMemo } from 'react'
import { Regex, Copy, Check, AlertCircle, Info, Zap } from 'lucide-react'

interface Token {
  type: string
  value: string
  description: string
}

export default function RegexVisualizerPage() {
  const [pattern, setPattern] = useState('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')
  const [flags, setFlags] = useState('g')
  const [testString, setTestString] = useState('test@example.com\ninvalid-email\nuser.name@domain.co.uk')
  const [copied, setCopied] = useState(false)

  const tokens = useMemo(() => {
    return parseRegex(pattern)
  }, [pattern])

  const matches = useMemo(() => {
    try {
      const regex = new RegExp(pattern, flags)
      const lines = testString.split('\n')
      const results: { line: number; match: string; start: number; end: number }[] = []
      
      lines.forEach((line, lineIndex) => {
        let match
        const lineRegex = new RegExp(pattern, flags)
        while ((match = lineRegex.exec(line)) !== null) {
          results.push({
            line: lineIndex + 1,
            match: match[0],
            start: match.index,
            end: match.index + match[0].length
          })
          if (!flags.includes('g')) break
        }
      })
      
      return results
    } catch {
      return []
    }
  }, [pattern, flags, testString])

  const isValid = useMemo(() => {
    try {
      new RegExp(pattern, flags)
      return true
    } catch {
      return false
    }
  }, [pattern, flags])

  const parseRegex = (regex: string): Token[] => {
    const result: Token[] = []
    let i = 0

    const descriptions: Record<string, string> = {
      '^': '匹配字符串开头',
      '$': '匹配字符串结尾',
      '.': '匹配任意单个字符（除换行符）',
      '*': '匹配前一个元素 0 次或多次',
      '+': '匹配前一个元素 1 次或多次',
      '?': '匹配前一个元素 0 次或 1 次',
      '|': '或运算符，匹配左边或右边',
      '\\d': '匹配数字 [0-9]',
      '\\D': '匹配非数字 [^0-9]',
      '\\w': '匹配单词字符 [a-zA-Z0-9_]',
      '\\W': '匹配非单词字符',
      '\\s': '匹配空白字符',
      '\\S': '匹配非空白字符',
      '\\b': '匹配单词边界',
      '\\B': '匹配非单词边界',
      '\\n': '匹配换行符',
      '\\t': '匹配制表符',
      '\\r': '匹配回车符'
    }

    while (i < regex.length) {
      const char = regex[i]
      
      if (char === '\\') {
        const nextChar = regex[i + 1]
        if (nextChar) {
          const escaped = '\\' + nextChar
          result.push({
            type: 'escape',
            value: escaped,
            description: descriptions[escaped] || `转义字符 ${nextChar}`
          })
          i += 2
          continue
        }
      }

      if (char === '[') {
        let j = i + 1
        let negated = false
        if (regex[j] === '^') {
          negated = true
          j++
        }
        while (j < regex.length && regex[j] !== ']') {
          j++
        }
        const content = regex.slice(i, j + 1)
        result.push({
          type: 'charset',
          value: content,
          description: negated ? `匹配不在 ${content} 中的任意字符` : `匹配 ${content} 中的任意一个字符`
        })
        i = j + 1
        continue
      }

      if (char === '(') {
        let j = i + 1
        let depth = 1
        while (j < regex.length && depth > 0) {
          if (regex[j] === '(') depth++
          if (regex[j] === ')') depth--
          j++
        }
        const content = regex.slice(i, j)
        result.push({
          type: 'group',
          value: content,
          description: '捕获组'
        })
        i = j
        continue
      }

      if (char === '{') {
        let j = i + 1
        while (j < regex.length && regex[j] !== '}') {
          j++
        }
        const content = regex.slice(i, j + 1)
        result.push({
          type: 'quantifier',
          value: content,
          description: `量词: 匹配指定次数 ${content}`
        })
        i = j + 1
        continue
      }

      if (descriptions[char]) {
        result.push({
          type: 'special',
          value: char,
          description: descriptions[char]
        })
        i++
        continue
      }

      result.push({
        type: 'literal',
        value: char,
        description: `匹配字面字符 "${char}"`
      })
      i++
    }

    return result
  }

  const copyPattern = async () => {
    await navigator.clipboard.writeText(pattern)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getTokenColor = (type: string) => {
    switch (type) {
      case 'escape': return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
      case 'charset': return 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
      case 'group': return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
      case 'quantifier': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
      case 'special': return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Regex className="w-7 h-7" />
            正则表达式可视化
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            图形化解析正则表达式，帮助理解复杂模式
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <span className="font-medium text-gray-700 dark:text-gray-200">正则表达式</span>
                <button
                  onClick={copyPattern}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={pattern}
                      onChange={(e) => setPattern(e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-mono ${
                        isValid ? 'border-gray-300 dark:border-gray-600' : 'border-red-500'
                      }`}
                      placeholder="输入正则表达式..."
                    />
                  </div>
                  <input
                    type="text"
                    value={flags}
                    onChange={(e) => setFlags(e.target.value)}
                    className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-mono text-center"
                    placeholder="flags"
                  />
                </div>

                {!isValid && (
                  <div className="flex items-center gap-2 text-red-500 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    无效的正则表达式
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="px-4 py-3 bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <span className="font-medium text-gray-700 dark:text-gray-200">可视化解析</span>
              </div>
              <div className="p-4">
                <div className="flex flex-wrap gap-2">
                  {tokens.map((token, index) => (
                    <div
                      key={index}
                      className={`group relative px-2 py-1 rounded text-sm font-mono cursor-pointer ${getTokenColor(token.type)}`}
                    >
                      {token.value}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                        <div className="font-medium mb-1">{token.type}</div>
                        <div className="text-gray-300">{token.description}</div>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="px-4 py-3 bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <span className="font-medium text-gray-700 dark:text-gray-200">测试字符串</span>
              </div>
              <div className="p-4">
                <textarea
                  value={testString}
                  onChange={(e) => setTestString(e.target.value)}
                  className="w-full h-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-mono text-sm resize-none"
                  placeholder="输入测试字符串..."
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <span className="font-medium text-gray-700 dark:text-gray-200">
                  匹配结果 ({matches.length})
                </span>
                <Zap className="w-4 h-4 text-yellow-500" />
              </div>
              <div className="p-4">
                {matches.length > 0 ? (
                  <div className="space-y-2">
                    {matches.map((m, i) => (
                      <div key={i} className="flex items-center gap-3 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <span className="text-xs text-gray-500 dark:text-gray-400">行 {m.line}</span>
                        <span className="font-mono text-sm text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-800 px-2 py-0.5 rounded">
                          {m.match}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          [{m.start}-{m.end}]
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                    没有匹配结果
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="px-4 py-3 bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <span className="font-medium text-gray-700 dark:text-gray-200">常用模式</span>
              </div>
              <div className="p-4 space-y-2">
                {[
                  { name: '邮箱', pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$' },
                  { name: '手机号 (中国)', pattern: '^1[3-9]\\d{9}$' },
                  { name: 'URL', pattern: '^https?://[\\w.-]+\\.[a-zA-Z]{2,}[/\\w.-]*$' },
                  { name: 'IP 地址', pattern: '^((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$' },
                  { name: '日期 (YYYY-MM-DD)', pattern: '^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$' },
                  { name: '身份证号', pattern: '^[1-9]\\d{5}(19|20)\\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\\d|3[01])\\d{3}[\\dXx]$' }
                ].map((item, i) => (
                  <button
                    key={i}
                    onClick={() => setPattern(item.pattern)}
                    className="w-full text-left px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <span className="font-medium text-gray-700 dark:text-gray-200">{item.name}</span>
                    <code className="block text-xs text-gray-500 dark:text-gray-400 font-mono mt-1 truncate">
                      {item.pattern}
                    </code>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="px-4 py-3 bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <span className="font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  语法参考
                </span>
              </div>
              <div className="p-4 text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <span><code className="text-purple-600 dark:text-purple-400">.</code> 任意字符</span>
                  <span><code className="text-purple-600 dark:text-purple-400">\d</code> 数字</span>
                  <span><code className="text-purple-600 dark:text-purple-400">\w</code> 单词字符</span>
                  <span><code className="text-purple-600 dark:text-purple-400">\s</code> 空白</span>
                  <span><code className="text-green-600 dark:text-green-400">*</code> 0次或多次</span>
                  <span><code className="text-green-600 dark:text-green-400">+</code> 1次或多次</span>
                  <span><code className="text-green-600 dark:text-green-400">?</code> 0次或1次</span>
                  <span><code className="text-green-600 dark:text-green-400">{'{n}'}</code> n次</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
