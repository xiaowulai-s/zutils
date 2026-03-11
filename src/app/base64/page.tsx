'use client'

import { useState } from 'react'
import { ToolShell } from '@/components/tools'
import { ArrowRightLeft, Copy, Check, RotateCcw, Upload, Download } from 'lucide-react'

export default function Base64Page() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [copySuccess, setCopySuccess] = useState(false)
  const [error, setError] = useState('')

  const encode = () => {
    try {
      setError('')
      const encoder = new TextEncoder()
      const data = encoder.encode(input)
      let binary = ''
      for (let i = 0; i < data.length; i++) {
        binary += String.fromCharCode(data[i])
      }
      const encoded = btoa(binary)
      setOutput(encoded)
    } catch (e) {
      setError('编码失败')
    }
  }

  const decode = () => {
    try {
      setError('')
      const binary = atob(input)
      const bytes = new Uint8Array(binary.length)
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i)
      }
      const decoder = new TextDecoder()
      const decoded = decoder.decode(bytes)
      setOutput(decoded)
    } catch (e) {
      setError('解码失败，请确保输入是有效的 Base64 字符串')
    }
  }

  const process = () => {
    if (mode === 'encode') {
      encode()
    } else {
      decode()
    }
  }

  const swap = () => {
    setMode(mode === 'encode' ? 'decode' : 'encode')
    const temp = input
    setInput(output)
    setOutput(temp)
    setError('')
  }

  const copyOutput = async () => {
    if (!output) return
    try {
      await navigator.clipboard.writeText(output)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (e) {
      console.error('复制失败:', e)
    }
  }

  const clearAll = () => {
    setInput('')
    setOutput('')
    setError('')
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setInput(event.target?.result as string)
      }
      reader.readAsText(file)
    }
  }

  const downloadOutput = () => {
    if (!output) return
    const blob = new Blob([output], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = mode === 'encode' ? 'encoded.txt' : 'decoded.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <ToolShell title="Base64 编解码" icon={<ArrowRightLeft className="w-5 h-5" />}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex border rounded-lg overflow-hidden">
            <button
              onClick={() => { setMode('encode'); setError(''); }}
              className={`px-4 py-2 ${mode === 'encode' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
              编码
            </button>
            <button
              onClick={() => { setMode('decode'); setError(''); }}
              className={`px-4 py-2 ${mode === 'decode' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
              解码
            </button>
          </div>
          <button
            onClick={process}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors"
          >
            {mode === 'encode' ? '编码' : '解码'}
          </button>
          <button
            onClick={swap}
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

        <div className="flex flex-wrap gap-2">
          <label className="flex items-center gap-2 px-3 py-1.5 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
            <Upload className="w-4 h-4" />
            <span className="text-sm">上传文件</span>
            <input
              type="file"
              accept=".txt"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
          {output && (
            <>
              <button
                onClick={copyOutput}
                className="flex items-center gap-2 px-3 py-1.5 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {copySuccess ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                <span className="text-sm">{copySuccess ? '已复制' : '复制'}</span>
              </button>
              <button
                onClick={downloadOutput}
                className="flex items-center gap-2 px-3 py-1.5 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Download className="w-4 h-4" />
                <span className="text-sm">下载</span>
              </button>
            </>
          )}
        </div>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">
                {mode === 'encode' ? '原文' : 'Base64'}
              </span>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={mode === 'encode' ? '输入要编码的文本...' : '输入要解码的 Base64 字符串...'}
              className="w-full h-64 p-4 font-mono text-sm border rounded-lg bg-gray-50 dark:bg-gray-800 resize-none"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">
                {mode === 'encode' ? 'Base64' : '原文'}
              </span>
            </div>
            <textarea
              value={output}
              readOnly
              placeholder="结果将显示在这里..."
              className="w-full h-64 p-4 font-mono text-sm border rounded-lg bg-gray-50 dark:bg-gray-800 resize-none"
            />
          </div>
        </div>

        <div className="text-sm text-gray-500 dark:text-gray-400">
          <p><strong>提示:</strong> Base64 是一种用于将二进制数据编码为 ASCII 字符串的编码方式。广泛用于电子邮件、URL 参数等场景。</p>
        </div>
      </div>
    </ToolShell>
  )
}
