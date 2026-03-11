'use client'

import { useState } from 'react'
import { ToolShell } from '@/components/tools'
import { Shuffle, Copy, Check, RotateCcw, RefreshCw } from 'lucide-react'

type DataType = 'name' | 'email' | 'phone' | 'address' | 'company' | 'date' | 'number' | 'uuid'

interface DataField {
  type: DataType
  label: string
  enabled: boolean
}

const firstNames = ['张', '李', '王', '刘', '陈', '杨', '赵', '黄', '周', '吴', '徐', '孙', '马', '朱', '胡', '郭', '何', '林', '罗', '高']
const lastNames = ['伟', '芳', '娜', '秀英', '敏', '静', '丽', '强', '磊', '军', '洋', '勇', '艳', '杰', '娟', '涛', '明', '超', '秀兰', '霞']
const streets = ['中山路', '人民路', '解放路', '建设路', '和平路', '文化路', '科技路', '创新路', '发展路', '胜利路']
const cities = ['北京', '上海', '广州', '深圳', '杭州', '南京', '武汉', '成都', '西安', '重庆']
const companies = ['科技', '网络', '信息', '电子', '软件', '互联网', '数据', '智能', '云计算', '人工智能']

export default function RandomDataGeneratorPage() {
  const [fields, setFields] = useState<DataField[]>([
    { type: 'name', label: '姓名', enabled: true },
    { type: 'email', label: '邮箱', enabled: true },
    { type: 'phone', label: '手机号', enabled: true },
    { type: 'address', label: '地址', enabled: false },
    { type: 'company', label: '公司', enabled: false },
    { type: 'date', label: '日期', enabled: false },
    { type: 'number', label: '数字', enabled: false },
    { type: 'uuid', label: 'UUID', enabled: false },
  ])
  const [count, setCount] = useState(10)
  const [output, setOutput] = useState('')
  const [format, setFormat] = useState<'json' | 'csv' | 'sql'>('json')
  const [copySuccess, setCopySuccess] = useState(false)

  const generateName = () => {
    const first = firstNames[Math.floor(Math.random() * firstNames.length)]
    const last = lastNames[Math.floor(Math.random() * lastNames.length)]
    return first + last
  }

  const generateEmail = (name: string) => {
    const domains = ['qq.com', '163.com', 'gmail.com', 'outlook.com', 'sina.com']
    const pinyin = name.split('').map(c => c.charCodeAt(0).toString(16).slice(-2)).join('')
    return `${pinyin}${Math.floor(Math.random() * 1000)}@${domains[Math.floor(Math.random() * domains.length)]}`
  }

  const generatePhone = () => {
    const prefixes = ['138', '139', '150', '151', '152', '158', '159', '186', '187', '188']
    return prefixes[Math.floor(Math.random() * prefixes.length)] + Math.floor(Math.random() * 100000000).toString().padStart(8, '0')
  }

  const generateAddress = () => {
    const city = cities[Math.floor(Math.random() * cities.length)]
    const street = streets[Math.floor(Math.random() * streets.length)]
    const number = Math.floor(Math.random() * 999) + 1
    return `${city}市${street}${number}号`
  }

  const generateCompany = () => {
    const prefix = companies[Math.floor(Math.random() * companies.length)]
    const suffix = ['有限公司', '股份有限公司', '科技有限公司', '集团']
    return `${cityName()}${prefix}${suffix[Math.floor(Math.random() * suffix.length)]}`
  }

  const cityName = () => cities[Math.floor(Math.random() * cities.length)]

  const generateDate = () => {
    const start = new Date(2020, 0, 1)
    const end = new Date()
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
    return date.toISOString().split('T')[0]
  }

  const generateNumber = () => Math.floor(Math.random() * 10000)

  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
    })
  }

  const generate = () => {
    const enabledFields = fields.filter(f => f.enabled)
    if (enabledFields.length === 0) return

    const data: Record<string, unknown>[] = []

    for (let i = 0; i < count; i++) {
      const row: Record<string, unknown> = {}
      let name = ''

      enabledFields.forEach(field => {
        switch (field.type) {
          case 'name':
            name = generateName()
            row.name = name
            break
          case 'email':
            row.email = generateEmail(name || generateName())
            break
          case 'phone':
            row.phone = generatePhone()
            break
          case 'address':
            row.address = generateAddress()
            break
          case 'company':
            row.company = generateCompany()
            break
          case 'date':
            row.date = generateDate()
            break
          case 'number':
            row.number = generateNumber()
            break
          case 'uuid':
            row.uuid = generateUUID()
            break
        }
      })

      data.push(row)
    }

    let result = ''

    if (format === 'json') {
      result = JSON.stringify(data, null, 2)
    } else if (format === 'csv') {
      const headers = enabledFields.map(f => f.label).join(',')
      const rows = data.map(row => enabledFields.map(f => row[f.type] ?? '').join(','))
      result = [headers, ...rows].join('\n')
    } else if (format === 'sql') {
      const tableName = 'users'
      const columns = enabledFields.map(f => f.type).join(', ')
      const values = data.map(row => {
        const vals = enabledFields.map(f => {
          const val = row[f.type]
          return typeof val === 'string' ? `'${val}'` : val
        })
        return `(${vals.join(', ')})`
      })
      result = `INSERT INTO ${tableName} (${columns}) VALUES\n${values.join(',\n')};`
    }

    setOutput(result)
  }

  const toggleField = (type: DataType) => {
    setFields(fields.map(f => f.type === type ? { ...f, enabled: !f.enabled } : f))
  }

  const copyOutput = async () => {
    if (!output) return
    await navigator.clipboard.writeText(output)
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 2000)
  }

  const clearAll = () => {
    setOutput('')
  }

  return (
    <ToolShell title="随机数据生成" icon={<Shuffle className="w-5 h-5" />}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          {fields.map(field => (
            <label
              key={field.type}
              className={`flex items-center gap-2 px-3 py-1.5 border rounded-md cursor-pointer transition-colors ${
                field.enabled
                  ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <input
                type="checkbox"
                checked={field.enabled}
                onChange={() => toggleField(field.type)}
                className="rounded"
              />
              <span className="text-sm">{field.label}</span>
            </label>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2">
            <label className="text-sm">数量:</label>
            <input
              type="number"
              min="1"
              max="1000"
              value={count}
              onChange={(e) => setCount(Math.min(1000, Math.max(1, Number(e.target.value))))}
              className="w-20 px-3 py-1.5 border rounded-md bg-background"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm">格式:</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as 'json' | 'csv' | 'sql')}
              className="px-3 py-1.5 border rounded-md bg-background"
            >
              <option value="json">JSON</option>
              <option value="csv">CSV</option>
              <option value="sql">SQL</option>
            </select>
          </div>
          <button
            onClick={generate}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
          >
            <RefreshCw className="w-4 h-4" />
            生成
          </button>
          <button
            onClick={clearAll}
            className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <RotateCcw className="w-4 h-4" />
            清空
          </button>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border-b flex items-center justify-between">
            <span className="text-sm font-medium">生成结果</span>
            {output && (
              <button
                onClick={copyOutput}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
              >
                {copySuccess ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                {copySuccess ? '已复制' : '复制'}
              </button>
            )}
          </div>
          <textarea
            value={output}
            readOnly
            placeholder="点击生成按钮生成随机数据..."
            className="w-full h-64 p-4 font-mono text-sm bg-gray-50 dark:bg-gray-800 resize-none border-0"
          />
        </div>

        <div className="text-sm text-gray-500 dark:text-gray-400">
          <p><strong>随机数据生成器</strong> 可以生成测试数据，支持 JSON、CSV、SQL 格式导出。</p>
        </div>
      </div>
    </ToolShell>
  )
}
