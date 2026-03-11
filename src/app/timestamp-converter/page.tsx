'use client'

import { useState, useEffect } from 'react'
import { ToolShell } from '@/components/tools'
import { Clock, Copy, Check, RefreshCw, Calendar, Globe } from 'lucide-react'

export default function TimestampConverterPage() {
  const [timestamp, setTimestamp] = useState('')
  const [dateString, setDateString] = useState('')
  const [currentTime, setCurrentTime] = useState(Math.floor(Date.now() / 1000))
  const [copySuccess, setCopySuccess] = useState<string | null>(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Math.floor(Date.now() / 1000))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatDateTime = (date: Date) => {
    return {
      local: date.toLocaleString('zh-CN', { 
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
      }),
      iso: date.toISOString(),
      utc: date.toUTCString(),
      custom: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`
    }
  }

  const timestampToDate = () => {
    if (!timestamp) return
    const ts = parseInt(timestamp)
    if (isNaN(ts)) return
    
    const date = new Date(ts < 1e12 ? ts * 1000 : ts)
    setDateString(date.toISOString().slice(0, 19).replace('T', ' '))
  }

  const dateToTimestamp = () => {
    if (!dateString) return
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return
    
    setTimestamp(Math.floor(date.getTime() / 1000).toString())
  }

  const setCurrentTimestamp = () => {
    const ts = Math.floor(Date.now() / 1000)
    setTimestamp(ts.toString())
    timestampToDate()
  }

  const copyValue = async (value: string, key: string) => {
    try {
      await navigator.clipboard.writeText(value)
      setCopySuccess(key)
      setTimeout(() => setCopySuccess(null), 2000)
    } catch (e) {
      console.error('复制失败:', e)
    }
  }

  const now = new Date()
  const nowFormats = formatDateTime(now)

  return (
    <ToolShell title="时间戳转换" icon={<Clock className="w-5 h-5" />}>
      <div className="flex flex-col gap-6">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">当前时间戳</span>
              <div className="text-2xl font-mono font-bold text-blue-600 dark:text-blue-400">
                {currentTime}
              </div>
            </div>
            <button
              onClick={() => copyValue(currentTime.toString(), 'current')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
            >
              {copySuccess === 'current' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copySuccess === 'current' ? '已复制' : '复制'}
            </button>
          </div>
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {nowFormats.local}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              时间戳 → 日期时间
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={timestamp}
                onChange={(e) => setTimestamp(e.target.value.replace(/\D/g, ''))}
                placeholder="输入时间戳（秒或毫秒）"
                className="flex-1 px-4 py-2 border rounded-md bg-background font-mono"
              />
              <button
                onClick={timestampToDate}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
              >
                转换
              </button>
            </div>
            {timestamp && (
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md font-mono text-sm">
                {(() => {
                  const ts = parseInt(timestamp)
                  if (isNaN(ts)) return '无效时间戳'
                  const date = new Date(ts < 1e12 ? ts * 1000 : ts)
                  const formats = formatDateTime(date)
                  return (
                    <div className="space-y-2">
                      <div><span className="text-gray-500">本地时间:</span> {formats.local}</div>
                      <div><span className="text-gray-500">ISO 格式:</span> {formats.iso}</div>
                      <div><span className="text-gray-500">UTC 时间:</span> {formats.utc}</div>
                    </div>
                  )
                })()}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <Globe className="w-4 h-4" />
              日期时间 → 时间戳
            </h3>
            <div className="flex gap-2">
              <input
                type="datetime-local"
                value={dateString}
                onChange={(e) => setDateString(e.target.value)}
                className="flex-1 px-4 py-2 border rounded-md bg-background"
              />
              <button
                onClick={dateToTimestamp}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md"
              >
                转换
              </button>
            </div>
            {dateString && (
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md font-mono text-sm">
                {(() => {
                  const date = new Date(dateString)
                  if (isNaN(date.getTime())) return '无效日期'
                  return (
                    <div className="space-y-2">
                      <div>
                        <span className="text-gray-500">秒级时间戳:</span>{' '}
                        <span className="text-blue-600 dark:text-blue-400">{Math.floor(date.getTime() / 1000)}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">毫秒级时间戳:</span>{' '}
                        <span className="text-green-600 dark:text-green-400">{date.getTime()}</span>
                      </div>
                    </div>
                  )
                })()}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={setCurrentTimestamp}
            className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <RefreshCw className="w-4 h-4" />
            设为当前时间
          </button>
        </div>

        <div className="text-sm text-gray-500 dark:text-gray-400">
          <p><strong>Unix 时间戳</strong> 是从 1970 年 1 月 1 日 00:00:00 UTC 开始经过的秒数。</p>
          <p className="mt-1">支持秒级和毫秒级时间戳的相互转换。</p>
        </div>
      </div>
    </ToolShell>
  )
}
