'use client'

import { useState } from 'react'
import { ToolShell } from '@/components/tools'
import { Ruler, Copy, Check, RotateCcw, ArrowRightLeft } from 'lucide-react'

type Category = 'length' | 'weight' | 'temperature' | 'area' | 'volume' | 'speed' | 'data' | 'time'

interface Unit {
  name: string
  symbol: string
  toBase: number
}

const unitCategories: Record<Category, { name: string; units: Unit[] }> = {
  length: {
    name: '长度',
    units: [
      { name: '千米', symbol: 'km', toBase: 1000 },
      { name: '米', symbol: 'm', toBase: 1 },
      { name: '厘米', symbol: 'cm', toBase: 0.01 },
      { name: '毫米', symbol: 'mm', toBase: 0.001 },
      { name: '微米', symbol: 'μm', toBase: 0.000001 },
      { name: '英里', symbol: 'mi', toBase: 1609.344 },
      { name: '码', symbol: 'yd', toBase: 0.9144 },
      { name: '英尺', symbol: 'ft', toBase: 0.3048 },
      { name: '英寸', symbol: 'in', toBase: 0.0254 },
      { name: '海里', symbol: 'nmi', toBase: 1852 },
    ]
  },
  weight: {
    name: '重量',
    units: [
      { name: '吨', symbol: 't', toBase: 1000 },
      { name: '千克', symbol: 'kg', toBase: 1 },
      { name: '克', symbol: 'g', toBase: 0.001 },
      { name: '毫克', symbol: 'mg', toBase: 0.000001 },
      { name: '磅', symbol: 'lb', toBase: 0.453592 },
      { name: '盎司', symbol: 'oz', toBase: 0.0283495 },
      { name: '斤', symbol: 'jin', toBase: 0.5 },
      { name: '两', symbol: 'liang', toBase: 0.05 },
    ]
  },
  temperature: {
    name: '温度',
    units: [
      { name: '摄氏度', symbol: '°C', toBase: 1 },
      { name: '华氏度', symbol: '°F', toBase: 1 },
      { name: '开尔文', symbol: 'K', toBase: 1 },
    ]
  },
  area: {
    name: '面积',
    units: [
      { name: '平方千米', symbol: 'km²', toBase: 1000000 },
      { name: '平方米', symbol: 'm²', toBase: 1 },
      { name: '平方厘米', symbol: 'cm²', toBase: 0.0001 },
      { name: '公顷', symbol: 'ha', toBase: 10000 },
      { name: '亩', symbol: 'mu', toBase: 666.667 },
      { name: '平方英里', symbol: 'mi²', toBase: 2589988.11 },
      { name: '平方英尺', symbol: 'ft²', toBase: 0.092903 },
      { name: '平方英寸', symbol: 'in²', toBase: 0.00064516 },
    ]
  },
  volume: {
    name: '体积',
    units: [
      { name: '立方米', symbol: 'm³', toBase: 1 },
      { name: '升', symbol: 'L', toBase: 0.001 },
      { name: '毫升', symbol: 'mL', toBase: 0.000001 },
      { name: '加仑(美)', symbol: 'gal', toBase: 0.00378541 },
      { name: '品脱', symbol: 'pt', toBase: 0.000473176 },
      { name: '立方英尺', symbol: 'ft³', toBase: 0.0283168 },
      { name: '立方英寸', symbol: 'in³', toBase: 0.0000163871 },
    ]
  },
  speed: {
    name: '速度',
    units: [
      { name: '米/秒', symbol: 'm/s', toBase: 1 },
      { name: '千米/时', symbol: 'km/h', toBase: 0.277778 },
      { name: '英里/时', symbol: 'mph', toBase: 0.44704 },
      { name: '节', symbol: 'kn', toBase: 0.514444 },
      { name: '马赫', symbol: 'Ma', toBase: 340.29 },
    ]
  },
  data: {
    name: '数据存储',
    units: [
      { name: 'Bit', symbol: 'b', toBase: 0.125 },
      { name: 'Byte', symbol: 'B', toBase: 1 },
      { name: 'KB', symbol: 'KB', toBase: 1024 },
      { name: 'MB', symbol: 'MB', toBase: 1048576 },
      { name: 'GB', symbol: 'GB', toBase: 1073741824 },
      { name: 'TB', symbol: 'TB', toBase: 1099511627776 },
      { name: 'PB', symbol: 'PB', toBase: 1125899906842624 },
    ]
  },
  time: {
    name: '时间',
    units: [
      { name: '纳秒', symbol: 'ns', toBase: 0.000000001 },
      { name: '微秒', symbol: 'μs', toBase: 0.000001 },
      { name: '毫秒', symbol: 'ms', toBase: 0.001 },
      { name: '秒', symbol: 's', toBase: 1 },
      { name: '分钟', symbol: 'min', toBase: 60 },
      { name: '小时', symbol: 'h', toBase: 3600 },
      { name: '天', symbol: 'd', toBase: 86400 },
      { name: '周', symbol: 'wk', toBase: 604800 },
      { name: '月', symbol: 'mo', toBase: 2592000 },
      { name: '年', symbol: 'yr', toBase: 31536000 },
    ]
  },
}

export default function UnitConverterPage() {
  const [category, setCategory] = useState<Category>('length')
  const [fromUnit, setFromUnit] = useState(0)
  const [toUnit, setToUnit] = useState(1)
  const [fromValue, setFromValue] = useState('')
  const [toValue, setToValue] = useState('')
  const [copySuccess, setCopySuccess] = useState(false)

  const units = unitCategories[category].units

  const convert = (value: string, from: number, to: number) => {
    if (!value) return ''
    const num = parseFloat(value)
    if (isNaN(num)) return ''

    if (category === 'temperature') {
      if (from === to) return value
      let celsius: number
      if (from === 0) celsius = num
      else if (from === 1) celsius = (num - 32) * 5/9
      else celsius = num - 273.15

      if (to === 0) return celsius.toFixed(6).replace(/\.?0+$/, '')
      else if (to === 1) return (celsius * 9/5 + 32).toFixed(6).replace(/\.?0+$/, '')
      else return (celsius + 273.15).toFixed(6).replace(/\.?0+$/, '')
    }

    const baseValue = num * units[from].toBase
    const result = baseValue / units[to].toBase
    return result.toPrecision(10).replace(/\.?0+$/, '')
  }

  const handleFromChange = (value: string) => {
    setFromValue(value)
    setToValue(convert(value, fromUnit, toUnit))
  }

  const handleSwap = () => {
    setFromUnit(toUnit)
    setToUnit(fromUnit)
    setFromValue(toValue)
    setToValue(fromValue)
  }

  const handleCategoryChange = (cat: Category) => {
    setCategory(cat)
    setFromUnit(0)
    setToUnit(1)
    setFromValue('')
    setToValue('')
  }

  const copyResult = async () => {
    if (!toValue) return
    await navigator.clipboard.writeText(toValue)
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 2000)
  }

  return (
    <ToolShell title="单位转换器" icon={<Ruler className="w-5 h-5" />}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          {(Object.keys(unitCategories) as Category[]).map(cat => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-2 rounded-md text-sm transition-colors ${
                category === cat
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {unitCategories[cat].name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-4 items-end">
          <div>
            <label className="block text-sm font-medium mb-2">从</label>
            <select
              value={fromUnit}
              onChange={(e) => { setFromUnit(Number(e.target.value)); setToValue(convert(fromValue, Number(e.target.value), toUnit)) }}
              className="w-full px-3 py-2 border rounded-md bg-background mb-2"
            >
              {units.map((unit, i) => (
                <option key={i} value={i}>{unit.name} ({unit.symbol})</option>
              ))}
            </select>
            <input
              type="number"
              value={fromValue}
              onChange={(e) => handleFromChange(e.target.value)}
              placeholder="输入数值"
              className="w-full px-3 py-2 border rounded-md bg-background"
            />
          </div>

          <button
            onClick={handleSwap}
            className="p-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 self-center"
          >
            <ArrowRightLeft className="w-5 h-5" />
          </button>

          <div>
            <label className="block text-sm font-medium mb-2">到</label>
            <select
              value={toUnit}
              onChange={(e) => { setToUnit(Number(e.target.value)); setToValue(convert(fromValue, fromUnit, Number(e.target.value))) }}
              className="w-full px-3 py-2 border rounded-md bg-background mb-2"
            >
              {units.map((unit, i) => (
                <option key={i} value={i}>{unit.name} ({unit.symbol})</option>
              ))}
            </select>
            <div className="relative">
              <input
                type="text"
                value={toValue}
                readOnly
                placeholder="结果"
                className="w-full px-3 py-2 border rounded-md bg-gray-50 dark:bg-gray-800"
              />
              {toValue && (
                <button
                  onClick={copyResult}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1"
                >
                  {copySuccess ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-400" />}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-500 dark:text-gray-400">
          <p><strong>单位转换器</strong> 支持长度、重量、温度、面积、体积、速度、数据存储和时间等常用单位转换。</p>
        </div>
      </div>
    </ToolShell>
  )
}
