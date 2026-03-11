'use client'

import { useState, useCallback } from 'react'
import { ToolShell } from '@/components/tools'
import { Key, Copy, Check, RotateCcw, RefreshCw, Settings } from 'lucide-react'

export default function PasswordGeneratorPage() {
  const [password, setPassword] = useState('')
  const [length, setLength] = useState(16)
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  })
  const [copySuccess, setCopySuccess] = useState(false)
  const [history, setHistory] = useState<string[]>([])

  const generatePassword = useCallback(() => {
    let chars = ''
    if (options.uppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    if (options.lowercase) chars += 'abcdefghijklmnopqrstuvwxyz'
    if (options.numbers) chars += '0123456789'
    if (options.symbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?'

    if (!chars) {
      setPassword('请至少选择一种字符类型')
      return
    }

    let result = ''
    const array = new Uint32Array(length)
    crypto.getRandomValues(array)
    for (let i = 0; i < length; i++) {
      result += chars[array[i] % chars.length]
    }

    setPassword(result)
    setHistory(prev => [result, ...prev.slice(0, 9)])
  }, [length, options])

  const copyPassword = async () => {
    if (!password || password === '请至少选择一种字符类型') return
    try {
      await navigator.clipboard.writeText(password)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (e) {
      console.error('复制失败:', e)
    }
  }

  const clearAll = () => {
    setPassword('')
    setHistory([])
  }

  const toggleOption = (key: keyof typeof options) => {
    setOptions(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const getStrength = (pwd: string) => {
    let score = 0
    if (pwd.length >= 8) score++
    if (pwd.length >= 12) score++
    if (pwd.length >= 16) score++
    if (/[a-z]/.test(pwd)) score++
    if (/[A-Z]/.test(pwd)) score++
    if (/[0-9]/.test(pwd)) score++
    if (/[^a-zA-Z0-9]/.test(pwd)) score++
    
    if (score <= 2) return { label: '弱', color: 'bg-red-500' }
    if (score <= 4) return { label: '中等', color: 'bg-yellow-500' }
    if (score <= 6) return { label: '强', color: 'bg-green-500' }
    return { label: '非常强', color: 'bg-emerald-500' }
  }

  const strength = password && password !== '请至少选择一种字符类型' ? getStrength(password) : null

  return (
    <ToolShell title="密码生成器" icon={<Key className="w-5 h-5" />}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-3 items-center">
          <button
            onClick={generatePassword}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
          >
            <RefreshCw className="w-4 h-4" />
            生成密码
          </button>
          <button
            onClick={copyPassword}
            disabled={!password}
            className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            {copySuccess ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            {copySuccess ? '已复制' : '复制'}
          </button>
          <button
            onClick={clearAll}
            className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <RotateCcw className="w-4 h-4" />
            清空
          </button>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">密码长度: {length}</span>
          </div>
          <input
            type="range"
            min="4"
            max="64"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>4</span>
            <span>64</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            { key: 'uppercase', label: '大写字母', chars: 'A-Z' },
            { key: 'lowercase', label: '小写字母', chars: 'a-z' },
            { key: 'numbers', label: '数字', chars: '0-9' },
            { key: 'symbols', label: '特殊符号', chars: '!@#$...' },
          ].map(opt => (
            <label
              key={opt.key}
              className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                options[opt.key as keyof typeof options]
                  ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <input
                type="checkbox"
                checked={options[opt.key as keyof typeof options]}
                onChange={() => toggleOption(opt.key as keyof typeof options)}
                className="rounded"
              />
              <div>
                <div className="text-sm font-medium">{opt.label}</div>
                <div className="text-xs text-gray-500">{opt.chars}</div>
              </div>
            </label>
          ))}
        </div>

        {password && (
          <div className="space-y-2">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="font-mono text-lg break-all select-all">{password}</div>
              {strength && (
                <div className="flex items-center gap-2 mt-2">
                  <div className={`h-2 flex-1 rounded ${strength.color}`}></div>
                  <span className="text-sm text-gray-500">{strength.label}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {history.length > 0 && (
          <div className="border rounded-lg overflow-hidden">
            <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border-b">
              <span className="text-sm font-medium">历史记录</span>
            </div>
            <div className="max-h-32 overflow-y-auto">
              {history.map((pwd, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between px-4 py-2 border-b last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <code className="font-mono text-sm truncate flex-1">{pwd}</code>
                  <button
                    onClick={async () => {
                      await navigator.clipboard.writeText(pwd)
                    }}
                    className="ml-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    <Copy className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-sm text-gray-500 dark:text-gray-400">
          <p><strong>密码生成器</strong> 使用加密安全的随机数生成器创建强密码。</p>
          <p className="mt-1">建议使用 16 位以上包含大小写字母、数字和特殊符号的密码。</p>
        </div>
      </div>
    </ToolShell>
  )
}
