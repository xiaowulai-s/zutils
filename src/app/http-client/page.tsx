'use client'

import { useState } from 'react'
import { ToolShell } from '@/components/tools'
import { Globe, Send, Copy, Check, RotateCcw, Plus, Trash2 } from 'lucide-react'

interface Header {
  key: string
  value: string
  enabled: boolean
}

export default function HTTPClientPage() {
  const [url, setUrl] = useState('')
  const [method, setMethod] = useState('GET')
  const [body, setBody] = useState('')
  const [headers, setHeaders] = useState<Header[]>([
    { key: 'Content-Type', value: 'application/json', enabled: true }
  ])
  const [response, setResponse] = useState('')
  const [status, setStatus] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)
  const [responseTime, setResponseTime] = useState<number | null>(null)

  const addHeader = () => {
    setHeaders([...headers, { key: '', value: '', enabled: true }])
  }

  const removeHeader = (index: number) => {
    setHeaders(headers.filter((_, i) => i !== index))
  }

  const updateHeader = (index: number, field: 'key' | 'value' | 'enabled', value: string | boolean) => {
    setHeaders(headers.map((h, i) => i === index ? { ...h, [field]: value } : h))
  }

  const sendRequest = async () => {
    if (!url) return

    setLoading(true)
    setResponse('')
    setStatus(null)
    setResponseTime(null)

    const startTime = Date.now()

    try {
      const requestHeaders: Record<string, string> = {}
      headers.filter(h => h.enabled && h.key).forEach(h => {
        requestHeaders[h.key] = h.value
      })

      const options: RequestInit = {
        method,
        headers: requestHeaders,
      }

      if (method !== 'GET' && method !== 'HEAD' && body) {
        options.body = body
      }

      const res = await fetch(url, options)
      const endTime = Date.now()
      setResponseTime(endTime - startTime)
      setStatus(res.status)

      const contentType = res.headers.get('content-type') || ''
      let text: string

      if (contentType.includes('application/json')) {
        const json = await res.json()
        text = JSON.stringify(json, null, 2)
      } else {
        text = await res.text()
      }

      setResponse(text)
    } catch (error) {
      setResponse(`请求失败: ${error instanceof Error ? error.message : '未知错误'}`)
      setStatus(null)
    } finally {
      setLoading(false)
    }
  }

  const copyResponse = async () => {
    if (!response) return
    await navigator.clipboard.writeText(response)
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 2000)
  }

  const clearAll = () => {
    setUrl('')
    setBody('')
    setResponse('')
    setStatus(null)
    setResponseTime(null)
    setHeaders([{ key: 'Content-Type', value: 'application/json', enabled: true }])
  }

  return (
    <ToolShell title="HTTP 请求构造器" icon={<Globe className="w-5 h-5" />}>
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="px-3 py-2 border rounded-md bg-background w-28"
          >
            <option>GET</option>
            <option>POST</option>
            <option>PUT</option>
            <option>PATCH</option>
            <option>DELETE</option>
            <option>HEAD</option>
            <option>OPTIONS</option>
          </select>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="输入 URL..."
            className="flex-1 px-3 py-2 border rounded-md bg-background"
          />
          <button
            onClick={sendRequest}
            disabled={!url || loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white rounded-md"
          >
            <Send className="w-4 h-4" />
            {loading ? '发送中...' : '发送'}
          </button>
          <button
            onClick={clearAll}
            className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">请求头</span>
                <button
                  onClick={addHeader}
                  className="flex items-center gap-1 text-sm text-blue-500 hover:text-blue-600"
                >
                  <Plus className="w-4 h-4" />
                  添加
                </button>
              </div>
              <div className="space-y-2">
                {headers.map((header, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <input
                      type="checkbox"
                      checked={header.enabled}
                      onChange={(e) => updateHeader(index, 'enabled', e.target.checked)}
                      className="rounded"
                    />
                    <input
                      type="text"
                      value={header.key}
                      onChange={(e) => updateHeader(index, 'key', e.target.value)}
                      placeholder="Header"
                      className="flex-1 px-2 py-1 border rounded-md bg-background text-sm"
                    />
                    <input
                      type="text"
                      value={header.value}
                      onChange={(e) => updateHeader(index, 'value', e.target.value)}
                      placeholder="Value"
                      className="flex-1 px-2 py-1 border rounded-md bg-background text-sm"
                    />
                    <button
                      onClick={() => removeHeader(index)}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    >
                      <Trash2 className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {method !== 'GET' && method !== 'HEAD' && (
              <div>
                <span className="text-sm font-medium">请求体</span>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder='{"key": "value"}'
                  className="w-full h-32 mt-2 p-3 font-mono text-sm border rounded-lg bg-gray-50 dark:bg-gray-800 resize-none"
                />
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">响应</span>
                {status !== null && (
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    status < 300 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                    status < 400 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                    'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {status}
                  </span>
                )}
                {responseTime !== null && (
                  <span className="text-xs text-gray-400">{responseTime}ms</span>
                )}
              </div>
              {response && (
                <button
                  onClick={copyResponse}
                  className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
                >
                  {copySuccess ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
              )}
            </div>
            <textarea
              value={response}
              readOnly
              placeholder="响应将显示在这里..."
              className="w-full h-64 p-3 font-mono text-sm border rounded-lg bg-gray-50 dark:bg-gray-800 resize-none"
            />
          </div>
        </div>

        <div className="text-sm text-gray-500 dark:text-gray-400">
          <p><strong>HTTP 请求构造器</strong> 可以发送 GET、POST、PUT、DELETE 等 HTTP 请求，用于 API 测试和调试。</p>
        </div>
      </div>
    </ToolShell>
  )
}
