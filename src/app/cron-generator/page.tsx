'use client'

import { useState, useMemo } from 'react'
import { ToolShell } from '@/components/tools'
import { Clock, Copy, Check, RotateCcw, Play, Pause } from 'lucide-react'

type CronField = {
  value: string
  label: string
  options: string[]
}

const defaultFields: CronField[] = [
  { value: '*', label: '分钟', options: ['*', '0', '5', '10', '15', '20', '30'] },
  { value: '*', label: '小时', options: ['*', '0', '6', '9', '12', '18', '23'] },
  { value: '*', label: '日', options: ['*', '1', '15', 'L'] },
  { value: '*', label: '月', options: ['*', '1', '6', '12'] },
  { value: '*', label: '周', options: ['*', '0', '1', '6', 'MON-FRI'] },
]

const presets = [
  { name: '每分钟', cron: '* * * * *' },
  { name: '每小时', cron: '0 * * * *' },
  { name: '每天零点', cron: '0 0 * * *' },
  { name: '每天 9 点', cron: '0 9 * * *' },
  { name: '每周一 9 点', cron: '0 9 * * 1' },
  { name: '每月 1 号零点', cron: '0 0 1 * *' },
  { name: '工作日 9 点', cron: '0 9 * * 1-5' },
  { name: '每 5 分钟', cron: '*/5 * * * *' },
  { name: '每 30 分钟', cron: '*/30 * * * *' },
  { name: '每小时整点', cron: '0 * * * *' },
]

export default function CronGeneratorPage() {
  const [fields, setFields] = useState<CronField[]>(defaultFields)
  const [copySuccess, setCopySuccess] = useState(false)

  const cronExpression = useMemo(() => {
    return fields.map(f => f.value).join(' ')
  }, [fields])

  const humanReadable = useMemo(() => {
    const [min, hour, day, month, weekday] = fields.map(f => f.value)
    
    const parts: string[] = []
    
    if (min === '*' && hour === '*' && day === '*' && month === '*' && weekday === '*') {
      return '每分钟执行'
    }
    
    if (min.startsWith('*/')) {
      parts.push(`每 ${min.slice(2)} 分钟`)
    } else if (min !== '*') {
      parts.push(`第 ${min} 分钟`)
    }
    
    if (hour.startsWith('*/')) {
      parts.push(`每 ${hour.slice(2)} 小时`)
    } else if (hour !== '*') {
      parts.push(`${hour} 点`)
    }
    
    if (day === 'L') {
      parts.push('每月最后一天')
    } else if (day !== '*') {
      parts.push(`每月 ${day} 号`)
    }
    
    if (month !== '*') {
      const monthNames = ['', '一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
      parts.push(monthNames[parseInt(month)] || month)
    }
    
    if (weekday !== '*') {
      const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
      if (weekday === 'MON-FRI') {
        parts.push('工作日')
      } else if (weekday.includes('-')) {
        parts.push(weekday)
      } else {
        parts.push(dayNames[parseInt(weekday)] || weekday)
      }
    }
    
    if (parts.length === 0) {
      return '每分钟执行'
    }
    
    return parts.join(' ') + ' 执行'
  }, [fields])

  const nextRuns = useMemo(() => {
    const runs: Date[] = []
    const now = new Date()
    
    for (let i = 0; i < 5; i++) {
      const next = new Date(now.getTime() + (i + 1) * 60000)
      runs.push(next)
    }
    
    return runs
  }, [cronExpression])

  const updateField = (index: number, value: string) => {
    setFields(fields.map((f, i) => i === index ? { ...f, value } : f))
  }

  const applyPreset = (cron: string) => {
    const parts = cron.split(' ')
    setFields(fields.map((f, i) => ({ ...f, value: parts[i] || '*' })))
  }

  const copyCron = async () => {
    await navigator.clipboard.writeText(cronExpression)
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 2000)
  }

  const reset = () => {
    setFields(defaultFields)
  }

  return (
    <ToolShell title="Cron 表达式生成器" icon={<Clock className="w-5 h-5" />}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          {presets.map(preset => (
            <button
              key={preset.name}
              onClick={() => applyPreset(preset.cron)}
              className="px-3 py-1.5 text-sm border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {preset.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-5 gap-2">
          {fields.map((field, index) => (
            <div key={field.label}>
              <label className="block text-xs text-gray-500 mb-1">{field.label}</label>
              <select
                value={field.value}
                onChange={(e) => updateField(index, e.target.value)}
                className="w-full px-2 py-1.5 border rounded-md bg-background text-sm"
              >
                {field.options.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
                <option value={field.value}>{field.value}</option>
              </select>
            </div>
          ))}
        </div>

        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-mono text-xl">{cronExpression}</div>
              <div className="text-sm text-gray-500 mt-1">{humanReadable}</div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={copyCron}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
              >
                {copySuccess ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                复制
              </button>
              <button
                onClick={reset}
                className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <RotateCcw className="w-4 h-4" />
                重置
              </button>
            </div>
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border-b">
            <span className="text-sm font-medium">接下来 5 次执行时间</span>
          </div>
          <div className="divide-y">
            {nextRuns.map((date, index) => (
              <div key={index} className="px-4 py-2 flex items-center justify-between">
                <span className="text-sm text-gray-500">#{index + 1}</span>
                <span className="font-mono text-sm">
                  {date.toLocaleString('zh-CN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-sm text-gray-500 dark:text-gray-400">
          <p><strong>Cron 表达式</strong> 格式: 分 时 日 月 周</p>
          <p className="mt-1">支持 * (任意值)、, (列表)、- (范围)、/ (步长)、L (最后) 等特殊字符。</p>
        </div>
      </div>
    </ToolShell>
  )
}
