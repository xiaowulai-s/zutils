'use client'

import { useState } from 'react'
import { ToolShell } from '@/components/tools'
import { Palette, Copy, Check, RotateCcw } from 'lucide-react'

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      }
    : null
}

function rgbToHex(r: number, g: number, b: number) {
  return '#' + [r, g, b].map(x => {
    const hex = Math.max(0, Math.min(255, x)).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('')
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255
  g /= 255
  b /= 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / d + 2) / 6
        break
      case b:
        h = ((r - g) / d + 4) / 6
        break
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  }
}

const presetColors = [
  '#FF0000', '#FF6600', '#FFFF00', '#00FF00', '#00FFFF',
  '#0000FF', '#9900FF', '#FF00FF', '#FFFFFF', '#000000',
  '#808080', '#800000', '#808000', '#008000', '#800080',
  '#008080', '#000080', '#FFC0CB', '#FFA500', '#8B4513'
]

export default function ColorPickerPage() {
  const [color, setColor] = useState('#3B82F6')
  const [copySuccess, setCopySuccess] = useState<Record<string, boolean>>({})

  const rgb = hexToRgb(color) || { r: 59, g: 130, b: 246 }
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)

  const updateFromHex = (hex: string) => {
    if (/^#?[0-9a-fA-F]{6}$/.test(hex)) {
      setColor(hex.startsWith('#') ? hex : '#' + hex)
    }
  }

  const updateFromRgb = (r: number, g: number, b: number) => {
    setColor(rgbToHex(r, g, b))
  }

  const copyValue = async (id: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value)
      setCopySuccess({ ...copySuccess, [id]: true })
      setTimeout(() => setCopySuccess({ ...copySuccess, [id]: false }), 2000)
    } catch (e) {
      console.error('复制失败:', e)
    }
  }

  const randomColor = () => {
    const r = Math.floor(Math.random() * 256)
    const g = Math.floor(Math.random() * 256)
    const b = Math.floor(Math.random() * 256)
    setColor(rgbToHex(r, g, b))
  }

  return (
    <ToolShell title="颜色选择器" icon={<Palette className="w-5 h-5" />}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-3 items-center">
          <button
            onClick={randomColor}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-md transition-colors"
          >
            随机颜色
          </button>
          <button
            onClick={() => setColor('#3B82F6')}
            className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <RotateCcw className="w-4 h-4" />
            重置
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div
              className="w-full h-48 rounded-lg border-4 transition-all"
              style={{ backgroundColor: color }}
            />

            <div className="border rounded-lg p-4">
              <div className="text-sm font-medium mb-3">预设颜色</div>
              <div className="grid grid-cols-10 gap-2">
                {presetColors.map((presetColor, index) => (
                  <button
                    key={index}
                    onClick={() => setColor(presetColor)}
                    className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${color === presetColor ? 'border-gray-900 dark:border-white' : 'border-gray-200 dark:border-gray-700'}`}
                    style={{ backgroundColor: presetColor }}
                  />
                ))}
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="text-sm font-medium mb-3">颜色选择器</div>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full h-32 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">HEX</span>
                <button
                  onClick={() => copyValue('hex', color)}
                  className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
                >
                  {copySuccess['hex'] ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  {copySuccess['hex'] ? '已复制' : '复制'}
                </button>
              </div>
              <input
                type="text"
                value={color}
                onChange={(e) => updateFromHex(e.target.value)}
                className="w-full px-4 py-2 font-mono text-lg border rounded-md bg-white dark:bg-gray-700"
              />
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">RGB</span>
                <button
                  onClick={() => copyValue('rgb', `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)}
                  className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
                >
                  {copySuccess['rgb'] ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  {copySuccess['rgb'] ? '已复制' : '复制'}
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>R: {rgb.r}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="255"
                    value={rgb.r}
                    onChange={(e) => updateFromRgb(parseInt(e.target.value), rgb.g, rgb.b)}
                    className="w-full accent-red-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>G: {rgb.g}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="255"
                    value={rgb.g}
                    onChange={(e) => updateFromRgb(rgb.r, parseInt(e.target.value), rgb.b)}
                    className="w-full accent-green-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>B: {rgb.b}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="255"
                    value={rgb.b}
                    onChange={(e) => updateFromRgb(rgb.r, rgb.g, parseInt(e.target.value))}
                    className="w-full accent-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="text-sm font-medium mb-3">CSS 值</div>
              <div className="space-y-2 font-mono text-sm">
                <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  <span>{color}</span>
                  <button onClick={() => copyValue('css-hex', color)} className="text-gray-400 hover:text-gray-600">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  <span>rgb({rgb.r}, {rgb.g}, {rgb.b})</span>
                  <button onClick={() => copyValue('css-rgb', `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)} className="text-gray-400 hover:text-gray-600">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-500 dark:text-gray-400">
          <p><strong>提示:</strong> 颜色选择器支持 HEX、RGB、HSL 多种颜色格式，可以通过颜色选择器、滑块或预设颜色快速选择颜色。</p>
        </div>
      </div>
    </ToolShell>
  )
}
