'use client'

import { useState, useRef, useCallback } from 'react'
import { ToolShell } from '@/components/tools'
import { Radio, Send, Trash2, Link2, Unlink, Copy, Check } from 'lucide-react'

interface Message {
  id: number
  type: 'sent' | 'received' | 'system'
  content: string
  timestamp: Date
}

export default function WebSocketTesterPage() {
  const [url, setUrl] = useState('wss://echo.websocket.org')
  const [status, setStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected')
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [copySuccess, setCopySuccess] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)
  const messageIdRef = useRef(0)

  const addMessage = useCallback((type: Message['type'], content: string) => {
    setMessages(prev => [...prev, {
      id: ++messageIdRef.current,
      type,
      content,
      timestamp: new Date()
    }])
  }, [])

  const connect = () => {
    if (!url) return

    setStatus('connecting')
    addMessage('system', `正在连接到 ${url}...`)

    try {
      const ws = new WebSocket(url)
      wsRef.current = ws

      ws.onopen = () => {
        setStatus('connected')
        addMessage('system', '连接成功')
      }

      ws.onmessage = (event) => {
        addMessage('received', typeof event.data === 'string' ? event.data : '[二进制数据]')
      }

      ws.onerror = () => {
        addMessage('system', '连接错误')
      }

      ws.onclose = () => {
        setStatus('disconnected')
        addMessage('system', '连接已关闭')
        wsRef.current = null
      }
    } catch (error) {
      setStatus('disconnected')
      addMessage('system', `连接失败: ${error}`)
    }
  }

  const disconnect = () => {
    if (wsRef.current) {
      wsRef.current.close()
    }
  }

  const send = () => {
    if (!input || !wsRef.current || status !== 'connected') return

    try {
      wsRef.current.send(input)
      addMessage('sent', input)
      setInput('')
    } catch (error) {
      addMessage('system', `发送失败: ${error}`)
    }
  }

  const clearMessages = () => {
    setMessages([])
  }

  const copyMessage = async (content: string) => {
    await navigator.clipboard.writeText(content)
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 2000)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  }

  return (
    <ToolShell title="WebSocket 测试" icon={<Radio className="w-5 h-5" />}>
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="ws:// 或 wss:// URL"
            className="flex-1 px-3 py-2 border rounded-md bg-background"
            disabled={status !== 'disconnected'}
          />
          {status === 'disconnected' ? (
            <button
              onClick={connect}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md"
            >
              <Link2 className="w-4 h-4" />
              连接
            </button>
          ) : (
            <button
              onClick={disconnect}
              disabled={status === 'connecting'}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white rounded-md"
            >
              <Unlink className="w-4 h-4" />
              断开
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            status === 'connected' ? 'bg-green-500' :
            status === 'connecting' ? 'bg-yellow-500' : 'bg-gray-400'
          }`} />
          <span className="text-sm text-gray-500">
            {status === 'connected' ? '已连接' :
             status === 'connecting' ? '连接中...' : '未连接'}
          </span>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border-b flex items-center justify-between">
            <span className="text-sm font-medium">消息 ({messages.length})</span>
            <button
              onClick={clearMessages}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
            >
              <Trash2 className="w-4 h-4" />
              清空
            </button>
          </div>
          <div className="h-64 overflow-y-auto p-2 space-y-2 bg-gray-50 dark:bg-gray-900">
            {messages.length === 0 ? (
              <div className="text-center text-gray-400 py-8">暂无消息</div>
            ) : (
              messages.map(msg => (
                <div
                  key={msg.id}
                  className={`p-2 rounded text-sm ${
                    msg.type === 'sent' ? 'bg-blue-100 dark:bg-blue-900/30 ml-8' :
                    msg.type === 'received' ? 'bg-green-100 dark:bg-green-900/30 mr-8' :
                    'bg-gray-200 dark:bg-gray-800 text-gray-500 italic'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-400">
                      {msg.type === 'sent' ? '↑ 发送' :
                       msg.type === 'received' ? '↓ 接收' : '系统'}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">{formatTime(msg.timestamp)}</span>
                      {msg.type !== 'system' && (
                        <button onClick={() => copyMessage(msg.content)} className="p-0.5">
                          <Copy className="w-3 h-3 text-gray-400" />
                        </button>
                      )}
                    </div>
                  </div>
                  <pre className="whitespace-pre-wrap break-all font-mono">{msg.content}</pre>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                send()
              }
            }}
            placeholder="输入消息 (Enter 发送, Shift+Enter 换行)"
            className="flex-1 px-3 py-2 border rounded-md bg-background resize-none h-20"
            disabled={status !== 'connected'}
          />
          <button
            onClick={send}
            disabled={!input || status !== 'connected'}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white rounded-md self-end"
          >
            <Send className="w-4 h-4" />
            发送
          </button>
        </div>

        <div className="text-sm text-gray-500 dark:text-gray-400">
          <p><strong>WebSocket 测试工具</strong> 可以连接 WebSocket 服务器，发送和接收消息。</p>
          <p className="mt-1">测试地址: <code className="px-1 bg-gray-100 dark:bg-gray-800 rounded">wss://echo.websocket.org</code> (回显服务器)</p>
        </div>
      </div>
    </ToolShell>
  )
}
