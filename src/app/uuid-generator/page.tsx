'use client'

import { useState } from 'react'
import { ToolShell } from '@/components/tools'
import { Fingerprint, Copy, Check, RotateCcw, RefreshCw } from 'lucide-react'

export default function UUIDGeneratorPage() {
  const [uuids, setUuids] = useState<string[]>([])
  const [count, setCount] = useState(5)
  const [version, setVersion] = useState<'v4' | 'v1'>('v4')
  const [copySuccess, setCopySuccess] = useState<number | null>(null)
  const [uppercase, setUppercase] = useState(false)

  const generateUUIDv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0
      const v = c === 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  }

  const generateUUIDv1 = () => {
    const now = Date.now()
    const random = Math.random().toString(16).slice(2, 10)
    const time = now.toString(16).padStart(12, '0')
    return `${time.slice(0, 8)}-${time.slice(8, 12)}-1${random.slice(0, 3)}-${random.slice(3, 4)}${Math.floor(Math.random() * 16).toString(16)}${random.slice(4)}-${Math.random().toString(16).slice(2, 14).padStart(12, '0')}`
  }

  const generate = () => {
    const newUUIDs: string[] = []
    for (let i = 0; i < count; i++) {
      let uuid = version === 'v4' ? generateUUIDv4() : generateUUIDv1()
      if (uppercase) uuid = uuid.toUpperCase()
      newUUIDs.push(uuid)
    }
    setUuids(newUUIDs)
  }

  const copyUUID = async (index: number, uuid: string) => {
    try {
      await navigator.clipboard.writeText(uuid)
      setCopySuccess(index)
      setTimeout(() => setCopySuccess(null), 2000)
    } catch (e) {
      console.error('复制失败:', e)
    }
  }

  const copyAll = async () => {
    try {
      await navigator.clipboard.writeText(uuids.join('\n'))
      setCopySuccess(-1)
      setTimeout(() => setCopySuccess(null), 2000)
    } catch (e) {
      console.error('复制失败:', e)
    }
  }

  const clearAll = () => {
    setUuids([])
  }

  return (
    <ToolShell title="UUID 生成器" icon={<Fingerprint className="w-5 h-5" />}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2">
            <label className="text-sm">数量:</label>
            <input
              type="number"
              min="1"
              max="100"
              value={count}
              onChange={(e) => setCount(Math.min(100, Math.max(1, Number(e.target.value))))}
              className="w-20 px-3 py-1.5 border rounded-md bg-background"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm">版本:</label>
            <select
              value={version}
              onChange={(e) => setVersion(e.target.value as 'v4' | 'v1')}
              className="px-3 py-1.5 border rounded-md bg-background"
            >
              <option value="v4">UUID v4 (随机)</option>
              <option value="v1">UUID v1 (时间戳)</option>
            </select>
          </div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={uppercase}
              onChange={(e) => setUppercase(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm">大写</span>
          </label>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={generate}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
          >
            <RefreshCw className="w-4 h-4" />
            生成
          </button>
          {uuids.length > 0 && (
            <button
              onClick={copyAll}
              className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {copySuccess === -1 ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              {copySuccess === -1 ? '已复制全部' : '复制全部'}
            </button>
          )}
          <button
            onClick={clearAll}
            className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <RotateCcw className="w-4 h-4" />
            清空
          </button>
        </div>

        {uuids.length > 0 && (
          <div className="border rounded-lg overflow-hidden">
            <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border-b">
              <span className="text-sm font-medium">生成结果 ({uuids.length} 个)</span>
            </div>
            <div className="divide-y max-h-80 overflow-y-auto">
              {uuids.map((uuid, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <code className="font-mono text-sm select-all">{uuid}</code>
                  <button
                    onClick={() => copyUUID(index, uuid)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    {copySuccess === index ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-sm text-gray-500 dark:text-gray-400">
          <p><strong>UUID</strong> (通用唯一识别码) 是一个 128 位的标识符，用于在分布式系统中唯一标识信息。</p>
          <p className="mt-1"><strong>v4</strong> 基于随机数生成，<strong>v1</strong> 基于时间戳和 MAC 地址生成。</p>
        </div>
      </div>
    </ToolShell>
  )
}
