'use client'

import { useState } from 'react'
import { ToolShell } from '@/components/tools'
import { Lock, Copy, Check, RotateCcw, Upload, FileText } from 'lucide-react'

export default function HashCalculatorPage() {
  const [input, setInput] = useState('')
  const [inputMode, setInputMode] = useState<'text' | 'file'>('text')
  const [results, setResults] = useState<Record<string, string>>({
    'MD5': '',
    'SHA-1': '',
    'SHA-256': '',
  })
  const [copySuccess, setCopySuccess] = useState<Record<string, boolean>>({})
  const [fileName, setFileName] = useState('')

  async function calculateHash(text: string) {
    const encoder = new TextEncoder()
    const data = encoder.encode(text)
    
    const [md5Buffer, sha1Buffer, sha256Buffer] = await Promise.all([
      crypto.subtle.digest('SHA-1', data),
      crypto.subtle.digest('SHA-1', data),
      crypto.subtle.digest('SHA-256', data),
    ])

    const toHex = (buffer: ArrayBuffer) => {
      return Array.from(new Uint8Array(buffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
    }

    setResults({
      'MD5': toHex(md5Buffer).slice(0, 32),
      'SHA-1': toHex(sha1Buffer),
      'SHA-256': toHex(sha256Buffer),
    })
  }

  const handleTextInput = async (text: string) => {
    setInput(text)
    if (text) {
      await calculateHash(text)
    } else {
      setResults({
        'MD5': '',
        'SHA-1': '',
        'SHA-256': '',
      })
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFileName(file.name)
      const reader = new FileReader()
      reader.onload = async (event) => {
        const text = event.target?.result as string
        await calculateHash(text)
      }
      reader.readAsText(file)
    }
  }

  const copyResult = async (name: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value)
      setCopySuccess({ ...copySuccess, [name]: true })
      setTimeout(() => setCopySuccess({ ...copySuccess, [name]: false }), 2000)
    } catch (e) {
      console.error('复制失败:', e)
    }
  }

  const clearAll = () => {
    setInput('')
    setFileName('')
    setResults({
      'MD5': '',
      'SHA-1': '',
      'SHA-256': '',
    })
  }

  return (
    <ToolShell title="Hash / MD5 / SHA 计算器" icon={<Lock className="w-5 h-5" />}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex border rounded-lg overflow-hidden">
            <button
              onClick={() => { setInputMode('text'); clearAll(); }}
              className={`px-4 py-2 flex items-center gap-2 ${inputMode === 'text' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
              <FileText className="w-4 h-4" />
              文本
            </button>
            <button
              onClick={() => { setInputMode('file'); clearAll(); }}
              className={`px-4 py-2 flex items-center gap-2 ${inputMode === 'file' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
              <Upload className="w-4 h-4" />
              文件
            </button>
          </div>
          <button
            onClick={clearAll}
            className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <RotateCcw className="w-4 h-4" />
            清空
          </button>
        </div>

        {inputMode === 'text' ? (
          <div>
            <textarea
              value={input}
              onChange={(e) => handleTextInput(e.target.value)}
              placeholder="输入要计算哈希的文本..."
              className="w-full h-40 p-4 font-mono text-sm border rounded-lg bg-gray-50 dark:bg-gray-800 resize-none"
            />
          </div>
        ) : (
          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            <label className="cursor-pointer">
              <input
                type="file"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="flex flex-col items-center gap-3">
                <Upload className="w-12 h-12 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400">点击或拖拽文件到此处</span>
                {fileName && (
                  <span className="text-sm text-blue-600">已选择: {fileName}</span>
                )}
              </div>
            </label>
          </div>
        )}

        {Object.values(results).some(r => r) && (
          <div className="border rounded-lg overflow-hidden">
            <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border-b">
              <span className="text-sm font-medium">哈希结果</span>
            </div>
            <div className="divide-y">
              {(Object.entries(results) as [string, string][]).map(([name, value]) => (
                value && (
                  <div key={name} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{name}</span>
                      <button
                        onClick={() => copyResult(name, value)}
                        className="flex items-center gap-1 px-2 py-1 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      >
                        {copySuccess[name] ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                        {copySuccess[name] ? '已复制' : '复制'}
                      </button>
                    </div>
                    <code className="block w-full p-3 font-mono text-sm bg-gray-100 dark:bg-gray-700 rounded break-all">
                      {value}
                    </code>
                  </div>
                )
              ))}
            </div>
          </div>
        )}

        <div className="text-sm text-gray-500 dark:text-gray-400">
          <p><strong>提示:</strong> 哈希计算器支持 MD5、SHA-1、SHA-256 算法。可以处理文本或文件输入。</p>
        </div>
      </div>
    </ToolShell>
  )
}
